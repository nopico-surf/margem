import { getServerClient } from "@/lib/supabase";
import { CATEGORIA_PADRAO } from "@/lib/recursos";
import type { CadastroProfissional } from "./cadastro";
import type { PedidoApoio, PlanoBase, PlanoOpcional } from "./planos";

// Gravação da tabela apoios. Só ids do Asaas, plano, valor e status: nome e CPF nunca chegam aqui.

export type StatusApoio = "aguardando" | "pago" | "ativo" | "inadimplente" | "recusado" | "expirado" | "cancelado" | "falhou" | "estornado";

export type AtualizacaoApoio = {
  status?: StatusApoio;
  asaas_cliente_id?: string;
  asaas_cobranca_id?: string;
  asaas_autorizacao_id?: string;
  asaas_assinatura_id?: string | null;
  ultimo_pagamento_em?: string;
  estornado_em?: string;
};

// Grava o apoio antes de falar com o Asaas: o id dele vai como referência pra cobrança e pra
// autorização, e o webhook acha o apoio por ele mesmo que chegue antes da atualização com os ids.
export async function criarApoio(pedido: PedidoApoio): Promise<string | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("apoios")
    .insert({
      publico: pedido.publico,
      frequencia: pedido.frequencia,
      valor: pedido.valor,
      plano_base: pedido.planoBase ?? null,
      plano_opcional: pedido.planoOpcional ?? null,
      profissional_id: pedido.profissionalId ?? null,
      troca: pedido.troca ?? false,
      valor_imediato: pedido.valorImediato ?? null,
    })
    .select("id")
    .single();
  if (error) console.error("[apoio] criarApoio falhou:", error.message);
  return (data?.id as string | undefined) ?? null;
}

export async function atualizarApoio(id: string, campos: AtualizacaoApoio) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("apoios")
    .update({ ...campos, atualizado_em: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("[apoio] atualizarApoio falhou:", error.message);
  return !error;
}

export type ApoioEncontrado = {
  id: string;
  frequencia: "unico" | "mensal";
  status: StatusApoio;
  profissional_id: string | null;
  asaas_autorizacao_id: string | null;
  troca: boolean;
};

const COLUNAS_APOIO_ENCONTRADO = "id, frequencia, status, profissional_id, asaas_autorizacao_id, troca";

type CampoBusca = "id" | "asaas_cobranca_id" | "asaas_autorizacao_id" | "asaas_assinatura_id";

export async function buscarApoioPor(campo: CampoBusca, valor: string): Promise<ApoioEncontrado | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("apoios").select(COLUNAS_APOIO_ENCONTRADO).eq(campo, valor).maybeSingle();
  if (error) console.error("[apoio] buscarApoioPor falhou:", error.message);
  return (data as ApoioEncontrado | null) ?? null;
}

// Muda o apoio só se o status ainda for o que o webhook leu: dois eventos chegando juntos não se
// atropelam, e o que chegou depois é aplicado em cima do estado certo ou não é aplicado.
export async function atualizarApoioSeStatus(id: string, statusAtual: StatusApoio, campos: AtualizacaoApoio) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("apoios")
    .update({ ...campos, atualizado_em: new Date().toISOString() })
    .eq("id", id)
    .eq("status", statusAtual);
  if (error) console.error("[apoio] atualizarApoioSeStatus falhou:", error.message);
  return !error;
}

// Marca o evento do webhook como recebido. "repetido" quando o Asaas reentrega um evento já gravado.
export async function registrarEvento(id: string, tipo: string, apoioId: string | null): Promise<"novo" | "repetido" | "erro"> {
  const supabase = getServerClient();
  if (!supabase) return "erro";
  const { error } = await supabase.from("eventos_asaas").insert({ id, tipo, apoio_id: apoioId });
  if (!error) return "novo";
  if (error.code === "23505") return "repetido";
  console.error("[apoio] registrarEvento falhou:", error.message);
  return "erro";
}

// Desfaz o registro quando o processamento falha, pra o Asaas reentregar o evento e ele ser processado.
export async function removerEvento(id: string) {
  const supabase = getServerClient();
  if (!supabase) return;
  const { error } = await supabase.from("eventos_asaas").delete().eq("id", id);
  if (error) console.error("[apoio] removerEvento falhou:", error.message);
}

