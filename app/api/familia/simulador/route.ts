import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { buscarPerfil, buscarUltimoDiagnostico } from "@/lib/familia/dados";
import { lerCenario, lerPrompt, type Cenario } from "@/lib/familia/conteudo";
import { limparApelido, rotuloDaOpcao, sanitizarRespostas, ROTULO_PROBLEMA } from "@/lib/familia/diagnostico";
import { temTermoDeRisco } from "@/lib/familia/risco";
import { gerarFeedback, historicoValido, responderComoPersonagem, REACOES_SIMULADOR } from "@/lib/familia/simulador";
import { SIMULADOR_GRATIS, SIMULADOR_LIMITE_POR_DIA, SIMULADOR_MAX_MENSAGENS } from "@/lib/familia/config";

// Simulador de conversa (briefing, seção 8). Três ações:
// - iniciar: confere acesso e limite, cria a linha em familia_simulacoes;
// - mensagem: confere risco na mensagem do familiar (camada nossa) e pede a resposta do personagem;
// - terminar: pede o feedback e grava só ele.
// A conversa em si nunca é gravada nem logada.

type Corpo = { acao?: unknown; cenario?: unknown; simulacaoId?: unknown; historico?: unknown; reacoes?: unknown };

function erro(codigo: string, status: number) {
  return Response.json({ error: codigo }, { status });
}

async function buscarSimulacao(supabase: NonNullable<Awaited<ReturnType<typeof usuarioDaRequisicao>>>["supabase"], userId: string, id: unknown) {
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await supabase
    .from("familia_simulacoes")
    .select("id, cenario, concluido_em, parou_por_seguranca")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  return data as { id: string; cenario: string; concluido_em: string | null; parou_por_seguranca: boolean } | null;
}

// A cena e a nota do cenário entram no prompt antes das trocas, pra que um {{apelido}} escrito dentro delas
// também seja substituído (briefing M4b).
async function promptDoPersonagem(respostasBrutas: unknown, reacoesDoCorpo: unknown, cenario: Cenario) {
  const respostas = sanitizarRespostas(respostasBrutas);
  const reacoesValidas = new Map(REACOES_SIMULADOR.map((reacao) => [reacao.valor as string, reacao.rotulo]));
  const reacoes = Array.isArray(reacoesDoCorpo) ? reacoesDoCorpo.filter((item): item is string => typeof item === "string" && reacoesValidas.has(item)) : [];
  const base = (await lerPrompt("personagem")).replaceAll("{{contexto_do_cenario}}", cenario.contexto);
  const prompt = cenario.notaDoPersonagem ? `${base}

Ajuste para esta cena: ${cenario.notaDoPersonagem}` : base;
  return prompt
    .replaceAll("{{apelido}}", limparApelido(respostas.apelido) || "a pessoa")
    .replaceAll("{{problemas}}", (respostas.problemas ?? []).map((problema) => ROTULO_PROBLEMA[problema].toLowerCase()).join(", ") || "álcool ou outras drogas")
    .replaceAll("{{relacao}}", respostas.relacao ? rotuloDaOpcao("relacao", respostas.relacao) : "pessoa próxima")
    .replaceAll("{{reacoes}}", reacoes.map((reacao) => reacoesValidas.get(reacao)?.toLowerCase()).join(", ") || "nega");
}

// Prompt do feedback: o foco do cenário entra no fim, e só depois o apelido é trocado (briefing M4b).
// Sem foco, é o prompt de sempre.
async function promptDoFeedback(cenario: Cenario, respostasBrutas: unknown) {
  const prompt = await lerPrompt("feedback");
  if (!cenario.focoDoFeedback) return prompt;
  const respostas = sanitizarRespostas(respostasBrutas);
  return `${prompt}

Foco desta cena: ${cenario.focoDoFeedback}`.replaceAll("{{apelido}}", limparApelido(respostas.apelido) || "a pessoa");
}

