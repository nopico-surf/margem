import { ReactNode } from "react";

// Figma: "card background" / "background card". A faixa que envolve cada seção do resultado.
type CardBackgroundProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function CardBackground({ id, children, className }: CardBackgroundProps) {
  return (
    <section id={id} className={className ? `figma-result-band ${className}` : "figma-result-band"}>
      <div className="figma-section-inner">{children}</div>
    </section>
  );
}