// `pago`: o primeiro pagamento caiu. No mensal ele chega antes (ou sem) a autorização do Pix Automático,
// e o apoio continua `aguardando` até ela; é isso que separa "Pix pago" de "tudo feito" na tela.
export async function buscarStatusApoio(id: string): Promise<{ status: StatusApoio; pago: boolean } | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("apoios").select("status, ultimo_pagamento_em").eq("id", id).maybeSingle();
  if (error) console.error("[apoio] buscarStatusApoio falhou:", error.message);
  if (!data) return null;
  return { status: data.status as StatusApoio, pago: data.ultimo_pagamento_em !== null };
}

// --- Profissional -------------------------------------------------------------------------------

export type StatusProfissional =
  | "em_analise"
  | "recusado"
  | "lista_espera"
  | "aguardando_pagamento"
  | "ativo"
  | "gratuito"
  | "inadimplente"
  | "cancelado";

export type ProfissionalDoLink = {
  id: string;
  // "ja_ativo" quando o mês pago ainda está longe de acabar (mais de 7 dias): o link abre, mas não gera
  // outro Pix. Perto do fim do mês pago, ou depois, o link volta a cobrar (quem pagou sem autorizar o
  // Pix Automático paga o mês seguinte por ele). Quem tem o Pix Automático ativo é barrado na rota.
  situacao: "pode_pagar" | "ja_ativo";
  status: StatusProfissional;
  nome: string;
  profissao: "psicologo" | "medico";
  plano_base_escolhido: PlanoBase | null;
  opcional_escolhido: PlanoOpcional | null;
  email: string | null;
  pago_ate: string | null;
};

// O link vale para quem recebeu o link de pagamento (aguardando_pagamento), já estava na Margem antes
// da cobrança (gratuito) ou já pagou alguma vez (ativo, inadimplente). Recusado, cancelado e os status
// de antes da aprovação, ou código que não existe, são link inválido.
const STATUS_DO_LINK: StatusProfissional[] = ["aguardando_pagamento", "gratuito", "ativo", "inadimplente"];

// Antecedência com que o link volta a cobrar antes de o mês pago acabar; os mesmos 7 dias de tolerância.
const DIAS_ANTES_DO_FIM = 7;

export async function buscarProfissionalPorToken(token: string): Promise<ProfissionalDoLink | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profissionais_cadastrados")
    .select("id, status, nome, especialidade, plano_base_escolhido, opcional_escolhido, email, pago_ate")
    // O link longo é hex de 64; o curto tem hífen e nunca bate com o formato do longo.
    .eq(token.includes("-") ? "codigo_link" : "token_apoio", token)
    .in("status", STATUS_DO_LINK)
    .maybeSingle();
  if (error) console.error("[apoio] buscarProfissionalPorToken falhou:", error.message);
  if (!data) return null;
  // Assistente social não tem plano: o link dele não vale.
  const profissao = data.especialidade === "psicologo" ? "psicologo" : data.especialidade === "psiquiatra" ? "medico" : null;
  if (!profissao) return null;
  const reabreEm = Date.now() + DIAS_ANTES_DO_FIM * 24 * 60 * 60 * 1000;
  const situacao = data.pago_ate && new Date(data.pago_ate).getTime() > reabreEm ? "ja_ativo" : "pode_pagar";
  return {
    id: data.id,
    situacao,
    status: data.status,
    nome: data.nome,
    profissao,
    plano_base_escolhido: data.plano_base_escolhido,
    opcional_escolhido: data.opcional_escolhido,
    email: data.email,
    pago_ate: data.pago_ate,
  };
}

// Plano que o profissional paga hoje: o do apoio pago mais recente (o upgrade pago passa a ser o atual).
export async function buscarPlanoAtual(profissionalId: string): Promise<{ planoBase: PlanoBase; planoOpcional: PlanoOpcional | null } | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("apoios")
    .select("plano_base, plano_opcional")
    .eq("profissional_id", profissionalId)
    .not("ultimo_pagamento_em", "is", null)
    .not("plano_base", "is", null)
    .not("status", "in", "(estornado,falhou)")
    .order("ultimo_pagamento_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error("[apoio] buscarPlanoAtual falhou:", error.message);
  if (!data) return null;
  return { planoBase: data.plano_base, planoOpcional: data.plano_opcional };
}

