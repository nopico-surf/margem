export type RiskResult = {
  emergency: boolean;
  message?: string;
};

const terms = [
  { words: ["suicidio", "me matar", "tirar minha vida"], message: "Se houver risco imediato, procure ajuda agora e ligue para um serviço de emergência." },
  { words: ["overdose", "nao consigo respirar", "dor no peito"], message: "Se o corpo estiver em risco agora, ligue para o SAMU 192." },
  { words: ["violencia", "me machucar", "machucar alguem"], message: "Se houver risco de violência, ligue para a Polícia 190." },
];

export function detectarRisco(texto: string): RiskResult {
  const normalized = texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const match = terms.find((term) => term.words.some((word) => normalized.includes(word)));
  return match ? { emergency: true, message: match.message } : { emergency: false };
}
