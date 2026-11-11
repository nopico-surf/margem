import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";

// "Pedir acesso gratuito" (briefing 01): sem comprovante de renda, o texto é opcional. O pedido fica
// em familia_pedidos_gratuidade e o fundador libera à mão (migração 0043). O texto nunca vai pra log
// nem pro Mixpanel.

const MAXIMO = 500;

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { texto?: unknown } | null;
  const texto = typeof corpo?.texto === "string" ? corpo.texto.trim().slice(0, MAXIMO) : "";
  const { error } = await sessao.supabase.from("familia_pedidos_gratuidade").insert({ user_id: sessao.user.id, texto: texto || null });
  if (error) {
    console.error("[familia] pedido de acesso gratuito falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
