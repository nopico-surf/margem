import { CENARIOS, ORDEM_ITENS, type CenarioId } from "./conteudo";

// Código do link de desafio: versão (1 caractere) + cenário (1 caractere) + itens e combinados num
// número só, em base36. Itens = um bit por posição em ORDEM_ITENS; combinados = 4 bits no fim.
// Nada vai pra servidor: a mochila inteira está no link, e só com os itens do nível escolhido.

const VERSAO = "1";

export type Desafio = { cenario: CenarioId; itens: string[]; combinados: number[] };

export function codificar({ cenario, itens, combinados }: Desafio): string {
  const indice = CENARIOS.findIndex((c) => c.id === cenario);
  let mascara = 0;
  for (const id of itens) {
    const bit = ORDEM_ITENS.indexOf(id);
    if (bit >= 0) mascara += 2 ** bit;
  }
  let comb = 0;
  for (const i of combinados) if (i >= 0 && i < 4) comb |= 1 << i;
  return VERSAO + indice.toString(36) + (mascara * 16 + comb).toString(36);
}

// Código inválido ou de versão antiga devolve null: a tela segue pro início normal, sem erro.
export function decodificar(codigo: string): Desafio | null {
  if (!/^[0-9a-z]{3,12}$/.test(codigo) || codigo[0] !== VERSAO) return null;
  const cenario = CENARIOS[parseInt(codigo[1], 36)];
  const numero = parseInt(codigo.slice(2), 36);
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
  return { cenario: cenario.id, itens, combinados };
}
