"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultPage } from "@/components/conversa/ResultPage";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { TITULOS_CARDS_HOME } from "@/lib/cards-home";
import { track } from "@/lib/mixpanel";
import type { CardResource, OrientationResult } from "@/components/conversa/types";
import { URLS_DE_ICONE, URL_AVATAR_PADRAO } from "@/components/icons";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// Copy fixa do Figma (1205:16250) para quando o Gemini falha: não varia por motivo de falha.
const MENSAGEM_ERRO_GEMINI = "Desculpe, houve um erro ao carregar suas informações";

// Na tela, profissionais, serviços e instituições sempre chegam preenchidos pela API, mesmo que
// como lista vazia, por isso aqui eles não são opcionais.
type OrientacaoDaApi = OrientationResult & {
  risco?: { emergency?: boolean };
  foi_cache_hit?: boolean;
};

type RecursosDaApi = {
  profissionais: ProfissionalCadastrado[];
  servicos_publicos: CardResource[];
  instituicoes: CardResource[];
};

function carregarImagem(url: string) {
  return new Promise<void>((resolve) => {
    let concluida = false;
    const concluir = () => {
      if (concluida) return;
      concluida = true;
      window.clearTimeout(timeout);
      resolve();
    };
    const timeout = window.setTimeout(concluir, 2000);
    const imagem = new Image();
    imagem.onload = imagem.onerror = concluir;
    imagem.src = url;
  });
}

function midiasDosRecursos(recursos: RecursosDaApi) {
  return {
    profissionais: [...new Set([
      ...URLS_DE_ICONE,
      ...recursos.profissionais.map((profissional) => profissional.foto_url || URL_AVATAR_PADRAO),
    ])],
    servicosPublicos: URLS_DE_ICONE,
    instituicoes: URLS_DE_ICONE,
  };
}

