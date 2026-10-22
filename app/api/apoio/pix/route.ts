import { NextResponse } from "next/server";
import {
  DESCRICAO_DOACAO,
  DESCRICAO_SERVICO,
  buscarOuCriarCliente,
  criarAutorizacaoPixAutomatico,
  criarCobrancaPix,
  type ResultadoAsaas,
} from "@/lib/asaas";
import { normalizarCpfCnpj } from "@/lib/apoio/documento";
import { ehPlanoBase, ehPlanoOpcional, ehServico, pedidoDoProfissional, validarDoacao, type PedidoApoio } from "@/lib/apoio/planos";
import { atualizarApoio, buscarProfissionalPorToken, criarApoio, temPlanoAtivo } from "@/lib/apoio/registro";

// Gera o Pix de um apoio: cobrança avulsa pra doação única, autorização de Pix Automático pra mensal.
//
// Dois caminhos (ver docs/apoio-telas.md):
// - doação de qualquer pessoa: frequencia e valor vêm da tela e são conferidos contra o catálogo;
// - profissional: só pelo link pessoal (token). O cadastro sai do banco; da tela vêm só o plano base e
//   o opcional (os escolhidos no cadastro valem quando a tela não manda), e o valor é o do catálogo.
//
// Nome, CPF/CNPJ e e-mail só atravessam esta rota a caminho do Asaas: não são gravados, não vão pra log
// e não voltam na resposta. Nada aqui lê ou recebe o id de sessão da conversa.

const SEM_CACHE = { "Cache-Control": "no-store" };

// Só pra barrar o óbvio (sem @, sem domínio, com espaço); quem confirma que o e-mail existe é a nota chegando.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// O token do link é hex de 64 caracteres (migração 0027).
const TOKEN = /^[0-9a-f]{64}$/;

function erro(codigo: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: codigo, ...extra }, { status, headers: SEM_CACHE });
}

// 400 do Asaas é dado recusado (ex.: CPF que ele não aceita). O resto, inclusive 401 de chave errada
// e 429 de excesso de chamadas, é indisponibilidade: não é algo que a pessoa possa corrigir.
function erroDoAsaas(resultado: Extract<ResultadoAsaas<unknown>, { ok: false }>) {
  if (resultado.status === 400) {
    return erro("dados_recusados", 422, { codigos: resultado.codigos ?? [] });
  }
  return erro("pagamento_indisponivel", 503, { motivo: resultado.motivo });
}

// Monta o pedido do profissional a partir do link. Devolve a resposta de erro quando não dá.
async function pedidoPeloLink(corpo: Record<string, unknown>): Promise<{ pedido: PedidoApoio } | { resposta: NextResponse }> {
  const token = typeof corpo.token === "string" ? corpo.token : "";
  if (!TOKEN.test(token)) return { resposta: erro("link_invalido", 404) };

  const profissional = await buscarProfissionalPorToken(token);
  if (!profissional) return { resposta: erro("link_invalido", 404) };
  if (profissional.situacao === "ja_ativo") return { resposta: erro("plano_ja_ativo", 409) };

  const base = corpo.planoBase === undefined ? profissional.plano_base_escolhido : corpo.planoBase;
  if (!ehPlanoBase(base)) return { resposta: erro("plano_invalido", 400) };
  // opcional ausente: o do cadastro; null: sem turbinar.
  const opcional = corpo.opcional === undefined ? profissional.opcional_escolhido : corpo.opcional;
  if (opcional !== null && !ehPlanoOpcional(opcional)) return { resposta: erro("plano_invalido", 400) };

  const ativo = await temPlanoAtivo(profissional.id);
  if (ativo === null) return { resposta: erro("pagamento_indisponivel", 503, { motivo: "banco" }) };
  if (ativo) return { resposta: erro("plano_ja_ativo", 409) };

  return { pedido: pedidoDoProfissional(profissional.profissao, base, opcional, profissional.id) };
}

export async function POST(request: Request) {
  let corpo: Record<string, unknown>;
  try {
    const json = await request.json();
    if (!json || typeof json !== "object") return erro("pedido_invalido", 400);
    corpo = json as Record<string, unknown>;
  } catch {
    return erro("pedido_invalido", 400);
  }

  const nome = typeof corpo.nome === "string" ? corpo.nome.trim().replace(/\s+/g, " ") : "";
  if (!nome || nome.length > 100) return erro("nome_invalido", 400);

  const cpfCnpj = normalizarCpfCnpj(corpo.cpfCnpj);
  if (!cpfCnpj) return erro("cpf_cnpj_invalido", 400);

  // Com token é profissional; sem token é doação, mesmo que a tela mande outro público.
  let pedido: PedidoApoio;
  if (corpo.token !== undefined) {
    const resultado = await pedidoPeloLink(corpo);
    if ("resposta" in resultado) return resultado.resposta;
    pedido = resultado.pedido;
  } else {
    const validacao = validarDoacao(corpo);
    if (!validacao.ok) return erro(validacao.motivo, 400);
    pedido = validacao.pedido;
  }

  // Profissional informa e-mail pra receber a nota fiscal. Da doação (sem nota) o e-mail não é pedido
  // nem aceito.
  let email: string | undefined;
  if (ehServico(pedido.publico)) {
    email = typeof corpo.email === "string" ? corpo.email.trim().toLowerCase() : "";
    if (!email || email.length > 254 || !EMAIL.test(email)) return erro("email_invalido", 400);
  }

  const apoioId = await criarApoio(pedido);
  if (!apoioId) return erro("pagamento_indisponivel", 503, { motivo: "banco" });

  const cliente = await buscarOuCriarCliente(nome, cpfCnpj, email);
  if (!cliente.ok) {
    await atualizarApoio(apoioId, { status: "falhou" });
    return erroDoAsaas(cliente);
  }

  const descricao = ehServico(pedido.publico) ? DESCRICAO_SERVICO : DESCRICAO_DOACAO;

  if (pedido.frequencia === "unico") {
    const cobranca = await criarCobrancaPix({ clienteId: cliente.dados.id, valor: pedido.valor, descricao, referencia: apoioId });
    if (!cobranca.ok) {
      await atualizarApoio(apoioId, { status: "falhou", asaas_cliente_id: cliente.dados.id });
      return erroDoAsaas(cobranca);
    }
    await atualizarApoio(apoioId, { asaas_cliente_id: cliente.dados.id, asaas_cobranca_id: cobranca.dados.cobrancaId });
    return NextResponse.json({ apoioId, qrCode: cobranca.dados.qrCode }, { headers: SEM_CACHE });
  }

  const autorizacao = await criarAutorizacaoPixAutomatico({
    clienteId: cliente.dados.id,
    valor: pedido.valor,
    descricao,
    contrato: apoioId.replaceAll("-", ""),
  });
  if (!autorizacao.ok) {
    await atualizarApoio(apoioId, { status: "falhou", asaas_cliente_id: cliente.dados.id });
    return erroDoAsaas(autorizacao);
  }
  await atualizarApoio(apoioId, {
    asaas_cliente_id: cliente.dados.id,
    asaas_autorizacao_id: autorizacao.dados.autorizacaoId,
    asaas_assinatura_id: autorizacao.dados.assinaturaId,
  });
  return NextResponse.json({ apoioId, qrCode: autorizacao.dados.qrCode }, { headers: SEM_CACHE });
}
