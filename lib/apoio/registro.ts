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
};

type CampoBusca = "id" | "asaas_cobranca_id" | "asaas_autorizacao_id" | "asaas_assinatura_id";

export async function buscarApoioPor(campo: CampoBusca, valor: string): Promise<ApoioEncontrado | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("apoios").select("id, frequencia, status, profissional_id, asaas_autorizacao_id").eq(campo, valor).maybeSingle();
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
  // "ja_ativo" quando o plano já está pago (ativo ou na tolerância): o link abre, mas não gera outro Pix.
  situacao: "pode_pagar" | "ja_ativo";
  nome: string;
  profissao: "psicologo" | "medico";
  plano_base_escolhido: PlanoBase | null;
  opcional_escolhido: PlanoOpcional | null;
  email: string | null;
};

// Só quem recebeu o link de pagamento (aguardando_pagamento) ou já estava na Margem antes da cobrança
// (gratuito) paga por ele. Quem já pagou (ativo, inadimplente) vê que o plano está ativo. Qualquer outro
// status, ou código que não existe, é link inválido.
const STATUS_QUE_PAGAM: StatusProfissional[] = ["aguardando_pagamento", "gratuito"];
const STATUS_JA_ATIVOS: StatusProfissional[] = ["ativo", "inadimplente"];

export async function buscarProfissionalPorToken(token: string): Promise<ProfissionalDoLink | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profissionais_cadastrados")
    .select("id, nome, especialidade, status, plano_base_escolhido, opcional_escolhido, email")
    .eq("token_apoio", token)
    .in("status", [...STATUS_QUE_PAGAM, ...STATUS_JA_ATIVOS])
    .maybeSingle();
  if (error) console.error("[apoio] buscarProfissionalPorToken falhou:", error.message);
  if (!data) return null;
  // Assistente social não tem plano: o link dele não vale.
  const profissao = data.especialidade === "psicologo" ? "psicologo" : data.especialidade === "psiquiatra" ? "medico" : null;
  if (!profissao) return null;
  const situacao = STATUS_JA_ATIVOS.includes(data.status) ? "ja_ativo" : "pode_pagar";
  return {
    id: data.id,
    situacao,
    nome: data.nome,
    profissao,
    plano_base_escolhido: data.plano_base_escolhido,
    opcional_escolhido: data.opcional_escolhido,
    email: data.email,
  };
}

// Profissional com plano ativo (ou dentro da tolerância) não gera outro Pix: seriam duas mensalidades.
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
