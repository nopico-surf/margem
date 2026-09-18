"use client";

import { IconeAgendarWhatsapp } from "@/components/icons";
import { Button } from "@/components/ui/Button";

// Desabilitado de propósito enquanto o agendamento não existe.
export function BotaoAgendar({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button larguraTotal disabled onClick={onClick}>
      <IconeAgendarWhatsapp />
      {label}
    </Button>
  );
}
