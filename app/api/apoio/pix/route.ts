import { NextResponse } from "next/server";
import {
  DESCRICAO_DOACAO,
  DESCRICAO_SERVICO,
  buscarOuCriarCliente,
  cancelarAutorizacao,
  criarAutorizacaoPixAutomatico,
  criarCobrancaPix,
  hojeEmBrasilia,
  type ResultadoAsaas,
} from "@/lib/asaas";
import { encerrarAutorizacoesEmVigor } from "@/lib/apoio/autorizacoes";
import { normalizarCpfCnpj } from "@/lib/apoio/documento";
import {
  centavosDoPlano,
  ehPlanoBase,
  ehPlanoOpcional,
  ehServico,
  pedidoDoProfissional,
  validarDoacao,
  type PedidoApoio,
  type PlanoBase,
  type PlanoOpcional,
} from "@/lib/apoio/planos";
import {
  STATUS_QUE_PODEM_BRONZE,
  ativarBronze,
  atualizarApoio,
  atualizarApoioSeStatus,
  buscarPixPendentesDoProfissional,
  buscarPlanoAtual,
  buscarProfissionalPorToken,
  criarApoio,
  escolherPlano,
  temPlanoAtivo,
  type ProfissionalDoLink,
} from "@/lib/apoio/registro";

// Gera o Pix de um apoio: cobrança avulsa pra doação única, autorização de Pix Automático pra mensal.
//
// Dois caminhos (ver docs/apoio-telas.md):
// - doação de qualquer pessoa: frequencia e valor vêm da tela e são conferidos contra o catálogo;
// - profissional: só pelo link pessoal (token). O cadastro sai do banco; da tela vêm só o plano base e
//   o opcional (os escolhidos no cadastro valem quando a tela não manda), e o valor é o do catálogo.
// - troca de plano de quem já pagou (troca: true): upgrade cobra hoje só a diferença, num QR que já
//   autoriza o mensal novo a partir do próximo vencimento; downgrade não cobra nada, encerra o Pix
//   Automático atual e deixa o plano menor escolhido para o link cobrar no vencimento.
// - Bronze sem opcional não tem Pix: o perfil entra no ar como gratuito (resposta com gratuito: true).
//
// Nome, CPF/CNPJ e e-mail só atravessam esta rota a caminho do Asaas: não são gravados, não vão pra log
// e não voltam na resposta. Nada aqui lê ou recebe o id de sessão da conversa.

const SEM_CACHE = { "Cache-Control": "no-store" };

// Só pra barrar o óbvio (sem @, sem domínio, com espaço); quem confirma que o e-mail existe é a nota chegando.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Código do link pessoal: o longo (token_apoio, 64 hex) ou o curto (codigo_link, nome-sobrenome-4
// caracteres do alfabeto sem 0, o, 1 e l; migração 0031).
const TOKEN = /^(?:[0-9a-f]{64}|[a-z]+(?:-[a-z]+)?-[a-km-np-z2-9]{4})$/;

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

type Troca = { inicio: string; comecaEm: string; valorHojeCentavos: number; valorMensalCentavos: number };
type Downgrade = { profissionalId: string; base: PlanoBase; opcional: PlanoOpcional | null; valorMensalCentavos: number; comecaEm: string };

