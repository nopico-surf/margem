import { CENARIOS, ITENS, type CenarioId, type Polo } from "./conteudo";
import { porExtremo, type Eixo } from "./eixos";

// O rótulo fala da mochila, nunca da pessoa. Sai dos eixos: o mais extremo dá a primeira linha e a
// frase, o segundo dá a linha do "e também". A Virada de ano é testada antes de tudo.

export type Rotulo = { nome: string; tambem: string; frase: string };

const POR_POLO: Record<Polo, Rotulo> = {
  corpo: { nome: "Mochila de quem cuida do corpo", tambem: "e também cuida do corpo", frase: "Você é o redutor de danos que não deixa o corpo pagar a conta da noite." },
  festa: { nome: "Mochila de quem veio pra festa", tambem: "e também veio pra festa", frase: "Você é o redutor de danos que não abre mão da parte boa da noite." },
  grupo: { nome: "Mochila de quem cuida do grupo", tambem: "e também cuida do grupo", frase: "Você é o redutor de danos que combina as coisas antes, pra ninguém se perder depois." },
  autonomia: { nome: "Mochila de quem se resolve sozinho", tambem: "e também se resolve sozinho", frase: "Você é o redutor de danos que sai com tudo o que precisa pra se virar." },
  volta: { nome: "Mochila de quem pensa na volta", tambem: "e também pensa na volta", frase: "Você é o redutor de danos que resolve a volta antes de sair de casa." },
  presenca: { nome: "Mochila de quem veio pra ficar", tambem: "e também veio pra ficar", frase: "Você é o redutor de danos que se prepara pra ficar até o fim." },
  planejamento: { nome: "Mochila de quem pensou em tudo", tambem: "e também pensou em tudo", frase: "Você é o redutor de danos que pensa na noite antes dela começar." },
  leveza: { nome: "Mochila leve de propósito", tambem: "e também leva o essencial", frase: "Você é o redutor de danos que leva pouco e resolve no caminho." },
};

const VIRA_O_ANO = { nome: "Mochila de quem vira o ano bem", frase: "Você é o redutor de danos que entra no ano novo sabendo como volta pra casa." };

export function rotulo(cenario: CenarioId, itens: string[], combinados: number[], eixos: Eixo[]): Rotulo {
  const [primeiro, segundo] = porExtremo(eixos);
  // Virada: combinado de índice 1 é "Combinar a volta antes da meia-noite". O "e também" vem do eixo
  // mais extremo, já que a primeira linha não saiu dele.
  if (cenario === "virada" && itens.includes("calcado") && combinados.includes(1)) {
    return { ...VIRA_O_ANO, tambem: POR_POLO[primeiro.dominante].tambem };
  }
  const { nome, frase } = POR_POLO[primeiro.dominante];
  return { nome, frase, tambem: POR_POLO[segundo.dominante].tambem };
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
