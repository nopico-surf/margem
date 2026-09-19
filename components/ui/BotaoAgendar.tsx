"use client";

import { IconeAgendarWhatsapp } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export function BotaoAgendar({
  label,
  onClick,
  href,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}) {
  return (
    <Button larguraTotal disabled={disabled} href={href} alvoExterno={!!href} onClick={onClick}>
      <IconeAgendarWhatsapp />
      {label}
    </Button>
  );
}
