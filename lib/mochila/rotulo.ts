import { CENARIOS, ITENS, type CenarioId } from "./conteudo";

// O rótulo fala da mochila, nunca da pessoa. Avaliado de cima pra baixo, o primeiro que bate vence.
// Nenhuma regra olha item de nível 1 ou 2, então o rótulo nunca entrega item escondido no card.
// A frase vai embaixo do rótulo no resultado e no card, e começa sempre igual.

export type Rotulo = { nome: string; frase: string };

const VIRA_O_ANO: Rotulo = { nome: "Mochila de quem vira o ano bem", frase: "Você é o redutor de danos que entra no ano novo sabendo como volta pra casa." };
const PENSA_NA_VOLTA: Rotulo = { nome: "Mochila de quem pensa na volta", frase: "Você é o redutor de danos que resolve a volta antes de sair de casa." };
const CUIDA_DO_CORPO: Rotulo = { nome: "Mochila de quem cuida do corpo", frase: "Você é o redutor de danos que lembra que o corpo também foi pro rolê." };
const CUIDA_DO_GRUPO: Rotulo = { nome: "Mochila de quem cuida do grupo", frase: "Você é o redutor de danos que combina as coisas antes, pra ninguém se perder depois." };
const VEIO_PRA_FESTA: Rotulo = { nome: "Mochila de quem veio pra festa", frase: "Você é o redutor de danos que não abre mão da parte boa da noite." };
const LEVE: Rotulo = { nome: "Mochila leve", frase: "Você é o redutor de danos que leva pouco e resolve no caminho." };
const PRONTA: Rotulo = { nome: "Mochila pronta pro rolê", frase: "Você é o redutor de danos que monta a mochila do próprio jeito." };

export const ROTULOS: Rotulo[] = [VIRA_O_ANO, PENSA_NA_VOLTA, CUIDA_DO_CORPO, CUIDA_DO_GRUPO, VEIO_PRA_FESTA, LEVE, PRONTA];

export function rotulo(cenario: CenarioId, itens: string[], combinados: number[]): Rotulo {
  const tem = (id: string) => itens.includes(id);

  // Virada: combinado de índice 1 é "Combinar a volta antes da meia-noite".
  if (cenario === "virada" && tem("calcado") && combinados.includes(1)) return VIRA_O_ANO;

  if (tem("dinheiro") && tem("telefone") && tem("carregador")) return PENSA_NA_VOLTA;
  if (tem("garrafa") && tem("lanche")) return CUIDA_DO_CORPO;
  if (tem("telefone") && combinados.length >= 2) return CUIDA_DO_GRUPO;
  if (itens.filter((id) => ITENS[id].tipo === "role").length >= 2) return VEIO_PRA_FESTA;
  // Conta só os itens de nível 0: contando todos, "leve" ou "pronta" entregaria quantos itens
  // escondidos a pessoa levou.
  if (itens.filter((id) => ITENS[id].nivel === 0).length <= 4) return LEVE;
  return PRONTA;
}

// O item de cuidado de menor prioridade que não foi levado. Item sem prioridade (rolê e nível 2)
// nunca entra: cobrar um cuidado de uso de quem talvez nem precise soa como acusação.
export function ficouDeFora(cenario: CenarioId, itens: string[]): string | null {
  const oferecidos = CENARIOS.find((c) => c.id === cenario)?.itens ?? [];
  const candidatos = oferecidos
    .filter((id) => !itens.includes(id) && ITENS[id].prioridade !== null)
    .sort((a, b) => (ITENS[a].prioridade ?? 0) - (ITENS[b].prioridade ?? 0));
  return candidatos[0] ?? null;
}
