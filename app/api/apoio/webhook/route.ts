import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { encerrarAutorizacoesEmVigor } from "@/lib/apoio/autorizacoes";
import { buscarAssinaturaDaAutorizacao, cancelarAutorizacao, hojeEmBrasilia, mesSeguinte } from "@/lib/asaas";
import {
  atualizarApoioSeStatus,
  atualizarProfissionalSeStatus,
  buscarApoioMensalDoCliente,
  buscarApoioPor,
  estenderPagoAte,
  marcarPrimeiraAtivacao,
  registrarEvento,
  removerEvento,
  type ApoioEncontrado,
  type AtualizacaoApoio,
  type StatusApoio,
  type StatusProfissional,
} from "@/lib/apoio/registro";

// Recebe os avisos do Asaas e atualiza o status dos apoios e, quando o apoio é de um profissional, o
// status dele (que decide se o perfil aparece no site). O painel do Asaas continua sendo onde se
// acompanha quem pagou.
//
// O Asaas entrega cada evento "pelo menos uma vez": o id do evento é gravado antes de processar e um
// evento repetido é ignorado. Evento que não interessa também recebe 200, senão o Asaas pausa a fila
// depois de 15 falhas seguidas. O corpo do evento nunca vai pro log, só o tipo.

type Evento = {
  id?: unknown;
  event?: unknown;
  payment?: { id?: unknown; externalReference?: unknown; subscription?: unknown; customer?: unknown; value?: unknown } | null;
  authorization?: { id?: unknown; contractId?: unknown; subscriptionId?: unknown } | null;
  paymentInstruction?: { authorization?: { id?: unknown } | null } | null;
};

type Mudanca = { de: StatusApoio[]; campos: AtualizacaoApoio };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function texto(valor: unknown) {
  return typeof valor === "string" && valor ? valor : null;
}

// Compara pelo hash pra os dois lados terem o mesmo tamanho e a comparação levar o mesmo tempo
// acerte ou erre: assim não dá pra descobrir o token medindo quanto a resposta demora.
function tokenConfere(recebido: string | null, esperado: string) {
  if (!recebido) return false;
  const a = createHash("sha256").update(recebido).digest();
  const b = createHash("sha256").update(esperado).digest();
  return timingSafeEqual(a, b);
}

// O contractId da autorização é o id do apoio sem hífens (ver lib/asaas.ts).
function apoioIdDoContrato(contrato: string | null) {
  if (!contrato || !/^[0-9a-f]{32}$/i.test(contrato)) return null;
  return `${contrato.slice(0, 8)}-${contrato.slice(8, 12)}-${contrato.slice(12, 16)}-${contrato.slice(16, 20)}-${contrato.slice(20)}`;
}

async function encontrarApoio(evento: Evento): Promise<ApoioEncontrado | null> {
  const autorizacaoId = texto(evento.authorization?.id) ?? texto(evento.paymentInstruction?.authorization?.id);
  if (autorizacaoId) {
    const porAutorizacao = await buscarApoioPor("asaas_autorizacao_id", autorizacaoId);
    if (porAutorizacao) return porAutorizacao;
  }
  // O evento pode chegar antes de a rota do Pix gravar o id da autorização; o contrato resolve.
  const pelaReferencia = apoioIdDoContrato(texto(evento.authorization?.contractId));
  if (pelaReferencia) return buscarApoioPor("id", pelaReferencia);

  const pagamento = evento.payment;
  if (!pagamento) return null;
  const referencia = texto(pagamento.externalReference);
  if (referencia && UUID.test(referencia)) {
    const porReferencia = await buscarApoioPor("id", referencia);
    if (porReferencia) return porReferencia;
  }
  const assinatura = texto(pagamento.subscription);
  if (assinatura) {
    const porAssinatura = await buscarApoioPor("asaas_assinatura_id", assinatura);
    if (porAssinatura) return porAssinatura;
  }
  const cobranca = texto(pagamento.id);
  const porCobranca = cobranca ? await buscarApoioPor("asaas_cobranca_id", cobranca) : null;
  if (porCobranca) return porCobranca;

  // Pagamento sem nenhum id nosso (provavelmente o primeiro mês do Pix Automático, que o Asaas cria):
  // procura pelo cliente e pelo valor. O log diz só que referências o aviso trazia, sem dado pessoal,
  // pra o primeiro pagamento real mostrar se isto é necessário.
  const cliente = texto(pagamento.customer);
  const valor = typeof pagamento.value === "number" && Number.isFinite(pagamento.value) ? pagamento.value : null;
  const porCliente = cliente && valor !== null ? await buscarApoioMensalDoCliente(cliente, valor) : null;
  console.warn(
    `[asaas-webhook] ${evento.event} sem id nosso: ref=${referencia ? "sim" : "não"} assinatura=${assinatura ? "sim" : "não"} achado_pelo_cliente=${porCliente ? "sim" : "não"}`,
  );
  return porCliente;
}

