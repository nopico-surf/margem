"use client";

import { IconeMenu, IconeMenuResultado } from "@/components/icons";

// `variante` escolhe o asset: a home e a conversa usam exportações diferentes do mesmo desenho.
type BotaoMenuProps = {
  onClick: () => void;
  variante?: "home" | "resultado";
};

export function BotaoMenu({ onClick, variante = "home" }: BotaoMenuProps) {
  const className = variante === "home" ? "menu-button" : "figma-result-menu";
  return (
    <button className={className} type="button" aria-label="Abrir menu" onClick={onClick}>
      {variante === "home" ? <IconeMenu /> : <IconeMenuResultado />}
    </button>
  );
}
