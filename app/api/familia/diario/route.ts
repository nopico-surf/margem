import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { itensParaMarcar, sanitizarAnotacao, usouOutroEscrito } from "@/lib/familia/diario";

// Diário (briefing M2). GET devolve as anotações mais recentes; POST grava uma e conclui os itens do
// programa que ela completa (1 difícil: módulo 1; 3 difíceis em 7 dias e 1 bom: módulo 2); PATCH edita
// e DELETE ?id= apaga. Editar ou apagar não desfaz um item já concluído.

const CAMPOS = "id, tipo, quando, antes, percebeu, buscou, reagiu, depois, bom_o_que, bom_sentiu, texto_livre";

type Sessao = NonNullable<Awaited<ReturnType<typeof usuarioDaRequisicao>>>;

// Listas vazias no lugar de null, pro cliente não tratar dois casos.
function normalizar(linha: Record<string, unknown>) {
  const lista = (valor: unknown) => (Array.isArray(valor) ? valor : []);
  return {
    ...linha,
    antes: lista(linha.antes),
    percebeu: lista(linha.percebeu),
    buscou: lista(linha.buscou),
    reagiu: lista(linha.reagiu),
    depois: lista(linha.depois),
    bom_o_que: lista(linha.bom_o_que),
    bom_sentiu: lista(linha.bom_sentiu),
  };
}

async function concluirItens(sessao: Sessao) {
  const { data, error } = await sessao.supabase.from("familia_diario").select("tipo, quando").eq("user_id", sessao.user.id).order("quando", { ascending: false }).limit(100);
  if (error) return console.error("[familia] contar diário falhou:", error.message);
  const itens = itensParaMarcar(data ?? []);
  if (itens.length === 0) return;
  const marcado = await sessao.supabase
    .from("familia_exercicios")
    .upsert(itens.map((item) => ({ user_id: sessao.user.id, ...item })), { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
  if (marcado.error) console.error("[familia] marcar itens do diário falhou:", marcado.error.message);
}

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { data, error } = await sessao.supabase.from("familia_diario").select(CAMPOS).eq("user_id", sessao.user.id).order("quando", { ascending: false }).limit(100);
  if (error) console.error("[familia] ler diário falhou:", error.message);
  return Response.json({ anotacoes: (data ?? []).map(normalizar) });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { anotacao?: unknown } | null;
  const anotacao = sanitizarAnotacao(corpo?.anotacao);
  if (!anotacao) return Response.json({ error: "anotacao_invalida" }, { status: 400 });
  const { error } = await sessao.supabase.from("familia_diario").insert({ user_id: sessao.user.id, ...anotacao, usou_outro_escrito: usouOutroEscrito(anotacao) });
  if (error) {
    console.error("[familia] gravar diário falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  await concluirItens(sessao);
  return Response.json({ ok: true });
}

export async function PATCH(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { id?: unknown; anotacao?: unknown } | null;
  const anotacao = sanitizarAnotacao(corpo?.anotacao);
  if (!anotacao || typeof corpo?.id !== "string") return Response.json({ error: "anotacao_invalida" }, { status: 400 });
  const { error } = await sessao.supabase.from("familia_diario").update({ ...anotacao, usou_outro_escrito: usouOutroEscrito(anotacao) }).eq("id", corpo.id).eq("user_id", sessao.user.id);
  if (error) {
    console.error("[familia] editar diário falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  await concluirItens(sessao);
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "anotacao_invalida" }, { status: 400 });
  const { error } = await sessao.supabase.from("familia_diario").delete().eq("id", id).eq("user_id", sessao.user.id);
  if (error) {
    console.error("[familia] apagar diário falhou:", error.message);
    return Response.json({ error: "falha_ao_apagar" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
