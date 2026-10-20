// Planos de "Apoiar a Margem". O valor cobrado sai sempre daqui, no servidor: o navegador só diz qual
// público, qual frequência e qual valor escolheu, e isso é conferido contra este catálogo antes de
// qualquer chamada ao Asaas.
//
// Profissionais pagam taxa de manutenção de software (serviço, com nota fiscal), sempre mensal.
// O público geral faz doação (sem nota), única ou mensal, com valor aberto a partir de R$ 5.

export type PublicoApoio = "psicologo" | "medico" | "geral";
export type FrequenciaApoio = "unico" | "mensal";

// "medico" cobre médicos e psiquiatras, como a aba de Médicos/Psiquiatras da /profissionais.
export const VALORES_PROFISSIONAIS = {
  psicologo: [20, 40, 80],
  medico: [40, 80, 160],
} as const;

// Atalhos da tela. Qualquer outro valor a partir do mínimo também vale para o público geral.
export const SUGESTOES_DOACAO = [10, 25, 50, 100] as const;

// Não é regra nossa: o Asaas recusa cobrança abaixo de R$ 5,00 (medido no sandbox em 20/10/2026).
export const VALOR_MINIMO = 5;

export type PedidoApoio = { publico: PublicoApoio; frequencia: FrequenciaApoio; valor: number };

export type ResultadoPedido = { ok: true; pedido: PedidoApoio } | { ok: false; motivo: string };

// Valor em reais com no máximo dois decimais. Volta em centavos inteiros convertidos de novo pra
// reais, pra 10.1 + 0.2 não virar 10.299999 no Asaas.
function valorEmReais(valor: unknown): number | null {
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor <= 0) return null;
  const centavos = Math.round(valor * 100);
  if (Math.abs(valor * 100 - centavos) > 1e-6) return null;
  return centavos / 100;
}

export function validarPedido(entrada: unknown): ResultadoPedido {
  if (!entrada || typeof entrada !== "object") return { ok: false, motivo: "pedido_invalido" };
  const { publico, frequencia, valor } = entrada as Record<string, unknown>;

  if (publico !== "psicologo" && publico !== "medico" && publico !== "geral") return { ok: false, motivo: "publico_invalido" };
  if (frequencia !== "unico" && frequencia !== "mensal") return { ok: false, motivo: "frequencia_invalida" };

  const reais = valorEmReais(valor);
  if (reais === null) return { ok: false, motivo: "valor_invalido" };
  if (reais < VALOR_MINIMO) return { ok: false, motivo: "valor_abaixo_do_minimo" };

  if (publico !== "geral") {
    if (frequencia !== "mensal") return { ok: false, motivo: "frequencia_invalida" };
    if (!(VALORES_PROFISSIONAIS[publico] as readonly number[]).includes(reais)) return { ok: false, motivo: "valor_invalido" };
  }

  return { ok: true, pedido: { publico, frequencia, valor: reais } };
}

// Serviço tem nota fiscal; doação não.
export function ehServico(publico: PublicoApoio) {
  return publico !== "geral";
}
