"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Provedor } from "./config";
import { devAtivo, respostaDev } from "./dev";

// Cliente do Supabase Auth no navegador, só pro login do programa para familiares. Usa a chave
// anônima (pública). Não consulta tabela nenhuma: os dados passam pelos route handlers, que conferem
// o token. A sessão fica no aparelho (o familiar raramente precisa entrar de novo).

let cliente: SupabaseClient | null = null;

export function clienteAuth() {
  if (cliente) return cliente;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) return null;
  cliente = createClient(url, chave, {
    auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "margem-familia-auth" },
  });
  return cliente;
}

// Escopos mínimos: só nome e e-mail. Nada de amigos, contatos ou publicação.
const ESCOPOS: Record<Provedor, string> = {
  google: "openid email profile",
  apple: "name email",
  facebook: "email public_profile",
};

export async function entrarCom(provedor: Provedor) {
  const auth = clienteAuth();
  if (!auth) return { ok: false as const };
  const { error } = await auth.auth.signInWithOAuth({
    provider: provedor,
    options: { redirectTo: `${window.location.origin}/familia/entrar/retorno`, scopes: ESCOPOS[provedor] },
  });
  return error ? { ok: false as const } : { ok: true as const };
}

export async function tokenAtual() {
  const auth = clienteAuth();
  if (!auth) return null;
  const { data } = await auth.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function provedorAtual() {
  const auth = clienteAuth();
  const { data } = (await auth?.auth.getSession()) ?? { data: { session: null } };
  return (data.session?.user.app_metadata?.provider as string | undefined) ?? null;
}

// fetch com o token da pessoa. Sem sessão devolve null, e a tela manda pro login.
// No modo sem login (só localhost, lib/familia/dev.ts) responde de lá, sem token e sem banco.
export async function chamarApi(caminho: string, init?: RequestInit) {
  if (devAtivo()) return respostaDev(caminho, init);
  const token = await tokenAtual();
  if (!token) return null;
  return fetch(caminho, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
}
