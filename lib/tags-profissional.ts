import { normalizarTexto } from "@/lib/normalizar";

// Os cards cortam as tags em duas linhas, então as ligadas ao que a Margem cuida (álcool, drogas,
// dependência, redução de danos) sobem pro começo. O resto fica atrás, na ordem do cadastro.
const TERMOS_DO_TEMA = [
  "alcool",
  "droga",
  "dependenc",
  "reducao de dano",
  "abstinencia",
  "recaida",
  "substancia",
  "compuls",
  "cannabis",
];

export function tagsComTemaPrimeiro(tags: string[]): string[] {
  const doTema = (tag: string) => {
    const normalizada = normalizarTexto(tag);
    return TERMOS_DO_TEMA.some((termo) => normalizada.includes(termo));
  };
  return [...tags.filter(doTema), ...tags.filter((tag) => !doTema(tag))];
}
