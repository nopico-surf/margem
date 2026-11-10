import { normalizarTexto } from "@/lib/normalizar";

// Primeira camada de segurança do simulador (briefing, seção 8): a mensagem do familiar é conferida
// aqui ANTES de ir pro Gemini. Bateu, a simulação pausa e a tela mostra os contatos de emergência. É
// nossa, hardcoded, como o termos_risco do resto da Margem (CLAUDE.md, seção 3). A saída da IA com
// {"tipo":"seguranca"} é só uma segunda camada, nunca a única.
//
// Os termos ficam já normalizados (minúsculo, sem acento, sem pontuação), como o texto comparado.
// [REVISÃO CLÍNICA] Lista inicial do briefing, ampliada com variações próximas.
export const TERMOS_RISCO_SIMULADOR = [
  "me bateu",
  "me bate",
  "bateu em mim",
  "me agrediu",
  "me agride",
  "vai me matar",
  "quer me matar",
  "ameacou",
  "me ameaca",
  "se matar",
  "me matar",
  "suicidio",
  "suicidar",
  "tirar a propria vida",
  "overdose",
  "nao acorda",
  "desmaiou",
  "convulsao",
  "tenho medo dele",
  "tenho medo dela",
  "estou em perigo",
  "to em perigo",
  // "faca" fica de fora: normalizado, "faça" vira "faca" e daria falso alarme em toda frase com "faça".
  "arma",
  "uma arma",
];

export function temTermoDeRisco(texto: string) {
  const normalizado = ` ${normalizarTexto(texto)} `;
  return TERMOS_RISCO_SIMULADOR.some((termo) => normalizado.includes(` ${termo} `));
}
