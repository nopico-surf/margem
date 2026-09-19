"use client";

import { Button } from "@/components/ui/Button";

export function ModalFooter({ onClose }: { onClose: (origem: "botao_fechar") => void }) {
  return (
    <Button tamanho="medium" larguraTotal onClick={() => onClose("botao_fechar")}>
      Fechar
    </Button>
  );
}
