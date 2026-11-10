import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { buscarPerfil, buscarUltimoDiagnostico } from "@/lib/familia/dados";
import { calcularSafetyMode, diagnosticoCompleto, sanitizarRespostas } from "@/lib/familia/diagnostico";
import { lerBlocosDoResultado } from "@/lib/familia/conteudo";
import { montarResultado } from "@/lib/familia/resultado";

// Grava o diagnóstico e devolve o resultado montado com os blocos fixos (sem IA, briefing seção 6).
// O resultado não é gravado: é sempre remontado das respostas, pra pegar o texto mais novo dos blocos.

async function resposta(respostas: ReturnType<typeof sanitizarRespostas>, safetyMode: boolean) {
  const blocos = await lerBlocosDoResultado();
  return {
    apelido: respostas.apelido ?? "",
    problemas: respostas.problemas ?? [],
    reacoes: respostas.reacoes ?? [],
    relacao: respostas.relacao ?? null,
    resultado: montarResultado(respostas, blocos, safetyMode),
  };
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { user, supabase } = sessao;

  if (!(await buscarPerfil(supabase, user.id))) return Response.json({ error: "sem_consentimento" }, { status: 403 });

  const corpo = (await request.json().catch(() => null)) as { respostas?: unknown } | null;
  const respostas = sanitizarRespostas(corpo?.respostas);
  if (!diagnosticoCompleto(respostas)) return Response.json({ error: "diagnostico_incompleto" }, { status: 400 });

  const safetyMode = calcularSafetyMode(respostas);
  const [diagnostico, perfil] = await Promise.all([
    supabase.from("familia_diagnosticos").insert({ user_id: user.id, respostas, safety_mode: safetyMode }),
    supabase.from("familia_perfis").update({ safety_mode: safetyMode }).eq("user_id", user.id),
  ]);
  if (diagnostico.error || perfil.error) {
    console.error("[familia] gravar diagnóstico falhou:", diagnostico.error?.message ?? perfil.error?.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }

  return Response.json(await resposta(respostas, safetyMode));
}

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { user, supabase } = sessao;

  const [diagnostico, perfil] = await Promise.all([buscarUltimoDiagnostico(supabase, user.id), buscarPerfil(supabase, user.id)]);
  if (!diagnostico || !perfil) return Response.json({ error: "sem_diagnostico" }, { status: 404 });
  // O modo vem do perfil: o check-in (Fase 3) pode recalcular sem novo diagnóstico.
  return Response.json(await resposta(sanitizarRespostas(diagnostico.respostas), perfil.safety_mode));
}
