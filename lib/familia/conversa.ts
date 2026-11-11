// "Como foi a conversa" (briefing M1, item 2): registro curto de uma conversa real com a pessoa.
// Usado nos módulos 1, 3 e 5. Este arquivo não importa nada de runtime.

export type ComoFoi = "com_calma" | "coracao_acelerado" | "esquentou" | "travei";
export type ReacaoNaConversa = "ouviu" | "abertura" | "negou" | "mudou_assunto" | "irritou";

export type RegistroDaConversa = {
  id: string;
  modulo: number;
  frase: string | null;
  como_foi: ComoFoi;
  reacao: ReacaoNaConversa | null;
  criado_em: string;
};

export const MODULOS_DA_CONVERSA = [1, 3, 5];

// O item "A primeira conversa" do módulo 1 fica concluído quando a pessoa salva o registro.
export const ITEM_DA_CONVERSA_M1 = { modulo: 1, item: "conversa" };

export const MAXIMO_FRASE = 280;

export const TEXTOS_CONVERSA = {
  titulo: "Como foi a conversa com {{apelido}}",
  fraseRotulo: "Qual frase você usou?",
  outra: "Outra",
  outraRotulo: "Escreva a frase",
  naoLembro: "Não lembro",
  comoFoiRotulo: "Como foi para você?",
  reacaoRotulo: "Como {{apelido}} reagiu?",
  salvar: "Salvar",
  treinar: "Treinar o meu roteiro",
  verSeguranca: "Ver meu plano de segurança",
  contouTitulo: "O que você contou",
  contarDeNovo: "Contar de novo",
  voltar: "Voltar ao módulo",
};

export const OPCOES_COMO_FOI: Array<{ valor: ComoFoi; rotulo: string; retorno: string }> = [
  { valor: "com_calma", rotulo: "Consegui falar com calma", retorno: "Que bom. Falar com calma já muda o clima da conversa, qualquer que tenha sido a resposta." },
  {
    valor: "coracao_acelerado",
    rotulo: "Fiquei com o coração acelerado, mas falei o principal",
    retorno: "Ficar com o coração acelerado numa conversa assim é normal. Você falou o principal, e isso conta.",
  },
  {
    valor: "esquentou",
    rotulo: "Esquentou, e eu encerrei a conversa",
    retorno: "Encerrar quando esquenta é uma escolha certa: protege você e deixa a porta aberta para outra conversa.",
  },
  { valor: "travei", rotulo: "Travei e preferi deixar para outro dia", retorno: "Travar acontece. Fica para outro dia, e um treino antes pode ajudar." },
];

export const OPCOES_REACAO: Array<{ valor: ReacaoNaConversa; rotulo: string }> = [
  { valor: "ouviu", rotulo: "Ouviu sem interromper" },
  { valor: "abertura", rotulo: "Mostrou abertura ou concordou" },
  { valor: "negou", rotulo: "Negou que tem um problema" },
  { valor: "mudou_assunto", rotulo: "Mudou de assunto ou levou na brincadeira" },
  { valor: "irritou", rotulo: "Se irritou" },
];

const COMO_FOI = OPCOES_COMO_FOI.map((opcao) => opcao.valor);
const REACOES = OPCOES_REACAO.map((opcao) => opcao.valor);

export function sanitizarConversa(entrada: unknown) {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const modulo = Number(bruto.modulo);
  if (!MODULOS_DA_CONVERSA.includes(modulo)) return null;
  if (!COMO_FOI.includes(bruto.como_foi as ComoFoi)) return null;
  const frase = typeof bruto.frase === "string" && bruto.frase.trim() ? bruto.frase.trim().slice(0, MAXIMO_FRASE) : null;
  const reacao = REACOES.includes(bruto.reacao as ReacaoNaConversa) ? (bruto.reacao as ReacaoNaConversa) : null;
  return { modulo, frase, como_foi: bruto.como_foi as ComoFoi, reacao };
}
