"use client";

import { LogoMargemModal, IconeFecharModal } from "@/components/icons";

export function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="dados-modal-header">
      <LogoMargemModal className="dados-modal-logo" />
      <button className="dados-modal-close" type="button" aria-label="Fechar" onClick={onClose}>
        <IconeFecharModal />
      </button>
    </header>
  );
}
