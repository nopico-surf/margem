"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultPage } from "@/components/conversa/ResultPage";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { TITULOS_CARDS_HOME } from "@/lib/cards-home";
import { track } from "@/lib/mixpanel";
import type { CardResource, OrientationResult } from "@/components/conversa/types";
import { ICONES_ACAO, URL_AVATAR_PADRAO } from "@/components/icons";
import type { ProfissionalCadastrado } from "@/lib/supabase";

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
  return [...new Set([
    ...Object.values(ICONES_ACAO),
    ...recursos.profissionais.map((profissional) => profissional.foto_url || URL_AVATAR_PADRAO),
  ])];
}

export default function ConversaPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<OrientacaoDaApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<RecursosDaApi | null>(null);
  const [isResourcesLoading, setIsResourcesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Em desenvolvimento o React roda este efeito duas vezes (Strict Mode). Sem essa trava saíam dois
  // pedidos por conversa: dois registros no histórico e os skeletons piscando quando a segunda
  // resposta chegava depois da primeira.
  const jaBuscou = useRef(false);

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
      router.replace("/app");
      return;
    }

    const cardTitle = cardIndex ? TITULOS_CARDS_HOME[Number(cardIndex)] : null;
    const displayText = cardTitle || texto;
    setMessage(displayText || "");

    (async () => {
      setIsLoading(true);
      setResources(null);
      setIsResourcesLoading(false);
      setError(null);
      const origem = cardIndex ? "card" : "texto";
      const inicio = performance.now();
      let statusHttp: number | null = null;
      // Gemini fora do ar: por enquanto a tela fica no loading (o "tentar novamente" ainda vai ser desenhado).
      let manterCarregando = false;
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
            gemini_falhou: true,
            motivo: result.motivo ?? null,
            detalhe: result.detalhe ?? null,
            tempo_gemini_ms: result.tempo_gemini_ms ?? null,
            tempo_resposta_ms: Math.round(performance.now() - inicio),
          });
          manterCarregando = true;
          return;
        }
        if (!response.ok) throw new Error(result.error || "Não foi possível preparar a orientação.");
        if (typeof result.acolhimento !== "string" || typeof result.orientacao !== "string" || !Array.isArray(result.checklist_agora) || !Array.isArray(result.checklist_proximo)) {
          throw new Error("A resposta recebida não está completa.");
        }
        setOrientation(result);
        setIsResourcesLoading(true);
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
          .then(async (resourcesResult) => {
            await Promise.all(midiasDosRecursos(resourcesResult).map(carregarImagem));
            setResources(resourcesResult);
            setIsResourcesLoading(false);
          });
        track("orientacao_recebida", {
          origem,
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
        track("orientacao_falhou", { origem, tempo_resposta_ms: Math.round(performance.now() - inicio), status_http: statusHttp });
        setOrientation(null);
        setError(err instanceof Error ? err.message : "Não foi possível preparar a orientação.");
      } finally {
        if (!manterCarregando) setIsLoading(false);
      }
    })();
  }, [router]);

  if (!message) return null;

  return <ResultPage message={message} orientation={orientation} isLoading={isLoading} isResourcesLoading={isResourcesLoading} resources={resources} error={error} />;
}
