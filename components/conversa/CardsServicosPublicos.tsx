"use client";

import { CardBackground } from "./CardBackground";
import { CardHeader } from "./CardHeader";
import { CardRecurso } from "./CardRecurso";
import type { CardResource } from "./types";

// Figma: "cards-serviços publicos".
export function CardsServicosPublicos({ services }: { services: CardResource[] }) {
  if (services.length === 0) return null;

  return (
    <CardBackground id="figma-section-public-services">
      <CardHeader
        title="Serviços públicos"
        description="Acolhimento, saúde e assistência pública para cuidar e apoiar pessoas em uso de substâncias e familiares"
      />
      <div className="figma-resource-list">
        {services.map((service) => (
          <CardRecurso key={service.id} resource={service} tipoRecurso="servico_publico" />
        ))}
      </div>
    </CardBackground>
  );
}
