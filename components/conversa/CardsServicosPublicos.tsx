"use client";

import { ContainerConteudo } from "./ContainerConteudo";
import { CardHeader } from "./CardHeader";
import { CardRecurso } from "./CardRecurso";
import type { CardResource } from "./types";

// Figma: "cards-serviços publicos".
export function CardsServicosPublicos({ services, isLoading = false }: { services: CardResource[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <ContainerConteudo id="figma-section-public-services">
        <div className="figma-skeleton-description" aria-hidden="true"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        <div className="figma-resource-list figma-skeleton-resource-list" aria-hidden="true">{[1, 2, 3].map((item) => <article className="figma-resource-card" key={item}><div className="figma-skeleton-description"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div><div className="figma-skeleton-actions"><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div></article>)}</div>
      </ContainerConteudo>
    );
  }

  if (services.length === 0) return null;

  return (
    <ContainerConteudo id="figma-section-public-services">
      <CardHeader
        title="Serviços públicos"
        description="Acolhimento, saúde e assistência pública para cuidar e apoiar pessoas em uso de substâncias e familiares"
      />
      <div className="figma-resource-list">
        {services.map((service) => (
          <CardRecurso key={service.id} resource={service} tipoRecurso="servico_publico" />
        ))}
      </div>
    </ContainerConteudo>
  );
}
