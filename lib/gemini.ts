import { readFile } from "node:fs/promises";
import path from "node:path";

export type Orientation = {
  acolhimento: string;
  orientacao: string;
  pilula_espiritual: string | null;
  checklist_agora: string[];
  checklist_proximo: string[];
  perguntas_aprofundamento: Array<{ pergunta: string; opcoes: string[] }>;
};

// Não existe resposta genérica de reserva: quando o Gemini falha, quem chama recebe o motivo e decide
// o que fazer. O motivo vai pro log do servidor e pro Mixpanel, pra dar pra acompanhar as falhas.
export type MotivoFalhaGemini = "sem_chave" | "tempo_esgotado" | "erro_google" | "resposta_vazia" | "json_invalido" | "formato_invalido" | "erro_inesperado";

// tempoMs mede só a chamada ao Google (não inclui ler o prompt do disco nem a gravação no banco depois).
export type ResultadoGemini =
  | { ok: true; orientation: Orientation; tempoMs: number }
  | { ok: false; motivo: MotivoFalhaGemini; detalhe?: string; tempoMs: number };

const TIMEOUT_MS = 30000;

function campoInvalido(parsed: Record<string, unknown>) {
  if (typeof parsed.acolhimento !== "string") return "acolhimento";
  if (typeof parsed.orientacao !== "string") return "orientacao";
  if (parsed.pilula_espiritual !== null && typeof parsed.pilula_espiritual !== "string") return "pilula_espiritual";
  if (!Array.isArray(parsed.checklist_agora)) return "checklist_agora";
  if (!Array.isArray(parsed.checklist_proximo)) return "checklist_proximo";
  if (!Array.isArray(parsed.perguntas_aprofundamento)) return "perguntas_aprofundamento";
  const perguntaInvalida = parsed.perguntas_aprofundamento.some((item: unknown) => {
    if (!item || typeof item !== "object") return true;
    const question = item as { pergunta?: unknown; opcoes?: unknown };
    return typeof question.pergunta !== "string" || !Array.isArray(question.opcoes) || question.opcoes.some((option) => typeof option !== "string");
  });
  return perguntaInvalida ? "perguntas_aprofundamento" : null;
}

export async function gerarOrientacao(texto: string): Promise<ResultadoGemini> {
  if (!process.env.GEMINI_API_KEY) return { ok: false, motivo: "sem_chave", tempoMs: 0 };

  const inicio = performance.now();
  const tempoMs = () => Math.round(performance.now() - inicio);
  try {
    const prompt = await readFile(path.join(process.cwd(), "docs", "prompt-gemini.md"), "utf8");
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=" + process.env.GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${prompt}\n\nMensagem da pessoa:\n${texto}` }] }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 4096,
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) return { ok: false, motivo: "erro_google", detalhe: `http ${response.status}`, tempoMs: tempoMs() };
    const data = await response.json();
    const candidato = data?.candidates?.[0];
    const raw = candidato?.content?.parts?.[0]?.text;
    if (!raw) return { ok: false, motivo: "resposta_vazia", detalhe: `finishReason ${candidato?.finishReason ?? "nenhum"}`, tempoMs: tempoMs() };

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
    } catch {
      return { ok: false, motivo: "json_invalido", detalhe: `finishReason ${candidato?.finishReason ?? "nenhum"}`, tempoMs: tempoMs() };
    }

    const campo = campoInvalido(parsed);
    if (campo) return { ok: false, motivo: "formato_invalido", detalhe: campo, tempoMs: tempoMs() };

    return {
      ok: true,
      tempoMs: tempoMs(),
      orientation: {
        acolhimento: parsed.acolhimento as string,
        orientacao: parsed.orientacao as string,
        pilula_espiritual: parsed.pilula_espiritual as string | null,
        checklist_agora: (parsed.checklist_agora as unknown[]).filter((item): item is string => typeof item === "string"),
        checklist_proximo: (parsed.checklist_proximo as unknown[]).filter((item): item is string => typeof item === "string"),
        perguntas_aprofundamento: parsed.perguntas_aprofundamento as Orientation["perguntas_aprofundamento"],
      },
    };
  } catch (err) {
    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) return { ok: false, motivo: "tempo_esgotado", tempoMs: tempoMs() };
    return { ok: false, motivo: "erro_inesperado", detalhe: err instanceof Error ? err.message : undefined, tempoMs: tempoMs() };
  }
}
