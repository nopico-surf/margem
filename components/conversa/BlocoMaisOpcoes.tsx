"use client";

import { SectionJump } from "@/components/ui/SectionJump";

// A ordem aqui é a mesma em que as seções aparecem na página. A largura é a do skeleton de cada link.
// `rede` marca as seções que só aparecem com a rede completa (ver mostrarRedeCompleta em ResultPage).
const OPCOES: Array<{ label: string; targetId: string; largura: number; rede?: true }> = [
  { label: "Profissionais que podem ajudar", targetId: "figma-section-professionals", largura: 165 },
  { label: "Serviços públicos", targetId: "figma-section-public-services", largura: 165, rede: true },
  { label: "Espaços de apoio e escuta", targetId: "figma-section-support-spaces", largura: 225, rede: true },
  { label: "Passos reais, para fazer agora", targetId: "figma-section-real-steps", largura: 247 },
  { label: "Para planejar", targetId: "figma-section-planning", largura: 134 },
];

export function BlocoMaisOpcoes({ isLoading = false, mostrarRedeCompleta = true }: { isLoading?: boolean; mostrarRedeCompleta?: boolean }) {
  const opcoes = mostrarRedeCompleta ? OPCOES : OPCOES.filter((opcao) => !opcao.rede);

  if (isLoading) {
    return (
      <section className="figma-result-more figma-skeleton-more" aria-hidden="true">
        <span className="figma-skeleton figma-skeleton-more-title" />
        <div>{opcoes.map((opcao) => <span key={opcao.label} className="figma-skeleton figma-skeleton-more-option" style={{ width: opcao.largura }} />)}</div>
      </section>
    );
  }

  return (
    <section className="figma-result-more">
      <h2>Além disso, você pode ver</h2>
      <div>
        {opcoes.map((opcao) => (
          <SectionJump key={opcao.label} label={opcao.label} targetId={opcao.targetId} />
        ))}
      </div>
    </section>
  );
}