// O que cada evento faz com o apoio, e a partir de quais status. Fora da lista, o evento só é registrado.
function mudancaPara(tipo: string, apoio: ApoioEncontrado, assinaturaId: string | null): Mudanca | null {
  const agora = new Date().toISOString();

  switch (tipo) {
    // A autorização só ativa depois que o primeiro mês (o QR code) foi pago.
    case "PIX_AUTOMATIC_RECURRING_AUTHORIZATION_ACTIVATED":
      return { de: ["aguardando"], campos: { status: "ativo", ultimo_pagamento_em: agora, ...(assinaturaId ? { asaas_assinatura_id: assinaturaId } : {}) } };
    case "PIX_AUTOMATIC_RECURRING_AUTHORIZATION_REFUSED":
      return { de: ["aguardando"], campos: { status: "recusado" } };
    case "PIX_AUTOMATIC_RECURRING_AUTHORIZATION_EXPIRED":
      return { de: ["aguardando", "ativo", "inadimplente"], campos: { status: "expirado" } };
    case "PIX_AUTOMATIC_RECURRING_AUTHORIZATION_CANCELLED":
      return { de: ["aguardando", "ativo", "inadimplente"], campos: { status: "cancelado" } };
    case "PIX_AUTOMATIC_RECURRING_PAYMENT_INSTRUCTION_REFUSED":
      return { de: ["ativo"], campos: { status: "inadimplente" } };
    // Pix avulso chega como RECEIVED; a cobrança automática do mês, como CONFIRMED.
    case "PAYMENT_RECEIVED":
    case "PAYMENT_CONFIRMED":
      if (apoio.frequencia === "unico") return { de: ["aguardando", "expirado"], campos: { status: "pago", ultimo_pagamento_em: agora } };
      if (apoio.status === "ativo" || apoio.status === "inadimplente") return { de: [apoio.status], campos: { status: "ativo", ultimo_pagamento_em: agora } };
      return { de: [apoio.status], campos: { ultimo_pagamento_em: agora } };
    // Doação única não paga no dia. Ainda pode ser paga depois, e aí volta pra "pago".
    case "PAYMENT_OVERDUE":
      return apoio.frequencia === "unico" ? { de: ["aguardando"], campos: { status: "expirado" } } : null;
    // Estorno feito no painel do Asaas (os 7 dias do profissional, por exemplo).
    // Parcial vale igual (decisão de 22/10/2026): o Asaas desconta a taxa, e o estorno de Pix pode chegar
    // como parcial mesmo quando a intenção era devolver tudo.
    case "PAYMENT_REFUNDED":
    case "PAYMENT_PARTIALLY_REFUNDED":
      // Inclui quem pagou o primeiro mês sem a autorização se completar (aguardando, recusado, expirado).
      return {
        de: ["pago", "ativo", "inadimplente", "cancelado", "aguardando", "recusado", "expirado"],
        campos: { status: "estornado", estornado_em: agora },
      };
    default:
      return null;
  }
}

