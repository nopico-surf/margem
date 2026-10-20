import { getServerClient } from "@/lib/supabase";
import type { PedidoApoio } from "./planos";

// Gravação da tabela apoios. Só ids do Asaas, plano, valor e status: nome e CPF nunca chegam aqui.

export type StatusApoio = "aguardando" | "pago" | "ativo" | "inadimplente" | "recusado" | "expirado" | "cancelado" | "falhou";

export type AtualizacaoApoio = {
  status?: StatusApoio;
  asaas_cliente_id?: string;
  asaas_cobranca_id?: string;
  asaas_autorizacao_id?: string;
  asaas_assinatura_id?: string | null;
  ultimo_pagamento_em?: string;
};

// Grava o apoio antes de falar com o Asaas: o id dele vai como referência pra cobrança e pra
// autorização, e o webhook acha o apoio por ele mesmo que chegue antes da atualização com os ids.
export async function criarApoio(pedido: PedidoApoio): Promise<string | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("apoios")
    .insert({ publico: pedido.publico, frequencia: pedido.frequencia, valor: pedido.valor })
    .select("id")
    .single();
  if (error) console.error("[apoio] criarApoio falhou:", error.message);
  return (data?.id as string | undefined) ?? null;
}

export async function atualizarApoio(id: string, campos: AtualizacaoApoio) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("apoios")
    .update({ ...campos, atualizado_em: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("[apoio] atualizarApoio falhou:", error.message);
  return !error;
}

export type ApoioEncontrado = { id: string; frequencia: "unico" | "mensal"; status: StatusApoio };

type CampoBusca = "id" | "asaas_cobranca_id" | "asaas_autorizacao_id" | "asaas_assinatura_id";

export async function buscarApoioPor(campo: CampoBusca, valor: string): Promise<ApoioEncontrado | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("apoios").select("id, frequencia, status").eq(campo, valor).maybeSingle();
  if (error) console.error("[apoio] buscarApoioPor falhou:", error.message);
  return (data as ApoioEncontrado | null) ?? null;
}

// Muda o apoio só se o status ainda for o que o webhook leu: dois eventos chegando juntos não se
// atropelam, e o que chegou depois é aplicado em cima do estado certo ou não é aplicado.
export async function atualizarApoioSeStatus(id: string, statusAtual: StatusApoio, campos: AtualizacaoApoio) {
  const supabase = getServerClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("apoios")
    .update({ ...campos, atualizado_em: new Date().toISOString() })
    .eq("id", id)
    .eq("status", statusAtual);
  if (error) console.error("[apoio] atualizarApoioSeStatus falhou:", error.message);
  return !error;
}

// Marca o evento do webhook como recebido. "repetido" quando o Asaas reentrega um evento já gravado.
export async function registrarEvento(id: string, tipo: string, apoioId: string | null): Promise<"novo" | "repetido" | "erro"> {
  const supabase = getServerClient();
  if (!supabase) return "erro";
  const { error } = await supabase.from("eventos_asaas").insert({ id, tipo, apoio_id: apoioId });
  if (!error) return "novo";
  if (error.code === "23505") return "repetido";
  console.error("[apoio] registrarEvento falhou:", error.message);
  return "erro";
}

// Desfaz o registro quando o processamento falha, pra o Asaas reentregar o evento e ele ser processado.
export async function removerEvento(id: string) {
  const supabase = getServerClient();
  if (!supabase) return;
  const { error } = await supabase.from("eventos_asaas").delete().eq("id", id);
  if (error) console.error("[apoio] removerEvento falhou:", error.message);
}

export async function buscarStatusApoio(id: string): Promise<StatusApoio | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("apoios").select("status").eq("id", id).maybeSingle();
  if (error) console.error("[apoio] buscarStatusApoio falhou:", error.message);
  return (data?.status as StatusApoio | undefined) ?? null;
}
