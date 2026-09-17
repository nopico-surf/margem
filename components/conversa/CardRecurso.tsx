"use client";

import { IconeInfo } from "@/components/icons";
import { ResourceActions } from "./ResourceActions";
import type { CardResource, TipoRecurso } from "./types";

// Figma: "cards-instituições-completo", que é o card reaproveitado tanto pelos serviços públicos
// quanto pelos espaços de apoio. Só muda o que é enviado no tracking.
type CardRecursoProps = { resource: CardResource; tipoRecurso: TipoRecurso };

export function CardRecurso({ resource, tipoRecurso }: CardRecursoProps) {
  return (
    <article className="figma-resource-card">
      <div className="figma-resource-heading">
        <div>
          <h3>{resource.title}</h3>
          <p>{resource.description}</p>
        </div>
        <IconeInfo />
      </div>
      <ResourceActions resource={resource} tipoRecurso={tipoRecurso} />
    </article>
  );
}
