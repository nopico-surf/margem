import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function getServerClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export async function registrarInteracao(params: { texto: string; respostaId?: string; foiCacheHit: boolean }) {
  const supabase = getServerClient();
  if (!supabase) return;
  const sessaoId = crypto.randomUUID();
  await Promise.all([
    supabase.from("historico_interacoes").insert({ sessao_id: sessaoId, tipo: "campo_aberto", texto_original: params.texto, resposta_id: params.respostaId ?? null, foi_cache_hit: params.foiCacheHit }),
    supabase.from("auditoria_sessoes").insert({ sessao_id: sessaoId, acao: "orientacao_solicitada" }),
  ]);
}
