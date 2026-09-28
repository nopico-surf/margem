import { NextResponse } from "next/server";
import { gerarOrientacao } from "@/lib/gemini";
import { detectarRisco } from "@/lib/risco";
import { CARDS_HOME } from "@/lib/cards-home";
import { CATEGORIA_PADRAO, paraCardResource } from "@/lib/recursos";
import {
  buscarInstituicoesPorCategoria,
  buscarProfissionaisPorCategoria,
  buscarRespostaPorChave,
  buscarServicosPublicosPorCategoria,
  registrarInteracao,
  salvarRespostaGerada,
} from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const texto = typeof body.texto === "string" ? body.texto.trim() : "";
    const cardIndex = typeof body.cardIndex === "number" ? body.cardIndex : undefined;
    const sessaoId = typeof body.sessaoId === "string" ? body.sessaoId : "";
    const buscarRecursos = body.buscarRecursos === true;

    if (buscarRecursos) {
      const [profissionais, servicosPublicos, instituicoes] = await Promise.all([
        buscarProfissionaisPorCategoria(CATEGORIA_PADRAO, sessaoId),
        buscarServicosPublicosPorCategoria(CATEGORIA_PADRAO),
        buscarInstituicoesPorCategoria(CATEGORIA_PADRAO),
      ]);

      return NextResponse.json({
        profissionais,
        servicos_publicos: servicosPublicos.map((servico) => paraCardResource(servico.id, servico.nome, servico.descricao, servico.acoes)),
        instituicoes: instituicoes.map((instituicao) => paraCardResource(instituicao.id, instituicao.nome, instituicao.descricao, instituicao.contatos)),
      });
    }

    if (!texto && cardIndex === undefined) return NextResponse.json({ error: "Texto ou cardIndex obrigatório" }, { status: 400 });
    if (!sessaoId) return NextResponse.json({ error: "sessaoId obrigatório" }, { status: 400 });

    let cached = null;
    let orientation = null;
    let respostaId = null;
    let foiCache = false;
    let textoOriginal = texto;

    let tipoInteracao: "card" | "campo_aberto" = "campo_aberto";

    if (cardIndex !== undefined && cardIndex >= 0 && cardIndex < CARDS_HOME.length) {
      const chaveCard = CARDS_HOME[cardIndex].chave;
      tipoInteracao = "card";
      textoOriginal = chaveCard;
      cached = await buscarRespostaPorChave(chaveCard);
      if (cached) {
        orientation = cached;
        respostaId = cached.id;
        foiCache = true;
      }
    }

    // Preenchido só quando o Gemini é chamado (card e cache não chamam), pra medir o tempo real da API do Google.
    let tempoGeminiMs: number | null = null;

    // Campo livre sempre chama o Gemini: reaproveitar resposta salva por texto parecido fica pra depois.
    if (!orientation) {
      const resultado = await gerarOrientacao(texto);
      tempoGeminiMs = resultado.tempoMs;
      if (!resultado.ok) {
        // Sem resposta genérica: a tela segue no loading até existir o "tentar novamente".
        console.error(`[orientacao] Gemini falhou: ${resultado.motivo}${resultado.detalhe ? ` (${resultado.detalhe})` : ""} (${resultado.tempoMs}ms)`);
        await registrarInteracao({
          sessaoId,
          tipo: tipoInteracao,
          texto: textoOriginal,
          respostaId: null,
          foiCacheHit: false,
          recebeuOrientacao: false,
          tempoGeminiMs: resultado.tempoMs,
          geminiFalhou: true,
          motivoFalha: resultado.motivo,
        });
        return NextResponse.json({ error: "gemini_indisponivel", motivo: resultado.motivo, detalhe: resultado.detalhe ?? null, tempo_gemini_ms: resultado.tempoMs }, { status: 503 });
      }
      orientation = resultado.orientation;
      respostaId = await salvarRespostaGerada(orientation);
    }

    const risco = detectarRisco(textoOriginal);
    if (sessaoId) {
      await registrarInteracao({
        sessaoId,
        tipo: tipoInteracao,
        texto: textoOriginal,
        respostaId,
        foiCacheHit: foiCache,
        tempoGeminiMs,
        geminiFalhou: tempoGeminiMs !== null ? false : null,
      });
    }

    return NextResponse.json({
      ...orientation,
      risco,
      foi_cache_hit: foiCache,
      tempo_gemini_ms: tempoGeminiMs,
    });
  } catch (err) {
    console.error("[orientacao] Falha inesperada:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Não foi possível preparar a orientação." }, { status: 500 });
  }
}
