import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { alternarDiaFeito, dataValida, sanitizarMeta, segundaDaSemana, type Meta } from "@/lib/familia/escala";

// Meta da semana (componentes-parte1, C1).
// GET: a meta ativa (ou null).
// POST { meta, hoje, modulo? }: cria a meta da semana de `hoje`, ou edita a ativa ("Editar minha
//   meta" mantém a semana e os dias já feitos). Do módulo 1, marca o item "Como está a sua vida"; do
//   módulo 7, o item "Escolher a meta"; do módulo 8 (versão "aceitou"), o item "A sua meta desta semana".
// PATCH { data, hoje }: marca ou desmarca um dia da meta (briefing 00, item 6). Vale hoje e qualquer
//   dia que já passou na semana da meta, planejado ou não; dia futuro volta "dia_fora_da_semana".
// `hoje` vem do aparelho (AAAA-MM-DD): o dia que conta é o da pessoa, não o do servidor.

const CAMPOS = "id, area, texto, dias, momento, confianca, obstaculo_plano, semana_inicio, status, dias_feitos";
const ITEM_DO_MODULO: Record<number, string> = { 1: "escala", 7: "meta", 8: "meta" };

async function metaAtiva(sessao: NonNullable<Awaited<ReturnType<typeof usuarioDaRequisicao>>>) {
  const { data, error } = await sessao.supabase.from("familia_meta_semana").select(CAMPOS).eq("user_id", sessao.user.id).eq("status", "ativa").maybeSingle();
  if (error) console.error("[familia] ler meta falhou:", error.message);
  return (data as Meta | null) ?? null;
}

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  return Response.json({ meta: await metaAtiva(sessao) });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { meta?: unknown; hoje?: unknown; modulo?: unknown } | null;
  const meta = sanitizarMeta(corpo?.meta);
  if (!meta || !dataValida(corpo?.hoje)) return Response.json({ error: "meta_invalida" }, { status: 400 });

  const atual = await metaAtiva(sessao);
  const agora = new Date().toISOString();
  const { error } = atual
    ? await sessao.supabase.from("familia_meta_semana").update({ ...meta, atualizado_em: agora }).eq("id", atual.id).eq("user_id", sessao.user.id)
    : await sessao.supabase.from("familia_meta_semana").insert({ user_id: sessao.user.id, ...meta, semana_inicio: segundaDaSemana(corpo.hoje as string) });
  if (error) {
    console.error("[familia] gravar meta falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }

  const item = ITEM_DO_MODULO[Number(corpo?.modulo)];
  if (item) {
    const marcado = await sessao.supabase
      .from("familia_exercicios")
      .upsert({ user_id: sessao.user.id, modulo: Number(corpo?.modulo), item }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
    if (marcado.error) console.error("[familia] marcar item da meta falhou:", marcado.error.message);
  }
  return Response.json({ meta: await metaAtiva(sessao) });
}

export async function PATCH(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { hoje?: unknown; data?: unknown } | null;
  if (!dataValida(corpo?.hoje) || !dataValida(corpo?.data)) return Response.json({ error: "data_invalida" }, { status: 400 });
  const atual = await metaAtiva(sessao);
  if (!atual) return Response.json({ error: "sem_meta" }, { status: 404 });
  const dias_feitos = alternarDiaFeito(atual, corpo.data as string, corpo.hoje as string);
  if (!dias_feitos) return Response.json({ error: "dia_fora_da_semana" }, { status: 400 });
  const { error } = await sessao.supabase
    .from("familia_meta_semana")
    .update({ dias_feitos, atualizado_em: new Date().toISOString() })
    .eq("id", atual.id)
    .eq("user_id", sessao.user.id);
  if (error) {
    console.error("[familia] marcar dia da meta falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  return Response.json({ meta: await metaAtiva(sessao) });
}
