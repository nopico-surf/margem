// Os seis caminhos da home. A ordem importa: o índice é o mesmo usado pro /api/orientacao e pra
// escolher o ícone em ICONES_CAMINHO. `chave` é a chave_busca da resposta no banco; `slug` é a URL
// pública e indexável de /conversa/[slug].
export const CARDS_HOME: Array<{ titulo: string; descricao: string; chave: string; slug: string }> = [
  { titulo: "Quero mudar o uso", descricao: "Informações para reduzir ou parar e caminhos para buscar apoio", chave: "quero mudar uso", slug: "quero-mudar-o-uso" },
  { titulo: "Estou fisicamente mal", descricao: "Orientações imediatas para o seu corpo e contatos de emergência", chave: "estou fisicamente mal", slug: "estou-fisicamente-mal" },
  { titulo: "Estou emocionalmente mal", descricao: "Orientação para lidar com o momento e canais para falar sobre o que sente", chave: "estou emocionalmente mal", slug: "estou-emocionalmente-mal" },
  { titulo: "Quero ajudar alguém próximo", descricao: "Formas de oferecer suporte a quem você ama e grupos de acolhimento", chave: "quero ajudar alguem proximo", slug: "quero-ajudar-alguem-proximo" },
  { titulo: "Fiz uso e quero ajuda", descricao: "Cuidados para você passar por isso agora e apoio acolhedor sem julgamento", chave: "fiz uso e quero ajuda", slug: "fiz-uso-e-quero-ajuda" },
  { titulo: "Estou com vontade de usar", descricao: "Dicas práticas para atravessar a fissura e canais para conversar agora", chave: "estou com vontade de usar", slug: "estou-com-vontade-de-usar" },
];

export const TITULOS_CARDS_HOME = CARDS_HOME.map((card) => card.titulo);

export function indiceDoCard(slug: string) {
  return CARDS_HOME.findIndex((card) => card.slug === slug);
}
