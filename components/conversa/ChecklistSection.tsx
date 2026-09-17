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
};

export function ChecklistSection({ title, description, items, selectedIndex }: ChecklistSectionProps) {
  const sectionId = title === "Passos reais, para fazer agora" ? "figma-section-real-steps" : "figma-section-planning";
  const secao = sectionId === "figma-section-real-steps" ? "agora" : "planejar";

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
