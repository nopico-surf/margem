"use client";

import { chamarApi, clienteAuth } from "./auth-cliente";
import { CHAVE_CONSENTIMENTO_PENDENTE, CHAVE_RESPOSTAS } from "./config";
import { diagnosticoCompleto, type Respostas } from "./diagnostico";

// O diagnóstico é respondido sem conta: as respostas ficam no localStorage até o login e são
// vinculadas à conta logo depois (briefing, seção 4.1). Tudo aqui tolera localStorage bloqueado.

export function lerRespostasLocais(): Respostas {
  try {
    return JSON.parse(window.localStorage.getItem(CHAVE_RESPOSTAS) ?? "{}") as Respostas;
  } catch {
    return {};
  }
}

export function salvarRespostasLocais(respostas: Respostas) {
  try {
    window.localStorage.setItem(CHAVE_RESPOSTAS, JSON.stringify(respostas));
  } catch {}
}

function apagar(chave: string) {
  try {
    window.localStorage.removeItem(chave);
  } catch {}
}

function lerConsentimentoPendente(): { dados: boolean; comunicacoes: boolean } | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE_CONSENTIMENTO_PENDENTE);
    return bruto ? (JSON.parse(bruto) as { dados: boolean; comunicacoes: boolean }) : null;
  } catch {
    return null;
  }
}

export async function temSessao() {
  const auth = clienteAuth();
  if (!auth) return false;
  const { data } = await auth.auth.getSession();
  return Boolean(data.session);
}

export type DepoisDoLogin =
  | { tipo: "ir"; destino: string }
  | { tipo: "precisa_email" }
  | { tipo: "precisa_consentimento" }
  | { tipo: "sem_sessao" }
  | { tipo: "erro" };

// Depois do login (ou com sessão já aberta): garante o perfil com os consentimentos, grava o
// diagnóstico que estava no aparelho e diz pra onde seguir.
export async function concluirEntrada(email?: string): Promise<DepoisDoLogin> {
  const perfilResposta = await chamarApi("/api/familia/perfil");
  if (!perfilResposta) return { tipo: "sem_sessao" };
  if (!perfilResposta.ok) return { tipo: "erro" };
  const perfil = (await perfilResposta.json()) as { temPerfil: boolean; precisaEmail: boolean; temDiagnostico: boolean };

  if (!perfil.temPerfil || perfil.precisaEmail) {
    const consentimento = lerConsentimentoPendente();
    if (!perfil.temPerfil && !consentimento?.dados) return { tipo: "precisa_consentimento" };
    if (perfil.precisaEmail && !email) return { tipo: "precisa_email" };
    const criado = await chamarApi("/api/familia/perfil", {
      method: "POST",
      body: JSON.stringify({ consentimentoDados: consentimento?.dados === true, consentimentoComunicacoes: consentimento?.comunicacoes === true, email }),
    });
    if (!criado) return { tipo: "sem_sessao" };
    if (!criado.ok) {
      const { error } = (await criado.json().catch(() => ({}))) as { error?: string };
      return error === "precisa_email" ? { tipo: "precisa_email" } : { tipo: "erro" };
    }
    apagar(CHAVE_CONSENTIMENTO_PENDENTE);
  }

  const respostas = lerRespostasLocais();
  if (diagnosticoCompleto(respostas)) {
    const gravado = await chamarApi("/api/familia/diagnostico", { method: "POST", body: JSON.stringify({ respostas }) });
    if (!gravado?.ok) return { tipo: "erro" };
    apagar(CHAVE_RESPOSTAS);
    return { tipo: "ir", destino: "/familia/resultado" };
  }
  return { tipo: "ir", destino: perfil.temDiagnostico ? "/familia/resultado" : "/familia/diagnostico" };
}
