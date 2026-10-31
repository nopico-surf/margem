import { CAPACIDADE, ITENS, JEITOS, cenarioPorId, type CenarioId, type Polo } from "./conteudo";

// Os quatro eixos da mochila. Cada eixo é uma mistura entre dois polos legítimos, nunca uma nota de
// "quanto a pessoa se cuida": o percentual só aparece junto do polo, e nada compara pessoas.
// Entram os itens da mochila, os combinados marcados (ou o "Não vou fazer combinados") e os jeitos
// escolhidos.

export type EixoId = "corpo_festa" | "grupo_autonomia" | "volta_presenca" | "planejamento_leveza";

export type Eixo = {
  id: EixoId;
  a: Polo;
  b: Polo;
  // Percentual do polo a, 0 a 100, sem arredondar.
  valor: number;
  dominante: Polo;
  // Percentual do polo dominante, arredondado: é o que aparece na tela.
  percentual: number;
};

export const NOME_POLO: Record<Polo, string> = {
  corpo: "Corpo",
  festa: "Festa",
  grupo: "Grupo",
  autonomia: "Autonomia",
  volta: "Volta",
  presenca: "Presença",
  planejamento: "Planejamento",
  leveza: "Leveza",
};

const AUTONOMIA = ["carregador", "dinheiro", "documento", "pochete"];
const VOLTA: Record<string, number> = { dinheiro: 2, carregador: 2, calcado: 2, telefone: 1 };
const PRESENCA: Record<string, number> = {
  casaquinho: 2,
  leque: 1,
  bone: 1,
  "protetor-solar": 1,
  "protetor-auricular": 1,
  "caixa-de-som": 1,
  glitter: 1,
  uvas: 1,
  maquiagem: 1,
  fone: 1,
};

// Planejamento x Leveza não é proporção entre dois lados: é uma pontuação sobre 19.
const MAX_COMBINADOS = 6;
const MAX_BONUS = 4;
// "Não vou fazer combinados" é escolha, não falta: pesa em Autonomia e puxa pra Leveza.
const SEM_COMBINADOS_AUTONOMIA = 2;
const SEM_COMBINADOS_LEVEZA = 2;
const MAX_PLANEJAMENTO = CAPACIDADE + MAX_COMBINADOS + MAX_BONUS;

function eixo(id: EixoId, a: Polo, b: Polo, valor: number): Eixo {
  const dominante = valor >= 50 ? a : b;
  return { id, a, b, valor, dominante, percentual: Math.round(valor >= 50 ? valor : 100 - valor) };
}

// Os dois lados em zero deixam o eixo no meio.
function mistura(id: EixoId, a: Polo, b: Polo, ladoA: number, ladoB: number): Eixo {
  return eixo(id, a, b, ladoA + ladoB === 0 ? 50 : (ladoA / (ladoA + ladoB)) * 100);
}

export function eixos(cenarioId: CenarioId, itens: string[], combinados: number[], semCombinados: boolean, jeitos: string[]): Eixo[] {
  const tem = (id: string) => itens.includes(id);
  const bonus = (polo: Polo) => jeitos.reduce((s, id) => s + (JEITOS.find((j) => j.id === id)?.bonus[polo] ?? 0), 0);
  const conta = (pesos: Record<string, number>) => itens.reduce((s, id) => s + (pesos[id] ?? 0), 0);
  const deVolta = cenarioPorId(cenarioId)?.combinadosVolta ?? [];

  const corpo = itens.filter((id) => ITENS[id].tipo === "cuidado").length + bonus("corpo");
  const festa = itens.filter((id) => ITENS[id].tipo === "role").length + bonus("festa");

  const grupo = (tem("telefone") ? 2 : 0) + combinados.length + bonus("grupo");
  const autonomia = AUTONOMIA.filter(tem).length + (semCombinados ? SEM_COMBINADOS_AUTONOMIA : 0) + bonus("autonomia");

  const volta = conta(VOLTA) + combinados.filter((i) => deVolta.includes(i)).length + bonus("volta");
  const presenca = conta(PRESENCA) + bonus("presenca");

  // O bônus de Leveza puxa pro outro lado, por isso entra descontando o de Planejamento.
  const espacos = Math.min(itens.reduce((s, id) => s + ITENS[id].espacos, 0), CAPACIDADE);
  const doCombinado = semCombinados ? -SEM_COMBINADOS_LEVEZA : Math.min(combinados.length * 1.5, MAX_COMBINADOS);
  const doJeito = Math.max(-MAX_BONUS, Math.min(bonus("planejamento") - bonus("leveza"), MAX_BONUS));
  const pontos = Math.max(0, Math.min(espacos + doCombinado + doJeito, MAX_PLANEJAMENTO));

  return [
    mistura("corpo_festa", "corpo", "festa", corpo, festa),
    mistura("grupo_autonomia", "grupo", "autonomia", grupo, autonomia),
    mistura("volta_presenca", "volta", "presenca", volta, presenca),
    eixo("planejamento_leveza", "planejamento", "leveza", (pontos / MAX_PLANEJAMENTO) * 100),
  ];
}

// Os eixos refeitos a partir dos quatro valores, na ordem acima. Serve o link de desafio, que leva
// os valores prontos: os itens escondidos pelo nível entram na conta sem aparecer no link.
export function eixosDeValores(valores: number[]): Eixo[] {
  return [
    eixo("corpo_festa", "corpo", "festa", valores[0]),
    eixo("grupo_autonomia", "grupo", "autonomia", valores[1]),
    eixo("volta_presenca", "volta", "presenca", valores[2]),
    eixo("planejamento_leveza", "planejamento", "leveza", valores[3]),
  ];
}

// Mais extremo primeiro (maior distância de 50). Empate fica na ordem dos eixos.
export function porExtremo(lista: Eixo[]): Eixo[] {
  return [...lista].sort((x, y) => Math.abs(y.valor - 50) - Math.abs(x.valor - 50));
}
