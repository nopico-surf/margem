"use client";

import { IconeSetaResultado } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export function BotaoServicosPublicos({ onClick }: { onClick: () => void }) {
  return (
    <Button variante="transparent" redondo larguraTotal onClick={onClick}>
      Se preferir, veja os serviços públicos <IconeSetaResultado />
    </Button>
  );
}
