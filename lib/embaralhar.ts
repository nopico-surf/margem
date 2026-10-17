function hashString(texto: string) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

// PRNG seedado (mulberry32): mesma sessaoId sempre gera a mesma sequência, então a ordem
// dos profissionais é aleatória por sessão mas estável entre recarregamentos.
function criarGeradorSeed(seed: number) {
  return function gerar() {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Roda no servidor (resposta da conversa) e no navegador (/inicio e /profissionais). Pra ordem bater
// entre as telas, a lista de entrada precisa chegar sempre na mesma ordem (por nome).
export function embaralharComSeed<T>(itens: T[], seedStr: string) {
  const gerar = criarGeradorSeed(hashString(seedStr));
  const resultado = [...itens];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(gerar() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}
