"use client";

import { forwardRef } from "react";
import { IconeFecharMenu } from "@/components/icons";

// Recebe ref porque o menu devolve o foco para ele assim que abre.
export const BotaoFecharMenu = forwardRef<HTMLButtonElement, { onClick: () => void }>(
  function BotaoFecharMenu({ onClick }, ref) {
    return (
      <button className="side-menu-close" type="button" aria-label="Fechar menu" onClick={onClick} ref={ref}>
        <IconeFecharMenu />
      </button>
    );
  },
);
