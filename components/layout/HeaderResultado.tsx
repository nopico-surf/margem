"use client";

import { useState } from "react";
import { LogoMargemResultado } from "@/components/icons";
import { BotaoMenu } from "@/components/ui/BotaoMenu";
import { SideMenu } from "./SideMenu";
import { track } from "@/lib/mixpanel";

export function HeaderResultado() {
  const [menuOpen, setMenuOpen] = useState(false);

  function abrirMenu() {
    setMenuOpen(true);
    track("menu_clicado", { rota: "/conversa" });
  }

  return (
    <>
      <header className="figma-result-header">
        <a href="/inicio" aria-label="Ir para o início" onClick={() => track("logo_clicado", { rota: "/conversa" })}>
          <LogoMargemResultado className="figma-result-logo" />
        </a>
        <BotaoMenu variante="resultado" onClick={abrirMenu} />
      </header>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
