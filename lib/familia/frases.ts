// "Reescrever minhas frases" (briefing M3, ferramenta C3): troca frases que viram briga por versões
// novas. As 10 frases e os textos vêm do briefing. Este arquivo não importa nada de runtime. Frase
// escrita pela pessoa nunca vai pra IA (só vai ao simulador se ela tocar em "Treinar esta frase") nem
// pro Mixpanel.

export type HabilidadeId = "breve" | "pedido" | "fato" | "sentimento" | "compreensao" | "parte" | "ajuda" | "valorizar";

// A explicação de cada habilidade é a do texto do módulo 3 ("As 7 habilidades"). "valorizar" não está
// entre as 7 e o briefing não traz explicação: fica sem a linha, [PENDÊNCIA DO FUNDADOR].
export const HABILIDADES: Record<HabilidadeId, { rotulo: string; explicacao: string | null }> = {
  breve: { rotulo: "breve", explicacao: "Uma ou duas frases. Quanto mais longa a conversa, mais chance de virar sermão." },
  pedido: { rotulo: "pedido", explicacao: "Pedir o que você quer abre caminho. Só reclamar do que não quer fecha." },
  fato: { rotulo: "fato", explicacao: "Um momento concreto, sem \"você é\" e sem \"você sempre\"." },
  sentimento: { rotulo: "sentimento", explicacao: "Falar de você, não do que a pessoa fez de errado." },
  compreensao: { rotulo: "compreensão", explicacao: "Entender não é concordar." },
  parte: { rotulo: "parte", explicacao: "Sobre o jeito de conversar ou sobre a relação. Nunca sobre o uso: isso não é responsabilidade sua." },
  ajuda: { rotulo: "ajuda", explicacao: "Algo concreto e fácil de aceitar." },
  valorizar: { rotulo: "valorizar", explicacao: null },
};

export type FraseModelo = { id: string; antes: string; novo: string; habilidades: HabilidadeId[] };

export const FRASES_MODELO: FraseModelo[] = [
  { id: "F1", antes: "Você nunca ajuda em nada nesta casa.", novo: "A casa tá pesando pra mim esta semana. Você pode lavar a louça hoje?", habilidades: ["sentimento", "pedido", "breve"] },
  { id: "F2", antes: "Nossa, resolveu aparecer? Milagre!", novo: "Que bom que você veio jantar. Eu gosto muito quando a gente come junto.", habilidades: ["breve", "valorizar", "sentimento"] },
  { id: "F3", antes: "Você não tem responsabilidade nenhuma.", novo: "Ontem você perdeu o compromisso das 9h, e isso me deu medo. Se quiser, eu te lembro na próxima.", habilidades: ["fato", "sentimento", "ajuda"] },
  { id: "F4", antes: "Tá escondendo alguma coisa de novo, né?", novo: "Quando você chega tarde sem avisar, eu fico com medo. Me manda uma mensagem quando atrasar?", habilidades: ["fato", "sentimento", "pedido"] },
  { id: "F5", antes: "Você gastou tudo de novo! Vai acabar com a família!", novo: "Vi que a conta ficou no negativo e fiquei com medo. Vamos sentar no domingo para olhar as contas juntos?", habilidades: ["fato", "sentimento", "ajuda"] },
  { id: "F6", antes: "Se continuar assim, eu vou embora.", novo: "Eu tô no meu limite com essas brigas. Queria muito ter dias mais tranquilos com você.", habilidades: ["sentimento", "pedido", "breve"] },
  { id: "F7", antes: "Olha todo mundo da sua idade trabalhando, e você aí.", novo: "Eu sei que tá difícil achar o seu caminho. Se quiser, eu te ajudo a procurar alguma coisa.", habilidades: ["compreensao", "ajuda", "breve"] },
  { id: "F8", antes: "Você estragou o fim de semana de novo.", novo: "Eu fiquei triste de não sair no sábado. Queria muito passear com você no próximo.", habilidades: ["sentimento", "pedido", "breve"] },
  { id: "F9", antes: "Onde você tava? Com quem? Quanto gastou?", novo: "Eu me preocupei ontem à noite. E acho que exagerei mandando tanta mensagem.", habilidades: ["sentimento", "parte", "breve"] },
  { id: "F10", antes: "Eu não aguento mais ver você se destruindo.", novo: "Eu te amo e fico com medo de te ver assim. Tô aqui se você quiser conversar.", habilidades: ["sentimento", "ajuda", "breve"] },
];

