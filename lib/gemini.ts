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

export const fallbackOrientation: Orientation = {
  acolhimento: "Você não precisa resolver tudo agora. O que você está vivendo merece cuidado, e procurar um caminho possível já é um movimento importante.",
  orientacao: "Pode ajudar começar por uma coisa pequena e segura hoje, como beber água, descansar em um lugar protegido e falar com alguém de confiança. Se quiser acompanhamento, serviços públicos e grupos de apoio podem caminhar com você.",
  pilula_espiritual: null,
  checklist_agora: ["Ir para um lugar onde você se sinta mais seguro", "Beber água e tentar descansar", "Mandar uma mensagem para alguém de confiança"],
  checklist_proximo: ["Observar como você está se sentindo ao longo da semana", "Conversar com alguém de confiança sobre o que está vivendo", "Buscar um serviço ou grupo de apoio que faça sentido para você"],
  perguntas_aprofundamento: [],
};

export async function gerarOrientacao(texto: string): Promise<Orientation> {
  if (!process.env.GEMINI_API_KEY) return fallbackOrientation;

  try {
    const prompt = await readFile(path.join(process.cwd(), "docs", "prompt-gemini.md"), "utf8");
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=" + process.env.GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${prompt}\n\nMensagem da pessoa:\n${texto}` }] }] }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) return fallbackOrientation;
    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return fallbackOrientation;

    const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
    if (
      typeof parsed.acolhimento !== "string" ||
      typeof parsed.orientacao !== "string" ||
      (parsed.pilula_espiritual !== null && typeof parsed.pilula_espiritual !== "string") ||
      !Array.isArray(parsed.checklist_agora) ||
      !Array.isArray(parsed.checklist_proximo) ||
      !Array.isArray(parsed.perguntas_aprofundamento) ||
      parsed.perguntas_aprofundamento.some((item: unknown) => {
        if (!item || typeof item !== "object") return true;
        const question = item as { pergunta?: unknown; opcoes?: unknown };
        return typeof question.pergunta !== "string" || !Array.isArray(question.opcoes) || question.opcoes.some((option) => typeof option !== "string");
      })
    ) return fallbackOrientation;
    return {
      acolhimento: parsed.acolhimento,
      orientacao: parsed.orientacao,
      pilula_espiritual: parsed.pilula_espiritual,
      checklist_agora: parsed.checklist_agora.filter((item: unknown): item is string => typeof item === "string"),
      checklist_proximo: parsed.checklist_proximo.filter((item: unknown): item is string => typeof item === "string"),
      perguntas_aprofundamento: parsed.perguntas_aprofundamento,
    };
  } catch {
    return fallbackOrientation;
  }
}
