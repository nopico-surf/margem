"use client";

import { IconeDeAcao } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { CardAction } from "@/components/conversa/types";

type ActionButtonProps = CardAction & { onClick?: () => void };

export function ActionButton({ label, icon, href, onClick }: ActionButtonProps) {
  return (
    <Button variante="secondary" redondo href={href} alvoExterno={Boolean(href)} onClick={onClick}>
      {icon && <IconeDeAcao nome={icon} />}
      {label}
    </Button>
  );
}
