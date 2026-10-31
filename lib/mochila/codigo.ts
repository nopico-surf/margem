import { CENARIOS, ORDEM_ITENS, TRIBOS, type CenarioId } from "./conteudo";

// Código do link de desafio, em base36. Versão 2: versão (1 caractere) + cenário (1) + tribo (1,
// zero sem tribo) + os quatro eixos em centésimos (3 cada) + itens e combinados num número só.
// Itens = um bit por posição em ORDEM_ITENS; combinados = 4 bits no fim. Os eixos vão prontos
// porque saem de todos os itens, inclusive os que o nível esconde, e dos jeitos: com eles a prévia
// do link desenha o mesmo card do feed sem revelar nada. A versão 1 (sem tribo e sem eixos) ainda
// abre o desafio. Nada vai pra servidor: a mochila inteira está no link.

const VERSAO = "2";
const EIXO = 3;

export type Desafio = { cenario: CenarioId; itens: string[]; combinados: number[]; tribo?: string; eixos?: number[] };

export function codificar({ cenario, itens, combinados, tribo, eixos = [] }: Desafio): string {
  const indice = CENARIOS.findIndex((c) => c.id === cenario);
  let mascara = 0;
  for (const id of itens) {
    const bit = ORDEM_ITENS.indexOf(id);
    if (bit >= 0) mascara += 2 ** bit;
  }
  let comb = 0;
  for (const i of combinados) if (i >= 0 && i < 4) comb |= 1 << i;
  const triboCod = (TRIBOS.findIndex((t) => t.id === tribo) + 1).toString(36);
  const eixosCod = [0, 1, 2, 3].map((i) => Math.round((eixos[i] ?? 50) * 100).toString(36).padStart(EIXO, "0")).join("");
  return VERSAO + indice.toString(36) + triboCod + eixosCod + (mascara * 16 + comb).toString(36);
}

// Código inválido ou de versão desconhecida devolve null: a tela segue pro início normal, sem erro.
export function decodificar(codigo: string): Desafio | null {
  if (!/^[0-9a-z]{3,30}$/.test(codigo)) return null;
  let resto: string;
  let tribo: string | undefined;
  let eixos: number[] | undefined;
  if (codigo[0] === "1") resto = codigo.slice(2);
  else if (codigo[0] === VERSAO && codigo.length > 3 + EIXO * 4) {
    const t = parseInt(codigo[2], 36);
    if (t > TRIBOS.length) return null;
    tribo = TRIBOS[t - 1]?.id;
    eixos = [0, 1, 2, 3].map((i) => parseInt(codigo.slice(3 + i * EIXO, 3 + (i + 1) * EIXO), 36) / 100);
    if (eixos.some((v) => !(v >= 0 && v <= 100))) return null;
    resto = codigo.slice(3 + EIXO * 4);
  } else return null;
  const cenario = CENARIOS[parseInt(codigo[1], 36)];
  const numero = parseInt(resto, 36);
  if (!cenario || !Number.isSafeInteger(numero)) return null;
  const comb = numero % 16;
  let mascara = Math.floor(numero / 16);
  const itens: string[] = [];
  for (let bit = 0; mascara > 0; bit++, mascara = Math.floor(mascara / 2)) {
    if (mascara % 2 !== 1) continue;
    const id = ORDEM_ITENS[bit];
    if (!id || !cenario.itens.includes(id)) return null;
    itens.push(id);
  }
  const combinados = [0, 1, 2, 3].filter((i) => comb & (1 << i) && i < cenario.combinados.length);
  return { cenario: cenario.id, itens, combinados, tribo, eixos };
}
