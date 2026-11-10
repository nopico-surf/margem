import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { ITEM_DO_DIARIO, sanitizarAnotacao } from "@/lib/familia/diario";

// Diário (ajuste de 10/11/2026: disponível desde o módulo 1). GET devolve as anotações mais recentes;
// POST grava uma e marca o item "Observe sem reagir" do módulo 1 como feito.

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { data, error } = await sessao.supabase
    .from("familia_diario")
    .select("id, tipo, quando, antes, percebeu, reagiu, depois")
    .eq("user_id", sessao.user.id)
    .order("quando", { ascending: false })
    .limit(50);
  if (error) console.error("[familia] ler diário falhou:", error.message);
  return Response.json({ anotacoes: data ?? [] });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { anotacao?: unknown } | null;
  const anotacao = sanitizarAnotacao(corpo?.anotacao);
  if (!anotacao) return Response.json({ error: "anotacao_invalida" }, { status: 400 });
  const { error } = await sessao.supabase.from("familia_diario").insert({ user_id: sessao.user.id, ...anotacao });
  if (error) {
    console.error("[familia] gravar diário falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  const marcado = await sessao.supabase
    .from("familia_exercicios")
    .upsert({ user_id: sessao.user.id, ...ITEM_DO_DIARIO }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
  if (marcado.error) console.error("[familia] marcar item do diário falhou:", marcado.error.message);
  return Response.json({ ok: true });
}
