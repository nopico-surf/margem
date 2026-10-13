"use client";

import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { track } from "@/lib/mixpanel";

// O que fez o painel subir, pra medir aceite e recusa por gatilho. "abertura" é o painel subindo
// sozinho; "card" e "texto_livre" são a tentativa de conversar sem ter aceitado. Nunca diz qual
// card foi tocado nem o que foi escrito, porque isso só pode ir pro Mixpanel depois do aceite.
export type ContextoConsentimento = {
  rota: string;
  gatilho: "abertura" | "card" | "texto_livre";
};

const COOKIE_CONSENTIMENTO = "margem-consentimento=true; path=/; max-age=34560000; samesite=lax";

// Quem aceitou antes de 24/09/2026 tem o aceite só no localStorage, sem o cookie que o /api/orientacao
// exige. Regrava o cookie aqui pra essa pessoa não ser recusada pelo servidor.
export function jaConsentiu(): boolean {
  try {
    const consentiu = window.localStorage.getItem("margem-consentimento") === "true";
    if (consentiu && !document.cookie.split("; ").includes("margem-consentimento=true")) {
      document.cookie = COOKIE_CONSENTIMENTO;
    }
    return consentiu;
  } catch {
    return false;
  }
}

// Grava o consentimento no localStorage, no cookie (o proxy.ts lê pra mandar "/" direto pra /inicio)
// e na sessão anônima do banco.
export function conceder(contexto: ContextoConsentimento) {
  try {
    window.localStorage.setItem("margem-consentimento", "true");
  } catch {}
  document.cookie = COOKIE_CONSENTIMENTO;
  track("consentimento_concedido", contexto);
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

// A recusa não vai pro localStorage nem pro cookie: quem recusou vê o painel de novo na próxima visita.
// Fica só na aba (sessionStorage), pra o painel não voltar a cada tela. Tocar num card ou enviar o
// campo livre reabre o painel do mesmo jeito, porque conversar depende do aceite.
export function jaRecusou(): boolean {
  try {
    return window.sessionStorage.getItem("margem-consentimento-recusado") === "true";
  } catch {
    return false;
  }
}

export function recusar(contexto: ContextoConsentimento) {
  try {
    window.sessionStorage.setItem("margem-consentimento-recusado", "true");
  } catch {}
  track("consentimento_recusado", contexto);
}
