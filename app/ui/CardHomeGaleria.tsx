"use client";

import { CardHomeGroup } from "@/components/app/CardHomeGroup";

// A galeria é componente de servidor e não passa função: o clique aqui não faz nada.
export function CardHomeGroupGaleria() {
  return <CardHomeGroup onSelect={() => {}} />;
}
