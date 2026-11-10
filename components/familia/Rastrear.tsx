"use client";

import { useEffect } from "react";
import { track } from "@/lib/mixpanel";

// Dispara um evento do Mixpanel quando a tela aparece. Nunca leva texto nem e-mail.
export function Rastrear({ evento, propriedades }: { evento: string; propriedades?: Record<string, string | number | boolean> }) {
  useEffect(() => {
    track(evento, propriedades);
    // Uma vez por montagem.
  }, []);
  return null;
}
