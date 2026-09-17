"use client";

import { CardBackground } from "./CardBackground";
import { CardHeader } from "./CardHeader";
import { CheckBoxGroup } from "./CheckBoxGroup";
import { track } from "@/lib/mixpanel";

// Figma: "passos-reais" e "proximos-passos". Mesmo desenho, dois conteúdos.
type ChecklistSectionProps = {
  title: string;
  description: string;
  items: string[];
  selectedIndex?: number;
  isLoading?: boolean;
};

export function ChecklistSection({ title, description, items, selectedIndex, isLoading = false }: ChecklistSectionProps) {
  const sectionId = title === "Passos reais, para fazer agora" ? "figma-section-real-steps" : "figma-section-planning";
  const secao = sectionId === "figma-section-real-steps" ? "agora" : "planejar";

  if (isLoading) {
    const itemHeights = sectionId === "figma-section-real-steps" ? [60, 60, 60, 48, 48] : [80, 80, 80, 80, 80];
    return (
      <CardBackground id={sectionId} className="figma-checklist-band">
        <div className="figma-skeleton-description" aria-hidden="true"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        <div className="figma-checklist figma-skeleton-checklist" aria-hidden="true">{itemHeights.map((height, index) => <span key={index} className="figma-skeleton" style={{ height }} />)}</div>
      </CardBackground>
    );
  }

  return (
    <CardBackground id={sectionId} className="figma-checklist-band">
      <CardHeader title={title} description={description} />
      <div className="figma-checklist">
        {items.map((item, index) => (
          <CheckBoxGroup
            key={`${title}-${index}`}
            item={item}
            selected={selectedIndex === index}
            onChange={(marcado) => track("checklist_item_alterado", { secao, indice: index, marcado })}
          />
        ))}
      </div>
    </CardBackground>
  );
}
