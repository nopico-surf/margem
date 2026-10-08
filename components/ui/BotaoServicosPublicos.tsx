"use client";

import { IconeSetaResultado } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export function BotaoServicosPublicos({ onClick }: { onClick: () => void }) {
  return (
    <Button variante="transparent" redondo onClick={onClick}>
      Se preferir, navegue por aqui <IconeSetaResultado />
    </Button>
  );
}
