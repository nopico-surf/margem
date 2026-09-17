"use client";

import { CardBackground } from "./CardBackground";
import { CardHeader } from "./CardHeader";
import { CardRecurso } from "./CardRecurso";
import type { CardResource } from "./types";

// Figma: "cards-instituições-completo".
export function CardsInstituicoes({ spaces }: { spaces: CardResource[] }) {
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
