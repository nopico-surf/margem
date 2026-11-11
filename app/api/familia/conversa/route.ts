import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { ITENS_DA_CONVERSA, sanitizarConversa } from "@/lib/familia/conversa";

// "Como foi a conversa" (briefing M1, item 2). GET devolve os registros mais recentes; POST grava um e,
// nos módulos 1 e 3, conclui o item da conversa. A frase escrita pela pessoa nunca vai pra IA nem
// pro Mixpanel.

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { data, error } = await sessao.supabase
    .from("familia_conversa")
    .select("id, modulo, frase, como_foi, reacao, criado_em")
    .eq("user_id", sessao.user.id)
    .order("criado_em", { ascending: false })
    .limit(20);
  if (error) console.error("[familia] ler conversa falhou:", error.message);
  return Response.json({ registros: data ?? [] });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { registro?: unknown } | null;
  const registro = sanitizarConversa(corpo?.registro);
  if (!registro) return Response.json({ error: "registro_invalido" }, { status: 400 });
  const { error } = await sessao.supabase.from("familia_conversa").insert({ user_id: sessao.user.id, ...registro });
  if (error) {
    console.error("[familia] gravar conversa falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  const item = ITENS_DA_CONVERSA[registro.modulo];
  if (item) {
    const marcado = await sessao.supabase
      .from("familia_exercicios")
      .upsert({ user_id: sessao.user.id, ...item }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
    if (marcado.error) console.error("[familia] marcar item da conversa falhou:", marcado.error.message);
  }
  return Response.json({ ok: true });
}
