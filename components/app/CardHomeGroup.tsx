"use client";

import { CardHome } from "./CardHome";

// Figma: "card home group" (o título da seção mais a fileira).
export function CardHomeGroup({ onSelect }: { onSelect: (indice: number) => void }) {
  return (
    <section className="pathways" id="pathways" aria-labelledby="pathways-title">
      <h2 id="pathways-title" className="home-secao-titulo">Você pode começar por aqui</h2>
      <CardHome onSelect={onSelect} />
    </section>
  );
}
