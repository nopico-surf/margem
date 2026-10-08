// Anos de experiência = ano atual menos o ano de início. Conta por ano-calendário (não por data),
// então todo mundo sobe junto à 00h de 1º de janeiro. O ano vem do fuso de São Paulo pra servidor
// (UTC) e navegador concordarem na virada.
const formatadorAno = new Intl.DateTimeFormat("en-CA", { year: "numeric", timeZone: "America/Sao_Paulo" });

export function anosDeExperiencia(anoInicio: number | null): number | null {
  if (anoInicio == null) return null;
  const anoAtual = Number(formatadorAno.format(new Date()));
  return Math.max(1, anoAtual - anoInicio);
}

export function rotuloAnosDeExperiencia(anoInicio: number | null): string | null {
  const anos = anosDeExperiencia(anoInicio);
  if (anos == null) return null;
  return `${anos} ${anos === 1 ? "ano" : "anos"} de experiência`;
}
