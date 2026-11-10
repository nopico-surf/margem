"use client";

import { chamarApi } from "./auth-cliente";
import type { Meta } from "./escala";

// Toque num dia da meta (painel e meta salva): marca ou desmarca. Devolve a meta atualizada, ou null
// se não salvou.
// [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o dia só não muda.
export async function alternarDiaDaMeta(data: string, hoje: string): Promise<Meta | null> {
  const resposta = await chamarApi("/api/familia/meta", { method: "PATCH", body: JSON.stringify({ data, hoje }) });
  if (!resposta?.ok) return null;
  return ((await resposta.json()) as { meta: Meta | null }).meta;
}