// Autorizações de Pix Automático em vigor do profissional (apoio ativo ou com o mês em nova tentativa),
// menos a de "exceto". A troca de plano encerra estas quando a nova ativa (upgrade) ou na hora (downgrade).
export async function buscarAutorizacoesEmVigor(profissionalId: string, exceto?: string): Promise<Array<{ id: string; status: StatusApoio; asaas_autorizacao_id: string | null }> | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  let consulta = supabase
    .from("apoios")
    .select("id, status, asaas_autorizacao_id")
    .eq("profissional_id", profissionalId)
    .in("status", ["ativo", "inadimplente"]);
  if (exceto) consulta = consulta.neq("id", exceto);
  const { data, error } = await consulta;
  if (error) {
    console.error("[apoio] buscarAutorizacoesEmVigor falhou:", error.message);
    return null;
  }
  return (data ?? []) as Array<{ id: string; status: StatusApoio; asaas_autorizacao_id: string | null }>;
}

// Plano escolhido para o próximo pagamento pelo link (downgrade agendado, ou o upgrade pedido).
export async function escolherPlano(profissionalId: string, base: PlanoBase, opcional: PlanoOpcional | null) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("profissionais_cadastrados")
    .update({ plano_base_escolhido: base, opcional_escolhido: opcional })
    .eq("id", profissionalId);
  if (error) console.error("[apoio] escolherPlano falhou:", error.message);
  return !error;
}

// Bronze sem opcional não tem o que pagar: o perfil entra no ar como gratuito, com o Bronze escolhido.
// Só para quem recebeu o link e ainda não pagou (aguardando_pagamento) ou já está como gratuito; quem já
// pagou alguma vez e vai para o Bronze está fazendo downgrade, que passa pela aprovação do Vitor.
export const STATUS_QUE_PODEM_BRONZE: StatusProfissional[] = ["aguardando_pagamento", "gratuito"];

export async function ativarBronze(profissionalId: string) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("profissionais_cadastrados")
    .update({ status: "gratuito", plano_base_escolhido: "bronze", opcional_escolhido: null })
    .eq("id", profissionalId)
    .in("status", STATUS_QUE_PODEM_BRONZE)
    .select("id");
  if (error) console.error("[apoio] ativarBronze falhou:", error.message);
  return !error && (data?.length ?? 0) > 0;
}

// Profissional com Pix Automático autorizado (ativo, ou com o mês em nova tentativa) não gera outro Pix:
// o Asaas já cobra sozinho, seriam duas mensalidades.
export async function temPlanoAtivo(profissionalId: string): Promise<boolean | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from("apoios")
    .select("id", { count: "exact", head: true })
    .eq("profissional_id", profissionalId)
    .in("status", ["ativo", "inadimplente"]);
  if (error) {
    console.error("[apoio] temPlanoAtivo falhou:", error.message);
    return null;
  }
  return (count ?? 0) > 0;
}

export type AtualizacaoProfissional = {
  status: StatusProfissional;
  ativado_em?: string;
  inadimplente_desde?: string | null;
  cancelado_em?: string;
  pago_ate?: string | null;
};

// Muda o profissional só a partir dos status esperados: o webhook nunca tira do ar alguém que o Vitor
// pausou ou recusou na mão, nem reativa quem foi cancelado por outro motivo.
export async function atualizarProfissionalSeStatus(id: string, de: StatusProfissional[], campos: AtualizacaoProfissional) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase.from("profissionais_cadastrados").update(campos).eq("id", id).in("status", de);
  if (error) console.error("[apoio] atualizarProfissionalSeStatus falhou:", error.message);
  return !error;
}

// ativado_em marca o primeiro pagamento (conta os 7 dias): só é gravado uma vez.
export async function marcarPrimeiraAtivacao(id: string, quando: string) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase.from("profissionais_cadastrados").update({ ativado_em: quando }).eq("id", id).is("ativado_em", null);
  if (error) console.error("[apoio] marcarPrimeiraAtivacao falhou:", error.message);
  return !error;
}

