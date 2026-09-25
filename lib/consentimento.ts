"use client";

import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { grantGoogleConsent } from "@/components/GoogleTagManager";
import { track } from "@/lib/mixpanel";

export function jaConsentiu(): boolean {
  try {
    return window.localStorage.getItem("margem-consentimento") === "true";
  } catch {
    return false;
  }
}

// Grava o consentimento no localStorage, no cookie (o proxy.ts lê pra mandar "/" direto pra /inicio)
// e na sessão anônima do banco.
export function conceder() {
  try {
    window.localStorage.setItem("margem-consentimento", "true");
  } catch {}
  document.cookie = "margem-consentimento=true; path=/; max-age=34560000; samesite=lax";
  grantGoogleConsent();
  track("consentimento_concedido");
  const sessaoId = getOrCreateSessaoId();
  fetch("/api/sessao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessaoId }),
  })
    .then((response) => {
      if (!response.ok) track("consentimento_falhou");
    })
    .catch(() => track("consentimento_falhou"));
}
