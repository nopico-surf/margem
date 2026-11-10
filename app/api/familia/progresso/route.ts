import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";

// Início e conclusão de módulo. Na Fase 1 só o módulo 1 existe; a liberação semanal é da Fase 2.
// GET devolve { modulos: { [n]: { iniciado_em, concluido_em } } } pro painel do programa.
export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { data, error } = await sessao.supabase.from("familia_progresso").select("modulo, iniciado_em, concluido_em").eq("user_id", sessao.user.id).order("modulo");
  if (error) console.error("[familia] ler progresso falhou:", error.message);
  return Response.json({
    modulos: Object.fromEntries((data ?? []).map((linha) => [linha.modulo, { iniciado_em: linha.iniciado_em, concluido_em: linha.concluido_em }])),
  });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { user, supabase } = sessao;

  const corpo = (await request.json().catch(() => null)) as { modulo?: unknown; acao?: unknown } | null;
  const modulo = Number(corpo?.modulo);
  if (!Number.isInteger(modulo) || modulo < 1 || modulo > 8) return Response.json({ error: "modulo_invalido" }, { status: 400 });

  if (corpo?.acao === "concluir") {
    const { error } = await supabase
      .from("familia_progresso")
      .upsert({ user_id: user.id, modulo, concluido_em: new Date().toISOString() }, { onConflict: "user_id,modulo" });
    if (error) console.error("[familia] concluir módulo falhou:", error.message);
    return Response.json({ ok: !error });
  }

  // Iniciar não sobrescreve: a primeira vez é a que vale.
  const { error } = await supabase.from("familia_progresso").upsert({ user_id: user.id, modulo }, { onConflict: "user_id,modulo", ignoreDuplicates: true });
  if (error) console.error("[familia] iniciar módulo falhou:", error.message);
  return Response.json({ ok: !error });
}
