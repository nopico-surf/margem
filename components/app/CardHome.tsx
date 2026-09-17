"use client";

import { CARDS_HOME } from "@/lib/cards-home";
import { CardHomeHeader } from "./CardHomeHeader";

// Figma: "card home" (a lista dos seis caminhos).
export function CardHome({ onSelect }: { onSelect: (indice: number) => void }) {
  return (
    <div className="pathway-list">
      {CARDS_HOME.map((card, indice) => (
        <CardHomeHeader
          key={card.titulo}
          indice={indice}
          titulo={card.titulo}
          descricao={card.descricao}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
