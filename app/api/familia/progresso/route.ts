import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";

// Início e conclusão de módulo. Na Fase 1 só o módulo 1 existe; a liberação semanal é da Fase 2.
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
