"use client";

import { IconeAgendarWhatsapp } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export function BotaoAgendar({
  label,
  onClick,
  href,
  disabled = false,
  tamanho,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  tamanho?: "small" | "medium";
}) {
  return (
    <Button larguraTotal tamanho={tamanho} disabled={disabled} href={href} alvoExterno={!!href} onClick={onClick}>
      <IconeAgendarWhatsapp />
      {label}
    </Button>
  );
}
