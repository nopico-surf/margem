"use client";

import { CARDS_HOME } from "@/lib/cards-home";
import { ActionRow } from "@/components/conversa/ActionRow";
import { CardHomeHeader } from "./CardHomeHeader";

// Figma: "card home" (os seis caminhos). Uma fileira que rola de lado quando não cabe, e que no mouse
// dá para arrastar, como a de profissionais.
export function CardHome({ onSelect }: { onSelect: (indice: number) => void }) {
  return (
    <ActionRow className="pathway-list" origem="caminhos">
      {CARDS_HOME.map((card, indice) => (
        <CardHomeHeader
          key={card.titulo}
          indice={indice}
          titulo={card.titulo}
          descricao={card.descricao}
          onSelect={onSelect}
        />
      ))}
    </ActionRow>
  );
}
