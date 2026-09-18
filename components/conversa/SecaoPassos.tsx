"use client";

import { ContainerConteudo } from "./ContainerConteudo";
import { CardHeader } from "./CardHeader";
import { CheckBoxGroup } from "./CheckBoxGroup";
import { track } from "@/lib/mixpanel";

// Figma: `passos-reais` e `proximos-passos`, na página Checklist do Margem System. São dois lá e um
// aqui: o desenho é o mesmo, só muda o conteúdo, então o que varia entra por prop.
//
// O `passo` diz qual dos dois é. Antes isso era descoberto comparando o `title` com a string
// "Passos reais, para fazer agora": trocar uma vírgula do título mandava a seção para o id errado,
// para o evento errado do Mixpanel e para as alturas erradas de skeleton, sem erro nenhum.
type SecaoPassosProps = {
  passo: "agora" | "planejar";
  title: string;
  description: string;
  items: string[];
  selectedIndex?: number;
  isLoading?: boolean;
};

export function SecaoPassos({ passo, title, description, items, selectedIndex, isLoading = false }: SecaoPassosProps) {
  const sectionId = passo === "agora" ? "figma-section-real-steps" : "figma-section-planning";
  const secao = passo;

  if (isLoading) {
    const itemHeights = passo === "agora" ? [60, 60, 60, 48, 48] : [80, 80, 80, 80, 80];
    return (
      <ContainerConteudo id={sectionId} className="figma-checklist-band">
        <div className="figma-skeleton-description" aria-hidden="true"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        <div className="figma-checklist figma-skeleton-checklist" aria-hidden="true">{itemHeights.map((height, index) => <span key={index} className="figma-skeleton" style={{ height }} />)}</div>
      </ContainerConteudo>
    );
  }

  return (
    <ContainerConteudo id={sectionId} className="figma-checklist-band">
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
    </ContainerConteudo>
  );
}
