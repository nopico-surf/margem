// Os seis caminhos da home. A ordem importa: o índice é o que vai pro sessionStorage e pro
// /api/orientacao, e é o mesmo índice usado para escolher o ícone em ICONES_CAMINHO.
export const CARDS_HOME: Array<{ titulo: string; descricao: string }> = [
  { titulo: "Quero mudar o uso", descricao: "Informações para reduzir ou parar e caminhos para buscar apoio" },
  { titulo: "Estou fisicamente mal", descricao: "Orientações imediatas para o seu corpo e contatos de emergência" },
  { titulo: "Estou emocionalmente mal", descricao: "Orientação para lidar com o momento e canais para falar sobre o que sente" },
  { titulo: "Quero ajudar alguém próximo", descricao: "Formas de oferecer suporte a quem você ama e grupos de acolhimento" },
  { titulo: "Fiz uso e quero ajuda", descricao: "Cuidados para você passar por isso agora e apoio acolhedor sem julgamento" },
  { titulo: "Estou com vontade de usar", descricao: "Dicas práticas para atravessar a fissura e canais para conversar agora" },
];

export const TITULOS_CARDS_HOME = CARDS_HOME.map((card) => card.titulo);
