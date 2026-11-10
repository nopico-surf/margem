import type { SupabaseClient } from "@supabase/supabase-js";
import type { Respostas } from "./diagnostico";

// Leituras das tabelas familia_* (supabase/migrations/0040_familia.sql). Sempre com o service role,
// sempre filtradas pelo user_id já conferido em auth-servidor.ts.

export type Perfil = {
  user_id: string;
  email: string | null;
  safety_mode: boolean;
  acesso_liberado_em: string | null;
};

export async function buscarPerfil(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("familia_perfis")
    .select("user_id, email, safety_mode, acesso_liberado_em")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) console.error("[familia] buscarPerfil falhou:", error.message);
  return (data as Perfil | null) ?? null;
}

export async function buscarUltimoDiagnostico(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("familia_diagnosticos")
    .select("respostas, safety_mode, criado_em")
    .eq("user_id", userId)
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error("[familia] buscarUltimoDiagnostico falhou:", error.message);
  return (data as { respostas: Respostas; safety_mode: boolean; criado_em: string } | null) ?? null;
}

export function emailValido(email: unknown): email is string {
  return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
