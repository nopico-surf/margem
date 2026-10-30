import { CAPACIDADE, ITENS } from "./conteudo";

// Coloca os itens na grade 3x3. Item de 2 espaços é um retângulo 2x1 deitado, então cada fileira
// comporta no máximo um. Primeiro tenta na ordem em que a pessoa escolheu; se sobrar espaço solto
// que não comporta um item de 2, reorganiza (os de 2 primeiro, um por fileira) antes de recusar.

export type Posicao = { id: string; linha: number; coluna: number; espacos: 1 | 2 };

const LADO = 3;

function encaixarNaOrdem(ids: string[]): Posicao[] | null {
  const ocupado = Array.from({ length: LADO }, () => Array<boolean>(LADO).fill(false));
  const posicoes: Posicao[] = [];
  for (const id of ids) {
    const espacos = ITENS[id].espacos;
    let achou = false;
    for (let linha = 0; linha < LADO && !achou; linha++) {
      for (let coluna = 0; coluna + espacos <= LADO && !achou; coluna++) {
        if (ocupado[linha][coluna] || (espacos === 2 && ocupado[linha][coluna + 1])) continue;
        ocupado[linha][coluna] = true;
        if (espacos === 2) ocupado[linha][coluna + 1] = true;
        posicoes.push({ id, linha, coluna, espacos });
        achou = true;
      }
    }
    if (!achou) return null;
  }
  return posicoes;
}

export function espacosUsados(ids: string[]): number {
  return ids.reduce((soma, id) => soma + ITENS[id].espacos, 0);
}

export function encaixar(ids: string[]): Posicao[] | null {
  if (espacosUsados(ids) > CAPACIDADE) return null;
  const naOrdem = encaixarNaOrdem(ids);
  if (naOrdem) return naOrdem;
  const dois = ids.filter((id) => ITENS[id].espacos === 2);
  const um = ids.filter((id) => ITENS[id].espacos === 1);
  return encaixarNaOrdem([...dois, ...um]);
}

export function cabe(ids: string[], novo: string): boolean {
  return encaixar([...ids, novo]) !== null;
}

// A mochila do jeito do card e do resultado: só com os itens dados, em fileiras que sempre
// fecham, sem espaço vazio que entregue algo.
export type Bloco = { id: string; ordem: number; espacos: 1 | 2 };

export function fileiras(ids: string[]): Bloco[][] {
  const itens = ids.map((id, ordem) => ({ id, ordem, espacos: ITENS[id].espacos }));
  const total = itens.reduce((s, it) => s + it.espacos, 0);
  const dois = itens.filter((it) => it.espacos === 2);
  let n = total <= 4 ? 1 : total <= 8 ? 2 : 3;
  n = Math.max(n, Math.min(dois.length, 3));
  const rows = Array.from({ length: n }, () => ({ lista: [] as Bloco[], usado: 0 }));
  dois.forEach((it, k) => {
    rows[k % n].lista.push(it);
    rows[k % n].usado += 2;
  });
  for (const it of itens.filter((i) => i.espacos === 1)) {
    let melhor = rows[0];
    for (const r of rows) if (r.usado < melhor.usado) melhor = r;
    melhor.lista.push(it);
    melhor.usado += 1;
  }
  return rows.filter((r) => r.lista.length).map((r) => r.lista.sort((a, b) => a.ordem - b.ordem));
}
