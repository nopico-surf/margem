"use client";

import { IconeSeta } from "@/components/icons";

export function BotaoTopicos({ onClick }: { onClick: () => void }) {
  return (
    <button className="topics-button" type="button" onClick={onClick}>
      Se preferir, veja os tópicos <IconeSeta />
    </button>
  );
}
