"use client";

import { chamarApi } from "./auth-cliente";
import { condicoesBatem, type BlocoMarkdown, type Contexto } from "./markdown";
import { PRIORIDADE_REACAO } from "./resultado";

// Exercício da semana no cliente: quais itens valem pra pessoa e quais já foram feitos.

export type ItemExercicio = Extract<BlocoMarkdown, { tipo: "exercicio" }>;
export type EstadoExercicio = Record<string, string>;

type Diagnostico = { problemas: string[]; reacoes: string[]; resultado: { safetyMode: boolean } };

export function contextoDo(diagnostico: Diagnostico): Contexto {
  return {
    principal: diagnostico.problemas[0] ?? "alcool",
    problemas: diagnostico.problemas.length ? diagnostico.problemas : ["alcool"],
    seguranca: diagnostico.resultado.safetyMode,
    // caution_mode: sem regra ainda (ver Contexto em markdown.ts).
    cautela: false,
    // A mesma reação que o resultado usa no "Se a pessoa reagir mal".
    reacao: PRIORIDADE_REACAO.find((reacao) => diagnostico.reacoes.includes(reacao)) ?? "ainda_nao_tentei",
  };
}

export function itensDoExercicio(blocos: BlocoMarkdown[], contexto: Contexto): ItemExercicio[] {
  return blocos.filter((bloco): bloco is ItemExercicio => bloco.tipo === "exercicio" && condicoesBatem(bloco.condicoes, contexto));
}

export async function carregarEstado(modulo: number): Promise<EstadoExercicio> {
  const resposta = await chamarApi(`/api/familia/exercicio?modulo=${modulo}`);
  if (!resposta?.ok) return {};
  return ((await resposta.json()) as { itens: EstadoExercicio }).itens ?? {};
}

export async function marcarFeito(modulo: number, item: string) {
  const resposta = await chamarApi("/api/familia/exercicio", { method: "POST", body: JSON.stringify({ modulo, item }) });
  return Boolean(resposta?.ok);
}
