import { cancelarCobranca } from "@/lib/asaas";
import { atualizarApoioSeStatus } from "@/lib/apoio/registro";
import { getServerClient } from "@/lib/supabase";
import type { PlanoFamilia } from "./oferta";

// Só servidor. A compra do programa para familiares é um apoio com público "familia" (migração 0043):
// mesma tabela, mesmo webhook e mesma tela de status do /plano. Daqui sai o que é só da família:
// liberar e retirar o acesso da conta, e cancelar os Pix antigos dela.

// Pix da mesma conta que ainda não foram pagos são cancelados antes de gerar um novo, pra não ficarem
// dois QR pagáveis (mesma regra do /plano). Erro 4xx do Asaas é cobrança que já não existe ou já
// venceu; falha de rede ou do Asaas impede o Pix novo.
export async function cancelarPixPendentesDaFamilia(userId: string) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("apoios")
    .select("id, asaas_cobranca_id")
    .eq("familia_user_id", userId)
    .eq("status", "aguardando");
  if (error) {
    console.error("[familia] buscar Pix pendentes falhou:", error.message);
    return false;
  }
  for (const pendente of data ?? []) {
    if (pendente.asaas_cobranca_id) {
      const cancelamento = await cancelarCobranca(pendente.asaas_cobranca_id as string);
      if (!cancelamento.ok && !(cancelamento.status && cancelamento.status < 500)) return false;
    }
    await atualizarApoioSeStatus(pendente.id as string, "aguardando", { status: "cancelado" });
  }
  return true;
}

// Pix pago: libera as 8 semanas. A primeira liberação vale (um segundo pagamento não muda a data, que
// conta o prazo pra pedir o dinheiro de volta).
export async function liberarAcessoDaFamilia(userId: string) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("familia_perfis")
    .update({ acesso_liberado_em: new Date().toISOString() })
    .eq("user_id", userId)
    .is("acesso_liberado_em", null);
  if (error) console.error("[familia] liberar acesso falhou:", error.message);
  return !error;
}

// Estorno (a devolução pedida no prazo, feita à mão no painel do Asaas): o acesso sai na hora.
export async function retirarAcessoDaFamilia(userId: string) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase.from("familia_perfis").update({ acesso_liberado_em: null }).eq("user_id", userId);
  if (error) console.error("[familia] retirar acesso falhou:", error.message);
  return !error;
}

export type CompraDaFamilia = { plano: PlanoFamilia; pagoEm: string };

// A compra paga mais recente da conta. Quem tem acesso sem compra recebeu acesso gratuito.
export async function buscarCompraDaFamilia(userId: string): Promise<CompraDaFamilia | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("apoios")
    .select("familia_plano, ultimo_pagamento_em")
    .eq("familia_user_id", userId)
    .eq("status", "pago")
    .order("ultimo_pagamento_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error("[familia] buscar compra falhou:", error.message);
  if (!data?.familia_plano || !data.ultimo_pagamento_em) return null;
  return { plano: data.familia_plano as PlanoFamilia, pagoEm: data.ultimo_pagamento_em as string };
}
