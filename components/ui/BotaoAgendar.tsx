"use client";

import { IconeAgendarWhatsapp } from "@/components/icons";

export function BotaoAgendar({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="figma-schedule-button" type="button" onClick={onClick} disabled>
      <IconeAgendarWhatsapp />
      {label}
    </button>
  );
}
