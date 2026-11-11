import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { aplicarPasso, CONVITE_VAZIO, ITEM_CONTAR_M5, ITEM_PREPARAR_M5, PASSOS_DO_CONVITE, sanitizarResultado, type Convite } from "@/lib/familia/convite";

// Módulo 5 (briefing M5, C6): o convite.
// GET devolve o convite (ou null).
// POST { tipo: "passo", dados: { passo, ... } } grava o passo da tela "Preparar o convite". O passo 5
//   conclui o item "preparar".
// POST { tipo: "resultado", resultado: "sim" | "pensar" | "nao" | null } grava "Contar como foi". Com uma
//   resposta, conclui o item "contar"; null ("Ainda não convidei") limpa o resultado e não conclui nada.
// A frase escrita pela pessoa nunca vai pra IA nem pro Mixpanel.

type Sessao = NonNullable<Awaited<ReturnType<typeof usuarioDaRequisicao>>>;

const COLUNAS = "passo, profissionais_salvos, frase, plano_b, data_retorno, resultado, data_resultado";

async function lerConvite(sessao: Sessao) {
  const { data, error } = await sessao.supabase.from("familia_convite").select(COLUNAS).eq("user_id", sessao.user.id).maybeSingle();
  if (error) console.error("[familia] ler convite falhou:", error.message);
  return (data as Convite | null) ?? null;
}

async function marcarItem(sessao: Sessao, item: { modulo: number; item: string }) {
  const { error } = await sessao.supabase
    .from("familia_exercicios")
    .upsert({ user_id: sessao.user.id, ...item }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
  if (error) console.error("[familia] marcar item do módulo 5 falhou:", error.message);
}

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  return Response.json({ convite: await lerConvite(sessao) });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { tipo?: unknown; dados?: unknown; resultado?: unknown } | null;
  const atual = (await lerConvite(sessao)) ?? CONVITE_VAZIO;
  let novo: Convite | null = null;

  if (corpo?.tipo === "passo") {
    novo = aplicarPasso(atual, corpo.dados);
    if (!novo) return Response.json({ error: "passo_invalido" }, { status: 400 });
  } else if (corpo?.tipo === "resultado") {
    const resultado = sanitizarResultado(corpo.resultado);
    if (corpo.resultado !== null && !resultado) return Response.json({ error: "resultado_invalido" }, { status: 400 });
    novo = { ...atual, resultado, data_resultado: resultado ? new Date().toISOString() : null };
  } else {
    return Response.json({ error: "tipo_invalido" }, { status: 400 });
  }

  const { error } = await sessao.supabase
    .from("familia_convite")
    .upsert({ user_id: sessao.user.id, ...novo, atualizado_em: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) {
    console.error("[familia] gravar convite falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  if (corpo.tipo === "passo" && novo.passo >= PASSOS_DO_CONVITE) await marcarItem(sessao, ITEM_PREPARAR_M5);
  if (corpo.tipo === "resultado" && novo.resultado) await marcarItem(sessao, ITEM_CONTAR_M5);
  return Response.json({ convite: novo });
}
