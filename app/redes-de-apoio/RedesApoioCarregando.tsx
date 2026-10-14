"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { BannerSugestaoRede } from "@/components/conversa/BannerSugestaoRede";
import { FiltroEspecialidade } from "@/components/conversa/FiltroEspecialidade";
import { OPCOES_REDE, tipoDeRedeDaUrl, type TipoRede } from "@/lib/redes-apoio";
import { track } from "@/lib/mixpanel";

// Shell da /redes-de-apoio: tudo o que não depende da lista já aparece, e só os cards ficam em
// skeleton. O skeleton do card é o mesmo que CardsServicosPublicos e CardsInstituicoes usam.

const QUANTIDADE_DE_SKELETONS = 3;

function Filtro({ tipo }: { tipo: TipoRede }) {
  return <FiltroEspecialidade opcoes={OPCOES_REDE} selecionada={tipo} onChange={() => {}} />;
}

function FiltroDaUrl() {
  return <Filtro tipo={tipoDeRedeDaUrl(useSearchParams().get("tipo"))} />;
}

// O clique no banner também precisa dizer de qual aba veio, mesmo com a lista ainda em skeleton.
function BannerDaUrl() {
  const tipo = tipoDeRedeDaUrl(useSearchParams().get("tipo"));
  return <BannerSugestaoRede onClick={() => track("sugestao_rede_apoio_clicada", { tipo })} />;
}

export function RedesApoioCarregando() {
  return (
    <main className="figma-result-page redes-apoio-pagina" aria-busy="true">
      <Header onOpenMenu={() => {}} hrefDoLogo="/inicio" />

      <ContainerConteudo id="redes-de-apoio">
        <CardHeader as="h1" title="Redes de apoio" />
        {/* Vindo do menu (navegação no cliente), a URL já é conhecida e o filtro nasce certo. Só no
            HTML estático, que não conhece a query, vale o fallback em Públicas até a resposta chegar. */}
        <Suspense fallback={<Filtro tipo="publicas" />}>
          <FiltroDaUrl />
        </Suspense>
        <div className="figma-resource-list figma-skeleton-resource-list" aria-hidden="true">
          {Array.from({ length: QUANTIDADE_DE_SKELETONS }, (_, i) => (
            <article className="figma-resource-card" key={i}>
              <div className="figma-skeleton-description">
                <span className="figma-skeleton figma-skeleton-heading" />
                <span className="figma-skeleton" />
                <span className="figma-skeleton" />
                <span className="figma-skeleton" />
              </div>
              <div className="figma-skeleton-actions">
                <span className="figma-skeleton" />
                <span className="figma-skeleton" />
                <span className="figma-skeleton" />
              </div>
            </article>
          ))}
        </div>
        <Suspense fallback={<BannerSugestaoRede />}>
          <BannerDaUrl />
        </Suspense>
      </ContainerConteudo>

      <Footer />
    </main>
  );
}
