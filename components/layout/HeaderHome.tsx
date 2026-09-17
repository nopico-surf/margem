"use client";

import { LogoMargem } from "@/components/icons";
import { BotaoMenu } from "@/components/ui/BotaoMenu";

// Figma: "header home".
// A classe .app-header é lida pelo MessageInput para medir o teto do hero quando o teclado abre.
export function HeaderHome({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="app-header">
      <LogoMargem className="app-logo" />
      <BotaoMenu onClick={onOpenMenu} />
    </header>
  );
}
