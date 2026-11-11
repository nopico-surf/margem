import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { aplicarRede, ITEM_APOIO_M7, REDE_VAZIA, type Rede } from "@/lib/familia/rede";

// Módulo 7 (briefing M7, C10): a rede de apoio.
// GET devolve a rede (ou null).
// POST { tipo: "mensagem", nomes, mensagem } ("Contar que mandei") ou { tipo: "grupo", nomes, grupo }
//   ("Contar que fui"): grava o passo e conclui o item "apoio" do módulo 7.
// Os nomes escritos pela pessoa nunca vão pra IA nem pro Mixpanel.

type Sessao = NonNullable<Awaited<ReturnType<typeof usuarioDaRequisicao>>>;

async function lerRede(sessao: Sessao) {
  const { data, error } = await sessao.supabase.from("familia_rede").select("nomes, mensagens, grupos").eq("user_id", sessao.user.id).maybeSingle();
  if (error) console.error("[familia] ler rede falhou:", error.message);
  return (data as Rede | null) ?? null;
}

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  return Response.json({ rede: await lerRede(sessao) });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = await request.json().catch(() => null);
  const nova = aplicarRede((await lerRede(sessao)) ?? REDE_VAZIA, corpo, new Date().toISOString());
  if (!nova) return Response.json({ error: "passo_invalido" }, { status: 400 });

  const { error } = await sessao.supabase
    .from("familia_rede")
    .upsert({ user_id: sessao.user.id, ...nova, atualizado_em: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) {
    console.error("[familia] gravar rede falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  const marcado = await sessao.supabase
    .from("familia_exercicios")
    .upsert({ user_id: sessao.user.id, ...ITEM_APOIO_M7 }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
  if (marcado.error) console.error("[familia] marcar item do módulo 7 falhou:", marcado.error.message);
  return Response.json({ rede: nova });
}
