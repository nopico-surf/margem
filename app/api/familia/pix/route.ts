import { NextResponse } from "next/server";
import { DESCRICAO_FAMILIA, buscarOuCriarCliente, criarCobrancaPix, type ResultadoAsaas } from "@/lib/asaas";
import { normalizarCpfCnpj } from "@/lib/apoio/documento";
import { atualizarApoio, criarApoio } from "@/lib/apoio/registro";
import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { cancelarPixPendentesDaFamilia } from "@/lib/familia/compra-servidor";
import { buscarPerfil } from "@/lib/familia/dados";
import { validarCompra } from "@/lib/familia/oferta";

// Gera o Pix da compra do programa para familiares (briefing 01). É a cobrança avulsa da doação única
// do /plano (app/api/apoio/pix), com três diferenças: só pra quem está logado, o valor é conferido
// contra lib/familia/oferta.ts e a descrição no extrato é só "Margem". Os códigos de erro são os da
// rota do /plano, pra tela reaproveitar as mesmas mensagens.
//
// Nome e CPF só atravessam esta rota a caminho do Asaas: não são gravados, não vão pra log e não
// voltam na resposta. O e-mail da conta vai pro Asaas pra pessoa receber o recibo.

const SEM_CACHE = { "Cache-Control": "no-store" };

function erro(codigo: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: codigo, ...extra }, { status, headers: SEM_CACHE });
}

function erroDoAsaas(resultado: Extract<ResultadoAsaas<unknown>, { ok: false }>) {
  if (resultado.status === 400) return erro("dados_recusados", 422, { codigos: resultado.codigos ?? [] });
  return erro("pagamento_indisponivel", 503, { motivo: resultado.motivo });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { user, supabase } = sessao;

  const corpo = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const compra = validarCompra(corpo);
  if (!corpo || !compra) return erro("valor_invalido", 400);

  const perfil = await buscarPerfil(supabase, user.id);
  if (!perfil) return erro("sem_perfil", 409);
  if (perfil.acesso_liberado_em) return erro("acesso_ja_liberado", 409);

  const nome = typeof corpo.nome === "string" ? corpo.nome.trim().replace(/\s+/g, " ") : "";
  if (!nome || nome.length > 100) return erro("nome_invalido", 400);
  const cpfCnpj = normalizarCpfCnpj(corpo.cpfCnpj);
  if (!cpfCnpj) return erro("cpf_cnpj_invalido", 400);

  if (!(await cancelarPixPendentesDaFamilia(user.id))) return erro("pagamento_indisponivel", 503, { motivo: "pix_anterior" });

  const apoioId = await criarApoio({
    publico: "familia",
    frequencia: "unico",
    valor: compra.total,
    familiaUserId: user.id,
    familiaPlano: compra.plano,
    valorSessao: compra.valorSessao,
  });
  if (!apoioId) return erro("pagamento_indisponivel", 503, { motivo: "banco" });

  const cliente = await buscarOuCriarCliente(nome, cpfCnpj, user.email ?? perfil.email ?? undefined);
  if (!cliente.ok) {
    await atualizarApoio(apoioId, { status: "falhou" });
    return erroDoAsaas(cliente);
  }

  const cobranca = await criarCobrancaPix({ clienteId: cliente.dados.id, valor: compra.total, descricao: DESCRICAO_FAMILIA, referencia: apoioId });
  if (!cobranca.ok) {
    await atualizarApoio(apoioId, { status: "falhou", asaas_cliente_id: cliente.dados.id });
    return erroDoAsaas(cobranca);
  }
  await atualizarApoio(apoioId, { asaas_cliente_id: cliente.dados.id, asaas_cobranca_id: cobranca.dados.cobrancaId });
  return NextResponse.json({ apoioId, qrCode: cobranca.dados.qrCode }, { headers: SEM_CACHE });
}
