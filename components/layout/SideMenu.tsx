"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BotaoFecharMenu } from "@/components/ui/BotaoFecharMenu";
import { MenuContatos } from "./MenuContatos";
import { track } from "@/lib/mixpanel";
import type { Especialidade } from "@/components/conversa/FiltroEspecialidade";

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
};

// A saída tem animação, então o painel continua montado por mais 350ms depois de fechar.
const DURACAO_FECHAMENTO = 350;

export function SideMenu({ open, onClose }: SideMenuProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function irParaProfissionais(especialidade: Especialidade) {
    track("profissionais_menu_clicado", { especialidade });
    onClose();
    router.push(`/profissionais?especialidade=${especialidade}`);
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (open) {
      setMounted(true);
      setIsClosing(false);
    } else if (mounted) {
      setIsClosing(true);
      timeoutId = setTimeout(() => {
        setMounted(false);
        setIsClosing(false);
      }, DURACAO_FECHAMENTO);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [open, mounted]);

  // Com o menu aberto a página atrás não rola, e Esc fecha.
  useEffect(() => {
    if (!mounted || !open) return;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const previousDocumentOverscrollBehavior = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.documentElement.style.overscrollBehavior = previousDocumentOverscrollBehavior;
    };
  }, [mounted, onClose, open]);

  if (!mounted) return null;

  return (
    <div
      className={`side-menu ${isClosing ? "side-menu--closing" : "side-menu--open"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="side-menu-backdrop" onClick={onClose} aria-hidden="true" />
      <BotaoFecharMenu onClick={onClose} ref={closeButtonRef} />
      <aside className="side-menu-panel">
        <h2>Profissionais</h2>
        <div className="side-menu-professionals">
          <button type="button" onClick={() => irParaProfissionais("psicologo")}>Psicólogos</button>
          <button type="button" onClick={() => irParaProfissionais("psiquiatra")}>Psiquiatras</button>
        </div>
        <h2>Contatos</h2>
        <MenuContatos />
      </aside>
    </div>
  );
}
