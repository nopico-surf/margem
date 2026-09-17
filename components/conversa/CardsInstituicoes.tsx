"use client";

import { CardBackground } from "./CardBackground";
import { CardHeader } from "./CardHeader";
import { CardRecurso } from "./CardRecurso";
import type { CardResource } from "./types";

// Figma: "cards-instituições-completo".
export function CardsInstituicoes({ spaces, isLoading = false }: { spaces: CardResource[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <CardBackground id="figma-section-support-spaces">
        <div className="figma-skeleton-description" aria-hidden="true"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        <div className="figma-resource-list figma-skeleton-resource-list" aria-hidden="true">{[1, 2].map((item) => <article className="figma-resource-card" key={item}><div className="figma-skeleton-description"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div><div className="figma-skeleton-actions"><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div></article>)}</div>
      </CardBackground>
    );
  }

  if (spaces.length === 0) return null;

  return (
    <CardBackground id="figma-section-support-spaces">
      <CardHeader
        title="Espaços de apoio e escuta"
        description="Redes e instituições que oferecem acolhimento e trocas de experiências para pessoas em uso de substâncias e seus familiares"
      />
      <div className="figma-resource-list">
        {spaces.map((space) => (
          <CardRecurso key={space.id} resource={space} tipoRecurso="instituicao" />
        ))}
      </div>
    </CardBackground>
  );
}
