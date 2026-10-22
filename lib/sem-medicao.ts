// Rotas onde nenhuma ferramenta de medição carrega (Mixpanel, GTM e o que vem por ele: GA, Meta e
// Clarity). Hoje é só a página de pagamento do profissional: o pagamento nunca se liga à sessão da
// conversa, e o Mixpanel identifica pelo UUID da sessão. Ver docs/apoio-telas.md.
export const ROTA_SEM_MEDICAO = /^\/plano(\/|$)/;
