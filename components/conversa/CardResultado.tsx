"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultPage } from "@/components/conversa/ResultPage";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { conceder, jaConsentiu, jaRecusou, recusar } from "@/lib/consentimento";
import { track } from "@/lib/mixpanel";
import { URLS_DE_ICONE } from "@/components/icons";
import { URL_AVATAR_PADRAO } from "@/components/ui/Avatar";
import { fotoPequena } from "@/lib/foto-pequena";
import { carregarImagem } from "@/lib/carregar-imagem";
import type { CardResource, OrientationResult } from "./types";
import type { ProfissionalCadastrado } from "@/lib/supabase";

type RecursosDaApi = {
  profissionais: ProfissionalCadastrado[];
  servicos_publicos: CardResource[];
  instituicoes: CardResource[];
};

type CardResultadoProps = {
  cardIndex: number;
  slug: string;
  message: string;
  orientation: OrientationResult;
  riscoEmergency: boolean;
};

function midiasDosRecursos(recursos: RecursosDaApi) {
  return {
    profissionais: [...new Set([
      ...URLS_DE_ICONE,
      ...recursos.profissionais.map((profissional) => fotoPequena(profissional.foto_url || URL_AVATAR_PADRAO)),
    ])],
    servicosPublicos: URLS_DE_ICONE,
    instituicoes: URLS_DE_ICONE,
  };
}

// A resposta (texto e checklist) já vem pronta do servidor (é a mesma de sempre, do banco), então
// só ela nunca carrega nem falha. Profissionais, serviços públicos e instituições são buscados aqui,
// depois do consentimento, do mesmo jeito que a segunda chamada de /conversa (buscarRecursos: true).
export function CardResultado({ cardIndex, slug, message, orientation, riscoEmergency }: CardResultadoProps) {
  const router = useRouter();
  const [cookiesVisivel, setCookiesVisivel] = useState(false);
  const [resources, setResources] = useState<RecursosDaApi | null>(null);
  const [isResourcesLoading, setIsResourcesLoading] = useState({
    profissionais: true,
    servicosPublicos: true,
    instituicoes: true,
  });
  const jaRegistrou = useRef(false);
  const jaBuscouRecursos = useRef(false);

  useEffect(() => {
    if (jaConsentiu()) {
      registrarAcesso();
      buscarRecursos();
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
          qtd_profissionais: resources?.profissionais.length ?? 0,
          qtd_servicos: resources?.servicos_publicos.length ?? 0,
          qtd_instituicoes: resources?.instituicoes.length ?? 0,
        });
      })
      .catch(() => {});
  }

  function buscarRecursos() {
    if (jaBuscouRecursos.current) return;
    jaBuscouRecursos.current = true;
    fetch("/api/orientacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buscarRecursos: true, sessaoId: getOrCreateSessaoId() }),
    })
      .then(async (resourcesResponse) => {
        const resourcesResult = await resourcesResponse.json();
        if (!resourcesResponse.ok) throw new Error();
        return resourcesResult as RecursosDaApi;
      })
      .catch(() => {
        track("recursos_falharam", { origem: "card" });
        return { profissionais: [], servicos_publicos: [], instituicoes: [] } as RecursosDaApi;
      })
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
  }

  function aceitarPersonalizacao() {
    conceder({ rota: `/conversa/${slug}`, gatilho: "abertura" });
    setCookiesVisivel(false);
    registrarAcesso();
    buscarRecursos();
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
        isResourcesLoading={isResourcesLoading}
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