// Até quando um pagamento confirmado hoje deixa o perfil no ar: o mesmo dia do mês seguinte, fim do dia
// em Brasília. O site soma mais 7 dias de tolerância (lib/supabase.ts).
function pagoAteDeUmPagamentoHoje() {
  return new Date(`${mesSeguinte(hojeEmBrasilia())}T23:59:59-03:00`).toISOString();
}

const PAGAMENTO_CONFIRMADO = ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"];

// O que cada aviso faz com o profissional que paga pelo apoio (decisões de 22/10/2026):
// - pagamento confirmado (o primeiro mês, autorizado ou não, e cada mês seguinte): perfil no ar, status
//   ativo e o mês pago estendido; ativado_em gravado no primeiro, pros 7 dias de estorno;
// - Pix Automático ativado: garante o perfil no ar, caso o primeiro pagamento não tenha sido reconhecido;
// - mês recusado: status inadimplente, só informativo (o Asaas tenta de novo; o perfil fica até o fim do
//   mês pago mais a tolerância);
// - autorização cancelada, expirada ou recusada: nada muda, o mês pago fica no ar inteiro;
// - estorno: sai do ar na hora.
// Troca de plano (apoio com troca): o pagamento da diferença não reinicia o mês (pago_ate fica como
// está), e quando a autorização nova ativa, a antiga é encerrada no Asaas.
// Os status de origem protegem o que o Vitor muda na mão (pausa, recusa, cancelamento).
async function sincronizarProfissional(profissionalId: string, tipo: string, novoStatus: StatusApoio | undefined, apoio: ApoioEncontrado) {
  const agora = new Date().toISOString();
  const podeAtivar: StatusProfissional[] = ["aguardando_pagamento", "gratuito", "inadimplente", "ativo"];

  if (apoio.troca && PAGAMENTO_CONFIRMADO.includes(tipo)) {
    return atualizarProfissionalSeStatus(profissionalId, podeAtivar, { status: "ativo", inadimplente_desde: null });
  }
  if (apoio.troca && tipo === "PIX_AUTOMATIC_RECURRING_AUTHORIZATION_ACTIVATED") {
    return encerrarAutorizacoesEmVigor(profissionalId, apoio.id);
  }
  if (PAGAMENTO_CONFIRMADO.includes(tipo)) {
    const ok = await atualizarProfissionalSeStatus(profissionalId, podeAtivar, { status: "ativo", inadimplente_desde: null });
    return ok && (await estenderPagoAte(profissionalId, pagoAteDeUmPagamentoHoje())) && (await marcarPrimeiraAtivacao(profissionalId, agora));
  }
  if (tipo === "PIX_AUTOMATIC_RECURRING_AUTHORIZATION_ACTIVATED") {
    // estenderPagoAte nunca encurta: se o pagamento já foi reconhecido, não muda nada.
    const ok = await atualizarProfissionalSeStatus(profissionalId, podeAtivar, { status: "ativo" });
    return ok && (await estenderPagoAte(profissionalId, pagoAteDeUmPagamentoHoje())) && (await marcarPrimeiraAtivacao(profissionalId, agora));
  }
  if (novoStatus === "inadimplente") {
    return atualizarProfissionalSeStatus(profissionalId, ["ativo"], { status: "inadimplente", inadimplente_desde: agora });
  }
  if (novoStatus === "estornado") {
    return atualizarProfissionalSeStatus(profissionalId, ["ativo", "inadimplente"], { status: "cancelado", cancelado_em: agora, pago_ate: null });
  }
  return true;
}

