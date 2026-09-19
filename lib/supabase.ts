import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Orientation } from "@/lib/gemini";
import { instituicoesPadrao, servicosPublicosPadrao } from "./default-resources";

let client: SupabaseClient | null = null;

function getServerClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export type AcaoContato = { kind: string; label: string; value: string | null };

export type ProfissionalCadastrado = {
  id: string;
  nome: string;
  especialidade: "psicologo" | "psiquiatra" | "assistente_social";
  registro_profissional: string | null;
  anos_experiencia: number | null;
  foto_url: string | null;
  bio: string | null;
  tags: string[];
  whatsapp_link: string | null;
  telefone: string | null;
  email: string | null;
  localizacao: string | null;
  status: "ativo" | "pago" | "gratuito";
  categoria_resposta_relevante: string | null;
};

export type NaturezaServico = "saude_drogas" | "saude_mental" | "saude_geral" | "assistencia_social" | "seguranca";

export type ServicoPublico = {
  id: string;
  nome: string;
  descricao: string | null;
  natureza: NaturezaServico;
  endereco: string | null;
  categoria_resposta_relevante: string | null;
  acoes: AcaoContato[];
};

export type InstituicaoApoio = {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: "NA" | "AA" | "grupo_apoio" | "outro";
  categoria_resposta_relevante: string | null;
  contatos: AcaoContato[];
};

export async function buscarProfissionaisPorCategoria(categoria: string) {
  const supabase = getServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("profissionais_cadastrados").select("*").eq("categoria_resposta_relevante", categoria);
  if (error) console.error("[supabase] buscarProfissionaisPorCategoria falhou:", error.message);
  return (data ?? []) as ProfissionalCadastrado[];
}

export async function buscarServicosPublicosPorCategoria(categoria: string) {
  const supabase = getServerClient();
  if (!supabase) return servicosPublicosPadrao.filter((servico) => servico.categoria_resposta_relevante === categoria);
  const { data, error } = await supabase
    .from("servicos_publicos")
    .select("*")
    .eq("categoria_resposta_relevante", categoria)
    .eq("ativo", true)
    // natureza é enum: o Postgres ordena pela ordem de declaração dos valores, que é a ordem de exibição.
    .order("natureza")
    .order("ordem")
    .order("id");
  if (error) console.error("[supabase] buscarServicosPublicosPorCategoria falhou:", error.message);
  return (data ?? []) as ServicoPublico[];
}

export async function buscarInstituicoesPorCategoria(categoria: string) {
  const supabase = getServerClient();
  if (!supabase) return instituicoesPadrao.filter((instituicao) => instituicao.categoria_resposta_relevante === categoria);
  const { data, error } = await supabase
    .from("instituicoes_apoio")
    .select("*")
    .eq("categoria_resposta_relevante", categoria)
    .eq("ativo", true)
    .order("ordem")
    .order("id");
  if (error) console.error("[supabase] buscarInstituicoesPorCategoria falhou:", error.message);
  return (data ?? []) as InstituicaoApoio[];
}

export async function registrarConsentimento(sessaoId: string) {
  const supabase = getServerClient();
  if (!supabase) return;
  const [sessao, auditoria] = await Promise.all([
    supabase.from("sessoes").upsert({ id: sessaoId, consentimento_lgpd: true }),
    supabase.from("auditoria_sessoes").insert({ sessao_id: sessaoId, acao: "criada" }),
  ]);
  if (sessao.error) console.error("[supabase] registrarConsentimento (sessoes) falhou:", sessao.error.message);
  if (auditoria.error) console.error("[supabase] registrarConsentimento (auditoria_sessoes) falhou:", auditoria.error.message);
}

export async function buscarRespostaPorChave(chaveBusca: string) {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("respostas").select("*").eq("chave_busca", chaveBusca).maybeSingle();
  if (error) console.error("[supabase] buscarRespostaPorChave falhou:", error.message);
  return data as (Orientation & { id: string }) | null;
}

// Resposta do Gemini é gravada sem chave_busca: o campo livre não reaproveita resposta salva (a chave é
// única e só os cards buscam por ela). O texto que gerou a resposta fica em historico_interacoes.
export async function salvarRespostaGerada(orientation: Orientation) {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("respostas")
    .insert({
      origem: "gerada_gemini",
      chave_busca: null,
      acolhimento: orientation.acolhimento,
      orientacao: orientation.orientacao,
      pilula_espiritual: orientation.pilula_espiritual,
      checklist_agora: orientation.checklist_agora,
      checklist_proximo: orientation.checklist_proximo,
      perguntas_aprofundamento: orientation.perguntas_aprofundamento,
    })
    .select("id")
    .single();
  if (error) console.error("[supabase] salvarRespostaGerada falhou:", error.message);
  return data?.id as string | undefined;
}

// Quando o Gemini falha, a interação é registrada com resposta_id vazio e sem "recebeu_orientacao" na auditoria.
// tempoGeminiMs/geminiFalhou/motivoFalha ficam vazios quando a interação veio de card ou de cache (não chamou o Gemini).
export async function registrarInteracao(params: {
  sessaoId: string;
  tipo: "card" | "campo_aberto" | "pergunta_aprofundamento";
  chaveBusca?: string;
  texto: string;
  respostaId?: string | null;
  foiCacheHit: boolean;
  recebeuOrientacao?: boolean;
  tempoGeminiMs?: number | null;
  geminiFalhou?: boolean | null;
  motivoFalha?: string | null;
}) {
  const supabase = getServerClient();
  if (!supabase) return;
  // garante que a sessão existe mesmo se o consentimento não tiver sido gravado antes (ex: localStorage antigo)
  const sessao = await supabase.from("sessoes").upsert({ id: params.sessaoId, consentimento_lgpd: true }, { onConflict: "id", ignoreDuplicates: true });
  if (sessao.error) console.error("[supabase] registrarInteracao (sessoes) falhou:", sessao.error.message);
  const [historico, auditoria] = await Promise.all([
    supabase.from("historico_interacoes").insert({
      sessao_id: params.sessaoId,
      tipo: params.tipo,
      chave_busca: params.chaveBusca ?? null,
      texto_original: params.texto,
      resposta_id: params.respostaId ?? null,
      foi_cache_hit: params.foiCacheHit,
      tempo_gemini_ms: params.tempoGeminiMs ?? null,
      gemini_falhou: params.geminiFalhou ?? null,
      motivo_falha: params.motivoFalha ?? null,
    }),
    params.recebeuOrientacao === false ? null : supabase.from("auditoria_sessoes").insert({ sessao_id: params.sessaoId, acao: "recebeu_orientacao" }),
  ]);
  if (historico.error) console.error("[supabase] registrarInteracao (historico_interacoes) falhou:", historico.error.message);
  if (auditoria?.error) console.error("[supabase] registrarInteracao (auditoria_sessoes) falhou:", auditoria.error.message);
}

