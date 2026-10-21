// Cliente da API do Asaas. Só roda no servidor: a chave nunca chega ao navegador.
//
// O ambiente sai do prefixo da própria chave ($aact_prod_ é produção, $aact_hmlg_ é sandbox), assim não
// existe como apontar uma chave de teste pra produção ou o contrário.
//
// Nome, CPF e e-mail (só de profissional) de quem apoia passam por aqui só pra criar o cliente no Asaas. Não são gravados no nosso
// banco nem escritos em log: os erros registram status HTTP e código do Asaas, nunca o corpo enviado.

export type MotivoFalhaAsaas = "sem_chave" | "tempo_esgotado" | "erro_asaas" | "resposta_invalida" | "erro_inesperado";

export type ResultadoAsaas<T> =
  | { ok: true; dados: T }
  | { ok: false; motivo: MotivoFalhaAsaas; status?: number; codigos?: string[] };

export type QrCodePix = { payload: string; imagemBase64: string; expiraEm: string | null };

const TIMEOUT_MS = 15000;

// Tempo pra pagar o QR code da primeira cobrança do Pix Automático.
const EXPIRACAO_QR_SEGUNDOS = 30 * 60;

// Texto que aparece no app do banco de quem paga (máximo 35 caracteres no Pix Automático).
export const DESCRICAO_SERVICO = "Taxa de manutenção de software";
export const DESCRICAO_DOACAO = "Doação à Margem";

function urlBase(chave: string) {
  if (chave.startsWith("$aact_prod_")) return "https://api.asaas.com/v3";
  if (chave.startsWith("$aact_hmlg_")) return "https://api-sandbox.asaas.com/v3";
  return null;
}

// Data de hoje no fuso de Brasília, no formato AAAA-MM-DD que o Asaas espera.
export function hojeEmBrasilia(agora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(agora);
}

// Mesmo dia no mês seguinte; quando o mês seguinte é mais curto, o último dia dele (31/01 vira 28/02).
export function mesSeguinte(data: string) {
  const [ano, mes, dia] = data.split("-").map(Number);
  const ultimoDia = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();
  const proxima = new Date(Date.UTC(ano, mes, Math.min(dia, ultimoDia)));
  return proxima.toISOString().slice(0, 10);
}

async function chamar<T>(metodo: "GET" | "POST" | "PUT" | "DELETE", caminho: string, corpo?: unknown): Promise<ResultadoAsaas<T>> {
  const chave = process.env.ASAAS_API_KEY;
  const base = chave ? urlBase(chave) : null;
  if (!chave || !base) return { ok: false, motivo: "sem_chave" };

  try {
    const resposta = await fetch(`${base}${caminho}`, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Margem",
        access_token: chave,
      },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    const json = (await resposta.json().catch(() => null)) as Record<string, unknown> | null;
    if (!resposta.ok) {
      const erros = Array.isArray(json?.errors) ? (json.errors as Array<{ code?: unknown }>) : [];
      const codigos = erros.map((erro) => String(erro.code ?? "")).filter(Boolean);
      // Só o nome do recurso ("customers", "payments"): a busca de cliente leva o CPF depois do "?".
      const recurso = caminho.split("?")[0].split("/")[1];
      console.error(`[asaas] ${metodo} ${recurso} falhou: http ${resposta.status}`, codigos.join(","));
      return { ok: false, motivo: "erro_asaas", status: resposta.status, codigos };
    }
    if (!json) return { ok: false, motivo: "resposta_invalida", status: resposta.status };
    return { ok: true, dados: json as T };
  } catch (erro) {
    if (erro instanceof Error && erro.name === "TimeoutError") return { ok: false, motivo: "tempo_esgotado" };
    console.error("[asaas] erro inesperado:", erro instanceof Error ? erro.name : "desconhecido");
    return { ok: false, motivo: "erro_inesperado" };
  }
}

// Um cliente por pessoa no Asaas: procura pelo CPF/CNPJ antes de criar. A busca leva o CPF na URL, mas
// é uma chamada do servidor direto pro Asaas, que já guarda esse CPF; o log acima corta tudo depois do "?".
// Dois cliques quase simultâneos da mesma pessoa ainda podem criar dois clientes.
//
// email só vem de profissional: é pra onde o Asaas manda a nota fiscal. Num cliente que já existe, o
// e-mail só é preenchido se estiver vazio, nunca trocado: senão quem digitasse o CPF de outra pessoa
// passaria a receber as notas e avisos dela.
export async function buscarOuCriarCliente(nome: string, cpfCnpj: string, email?: string): Promise<ResultadoAsaas<{ id: string }>> {
  const busca = await chamar<{ data?: unknown }>("GET", `/customers?cpfCnpj=${encodeURIComponent(cpfCnpj)}&limit=1`);
  if (!busca.ok) return busca;
  if (!Array.isArray(busca.dados.data)) return { ok: false, motivo: "resposta_invalida" };
  const existente = busca.dados.data[0] as { id?: unknown; email?: unknown } | undefined;
  if (typeof existente?.id === "string") {
    if (email && !existente.email) {
      const atualizacao = await chamar("PUT", `/customers/${encodeURIComponent(existente.id)}`, { email });
      if (!atualizacao.ok) return atualizacao;
    }
    return { ok: true, dados: { id: existente.id } };
  }

  const resultado = await chamar<{ id?: unknown }>("POST", "/customers", { name: nome, cpfCnpj, ...(email ? { email } : {}) });
  if (!resultado.ok) return resultado;
  if (typeof resultado.dados.id !== "string") return { ok: false, motivo: "resposta_invalida" };
  return { ok: true, dados: { id: resultado.dados.id } };
}

