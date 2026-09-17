"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultPage } from "@/components/conversa/ResultPage";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { TITULOS_CARDS_HOME } from "@/lib/cards-home";
import { track } from "@/lib/mixpanel";
import type { CardResource, OrientationResult } from "@/components/conversa/types";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// Na tela, profissionais, serviços e instituições sempre chegam preenchidos pela API, mesmo que
// como lista vazia, por isso aqui eles não são opcionais.
type OrientacaoDaApi = OrientationResult & {
  risco?: { emergency?: boolean };
  foi_cache_hit?: boolean;
  profissionais: ProfissionalCadastrado[];
  servicos_publicos: CardResource[];
  instituicoes: CardResource[];
};

export default function ConversaPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<OrientacaoDaApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      setError(null);
      const origem = cardIndex ? "card" : "texto";
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
        if (!response.ok) throw new Error(result.error || "Não foi possível preparar a orientação.");
        if (typeof result.acolhimento !== "string" || typeof result.orientacao !== "string" || !Array.isArray(result.checklist_agora) || !Array.isArray(result.checklist_proximo)) {
          throw new Error("A resposta recebida não está completa.");
        }
        setOrientation(result);
        track("orientacao_recebida", {
          origem,
          foi_cache_hit: Boolean(result.foi_cache_hit),
          risco_detectado: Boolean(result.risco?.emergency),
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
        setIsLoading(false);
      }
    })();
  }, [router]);

  if (!message) return null;

  return <ResultPage message={message} orientation={orientation} isLoading={isLoading} error={error} />;
}
