import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { alternarDiaFeito, dataValida, segundaDaSemana } from "@/lib/familia/escala";
import {
  adiarCompleto,
  ITEM_ADIAR_M4,
  ITEM_GOSTA_M4,
  ITEM_PLANO_M4,
  sanitizarAdiar,
  sanitizarGosta,
  sanitizarPlano,
  type Adiar,
  type PlanoValorizar,
} from "@/lib/familia/valorizar";

// Módulo 4 (briefing M4): do que a pessoa gosta, plano de valorizar e "o combinado fica para outro dia".
// GET devolve as três coisas (ou null).
// POST { tipo: "gosta" | "plano" | "adiar", dados, hoje? } grava (um registro por pessoa; editar substitui)
//   e conclui o item do exercício. O plano guarda a segunda-feira de `hoje`: editar na mesma semana
//   mantém os dias feitos. Em "adiar", "sim" ou "não sei" não conclui nada: o exercício fica
//   "Deixado para depois".
// PATCH { data, hoje } marca ou desmarca um dia do plano, com a mesma regra dos dias da meta (hoje e dias
//   que já passaram na semana do plano).
// O texto escrito pela pessoa nunca vai pra IA nem pro Mixpanel.

type Sessao = NonNullable<Awaited<ReturnType<typeof usuarioDaRequisicao>>>;

async function lerTudo(sessao: Sessao) {
  const usuario = sessao.user.id;
  const [gosta, plano, adiar] = await Promise.all([
    sessao.supabase.from("familia_lista_gosta").select("itens, busca_relacionada").eq("user_id", usuario).maybeSingle(),
    sessao.supabase.from("familia_plano_valorizar").select("formas, dias, periodos, semana_inicio, feitos").eq("user_id", usuario).maybeSingle(),
    sessao.supabase.from("familia_adiar").select("clima, situacao, na_hora, depois").eq("user_id", usuario).maybeSingle(),
  ]);
  for (const { error } of [gosta, plano, adiar]) if (error) console.error("[familia] ler módulo 4 falhou:", error.message);
  return { gosta: gosta.data ?? null, plano: (plano.data as PlanoValorizar | null) ?? null, adiar: (adiar.data as Adiar | null) ?? null };
}

async function marcarItem(sessao: Sessao, item: { modulo: number; item: string }) {
  const { error } = await sessao.supabase
    .from("familia_exercicios")
    .upsert({ user_id: sessao.user.id, ...item }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
  if (error) console.error("[familia] marcar item do módulo 4 falhou:", error.message);
}

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  return Response.json(await lerTudo(sessao));
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { tipo?: unknown; dados?: unknown; hoje?: unknown } | null;
  const usuario = sessao.user.id;
  const agora = new Date().toISOString();
  let erro: { message: string } | null = null;

  if (corpo?.tipo === "gosta") {
    const gosta = sanitizarGosta(corpo.dados);
    if (!gosta) return Response.json({ error: "lista_invalida" }, { status: 400 });
    ({ error: erro } = await sessao.supabase.from("familia_lista_gosta").upsert({ user_id: usuario, ...gosta, atualizado_em: agora }, { onConflict: "user_id" }));
    if (!erro) await marcarItem(sessao, ITEM_GOSTA_M4);
  } else if (corpo?.tipo === "plano") {
    const plano = sanitizarPlano(corpo.dados);
    if (!plano || !dataValida(corpo.hoje)) return Response.json({ error: "plano_invalido" }, { status: 400 });
    const semana = segundaDaSemana(corpo.hoje);
    const atual = (await lerTudo(sessao)).plano;
    const feitos = atual && atual.semana_inicio === semana ? atual.feitos : [];
    ({ error: erro } = await sessao.supabase
      .from("familia_plano_valorizar")
      .upsert({ user_id: usuario, ...plano, semana_inicio: semana, feitos, atualizado_em: agora }, { onConflict: "user_id" }));
    if (!erro) await marcarItem(sessao, ITEM_PLANO_M4);
  } else if (corpo?.tipo === "adiar") {
    const adiar = sanitizarAdiar(corpo.dados);
    if (!adiar) return Response.json({ error: "adiar_invalido" }, { status: 400 });
    ({ error: erro } = await sessao.supabase.from("familia_adiar").upsert({ user_id: usuario, ...adiar, atualizado_em: agora }, { onConflict: "user_id" }));
    if (!erro && adiarCompleto(adiar)) await marcarItem(sessao, ITEM_ADIAR_M4);
  } else {
    return Response.json({ error: "tipo_invalido" }, { status: 400 });
  }

  if (erro) {
    console.error("[familia] gravar módulo 4 falhou:", erro.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  return Response.json({ ok: true });
}

export async function PATCH(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { data?: unknown; hoje?: unknown } | null;
  if (!dataValida(corpo?.data) || !dataValida(corpo?.hoje)) return Response.json({ error: "data_invalida" }, { status: 400 });
  const { plano } = await lerTudo(sessao);
  if (!plano) return Response.json({ error: "sem_plano" }, { status: 404 });
  const feitos = alternarDiaFeito({ semana_inicio: plano.semana_inicio, dias_feitos: plano.feitos }, corpo.data as string, corpo.hoje as string);
  if (!feitos) return Response.json({ error: "dia_fora_da_semana" }, { status: 400 });
  const { error } = await sessao.supabase
    .from("familia_plano_valorizar")
    .update({ feitos, atualizado_em: new Date().toISOString() })
    .eq("user_id", sessao.user.id);
  if (error) {
    console.error("[familia] marcar dia do plano falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  return Response.json({ plano: { ...plano, feitos } });
}
