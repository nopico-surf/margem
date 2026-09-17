"use client";

import { IconeSetaResultado } from "@/components/icons";

export function BotaoServicosPublicos({ onClick }: { onClick: () => void }) {
  return (
    <button className="figma-public-link" type="button" onClick={onClick}>
      Se preferir, veja os serviços públicos <IconeSetaResultado />
    </button>
  );
}
