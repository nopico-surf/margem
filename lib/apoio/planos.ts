// Planos de "Apoiar a Margem". O valor cobrado sai sempre daqui, no servidor: o navegador só diz o que
// escolheu, e isso é conferido contra este catálogo antes de qualquer chamada ao Asaas.
//
// Profissional paga um plano mensal (serviço, com nota fiscal), pelo link pessoal que recebe depois de
// aprovado: a profissão sai do cadastro dele no banco, nunca da tela. Qualquer pessoa pode fazer doação
// (sem nota), única ou mensal, com valor aberto a partir de R$ 5. Ver docs/apoio-telas.md.

export type PublicoApoio = "psicologo" | "medico" | "geral";
export type FrequenciaApoio = "unico" | "mensal";
export type PlanoProfissional = "perfil" | "destaque" | "divulgacao" | "divulgacao_plus";

// "medico" cobre médicos e psiquiatras (especialidade "psiquiatra" no cadastro).
export const PRECOS_PLANOS: Record<"psicologo" | "medico", Record<PlanoProfissional, number>> = {
  psicologo: { perfil: 20, destaque: 50, divulgacao: 160, divulgacao_plus: 370 },
  medico: { perfil: 40, destaque: 90, divulgacao: 260, divulgacao_plus: 580 },
};

// Atalhos da tela. Qualquer outro valor a partir do mínimo também vale para a doação.
export const SUGESTOES_DOACAO = [10, 25, 50, 100] as const;

// Não é regra nossa: o Asaas recusa cobrança abaixo de R$ 5,00 (medido no sandbox em 20/10/2026).
export const VALOR_MINIMO = 5;

export type PedidoApoio = {
  publico: PublicoApoio;
  frequencia: FrequenciaApoio;
  valor: number;
  plano?: PlanoProfissional;
  profissionalId?: string;
};

export type ResultadoPedido = { ok: true; pedido: PedidoApoio } | { ok: false; motivo: string };

export function ehPlano(valor: unknown): valor is PlanoProfissional {
  return valor === "perfil" || valor === "destaque" || valor === "divulgacao" || valor === "divulgacao_plus";
}

// Valor em reais com no máximo dois decimais. Volta em centavos inteiros convertidos de novo pra
// reais, pra 10.1 + 0.2 não virar 10.299999 no Asaas.
function valorEmReais(valor: unknown): number | null {
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor <= 0) return null;
  const centavos = Math.round(valor * 100);
  if (Math.abs(valor * 100 - centavos) > 1e-6) return null;
  return centavos / 100;
}

export function validarDoacao(entrada: unknown): ResultadoPedido {
  if (!entrada || typeof entrada !== "object") return { ok: false, motivo: "pedido_invalido" };
  const { frequencia, valor } = entrada as Record<string, unknown>;
  if (frequencia !== "unico" && frequencia !== "mensal") return { ok: false, motivo: "frequencia_invalida" };
  const reais = valorEmReais(valor);
  if (reais === null) return { ok: false, motivo: "valor_invalido" };
  if (reais < VALOR_MINIMO) return { ok: false, motivo: "valor_abaixo_do_minimo" };
  return { ok: true, pedido: { publico: "geral", frequencia, valor: reais } };
}

// Profissional: sempre mensal, preço do catálogo pela profissão que está no cadastro.
export function pedidoDoProfissional(profissao: "psicologo" | "medico", plano: PlanoProfissional, profissionalId: string): PedidoApoio {
  return { publico: profissao, frequencia: "mensal", valor: PRECOS_PLANOS[profissao][plano], plano, profissionalId };
}

// Serviço tem nota fiscal; doação não.
export function ehServico(publico: PublicoApoio) {
  return publico !== "geral";
}
