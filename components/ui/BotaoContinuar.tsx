"use client";

import { Button } from "@/components/ui/Button";

type BotaoContinuarProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  fullWidth?: boolean;
};

export function BotaoContinuar({ onClick, disabled, label = "Continuar", fullWidth = true }: BotaoContinuarProps) {
  return (
    <Button tamanho="medium" larguraTotal={fullWidth} disabled={disabled} onClick={onClick}>
      {label}
    </Button>
  );
}
