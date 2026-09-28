import type { ReactNode } from "react";

// Figma: página Badge, componente `badge`. `color` = secondary, primary, neutral.
// `neutral` ainda não aparece em nenhuma tela, então fica de fora (mesma regra do Button.tsx: só os
// eixos que aparecem em tela, acrescenta quando aparecer). Aceita ícone opcional antes do texto.
export function Badge({
  children,
  color = "primary",
  className,
}: {
  children: ReactNode;
  color?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <span className={["badge", className].filter(Boolean).join(" ")} data-color={color}>
      {children}
    </span>
  );
}