// Pix do profissional gerados e ainda não pagos (aguardando, sem pagamento). Um Pix novo cancela estes,
// pra só o último QR valer: pagar dois QR deixaria duas autorizações de Pix Automático cobrando todo mês.
export async function buscarPixPendentesDoProfissional(profissionalId: string): Promise<Array<{ id: string; asaas_autorizacao_id: string | null }> | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("apoios")
    .select("id, asaas_autorizacao_id")
    .eq("profissional_id", profissionalId)
    .eq("status", "aguardando")
    .is("ultimo_pagamento_em", null);
  if (error) {
    console.error("[apoio] buscarPixPendentesDoProfissional falhou:", error.message);
    return null;
  }
  return data ?? [];
}

// Estende o mês pago até "ate", nunca para trás: um aviso atrasado ou repetido não encurta o que já foi
// pago. "ate" é calculado no servidor, nunca vem do aviso.
export async function estenderPagoAte(id: string, ate: string) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("profissionais_cadastrados")
    .update({ pago_ate: ate })
    .eq("id", id)
    .or(`pago_ate.is.null,pago_ate.lt.${ate}`);
  if (error) console.error("[apoio] estenderPagoAte falhou:", error.message);
  return !error;
}

// Último recurso para achar de qual apoio é um pagamento que chegou sem nenhum id nosso (o primeiro mês do
// Pix Automático é criado pelo Asaas, e a documentação não diz se traz a referência): o apoio mensal mais
// recente do mesmo cliente do Asaas, com o mesmo valor (o mensal, ou a diferença cobrada hoje numa troca
// de plano), em qualquer status em que ainda pode receber um
// pagamento ou um estorno (de fora ficam só falhou e estornado). Só apoio de profissional: é o único
// caso em que o primeiro mês chega sem id nosso, e sem esse limite uma doação mensal criada com o CPF
// do profissional e o mesmo valor do plano poderia ficar com o pagamento dele.
export async function buscarApoioMensalDoCliente(clienteId: string, valor: number): Promise<ApoioEncontrado | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("apoios")
    .select(COLUNAS_APOIO_ENCONTRADO)
    .eq("asaas_cliente_id", clienteId)
    .eq("frequencia", "mensal")
    .not("profissional_id", "is", null)
    // valor vem do aviso autenticado do Asaas e é conferido como número antes de chegar aqui.
    .or(`valor.eq.${valor},valor_imediato.eq.${valor}`)
    .in("status", ["aguardando", "ativo", "inadimplente", "recusado", "expirado", "cancelado"])
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error("[apoio] buscarApoioMensalDoCliente falhou:", error.message);
  return (data as ApoioEncontrado | null) ?? null;
}

// Grava o cadastro de "Quero fazer parte" como em_analise: não aparece no site até o primeiro pagamento.
// O botão de WhatsApp do perfil leva ao número da Margem, como nos perfis que já existem (migração
// 0015); o WhatsApp do profissional fica em telefone, que nunca vai pro navegador.
//
// Quem já tem cadastro com o mesmo e-mail ou registro não ganha outro, e a resposta é a mesma de um
// cadastro novo: o formulário não serve pra descobrir quem está na Margem.
export async function gravarCadastro(cadastro: CadastroProfissional, whatsappDaMargem: string): Promise<boolean> {
  const supabase = getServerClient();
  if (!supabase) return false;

  // Duas buscas com .eq em vez de um .or montado com texto: o registro é digitado pela pessoa, e vírgula
  // ou parêntese dentro dele mudaria o filtro do .or.
  for (const [coluna, valor] of [["email", cadastro.email], ["registro_profissional", cadastro.registro_profissional]] as const) {
    const { count, error: erroBusca } = await supabase
      .from("profissionais_cadastrados")
      .select("id", { count: "exact", head: true })
      .eq(coluna, valor);
    if (erroBusca) {
      console.error("[apoio] gravarCadastro (busca) falhou:", erroBusca.message);
      return false;
    }
    if ((count ?? 0) > 0) return true;
  }

  const { error } = await supabase.from("profissionais_cadastrados").insert({
    ...cadastro,
    status: "em_analise",
    categoria_resposta_relevante: CATEGORIA_PADRAO,
    whatsapp_link: whatsappDaMargem,
  });
  if (error) console.error("[apoio] gravarCadastro falhou:", error.message);
  return !error;
}
