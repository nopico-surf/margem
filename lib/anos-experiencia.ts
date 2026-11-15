// Anos de experiência = ano atual menos o ano de início. Conta por ano-calendário (não por data),
// então todo mundo sobe junto à 00h de 1º de janeiro. O ano vem do fuso de São Paulo pra servidor
// (UTC) e navegador concordarem na virada.
const formatadorAno = new Intl.DateTimeFormat("en-CA", { year: "numeric", timeZone: "America/Sao_Paulo" });

export function anoAtualEmSaoPaulo(): number {
  return Number(formatadorAno.format(new Date()));
}

// `anoAtual` chega de fora nas telas que são prerenderizadas: ler o relógio durante o render de um
// componente de cliente é valor instável pro Cache Components, e a tela inteira cai pro loading.tsx,
// sem o texto no HTML. Nos cards montados no navegador o relógio é lido aqui mesmo.
export function anosDeExperiencia(anoInicio: number | null, anoAtual = anoAtualEmSaoPaulo()): number | null {
  if (anoInicio == null) return null;
  return Math.max(1, anoAtual - anoInicio);
}

export function rotuloAnosDeExperiencia(anoInicio: number | null, anoAtual?: number): string | null {
  const anos = anosDeExperiencia(anoInicio, anoAtual);
  if (anos == null) return null;
  return `${anos} ${anos === 1 ? "ano" : "anos"} de experiência`;
}
