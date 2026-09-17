"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/mixpanel";

const closeIcon = "https://www.figma.com/api/mcp/asset/f020c9b3-25d1-40a6-b7fe-284f4f710035.svg";
const whatsappIcon = "https://www.figma.com/api/mcp/asset/ccb114ae-13b9-45c7-bccb-094fdb68082a.svg";
const instagramIcon = "https://www.figma.com/api/mcp/asset/3d25ba20-fb17-47f0-9f61-3a917bee0be5.svg";
const emailIcon = "https://www.figma.com/api/mcp/asset/30e845f2-dbb7-4389-8a98-4555acde18a5.svg";

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function SideMenu({ open, onClose }: SideMenuProps) {
  const [mounted, setMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
      }, 350);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [open, mounted]);

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
      aria-label="Contatos"
    >
      <div className="side-menu-backdrop" onClick={onClose} aria-hidden="true" />
      <button
        className="side-menu-close"
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        ref={closeButtonRef}
      >
        <img src={closeIcon} alt="" />
      </button>
      <aside className="side-menu-panel">
        <h2>Contatos</h2>
        <div className="side-menu-contacts">
          <a
            href="https://wa.me/5511968996977"
            target="_blank"
            rel="noreferrer"
            onClick={() => track("contato_site_clicado", { origem: "menu", tipo_contato: "whatsapp" })}
          >
            <img src={whatsappIcon} alt="" />
            <span>11 9 6899 6977</span>
          </a>
          <a
            href="https://instagram.com/somos_margem_"
            target="_blank"
            rel="noreferrer"
            onClick={() => track("contato_site_clicado", { origem: "menu", tipo_contato: "instagram" })}
          >
            <img src={instagramIcon} alt="" />
            <span>somos_margem_</span>
          </a>
          <a
            href="mailto:vitor@somosmargem.com.br"
            onClick={() => track("contato_site_clicado", { origem: "menu", tipo_contato: "email" })}
          >
            <img src={emailIcon} alt="" />
            <span>vitor@somosmargem.com.br</span>
          </a>
        </div>
      </aside>
    </div>
  );
}