"use client";

export function ModalFooter({ onClose }: { onClose: () => void }) {
  return (
    <button className="dados-modal-button" type="button" onClick={onClose}>
      Fechar
    </button>
  );
}
