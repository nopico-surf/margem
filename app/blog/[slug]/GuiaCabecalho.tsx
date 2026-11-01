"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { track } from "@/lib/mixpanel";

// Header e menu lateral dos guias. Ficam num componente de cliente à parte pra o resto da página
// continuar no servidor, com o texto inteiro no HTML.
export function GuiaCabecalho() {
  const rota = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function abrirMenu() {
    setMenuOpen(true);
    track("menu_clicado", { rota });
  }

  function fecharMenu() {
    setMenuOpen(false);
    track("menu_fechado", { rota });
  }

  return (
    <>
      <Header onOpenMenu={abrirMenu} hrefDoLogo="/inicio" onLogoClick={() => track("logo_clicado", { rota })} />
      <SideMenu open={menuOpen} onClose={fecharMenu} rota={rota} />
    </>
  );
}
