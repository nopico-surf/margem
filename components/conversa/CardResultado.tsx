"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultPage } from "@/components/conversa/ResultPage";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { conceder, jaConsentiu, jaRecusou, recusar } from "@/lib/consentimento";
import { track } from "@/lib/mixpanel";
import type { CardResource, OrientationResult } from "./types";
import type { ProfissionalCadastrado } from "@/lib/supabase";

type CardResultadoProps = {
  cardIndex: number;
  slug: string;
  message: string;
  orientation: OrientationResult;
  resources: {
    profissionais: ProfissionalCadastrado[];
    servicos_publicos: CardResource[];
    instituicoes: CardResource[];
  };
  riscoEmergency: boolean;
};

// A resposta já vem pronta do servidor (é a mesma de sempre, do banco), então esta tela nunca
// carrega nem falha: existe só pra decidir se registra a interação (precisa de consentimento) e
// pra mostrar o painel de consentimento a quem chegou direto nesta URL sem ter passado por /inicio.
export function CardResultado({ cardIndex, slug, message, orientation, resources, riscoEmergency }: CardResultadoProps) {
  const router = useRouter();
  const [cookiesVisivel, setCookiesVisivel] = useState(false);
  const jaRegistrou = useRef(false);

  useEffect(() => {
    if (jaConsentiu()) {
      registrarAcesso();
      return;
    }
    if (!jaRecusou()) setCookiesVisivel(true);
  }, []);

  function registrarAcesso() {
    if (jaRegistrou.current) return;
    jaRegistrou.current = true;
    const inicio = performance.now();
    fetch("/api/orientacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: "", cardIndex, sessaoId: getOrCreateSessaoId() }),
    })
      .then((response) => response.json())
      .then((result) => {
        track("orientacao_recebida", {
          origem: "card",
          eh_retry: false,
          numero_tentativa: 1,
          gemini_falhou: false,
          foi_cache_hit: Boolean(result.foi_cache_hit),
          risco_detectado: Boolean(result.risco?.emergency ?? riscoEmergency),
          tempo_gemini_ms: result.tempo_gemini_ms ?? null,
          tempo_resposta_ms: Math.round(performance.now() - inicio),
          qtd_profissionais: resources.profissionais.length,
          qtd_servicos: resources.servicos_publicos.length,
          qtd_instituicoes: resources.instituicoes.length,
        });
      })
      .catch(() => {});
  }

  function aceitarPersonalizacao() {
    conceder({ rota: `/conversa/${slug}`, gatilho: "abertura" });
    setCookiesVisivel(false);
    registrarAcesso();
  }

  function navegarSemPersonalizacao() {
    recusar({ rota: `/conversa/${slug}`, gatilho: "abertura" });
    setCookiesVisivel(false);
  }

  function verDadosDosCookies() {
    track("politica_dados_aberta");
    router.push("/privacidade");
  }

  return (
    <>
      <ResultPage
        message={message}
        orientation={orientation}
        isLoading={false}
        isResourcesLoading={{ profissionais: false, servicosPublicos: false, instituicoes: false }}
        resources={resources}
        error={null}
        onRetry={() => {}}
      />
      <PainelInferior
        variante="cookies"
        visivel={cookiesVisivel}
        onAceitar={aceitarPersonalizacao}
        onRecusar={navegarSemPersonalizacao}
        onVerDados={verDadosDosCookies}
      />
    </>
  );
}
