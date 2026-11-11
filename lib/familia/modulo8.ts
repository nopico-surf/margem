// Módulo 8 (briefing M8, 11/11/2026): itens do exercício que as ferramentas de outros módulos concluem
// quando abertas daqui, e os textos dos cards. Este arquivo não importa nada de runtime.

export const ITEM_VALORIZAR_M8 = "valorizar";
export const ITEM_NOVO_CONVITE_M8 = "novo_convite";
export const ITEM_PAUSA_M8 = "pausa";
export const ITEM_FRASE_M8 = "frase";

// Versão "disse não": a pessoa faz um dos dois. Fazer um marca o outro como "Não se aplica".
export const ITENS_EXCLUSIVOS_M8: Record<string, string> = { [ITEM_NOVO_CONVITE_M8]: ITEM_PAUSA_M8, [ITEM_PAUSA_M8]: ITEM_NOVO_CONVITE_M8 };

export const TEXTOS_M8 = {
  naoSeAplica: "Não se aplica",
  criarMeta: "Criar minha meta",
  reverConvite: "Rever meu convite",
  escolherData: "Escolher a data",
  escolherFrase: "Escolher minha frase",
  retomarAntes: "Ver o profissional ou serviço de antes",
};