// SÓ DESENVOLVIMENTO: modo sem login (lib/familia/dev.ts). Sem conta, sem banco e sem limite de uso;
// as respostas do diagnóstico vêm do aparelho (respostasDev). O cenário vai dentro do id da simulação.
// A checagem de risco por palavra e o Gemini são os mesmos da rota real.
async function simuladorSemLogin(corpo: Corpo & { respostasDev?: unknown }) {
  if (corpo.acao === "iniciar") {
    const cenario = typeof corpo.cenario === "string" ? await lerCenario(corpo.cenario) : null;
    if (!cenario) return erro("cenario_invalido", 404);
    return Response.json({ simulacaoId: `${cenario.id}~${crypto.randomUUID()}` });
  }
  const cenario = typeof corpo.simulacaoId === "string" ? await lerCenario(corpo.simulacaoId.split("~")[0]) : null;
  if (!cenario) return erro("simulacao_invalida", 404);

  if (corpo.acao === "mensagem") {
    const historico = historicoValido(corpo.historico, true);
    if (!historico) return erro("historico_invalido", 400);
    const turnos = historico.filter((fala) => fala.autor === "familiar").length;
    if (turnos > SIMULADOR_MAX_MENSAGENS) return erro("limite_de_mensagens", 400);
    if (temTermoDeRisco(historico[historico.length - 1].texto)) return Response.json({ tipo: "seguranca", mensagem: null, origem: "palavra" });
    const resposta = await responderComoPersonagem(await promptDoPersonagem(corpo.respostasDev, corpo.reacoes, cenario), historico);
    if (!resposta.ok) return Response.json({ error: "ia_indisponivel", motivo: resposta.motivo }, { status: 503 });
    if (resposta.tipo === "seguranca") return Response.json({ tipo: "seguranca", mensagem: resposta.mensagem, origem: "ia" });
    return Response.json({ tipo: "fala", texto: resposta.texto, turnos, ultima: turnos >= SIMULADOR_MAX_MENSAGENS });
  }

  if (corpo.acao === "terminar") {
    const historico = historicoValido(corpo.historico, false);
    if (!historico) return erro("historico_invalido", 400);
    const resultado = await gerarFeedback(await promptDoFeedback(cenario, corpo.respostasDev), historico);
    if (!resultado.ok) return Response.json({ error: "ia_indisponivel", motivo: resultado.motivo }, { status: 503 });
    return Response.json({ feedback: resultado.feedback });
  }

  return erro("acao_invalida", 400);
}

