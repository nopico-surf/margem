"use client";

import { SectionJump } from "@/components/ui/SectionJump";

// A ordem aqui é a mesma em que as seções aparecem na página.
const OPCOES: Array<[string, string]> = [
  ["Profissionais que podem ajudar", "figma-section-professionals"],
  ["Serviços públicos", "figma-section-public-services"],
  ["Espaços de apoio e escuta", "figma-section-support-spaces"],
  ["Passos reais, para fazer agora", "figma-section-real-steps"],
  ["Para planejar", "figma-section-planning"],
];

export function MoreOptions({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <section className="figma-result-more figma-skeleton-more" aria-hidden="true">
        <span className="figma-skeleton figma-skeleton-more-title" />
        <div>{[165, 165, 225, 247, 134].map((width, index) => <span key={index} className="figma-skeleton figma-skeleton-more-option" style={{ width }} />)}</div>
      </section>
    );
  }

  return (
    <section className="figma-result-more">
      <h2>Além disso, você pode ver</h2>
      <div>
        {OPCOES.map(([label, targetId]) => (
          <SectionJump key={label} label={label} targetId={targetId} />
        ))}
      </div>
    </section>
  );
}
