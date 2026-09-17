"use client";

import { CardHome } from "./CardHome";

// Figma: "card home group" (o título da seção mais a lista).
// O id da seção e a classe .pathways são o alvo do botão "Se preferir, veja os tópicos".
export function CardHomeGroup({ onSelect }: { onSelect: (indice: number) => void }) {
  return (
    <section className="pathways" aria-labelledby="pathways-title">
      <h2 id="pathways-title">Você pode começar por aqui</h2>
      <p>Não precisa escolher a opção perfeita. Apenas dê o primeiro passo</p>
      <CardHome onSelect={onSelect} />
    </section>
  );
}
