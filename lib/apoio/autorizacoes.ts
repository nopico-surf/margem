import { cancelarAutorizacao } from "@/lib/asaas";
import { atualizarApoioSeStatus, buscarAutorizacoesEmVigor } from "./registro";

// Encerra no Asaas as autorizações de Pix Automático em vigor do profissional (menos a de "exceto") e
// marca os apoios como cancelados. Na troca de plano: no upgrade, quando a autorização nova ativa; no
// downgrade, na hora, porque o plano menor é pago pelo link no vencimento.
//
// Erro 4xx do Asaas é autorização que já não vale (a pessoa cancelou no banco); só falha de rede ou do
// Asaas devolve false, pra quem chamou tentar de novo em vez de deixar duas autorizações cobrando.
export async function encerrarAutorizacoesEmVigor(profissionalId: string, exceto?: string) {
  const emVigor = await buscarAutorizacoesEmVigor(profissionalId, exceto);
  if (emVigor === null) return false;
  for (const apoio of emVigor) {
    if (apoio.asaas_autorizacao_id) {
      const cancelamento = await cancelarAutorizacao(apoio.asaas_autorizacao_id);
      if (!cancelamento.ok && !(cancelamento.status && cancelamento.status < 500)) return false;
    }
    if (!(await atualizarApoioSeStatus(apoio.id, apoio.status, { status: "cancelado" }))) return false;
  }
  return true;
}