function lerQrCode(dados: { payload?: unknown; encodedImage?: unknown }, expiraEm: unknown): QrCodePix | null {
  if (typeof dados.payload !== "string" || typeof dados.encodedImage !== "string") return null;
  return { payload: dados.payload, imagemBase64: dados.encodedImage, expiraEm: typeof expiraEm === "string" ? expiraEm : null };
}

// Doação única: cobrança Pix avulsa, vencendo hoje. referencia é o id do apoio no nosso banco.
export async function criarCobrancaPix(params: {
  clienteId: string;
  valor: number;
  descricao: string;
  referencia: string;
}): Promise<ResultadoAsaas<{ cobrancaId: string; qrCode: QrCodePix }>> {
  const cobranca = await chamar<{ id?: unknown }>("POST", "/payments", {
    customer: params.clienteId,
    billingType: "PIX",
    value: params.valor,
    dueDate: hojeEmBrasilia(),
    description: params.descricao,
    externalReference: params.referencia,
  });
  if (!cobranca.ok) return cobranca;
  const cobrancaId = cobranca.dados.id;
  if (typeof cobrancaId !== "string") return { ok: false, motivo: "resposta_invalida" };

  // Sem QR code a pessoa não vê o Pix, então a cobrança não pode ficar pendente no painel do Asaas.
  const qr = await chamar<{ payload?: unknown; encodedImage?: unknown; expirationDate?: unknown }>("GET", `/payments/${encodeURIComponent(cobrancaId)}/pixQrCode`);
  const qrCode = qr.ok ? lerQrCode(qr.dados, qr.dados.expirationDate) : null;
  if (!qrCode) {
    await chamar("DELETE", `/payments/${encodeURIComponent(cobrancaId)}`);
    return qr.ok ? { ok: false, motivo: "resposta_invalida" } : qr;
  }
  return { ok: true, dados: { cobrancaId, qrCode } };
}

// A autorização nasce sem assinatura (subscriptionId vem null na criação). O webhook pergunta de novo
// quando ela ativa: sem esse id, a cobrança de cada mês não é reconhecida como deste apoio.
export async function buscarAssinaturaDaAutorizacao(autorizacaoId: string): Promise<ResultadoAsaas<{ assinaturaId: string | null }>> {
  const resultado = await chamar<{ subscriptionId?: unknown }>("GET", `/pix/automatic/authorizations/${encodeURIComponent(autorizacaoId)}`);
  if (!resultado.ok) return resultado;
  const { subscriptionId } = resultado.dados;
  return { ok: true, dados: { assinaturaId: typeof subscriptionId === "string" && subscriptionId ? subscriptionId : null } };
}

// Encerra o Pix Automático: nenhum mês novo é cobrado. Usado quando um pagamento é estornado.
export async function cancelarAutorizacao(autorizacaoId: string): Promise<ResultadoAsaas<unknown>> {
  return chamar("DELETE", `/pix/automatic/authorizations/${encodeURIComponent(autorizacaoId)}`);
}

// Apoio mensal: autorização de Pix Automático. O QR code paga o primeiro mês e autoriza os seguintes;
// a partir daí o Asaas gera as cobranças sozinho (modo SUBSCRIPTION). contrato é o id do apoio sem
// hífens (32 caracteres, o limite do Asaas é 35).
//
// startDate fica no mês seguinte porque o primeiro mês já é pago pelo QR code. A confirmar no sandbox
// antes de produção: que isso não gera cobrança dupla nem atrasa o primeiro mês.
export async function criarAutorizacaoPixAutomatico(params: {
  clienteId: string;
  valor: number;
  descricao: string;
  contrato: string;
}): Promise<ResultadoAsaas<{ autorizacaoId: string; assinaturaId: string | null; qrCode: QrCodePix }>> {
  const resultado = await chamar<{
    id?: unknown;
    subscriptionId?: unknown;
    payload?: unknown;
    encodedImage?: unknown;
    immediateQrCode?: { expirationDate?: unknown } | null;
  }>("POST", "/pix/automatic/authorizations", {
    customerId: params.clienteId,
    frequency: "MONTHLY",
    contractId: params.contrato,
    startDate: mesSeguinte(hojeEmBrasilia()),
    value: params.valor,
    description: params.descricao,
    paymentCreationMode: "SUBSCRIPTION",
    // Mês sem saldo: o Asaas tenta de novo até 3 vezes em 7 dias, os mesmos 7 dias de tolerância em
    // que o profissional continua no ar.
    retryPolicy: "ALLOW_THREE_IN_SEVEN_DAYS",
    immediateQrCode: {
      expirationSeconds: EXPIRACAO_QR_SEGUNDOS,
      originalValue: params.valor,
      description: params.descricao,
    },
  });
  if (!resultado.ok) return resultado;

  const { id, subscriptionId } = resultado.dados;
  const qrCode = lerQrCode(resultado.dados, resultado.dados.immediateQrCode?.expirationDate);
  if (typeof id !== "string" || !qrCode) return { ok: false, motivo: "resposta_invalida" };
  return { ok: true, dados: { autorizacaoId: id, assinaturaId: typeof subscriptionId === "string" ? subscriptionId : null, qrCode } };
}
