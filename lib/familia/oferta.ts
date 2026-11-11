// Oferta e compra do programa para familiares (briefing 01). Lido pela tela e pelo servidor: a tela
// mostra estes valores, e a rota do Pix confere o que a tela mandou contra eles antes de chamar o Asaas.

export type PlanoFamilia = "programa" | "acompanhamento";

// Programa: a pessoa escolhe quanto pagar, uma vez só. O conteúdo é o mesmo em qualquer valor.
export const VALORES_PROGRAMA = [47, 67, 97, 127, 147] as const;
export const VALOR_SUGERIDO = 97;

// Com acompanhamento: o programa pelo valor mínimo mais a primeira sessão com um profissional parceiro,
// paga no mesmo Pix. A sessão segue a faixa do valor social dos psicólogos (ValorSessaoPsicologos):
// cinco atalhos de R$ 60 a R$ 200 e "Outro valor" dentro da faixa.
export const VALOR_PROGRAMA_COM_ACOMPANHAMENTO = 47;
export const SESSAO_MINIMA = 60;
export const SESSAO_MAXIMA = 200;
export const VALORES_SESSAO = [60, 95, 130, 165, 200] as const;

// Prazo pra pedir o dinheiro de volta, contado da liberação do acesso (briefing 01b: 14 dias, o dobro
// do artigo 49 do CDC). Na tela, nunca com contador regressivo e nunca com "cancelar".
export const DIAS_PARA_DESISTIR = 14;

// [PENDÊNCIA DO FUNDADOR] Em quanto tempo a devolução cai, ex.: "2 dias úteis". Nulo: a frase
// "O valor volta pelo mesmo Pix em até..." aparece sem o prazo.
export const PRAZO_DEVOLUCAO: string | null = null;

// [PENDÊNCIA DO FUNDADOR] Em quanto tempo o pedido de acesso gratuito é respondido, ex.: "2 dias
// úteis". Nulo: a frase "A gente responde em até..." não aparece.
export const PRAZO_GRATUIDADE: string | null = null;

export type Compra = { plano: PlanoFamilia; valorPrograma: number; valorSessao: number | null; total: number };

export function valorDaSessaoValido(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= SESSAO_MINIMA && valor <= SESSAO_MAXIMA;
}

export function montarCompra(plano: PlanoFamilia, valorPrograma: number, valorSessao: number | null): Compra {
  const sessao = plano === "acompanhamento" ? valorSessao : null;
  return { plano, valorPrograma, valorSessao: sessao, total: valorPrograma + (sessao ?? 0) };
}

// O que a tela mandou, conferido. Valores em reais inteiros.
export function validarCompra(entrada: unknown): Compra | null {
  if (!entrada || typeof entrada !== "object") return null;
  const { plano, valor, valorSessao } = entrada as Record<string, unknown>;
  if (plano === "programa") {
    if (!(VALORES_PROGRAMA as readonly unknown[]).includes(valor)) return null;
    return montarCompra("programa", valor as number, null);
  }
  if (plano === "acompanhamento") {
    if (!valorDaSessaoValido(valorSessao)) return null;
    return montarCompra("acompanhamento", VALOR_PROGRAMA_COM_ACOMPANHAMENTO, valorSessao);
  }
  return null;
}

// Liberação semanal (briefing 01: a compra não pula a semana). O módulo 2 chega 7 dias depois da
// conclusão do módulo 1, e cada módulo seguinte, 7 dias depois do anterior. Sem o módulo 1 concluído,
// ainda não há data.
const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;

export function dataDoModulo(numero: number, modulo1ConcluidoEm: string | null): Date | null {
  if (numero <= 1) return new Date(0);
  if (!modulo1ConcluidoEm) return null;
  const base = new Date(modulo1ConcluidoEm).getTime();
  if (!Number.isFinite(base)) return null;
  return new Date(base + (numero - 1) * SEMANA_MS);
}

export function moduloChegou(numero: number, modulo1ConcluidoEm: string | null, agora = Date.now()) {
  const data = dataDoModulo(numero, modulo1ConcluidoEm);
  return data !== null && data.getTime() <= agora;
}

const DIA_MS = 24 * 60 * 60 * 1000;

// Ainda dentro do prazo pra pedir o dinheiro de volta.
export function podeDesistir(acessoLiberadoEm: string | null, agora = Date.now()) {
  if (!acessoLiberadoEm) return false;
  const liberado = new Date(acessoLiberadoEm).getTime();
  return Number.isFinite(liberado) && agora - liberado <= DIAS_PARA_DESISTIR * DIA_MS;
}

// Último dia do prazo, por extenso curto, no horário de Brasília: "25 de novembro".
export function fimDoPrazo(acessoLiberadoEm: string) {
  const fim = new Date(new Date(acessoLiberadoEm).getTime() + DIAS_PARA_DESISTIR * DIA_MS);
  return fim.toLocaleDateString("pt-BR", { day: "numeric", month: "long", timeZone: "America/Sao_Paulo" });
}
