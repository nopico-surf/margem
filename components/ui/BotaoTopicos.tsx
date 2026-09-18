"use client";

import { IconeSeta } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export function BotaoTopicos({ onClick }: { onClick: () => void }) {
  return (
    <Button variante="transparent" className="topics-button" onClick={onClick}>
      Se preferir, veja os tópicos <IconeSeta />
    </Button>
  );
}
