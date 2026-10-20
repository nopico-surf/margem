"use client";

// Versão sem a gravação de sessão, que a Margem não usa: o pacote completo era o maior JS do site.
import mixpanel from "mixpanel-browser/src/loaders/loader-module-core";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { HOST_LOCAL } from "@/lib/host-local";

type Propriedades = Record<string, string | number | boolean | null>;

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const UTM_CHAVES = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

// Lido na carga do módulo, antes de qualquer redirect (/ -> /inicio) apagar a query da URL.
const chegada = typeof window === "undefined" ? null : { busca: window.location.search, referrer: document.referrer };

// Exclusão por navegador: abrir qualquer página com ?sem_medicao=1 liga, ?sem_medicao=0 desliga.
const CHAVE_SEM_MEDICAO = "margem-sem-medicao";

function sincronizarSemMedicao() {
  if (!chegada) return;
  try {
    const valor = new URLSearchParams(chegada.busca).get("sem_medicao");
    if (valor === "1") window.localStorage.setItem(CHAVE_SEM_MEDICAO, "1");
    if (valor === "0") window.localStorage.removeItem(CHAVE_SEM_MEDICAO);
  } catch {}
}

function semMedicao() {
  try {
    return window.localStorage.getItem(CHAVE_SEM_MEDICAO) === "1";
  } catch {
    return false;
  }
}

sincronizarSemMedicao();

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

function iniciar() {
  if (iniciado || !token || typeof window === "undefined") return iniciado;
  if (HOST_LOCAL.test(window.location.hostname)) return false;
  if (semMedicao()) return false;
  mixpanel.init(token, {
    ip: true,
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