// Troca de plano: só para quem tem mês pago valendo. O valor de hoje é a diferença cheia entre o mensal
// novo e o atual (sem proporcional ao dia), e o mês não reinicia: o mensal novo começa em pago_ate.
async function pedidoDeTroca(
  corpo: Record<string, unknown>,
  profissional: ProfissionalDoLink,
): Promise<{ pedido: PedidoApoio; troca: Troca } | { downgrade: Downgrade } | { resposta: NextResponse }> {
  if (!profissional.pago_ate || new Date(profissional.pago_ate).getTime() <= Date.now()) {
    return { resposta: erro("troca_indisponivel", 409) };
  }
  const atual = await buscarPlanoAtual(profissional.id);
  if (!atual) return { resposta: erro("troca_indisponivel", 409) };

  const base = corpo.planoBase;
  const opcional = corpo.opcional ?? null;
  if (!ehPlanoBase(base) || (opcional !== null && !ehPlanoOpcional(opcional))) return { resposta: erro("plano_invalido", 400) };
  // Ir para o Bronze é downgrade que passa pela aprovação do Vitor (vagas em uso): não sai pela troca.
  if (base === "bronze") return { resposta: erro("plano_invalido", 400) };

  const atualCentavos = centavosDoPlano(profissional.profissao, atual.planoBase, atual.planoOpcional);
  const novoCentavos = centavosDoPlano(profissional.profissao, base, opcional);
  const comecaEm = profissional.pago_ate;
  if (novoCentavos === atualCentavos) {
    // Voltar ao plano atual depois de um downgrade agendado desfaz o agendamento (nada é cobrado hoje;
    // o plano atual é pago pelo link no vencimento). Sem agendamento, é o mesmo plano.
    const agendado = profissional.plano_base_escolhido !== atual.planoBase || profissional.opcional_escolhido !== atual.planoOpcional;
    if (!agendado) return { resposta: erro("mesmo_plano", 400) };
    return { downgrade: { profissionalId: profissional.id, base, opcional, valorMensalCentavos: novoCentavos, comecaEm } };
  }

  if (novoCentavos < atualCentavos) {
    return { downgrade: { profissionalId: profissional.id, base, opcional, valorMensalCentavos: novoCentavos, comecaEm } };
  }

  // O mensal novo começa no dia do vencimento (em Brasília), e nunca antes de amanhã.
  const vencimento = hojeEmBrasilia(new Date(comecaEm));
  const amanha = hojeEmBrasilia(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const inicio = vencimento > amanha ? vencimento : amanha;
  const diferenca = novoCentavos - atualCentavos;
  return {
    pedido: { ...pedidoDoProfissional(profissional.profissao, base, opcional, profissional.id), troca: true, valorImediato: diferenca / 100 },
    troca: { inicio, comecaEm, valorHojeCentavos: diferenca, valorMensalCentavos: novoCentavos },
  };
}

// Monta o pedido do profissional a partir do link. Devolve a resposta de erro quando não dá.
async function pedidoPeloLink(
  corpo: Record<string, unknown>,
): Promise<{ pedido: PedidoApoio; troca?: Troca } | { downgrade: Downgrade } | { resposta: NextResponse }> {
  const token = typeof corpo.token === "string" ? corpo.token : "";
  if (!TOKEN.test(token)) return { resposta: erro("link_invalido", 404) };

  const profissional = await buscarProfissionalPorToken(token);
  if (!profissional) return { resposta: erro("link_invalido", 404) };
  if (corpo.troca === true) return pedidoDeTroca(corpo, profissional);
  if (profissional.situacao === "ja_ativo") return { resposta: erro("plano_ja_ativo", 409) };

  const base = corpo.planoBase === undefined ? profissional.plano_base_escolhido : corpo.planoBase;
  if (!ehPlanoBase(base)) return { resposta: erro("plano_invalido", 400) };
  // opcional ausente: o do cadastro; null: sem turbinar.
  const opcional = corpo.opcional === undefined ? profissional.opcional_escolhido : corpo.opcional;
  if (opcional !== null && !ehPlanoOpcional(opcional)) return { resposta: erro("plano_invalido", 400) };
  if (base === "bronze" && !STATUS_QUE_PODEM_BRONZE.includes(profissional.status)) return { resposta: erro("plano_invalido", 400) };

  const ativo = await temPlanoAtivo(profissional.id);
  if (ativo === null) return { resposta: erro("pagamento_indisponivel", 503, { motivo: "banco" }) };
  if (ativo) return { resposta: erro("plano_ja_ativo", 409) };

  return { pedido: pedidoDoProfissional(profissional.profissao, base, opcional, profissional.id) };
}

// Downgrade: nada é cobrado nem devolvido hoje. O Pix Automático atual é encerrado (senão continuaria
// cobrando o plano maior) e o plano menor fica escolhido; o perfil segue no ar até o fim do mês pago, e
// faltando 7 dias para o vencimento o link volta a cobrar, já com o plano menor.
async function aplicarDowngrade(downgrade: Downgrade) {
  if (!(await cancelarPixPendentes(downgrade.profissionalId)) || !(await encerrarAutorizacoesEmVigor(downgrade.profissionalId))) {
    return erro("pagamento_indisponivel", 503, { motivo: "autorizacao_atual" });
  }
  if (!(await escolherPlano(downgrade.profissionalId, downgrade.base, downgrade.opcional))) {
    return erro("pagamento_indisponivel", 503, { motivo: "banco" });
  }
  return NextResponse.json(
    { apoioId: null, qrCode: null, valorHojeCentavos: 0, valorMensalCentavos: downgrade.valorMensalCentavos, comecaEm: downgrade.comecaEm },
    { headers: SEM_CACHE },
  );
}

// Bronze sem opcional: nada a cobrar (e o Asaas recusa abaixo de R$ 5). Os Pix antigos ainda não pagos
// são cancelados, pra nenhum QR velho continuar valendo, e o perfil entra no ar como gratuito. Não pede
// nome nem documento.
async function ativarSemPix(profissionalId: string) {
  if (!(await cancelarPixPendentes(profissionalId))) return erro("pagamento_indisponivel", 503, { motivo: "pix_anterior" });
  if (!(await ativarBronze(profissionalId))) return erro("pagamento_indisponivel", 503, { motivo: "banco" });
  return NextResponse.json({ apoioId: null, qrCode: null, gratuito: true }, { headers: SEM_CACHE });
}

// Cancela no Asaas os Pix do profissional que ainda não foram pagos, pra só o novo valer. Erro 4xx do
// Asaas é autorização que já não vale (expirou ou foi recusada); falha de rede ou do Asaas impede gerar o
// Pix novo, porque deixaria dois QR pagáveis.
async function cancelarPixPendentes(profissionalId: string) {
  const pendentes = await buscarPixPendentesDoProfissional(profissionalId);
  if (pendentes === null) return false;
  for (const pendente of pendentes) {
    if (pendente.asaas_autorizacao_id) {
      const cancelamento = await cancelarAutorizacao(pendente.asaas_autorizacao_id);
      if (!cancelamento.ok && !(cancelamento.status && cancelamento.status < 500)) return false;
    }
    await atualizarApoioSeStatus(pendente.id, "aguardando", { status: "cancelado" });
  }
  return true;
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

  // Com token é profissional; sem token é doação, mesmo que a tela mande outro público. O downgrade não
  // cobra nada, então não pede nome nem documento.
  let pedido: PedidoApoio;
  let troca: Troca | undefined;
  if (corpo.token !== undefined) {
    const resultado = await pedidoPeloLink(corpo);
    if ("resposta" in resultado) return resultado.resposta;
    if ("downgrade" in resultado) return aplicarDowngrade(resultado.downgrade);
    if (resultado.pedido.valor === 0 && resultado.pedido.profissionalId) return ativarSemPix(resultado.pedido.profissionalId);
    pedido = resultado.pedido;
    troca = resultado.troca;
  } else {
    const validacao = validarDoacao(corpo);
    if (!validacao.ok) return erro(validacao.motivo, 400);
    pedido = validacao.pedido;
  }

  const nome = typeof corpo.nome === "string" ? corpo.nome.trim().replace(/\s+/g, " ") : "";
  if (!nome || nome.length > 100) return erro("nome_invalido", 400);

  const cpfCnpj = normalizarCpfCnpj(corpo.cpfCnpj);
  if (!cpfCnpj) return erro("cpf_cnpj_invalido", 400);

  // Profissional informa e-mail pra receber a nota fiscal. Da doação (sem nota) o e-mail não é pedido
  // nem aceito.
  let email: string | undefined;
  if (ehServico(pedido.publico)) {
    email = typeof corpo.email === "string" ? corpo.email.trim().toLowerCase() : "";
    if (!email || email.length > 254 || !EMAIL.test(email)) return erro("email_invalido", 400);
  }

  if (pedido.profissionalId && !(await cancelarPixPendentes(pedido.profissionalId))) {
    return erro("pagamento_indisponivel", 503, { motivo: "pix_anterior" });
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
    ...(troca ? { valorImediato: pedido.valorImediato, inicio: troca.inicio } : {}),
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
  if (troca && pedido.profissionalId && pedido.planoBase) {
    // O próximo pagamento pelo link já sai com o plano novo marcado.
    await escolherPlano(pedido.profissionalId, pedido.planoBase, pedido.planoOpcional ?? null);
    return NextResponse.json(
      {
        apoioId,
        qrCode: autorizacao.dados.qrCode,
        valorHojeCentavos: troca.valorHojeCentavos,
        valorMensalCentavos: troca.valorMensalCentavos,
        comecaEm: troca.comecaEm,
      },
      { headers: SEM_CACHE },
    );
  }
  return NextResponse.json({ apoioId, qrCode: autorizacao.dados.qrCode }, { headers: SEM_CACHE });
}