export async function POST(request: Request) {
  const esperado = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!esperado) {
    console.error("[asaas-webhook] ASAAS_WEBHOOK_TOKEN ausente");
    return NextResponse.json({ error: "indisponivel" }, { status: 503 });
  }
  if (!tokenConfere(request.headers.get("asaas-access-token"), esperado)) {
    return NextResponse.json({ error: "nao_autorizado" }, { status: 401 });
  }

  let evento: Evento;
  try {
    evento = (await request.json()) as Evento;
  } catch {
    return NextResponse.json({ error: "corpo_invalido" }, { status: 400 });
  }
  const eventoId = texto(evento?.id);
  const tipo = texto(evento?.event);
  if (!eventoId || !tipo) return NextResponse.json({ error: "corpo_invalido" }, { status: 400 });

  const apoio = await encontrarApoio(evento);
  const registro = await registrarEvento(eventoId, tipo, apoio?.id ?? null);
  if (registro === "repetido") return NextResponse.json({ ok: true });
  if (registro === "erro") return NextResponse.json({ error: "indisponivel" }, { status: 503 });

  if (!apoio) return NextResponse.json({ ok: true });

  // O aviso de ativação pode vir sem a assinatura; aí pergunta ao Asaas. Se o Asaas não responder, o
  // evento volta pra fila em vez de ativar o apoio sem a assinatura, que não daria pra recuperar depois.
  let assinaturaId = texto(evento.authorization?.subscriptionId);
  const autorizacaoId = texto(evento.authorization?.id);
  if (tipo === "PIX_AUTOMATIC_RECURRING_AUTHORIZATION_ACTIVATED" && !assinaturaId && autorizacaoId) {
    const consulta = await buscarAssinaturaDaAutorizacao(autorizacaoId);
    if (!consulta.ok) {
      await removerEvento(eventoId);
      return NextResponse.json({ error: "indisponivel" }, { status: 503 });
    }
    assinaturaId = consulta.dados.assinaturaId;
    if (!assinaturaId) console.error("[asaas-webhook] autorização ativada sem assinatura: as cobranças do mês não vão ser reconhecidas");
  }

  const mudanca = mudancaPara(tipo, apoio, assinaturaId);
  if (!mudanca || !mudanca.de.includes(apoio.status)) return NextResponse.json({ ok: true });

  // Estorno de mensalidade encerra o Pix Automático, senão o mês seguinte seria cobrado. Erro 4xx do
  // Asaas aqui é autorização que já estava cancelada (a pessoa cancelou no banco); só falha de rede ou
  // do Asaas devolve o evento pra fila.
  if (mudanca.campos.status === "estornado" && apoio.frequencia === "mensal" && apoio.asaas_autorizacao_id) {
    const cancelamento = await cancelarAutorizacao(apoio.asaas_autorizacao_id);
    if (!cancelamento.ok && !(cancelamento.status && cancelamento.status < 500)) {
      await removerEvento(eventoId);
      return NextResponse.json({ error: "indisponivel" }, { status: 503 });
    }
  }

  // O profissional muda antes do apoio: se o apoio falhar, o evento volta pra fila e o profissional
  // é atualizado de novo pro mesmo status, sem efeito. Na ordem inversa, o apoio já mudado faria o
  // evento reentregue ser ignorado e o profissional ficaria pra trás.
  if (apoio.profissional_id && !(await sincronizarProfissional(apoio.profissional_id, tipo, mudanca.campos.status, apoio))) {
    await removerEvento(eventoId);
    console.error(`[asaas-webhook] ${tipo}: profissional não atualizado, o Asaas vai reentregar`);
    return NextResponse.json({ error: "indisponivel" }, { status: 503 });
  }

  const atualizado = await atualizarApoioSeStatus(apoio.id, apoio.status, mudanca.campos);
  if (!atualizado) {
    await removerEvento(eventoId);
    console.error(`[asaas-webhook] ${tipo} não aplicado, o Asaas vai reentregar`);
    return NextResponse.json({ error: "indisponivel" }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
