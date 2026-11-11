import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { FRASES_PARA_CONCLUIR, ITEM_FRASES_M3, LIMITE_DE_FRASES, sanitizarFrase } from "@/lib/familia/frases";

// "Reescrever minhas frases" (briefing M3). GET devolve as frases salvas (as mais novas primeiro); POST
// grava uma e, na terceira, conclui o item "Reescrever frases que viram briga" do módulo 3. A frase
// escrita pela pessoa nunca vai pra IA nem pro Mixpanel.

const CAMPOS = "id, frase_antes_id, frase_antes_texto, frase_nova, conferencia, criada_em";

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { data, error } = await sessao.supabase
    .from("familia_frase_reescrita")
    .select(CAMPOS)
    .eq("user_id", sessao.user.id)
    .order("criada_em", { ascending: false })
    .limit(LIMITE_DE_FRASES);
  if (error) console.error("[familia] ler frases falhou:", error.message);
  return Response.json({ frases: data ?? [] });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { frase?: unknown } | null;
  const frase = sanitizarFrase(corpo?.frase);
  if (!frase) return Response.json({ error: "frase_invalida" }, { status: 400 });

  const { count } = await sessao.supabase.from("familia_frase_reescrita").select("id", { count: "exact", head: true }).eq("user_id", sessao.user.id);
  if ((count ?? 0) >= LIMITE_DE_FRASES) return Response.json({ error: "limite_de_frases" }, { status: 409 });

  const { error } = await sessao.supabase.from("familia_frase_reescrita").insert({ user_id: sessao.user.id, ...frase });
  if (error) {
    console.error("[familia] gravar frase falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  if ((count ?? 0) + 1 >= FRASES_PARA_CONCLUIR) {
    const marcado = await sessao.supabase
      .from("familia_exercicios")
      .upsert({ user_id: sessao.user.id, ...ITEM_FRASES_M3 }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
    if (marcado.error) console.error("[familia] marcar item das frases falhou:", marcado.error.message);
  }
  return Response.json({ ok: true });
}
