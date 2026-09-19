"use client";

export function ModalFooter({ onClose }: { onClose: (origem: "botao_fechar") => void }) {
  return (
    <button className="dados-modal-button" type="button" onClick={() => onClose("botao_fechar")}>
      Fechar
    </button>
  );
}
