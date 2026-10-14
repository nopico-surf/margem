import type { OpcaoDoFiltro } from "@/components/conversa/FiltroEspecialidade";

// As duas listas da /redes-de-apoio. O valor é o que vai na URL (?tipo=) e no Mixpanel.
export type TipoRede = "publicas" | "independentes";

// Rótulos do Figma (Experiência do produto, 1478:12507 e menu 660:32), com a ortografia corrigida.
export const OPCOES_REDE: OpcaoDoFiltro<TipoRede>[] = [
  { valor: "publicas", rotulo: "Públicas" },
  { valor: "independentes", rotulo: "Independentes" },
];

export function tipoDeRedeDaUrl(valor: string | null): TipoRede {
  return valor === "independentes" ? "independentes" : "publicas";
}
