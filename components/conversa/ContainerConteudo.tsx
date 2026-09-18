import { ReactNode } from "react";

// Figma: `container-conteudo`, na página Card background do Margem System. Chamava-se `card-bg` até
// 18/09/2026, e o nome mudou porque ele não é fundo de card: é o container que envolve cards e
// textos, e é ele que carrega o slot. A faixa que envolve cada seção do resultado.
type ContainerConteudoProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function ContainerConteudo({ id, children, className }: ContainerConteudoProps) {
  return (
    <section id={id} className={className ? `figma-result-band ${className}` : "figma-result-band"}>
      <div className="figma-section-inner">{children}</div>
    </section>
  );
}
