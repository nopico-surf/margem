"use client";

import mixpanel from "mixpanel-browser";
import { getOrCreateSessaoId } from "@/lib/sessao-client";

type Propriedades = Record<string, string | number | boolean | null>;

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const UTM_CHAVES = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

// Lido na carga do módulo, antes de qualquer redirect (/ -> /bem-vindo ou /app) apagar a query da URL.
const chegada = typeof window === "undefined" ? null : { busca: window.location.search, referrer: document.referrer };

let iniciado = false;

function registrarOrigem() {
  if (!chegada) return;
  const params = new URLSearchParams(chegada.busca);
  const utms: Propriedades = {};
  for (const chave of UTM_CHAVES) {
    const valor = params.get(chave);
    if (valor) utms[chave] = valor;
  }

  let referrer: string | null = null;
  try {
    if (chegada.referrer && new URL(chegada.referrer).host !== window.location.host) referrer = chegada.referrer;
  } catch {}

  const primeiroContato: Propriedades = { primeiro_referrer: referrer ?? "direto" };
  for (const chave of UTM_CHAVES) primeiroContato[`primeira_${chave}`] = utms[chave] ?? null;
  mixpanel.register_once(primeiroContato);

  if (Object.keys(utms).length > 0) {
    const visitaAtual: Propriedades = {};
    for (const chave of UTM_CHAVES) visitaAtual[chave] = utms[chave] ?? null;
    mixpanel.register(visitaAtual);
  }
  if (referrer) mixpanel.register({ referrer });
}

// localhost e IPs de rede privada (acesso pelo celular via Wi-Fi, ex: 192.168.1.3:3000)
const HOST_LOCAL = /^(localhost|127\.\d+\.\d+\.\d+|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|.+\.local)$/;

function iniciar() {
  if (iniciado || !token || typeof window === "undefined") return iniciado;
  if (HOST_LOCAL.test(window.location.hostname)) return false;
  mixpanel.init(token, {
    ip: false,
    autocapture: false,
    track_pageview: false,
    persistence: "localStorage",
  });
  mixpanel.identify(getOrCreateSessaoId());
  registrarOrigem();
  iniciado = true;
  return iniciado;
}

export function track(evento: string, propriedades?: Propriedades) {
  if (!iniciar()) return;
  mixpanel.track(evento, propriedades);
}

export function registrar(propriedades: Propriedades) {
  if (!iniciar()) return;
  mixpanel.register(propriedades);
}