// GET ?cenario=nega-o-problema: o retorno do último treino concluído desse cenário ("Ver o retorno do
// treino", briefing M3). Só o retorno que já ficou guardado; a conversa nunca é gravada.
export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const cenario = new URL(request.url).searchParams.get("cenario") ?? "";
  if (!/^[a-z0-9-]{1,60}$/.test(cenario)) return erro("cenario_invalido", 400);
  const { data, error } = await sessao.supabase
    .from("familia_simulacoes")
    .select("feedback")
    .eq("user_id", sessao.user.id)
    .eq("cenario", cenario)
    .not("concluido_em", "is", null)
    .not("feedback", "is", null)
    .order("concluido_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error("[familia] ler retorno do treino falhou:", error.message);
  return Response.json({ feedback: (data?.feedback as unknown) ?? null });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "production" && request.headers.get("x-familia-dev") === "1") {
    return simuladorSemLogin(((await request.json().catch(() => null)) ?? {}) as Corpo & { respostasDev?: unknown });
  }
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { user, supabase } = sessao;
  const corpo = ((await request.json().catch(() => null)) ?? {}) as Corpo;

  const perfil = await buscarPerfil(supabase, user.id);
  if (!perfil) return erro("sem_consentimento", 403);

  if (corpo.acao === "iniciar") {
    const cenario = typeof corpo.cenario === "string" ? await lerCenario(corpo.cenario) : null;
    if (!cenario) return erro("cenario_invalido", 404);
    if (perfil.safety_mode && cenario.bloqueadoEmModoSeguranca) return erro("bloqueado_seguranca", 403);

    if (!perfil.acesso_liberado_em) {
      // Quem não comprou: 1 simulação grátis, só do cenário marcado como grátis.
      if (!cenario.gratis) return erro("so_para_compradores", 403);
      const { count } = await supabase.from("familia_simulacoes").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      if ((count ?? 0) >= SIMULADOR_GRATIS) return erro("limite_gratis", 429);
    } else {
      const inicioDoDia = new Date();
      inicioDoDia.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("familia_simulacoes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("criado_em", inicioDoDia.toISOString());
      if ((count ?? 0) >= SIMULADOR_LIMITE_POR_DIA) return erro("limite_diario", 429);
    }

    const { data, error } = await supabase.from("familia_simulacoes").insert({ user_id: user.id, cenario: cenario.id }).select("id").single();
    if (error || !data) {
      console.error("[familia] iniciar simulação falhou:", error?.message);
      return erro("falha_ao_salvar", 500);
    }
    return Response.json({ simulacaoId: data.id });
  }

  const simulacao = await buscarSimulacao(supabase, user.id, corpo.simulacaoId);
  if (!simulacao) return erro("simulacao_invalida", 404);
  if (simulacao.concluido_em || simulacao.parou_por_seguranca) return erro("simulacao_encerrada", 409);

  if (corpo.acao === "mensagem") {
    const historico = historicoValido(corpo.historico, true);
    if (!historico) return erro("historico_invalido", 400);
    const turnos = historico.filter((fala) => fala.autor === "familiar").length;
    if (turnos > SIMULADOR_MAX_MENSAGENS) return erro("limite_de_mensagens", 400);

    // Primeira camada de segurança, antes da IA.
    if (temTermoDeRisco(historico[historico.length - 1].texto)) {
      await supabase.from("familia_simulacoes").update({ parou_por_seguranca: true, turnos }).eq("id", simulacao.id);
      return Response.json({ tipo: "seguranca", mensagem: null, origem: "palavra" });
    }

    const [cenario, diagnostico] = await Promise.all([lerCenario(simulacao.cenario), buscarUltimoDiagnostico(supabase, user.id)]);
    if (!cenario) return erro("cenario_invalido", 404);
    const sistema = await promptDoPersonagem(diagnostico?.respostas, corpo.reacoes, cenario);

    const resposta = await responderComoPersonagem(sistema, historico);
    if (!resposta.ok) {
      console.error("[familia] simulador falhou:", resposta.motivo, "detalhe" in resposta ? resposta.detalhe : "");
      return Response.json({ error: "ia_indisponivel", motivo: resposta.motivo }, { status: 503 });
    }
    if (resposta.tipo === "seguranca") {
      await supabase.from("familia_simulacoes").update({ parou_por_seguranca: true, turnos }).eq("id", simulacao.id);
      return Response.json({ tipo: "seguranca", mensagem: resposta.mensagem, origem: "ia" });
    }
    await supabase.from("familia_simulacoes").update({ turnos }).eq("id", simulacao.id);
    return Response.json({ tipo: "fala", texto: resposta.texto, turnos, ultima: turnos >= SIMULADOR_MAX_MENSAGENS });
  }

  if (corpo.acao === "terminar") {
    const historico = historicoValido(corpo.historico, false);
    if (!historico) return erro("historico_invalido", 400);
    const [cenario, diagnostico] = await Promise.all([lerCenario(simulacao.cenario), buscarUltimoDiagnostico(supabase, user.id)]);
    if (!cenario) return erro("cenario_invalido", 404);
    const resultado = await gerarFeedback(await promptDoFeedback(cenario, diagnostico?.respostas), historico);
    if (!resultado.ok) {
      console.error("[familia] feedback do simulador falhou:", resultado.motivo, "detalhe" in resultado ? resultado.detalhe : "");
      return Response.json({ error: "ia_indisponivel", motivo: resultado.motivo }, { status: 503 });
    }
    const turnos = historico.filter((fala) => fala.autor === "familiar").length;
    const { error } = await supabase
      .from("familia_simulacoes")
      .update({ feedback: resultado.feedback, turnos, concluido_em: new Date().toISOString() })
      .eq("id", simulacao.id);
    if (error) console.error("[familia] gravar feedback falhou:", error.message);
    return Response.json({ feedback: resultado.feedback });
  }

  return erro("acao_invalida", 400);
}
