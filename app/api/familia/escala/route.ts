import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { sanitizarNotas, type OrigemEscala } from "@/lib/familia/escala";

// Escala "Como está a sua vida" (componentes-parte1, C1). GET devolve as duas últimas (a do módulo 7
// compara com a anterior); POST { origem, notas } grava uma. No módulo 7, gravar a escala marca o
// item "Refazer a escala". No módulo 1, o item só fica feito quando a meta é salva (rota da meta).

const ORIGENS: OrigemEscala[] = ["modulo1", "modulo7", "painel"];

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { data, error } = await sessao.supabase
    .from("familia_escala_vida")
    .select("id, origem, notas, criado_em")
    .eq("user_id", sessao.user.id)
    .order("criado_em", { ascending: false })
    .limit(2);
  if (error) console.error("[familia] ler escala falhou:", error.message);
  return Response.json({ escalas: data ?? [] });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const corpo = (await request.json().catch(() => null)) as { origem?: unknown; notas?: unknown } | null;
  const origem = ORIGENS.find((item) => item === corpo?.origem);
  const notas = sanitizarNotas(corpo?.notas);
  if (!origem || !notas) return Response.json({ error: "escala_invalida" }, { status: 400 });
  const { error } = await sessao.supabase.from("familia_escala_vida").insert({ user_id: sessao.user.id, origem, notas });
  if (error) {
    console.error("[familia] gravar escala falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  if (origem === "modulo7") {
    const marcado = await sessao.supabase
      .from("familia_exercicios")
      .upsert({ user_id: sessao.user.id, modulo: 7, item: "escala" }, { onConflict: "user_id,modulo,item", ignoreDuplicates: true });
    if (marcado.error) console.error("[familia] marcar item da escala falhou:", marcado.error.message);
  }
  return Response.json({ ok: true });
}
