// Planos de "Apoiar a Margem". O valor cobrado sai sempre daqui, no servidor: o navegador só diz o que
// escolheu, e isso é conferido contra este catálogo antes de qualquer chamada ao Asaas.
//
// Profissional paga um plano mensal (serviço, com nota fiscal), pelo link pessoal que recebe depois de
// aprovado: o cadastro sai do banco, nunca da tela. O plano é um plano base (define as vagas) mais, no
// máximo, um opcional para turbinar a presença; o valor é a soma dos dois (Figma, Experiência do
// produto, 1534:28280). O Bronze é gratuito: sozinho não gera Pix (o perfil entra no ar como gratuito,
// app/api/apoio/pix); com um opcional, o valor é só o do opcional.
//
// Médico (inclui psiquiatra) paga mais, pela mesma régua de antes: no plano base, o dobro (a mensalidade
// pesa um percentual maior da sessão média dele, R$ 200 contra R$ 130); no opcional, o acréscimo que já
// existia (cerca de 80% no Destaque, 62% na Divulgação, 57% na Plus). Médico nunca paga mais pelo mesmo
// anúncio: quando o opcional dele custa mais, a verba do anúncio dele sobe junto. Qualquer pessoa pode fazer doação
// (sem nota), única ou mensal, com valor aberto a partir de R$ 5. Ver docs/apoio-telas.md.

export type PublicoApoio = "psicologo" | "medico" | "geral";
export type FrequenciaApoio = "unico" | "mensal";
export type Profissao = "psicologo" | "medico";
export type PlanoBase = "bronze" | "prata" | "ouro" | "diamante";
export type PlanoOpcional = "destaque" | "divulgacao" | "divulgacao_plus";

// Preços em centavos, pra soma não arredondar errado. vagas: pessoas em acompanhamento simultâneo que o
// profissional pode manter no perfil; null é ilimitado. Por enquanto o limite é acompanhado na mão.
export const PLANOS_BASE: Record<Profissao, Record<PlanoBase, { centavos: number; vagas: number | null }>> = {
  psicologo: {
    bronze: { centavos: 0, vagas: 1 },
    prata: { centavos: 1999, vagas: 3 },
    ouro: { centavos: 3999, vagas: 8 },
    diamante: { centavos: 8999, vagas: null },
  },
  medico: {
    bronze: { centavos: 0, vagas: 1 },
    prata: { centavos: 3999, vagas: 3 },
    ouro: { centavos: 7999, vagas: 8 },
    diamante: { centavos: 17999, vagas: null },
  },
};

export const PLANOS_OPCIONAIS: Record<Profissao, Record<PlanoOpcional, { centavos: number }>> = {
  psicologo: {
    destaque: { centavos: 15999 },
    divulgacao: { centavos: 36999 },
    divulgacao_plus: { centavos: 55999 },
  },
  medico: {
    destaque: { centavos: 28999 },
    divulgacao: { centavos: 59999 },
    divulgacao_plus: { centavos: 87999 },
  },
};

// Catálogo de uma profissão, para as telas: as do cadastro usam a profissão escolhida na tela, a do
// link recebe o da profissão do cadastro. O valor cobrado é sempre recalculado no servidor.
export function catalogoDaProfissao(profissao: Profissao) {
  return { planosBase: PLANOS_BASE[profissao], planosOpcionais: PLANOS_OPCIONAIS[profissao] };
}

// Atalhos da tela. Qualquer outro valor a partir do mínimo também vale para a doação.
export const SUGESTOES_DOACAO = [10, 25, 50, 100] as const;

// Não é regra nossa: o Asaas recusa cobrança abaixo de R$ 5,00 (medido no sandbox em 20/10/2026).
export const VALOR_MINIMO = 5;

export type PedidoApoio = {
  publico: PublicoApoio;
  frequencia: FrequenciaApoio;
  valor: number;
  planoBase?: PlanoBase;
  planoOpcional?: PlanoOpcional | null;
  profissionalId?: string;
  // Troca de plano (upgrade): valor é o mensal novo; valorImediato, a diferença cobrada hoje.
  troca?: boolean;
  valorImediato?: number;
};

export type ResultadoPedido = { ok: true; pedido: PedidoApoio } | { ok: false; motivo: string };

export function ehPlanoBase(valor: unknown): valor is PlanoBase {
  return typeof valor === "string" && Object.hasOwn(PLANOS_BASE.psicologo, valor);
}

export function ehPlanoOpcional(valor: unknown): valor is PlanoOpcional {
  return typeof valor === "string" && Object.hasOwn(PLANOS_OPCIONAIS.psicologo, valor);
}

// Mensal em centavos do plano base mais o opcional (se houver), pela profissão.
export function centavosDoPlano(profissao: Profissao, base: PlanoBase, opcional: PlanoOpcional | null) {
  return PLANOS_BASE[profissao][base].centavos + (opcional ? PLANOS_OPCIONAIS[profissao][opcional].centavos : 0);
}

// Valor mensal em reais do plano base mais o opcional (se houver), pela profissão.
export function valorDoPlano(profissao: Profissao, base: PlanoBase, opcional: PlanoOpcional | null) {
  const centavos = PLANOS_BASE[profissao][base].centavos + (opcional ? PLANOS_OPCIONAIS[profissao][opcional].centavos : 0);
  return centavos / 100;
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

// Profissional: sempre mensal, valor do catálogo da profissão que está no cadastro.
export function pedidoDoProfissional(
  profissao: Profissao,
  base: PlanoBase,
  opcional: PlanoOpcional | null,
  profissionalId: string,
): PedidoApoio {
  return { publico: profissao, frequencia: "mensal", valor: valorDoPlano(profissao, base, opcional), planoBase: base, planoOpcional: opcional, profissionalId };
}

// Serviço tem nota fiscal; doação não.
export function ehServico(publico: PublicoApoio) {
  return publico !== "geral";
}
