import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";

// Itens do exercício da semana marcados como feitos, por módulo (ajuste de 10/11/2026).
// GET ?modulo=1 devolve { itens: { [id]: feito_em } }; POST { modulo, item } marca (a primeira vez vale).

function moduloValido(valor: unknown) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= 1 && numero <= 8 ? numero : null;
}

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const modulo = moduloValido(new URL(request.url).searchParams.get("modulo"));
  if (!modulo) return Response.json({ error: "modulo_invalido" }, { status: 400 });
  const { data, error } = await sessao.supabase
    .from("familia_exercicios")
    .select("item, feito_em")
    .eq("user_id", sessao.user.id)
    .eq("modulo", modulo)
    .order("feito_em");
  if (error) console.error("[familia] ler exercício falhou:", error.message);
  return Response.json({ itens: Object.fromEntries((data ?? []).map((linha) => [linha.item, linha.feito_em])) });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { modulo?: unknown; item?: unknown } | null;
  const modulo = moduloValido(corpo?.modulo);
  const item = typeof corpo?.item === "string" && /^[a-z_]{1,40}$/.test(corpo.item) ? corpo.item : null;
  if (!modulo || !item) return Response.json({ error: "item_invalido" }, { status: 400 });
  const { error } = await sessao.supabase
    .from("familia_exercicios")
    .upsert({ user_id: sessao.user.id, modulo, item }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
  if (error) {
    console.error("[familia] marcar exercício falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