export default function ConversaPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<OrientacaoDaApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<RecursosDaApi | null>(null);
  const [isResourcesLoading, setIsResourcesLoading] = useState({
    profissionais: false,
    servicosPublicos: false,
    instituicoes: false,
  });
  const [error, setError] = useState<string | null>(null);
  // Em desenvolvimento o React roda este efeito duas vezes (Strict Mode). Sem essa trava saíam dois
  // pedidos por conversa: dois registros no histórico e os skeletons piscando quando a segunda
  // resposta chegava depois da primeira.
  const jaBuscou = useRef(false);
  // Guarda a entrada original (texto/card) pra "tentar novamente" reenviar exatamente a mesma mensagem.
  const entradaRef = useRef<{ texto: string; cardIndex: string | null; origem: "card" | "texto" } | null>(null);
  const numeroTentativaRef = useRef(1);

  const buscarOrientacao = useCallback(async (ehRetry: boolean) => {
    const entrada = entradaRef.current;
    if (!entrada) return;
    const { texto, cardIndex, origem } = entrada;
    const tentativa = numeroTentativaRef.current;

    setIsLoading(true);
    setError(null);
    if (!ehRetry) {
      setResources(null);
      setIsResourcesLoading({ profissionais: false, servicosPublicos: false, instituicoes: false });
    }

    const inicio = performance.now();
    let statusHttp: number | null = null;
    try {
      const response = await fetch("/api/orientacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: texto || "",
          cardIndex: cardIndex ? parseInt(cardIndex) : undefined,
          sessaoId: getOrCreateSessaoId(),
        }),
      });
      statusHttp = response.status;
      const result = await response.json();
      if (result.error === "gemini_indisponivel") {
        track("gemini_falhou", {
          origem,
          eh_retry: ehRetry,
          numero_tentativa: tentativa,
          gemini_falhou: true,
          motivo: result.motivo ?? null,
          detalhe: result.detalhe ?? null,
          tempo_gemini_ms: result.tempo_gemini_ms ?? null,
          tempo_resposta_ms: Math.round(performance.now() - inicio),
        });
        numeroTentativaRef.current = tentativa + 1;
        setOrientation(null);
        setError(MENSAGEM_ERRO_GEMINI);
        return;
      }
      if (!response.ok) throw new Error(result.error || "Não foi possível preparar a orientação.");
      if (typeof result.acolhimento !== "string" || typeof result.orientacao !== "string" || !Array.isArray(result.checklist_agora) || !Array.isArray(result.checklist_proximo)) {
        throw new Error("A resposta recebida não está completa.");
      }
      setOrientation(result);
      setIsResourcesLoading({ profissionais: true, servicosPublicos: true, instituicoes: true });
      fetch("/api/orientacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buscarRecursos: true }),
      })
        .then(async (resourcesResponse) => {
          const resourcesResult = await resourcesResponse.json();
          if (!resourcesResponse.ok) throw new Error();
          return resourcesResult;
        })
        .catch(() => ({ profissionais: [], servicos_publicos: [], instituicoes: [] }))
        .then((resourcesResult) => {
          setResources(resourcesResult);
          const midias = midiasDosRecursos(resourcesResult);

          Promise.all(midias.profissionais.map(carregarImagem)).then(() => {
            setIsResourcesLoading((carregamento) => ({ ...carregamento, profissionais: false }));
          });
          Promise.all(midias.servicosPublicos.map(carregarImagem)).then(() => {
            setIsResourcesLoading((carregamento) => ({ ...carregamento, servicosPublicos: false }));
          });
          Promise.all(midias.instituicoes.map(carregarImagem)).then(() => {
            setIsResourcesLoading((carregamento) => ({ ...carregamento, instituicoes: false }));
          });
        });
      track("orientacao_recebida", {
        origem,
        eh_retry: ehRetry,
        numero_tentativa: tentativa,
        gemini_falhou: false,
        foi_cache_hit: Boolean(result.foi_cache_hit),
        risco_detectado: Boolean(result.risco?.emergency),
        tempo_gemini_ms: result.tempo_gemini_ms ?? null,
        tempo_resposta_ms: Math.round(performance.now() - inicio),
        qtd_profissionais: result.profissionais?.length ?? 0,
        qtd_servicos: result.servicos_publicos?.length ?? 0,
        qtd_instituicoes: result.instituicoes?.length ?? 0,
      });
    } catch (err) {
      track("orientacao_falhou", {
        origem,
        eh_retry: ehRetry,
        numero_tentativa: tentativa,
        tempo_resposta_ms: Math.round(performance.now() - inicio),
        status_http: statusHttp,
        detalhe: err instanceof Error ? err.message : null,
      });
      numeroTentativaRef.current = tentativa + 1;
      setOrientation(null);
      // Tela sempre mostra a copy fixa do Figma; o motivo técnico só vai pro tracking, nunca pra pessoa.
      setError(MENSAGEM_ERRO_GEMINI);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (jaBuscou.current) return;
    jaBuscou.current = true;

    let texto: string | null = null;
    let cardIndex: string | null = null;
    try {
      texto = window.sessionStorage.getItem("margem-mensagem");
      cardIndex = window.sessionStorage.getItem("margem-cardIndex");
    } catch {}

    if (!texto && !cardIndex) {
      router.replace("/inicio");
      return;
    }

    const cardTitle = cardIndex ? TITULOS_CARDS_HOME[Number(cardIndex)] : null;
    const displayText = cardTitle || texto;
    setMessage(displayText || "");
    entradaRef.current = { texto: texto || "", cardIndex, origem: cardIndex ? "card" : "texto" };
    buscarOrientacao(false);
  }, [router, buscarOrientacao]);

  function tentarNovamente() {
    track("retry_gemini_clicado", {
      origem: entradaRef.current?.origem ?? null,
      numero_tentativa: numeroTentativaRef.current,
    });
    buscarOrientacao(true);
  }

  if (!message) return null;

  return (
    <ResultPage
      message={message}
      orientation={orientation}
      isLoading={isLoading}
      isResourcesLoading={isResourcesLoading}
      resources={resources}
      error={error}
      onRetry={tentarNovamente}
    />
  );
}