export const CONFERENCIA = [
  "Dá para falar numa respiração só?",
  "Fala de um momento concreto, sem \"você sempre\" ou \"você nunca\"?",
  "Diz o que você sente (\"eu fico com medo\", \"eu fico triste\")?",
  "Diz o que você gostaria que acontecesse, e não só o que te incomoda?",
  "Ficou sem \"mas\" depois de uma parte boa? O \"mas\" apaga o que veio antes (\"eu te amo, mas...\" soa como bronca).",
  "Tem uma oferta de ajuda ou um pedaço que é seu (\"acho que eu falei num tom duro\")?",
];

export const CONFERENCIA_MINIMA = 3;
export const FRASES_PARA_CONCLUIR = 3;
export const MAXIMO_FRASE_ANTES = 280;
export const MAXIMO_FRASE_NOVA = 280;
const MAXIMO_FRASES_SALVAS = 30;

// O item "Reescrever frases que viram briga" do módulo 3 conclui na terceira frase salva.
export const ITEM_FRASES_M3 = { modulo: 3, item: "frases" };

// Chave do sessionStorage que leva a frase de "Treinar esta frase" até o simulador (some depois de lida).
export const CHAVE_FRASE_DO_TREINO = "margem-familia-frase-do-treino";
export const CENARIO_DO_TREINO = "nega-o-problema";

export const TEXTOS_FRASES = {
  titulo: "Reescrever frases que viram briga",
  tituloLista: "Minhas frases",
  contador: (n: number) => `${Math.min(n, FRASES_PARA_CONCLUIR)} de ${FRASES_PARA_CONCLUIR} frases`,
  intro: "Toda casa tem aquelas frases que, quando saem, já viram briga. Aqui você troca 3 delas por versões novas. Não precisa ficar perfeito: precisa soar como você.",
  comecar: "Reescrever minhas frases",
  escolha: "Qual destas frases costuma aparecer aí?",
  escolhaAjuda: "Não precisa ser igual. Escolha a mais parecida, ou escreva a sua.",
  escreverMinha: "Escrever a minha",
  continuar: "Continuar",
  exemploTitulo: "Um jeito novo de dizer",
  pensar: "Pense: o que aconteceu de concreto? O que você sentiu? O que você queria que acontecesse?",
  campoRotulo: "A sua frase nova",
  campoDica: "Com as suas palavras. Uma frase que você conseguiria falar sem perder o fôlego.",
  usarExemplo: "Usar o exemplo como base",
  conferirTitulo: "Antes de salvar, confira",
  conferirAjuda: "Três itens marcados já fazem uma frase muito melhor.",
  ajustarPergunta: "Quer ajustar mais um pouco?",
  ajustar: "Ajustar a frase",
  salvarMesmoAssim: "Salvar assim mesmo",
  salvar: "Salvar minha frase",
  salva: "Frase salva. Que tal falar em voz alta uma vez no treino, para ver como ela soa?",
  todas: "Pronto: você tem 3 frases novas para as situações que mais se repetem aí. Elas ficam em 'Minhas frases', no painel.",
  treinar: "Treinar esta frase",
  proxima: "Reescrever a próxima",
  copiar: "Copiar",
  verMinhas: "Ver minhas frases",
  outra: "Reescrever outra frase",
  voltar: "Voltar ao módulo",
};

export type FraseSalva = {
  id: string;
  frase_antes_id: string | null;
  frase_antes_texto: string;
  frase_nova: string;
  conferencia: number[];
  criada_em: string;
};

export function sanitizarFrase(entrada: unknown) {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const antes = typeof bruto.frase_antes_texto === "string" ? bruto.frase_antes_texto.trim().slice(0, MAXIMO_FRASE_ANTES) : "";
  const nova = typeof bruto.frase_nova === "string" ? bruto.frase_nova.trim().slice(0, MAXIMO_FRASE_NOVA) : "";
  if (!antes || !nova) return null;
  const modelo = FRASES_MODELO.find((frase) => frase.id === bruto.frase_antes_id);
  const conferencia = Array.isArray(bruto.conferencia)
    ? CONFERENCIA.map((_, indice) => indice + 1).filter((numero) => (bruto.conferencia as unknown[]).includes(numero))
    : [];
  return { frase_antes_id: modelo ? modelo.id : null, frase_antes_texto: antes, frase_nova: nova, conferencia };
}

export const LIMITE_DE_FRASES = MAXIMO_FRASES_SALVAS;
