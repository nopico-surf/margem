import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Orientation } from "@/lib/gemini";
import { instituicoesPadrao, profissionalDeTeste, servicosPublicosPadrao } from "./default-resources";

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
  crp: string | null;
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

export type ServicoPublico = {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: "UBS" | "CAPS" | "outro";
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
  if (!supabase) return categoria === "geral" ? [profissionalDeTeste] : [];
  const { data } = await supabase.from("profissionais_cadastrados").select("*").eq("categoria_resposta_relevante", categoria);
  if (data && data.length > 0) return data as ProfissionalCadastrado[];
  return categoria === "geral" ? [profissionalDeTeste] : [];
}

export async function buscarServicosPublicosPorCategoria(categoria: string) {
  const supabase = getServerClient();
  if (!supabase) return servicosPublicosPadrao.filter((servico) => servico.categoria_resposta_relevante === categoria);
  const { data } = await supabase.from("servicos_publicos").select("*").eq("categoria_resposta_relevante", categoria);
  return (data ?? []) as ServicoPublico[];
}

export async function buscarInstituicoesPorCategoria(categoria: string) {
  const supabase = getServerClient();
  if (!supabase) return instituicoesPadrao.filter((instituicao) => instituicao.categoria_resposta_relevante === categoria);
  const { data } = await supabase.from("instituicoes_apoio").select("*").eq("categoria_resposta_relevante", categoria);
  return (data ?? []) as InstituicaoApoio[];
}

export async function registrarConsentimento(sessaoId: string) {
  const supabase = getServerClient();
  if (!supabase) return;
  await supabase.from("sessoes").upsert({ id: sessaoId, consentimento_lgpd: true });
  await supabase.from("auditoria_sessoes").insert({ sessao_id: sessaoId, acao: "criada" });
}

export async function buscarRespostaPorChave(chaveBusca: string) {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("respostas").select("*").eq("chave_busca", chaveBusca).maybeSingle();
  return data as (Orientation & { id: string }) | null;
}

export async function salvarRespostaGerada(chaveBusca: string, orientation: Orientation) {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("respostas")
    .insert({
      origem: "gerada_gemini",
      chave_busca: chaveBusca,
      acolhimento: orientation.acolhimento,
      orientacao: orientation.orientacao,
      pilula_espiritual: orientation.pilula_espiritual,
      checklist_agora: orientation.checklist_agora,
      checklist_proximo: orientation.checklist_proximo,
      perguntas_aprofundamento: orientation.perguntas_aprofundamento,
    })
    .select("id")
    .single();
  return data?.id as string | undefined;
}

export async function registrarInteracao(params: { sessaoId: string; texto: string; respostaId?: string | null; foiCacheHit: boolean }) {
  const supabase = getServerClient();
  if (!supabase) return;
  // garante que a sessão existe mesmo se o consentimento não tiver sido gravado antes (ex: localStorage antigo)
  await supabase.from("sessoes").upsert({ id: params.sessaoId, consentimento_lgpd: true }, { onConflict: "id", ignoreDuplicates: true });
  await Promise.all([
    supabase.from("historico_interacoes").insert({
      sessao_id: params.sessaoId,
      tipo: "campo_aberto",
      texto_original: params.texto,
      resposta_id: params.respostaId ?? null,
      foi_cache_hit: params.foiCacheHit,
    }),
    supabase.from("auditoria_sessoes").insert({ sessao_id: params.sessaoId, acao: "recebeu_orientacao" }),
  ]);
}

