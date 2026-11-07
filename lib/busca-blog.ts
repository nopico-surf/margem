import { normalizarTexto } from "@/lib/normalizar";
import type { Guia } from "@/lib/guias";

// Busca da lista do blog (/blog). O índice é montado no servidor, a partir de lib/guias.ts, e a busca
// roda no navegador, enquanto a pessoa digita. Guia novo entra sozinho.
//
// Entra no índice o que diz do que o texto trata: o título (H1), o resumo (meta description e
// abertura) e as perguntas (os H2 e o FAQ). O corpo fica de fora: "álcool" aparece em quase todos os
// textos e traria a lista inteira de volta.
//
// Sem fuzzy e sem dicionário de gírias (CLAUDE.md, seção 8). O que a busca faz: ignora maiúscula,
// acento e pontuação ("cocaina" acha "cocaína"), aceita o começo da palavra ("cocai"), o plural
// ("drogas" acha "droga") e o feminino ("psicóloga" acha "psicólogo"). Toda palavra digitada precisa
// aparecer em algum campo. Palavra de uma ou duas letras precisa ser a palavra inteira: sem isso,
// "pó" acharia "pode", "por" e quase todos os textos.

export type EntradaIndiceBlog = {
  slug: string;
  titulo: string;
  perguntas: string;
  resumo: string;
};

// Título pesa mais que pergunta, que pesa mais que resumo. Empate fica na ordem de lib/guias.ts.
const PESOS = { titulo: 3, perguntas: 2, resumo: 1 } as const;

// Palavras que não dizem do que o texto trata. Sem isso, "o que é terapia" exigiria um "o" e um "e".
const PALAVRAS_VAZIAS = new Set([
  "a", "o", "as", "os", "um", "uma", "uns", "umas", "de", "do", "da", "dos", "das", "em", "no", "na",
  "nos", "nas", "por", "pelo", "pela", "pra", "pro", "para", "com", "sem", "e", "ou", "que", "se",
  "eu", "me", "meu", "minha", "voce", "como", "qual", "quais", "quando", "onde", "porque", "ao", "aos",
  "sobre", "isso", "esse", "essa", "e", "ser", "ter", "tem", "fazer", "ja", "mais", "muito",
]);

// "[texto](/rota)" vira "texto"; pontuação vira espaço antes de normalizar, pra "álcool/drogas" virar
// duas palavras (normalizarTexto apaga a pontuação sem separar).
function normalizar(texto: string) {
  return normalizarTexto(texto.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[^\p{L}\p{N}\s]/gu, " "));
}

// Tira o "s" do plural e o "a" ou "o" do gênero, pra "baratos", "barata" e "barato" se encontrarem.
// Palavra curta fica como está ("mas", "gás", "uso", "cura").
function radical(palavra: string) {
  let base = palavra.length > 3 && palavra.endsWith("s") ? palavra.slice(0, -1) : palavra;
  if (base.length > 4 && /[ao]$/.test(base)) base = base.slice(0, -1);
  return base;
}

function palavrasDoCampo(texto: string) {
  return Array.from(new Set(normalizar(texto).split(" ").filter(Boolean).map(radical))).join(" ");
}

export function montarIndiceBlog(guias: Guia[]): EntradaIndiceBlog[] {
  return guias.map((guia) => ({
    slug: guia.slug,
    titulo: palavrasDoCampo(guia.h1),
    perguntas: palavrasDoCampo(
      [...guia.secoes.map((secao) => secao.titulo), ...guia.perguntas.map((item) => item.pergunta)].join(" "),
    ),
    resumo: palavrasDoCampo(`${guia.descricao} ${guia.abertura}`),
  }));
}

// O que a pessoa digitou, já do jeito do índice. Vazio quando só tem palavra vazia ou pontuação.
export function termosDaBusca(busca: string) {
  return Array.from(
    new Set(
      normalizar(busca)
        .split(" ")
        .filter((palavra) => palavra && !PALAVRAS_VAZIAS.has(palavra))
        .map(radical),
    ),
  );
}

function pesoDoTermo(entrada: EntradaIndiceBlog, termo: string) {
  let melhor = 0;
  for (const campo of ["titulo", "perguntas", "resumo"] as const) {
    if (PESOS[campo] <= melhor) continue;
    // Começo de palavra: " " na frente pra "cocai" achar "cocaina" mas "caina" não.
    const procurado = termo.length < 3 ? ` ${termo} ` : ` ${termo}`;
    if (` ${entrada[campo]} `.includes(procurado)) melhor = PESOS[campo];
  }
  return melhor;
}

// Os slugs que batem, do mais pro menos relevante. `null` quando não tem o que buscar (campo vazio ou
// só palavras vazias): aí a lista inteira aparece, na ordem de sempre.
export function buscarNoBlog(indice: EntradaIndiceBlog[], busca: string): string[] | null {
  const termos = termosDaBusca(busca);
  if (termos.length === 0) return null;

  const achados: { slug: string; pontos: number; ordem: number }[] = [];
  indice.forEach((entrada, ordem) => {
    let pontos = 0;
    for (const termo of termos) {
      const peso = pesoDoTermo(entrada, termo);
      if (peso === 0) return;
      pontos += peso;
    }
    achados.push({ slug: entrada.slug, pontos, ordem });
  });

  return achados.sort((a, b) => b.pontos - a.pontos || a.ordem - b.ordem).map((achado) => achado.slug);
}
