import { NextResponse } from "next/server";
import { catalogoDaProfissao } from "@/lib/apoio/planos";
import { buscarPlanoAtual, buscarProfissionalPorToken, temPlanoAtivo } from "@/lib/apoio/registro";

// Dados do link pessoal de pagamento, pra tela do profissional: nome, profissão, plano base e opcional
// escolhidos no cadastro, o catálogo da profissão dele (preço em centavos e vagas) e o e-mail do cadastro (que preenche o
// campo da nota fiscal).
//
// POST com o token no corpo, e não na URL, pra ele não ficar no log de acesso da rota. Quem tem o link
// vê o próprio e-mail; o link só existe no WhatsApp do profissional.

const SEM_CACHE = { "Cache-Control": "no-store" };
// Código do link pessoal: o longo (token_apoio, 64 hex) ou o curto (codigo_link, nome-sobrenome-4
// caracteres do alfabeto sem 0, o, 1 e l; migração 0031).
const TOKEN = /^(?:[0-9a-f]{64}|[a-z]+(?:-[a-z]+)?-[a-km-np-z2-9]{4})$/;

export async function POST(request: Request) {
  let token = "";
  try {
    const corpo = (await request.json()) as { token?: unknown } | null;
    token = typeof corpo?.token === "string" ? corpo.token : "";
  } catch {
    // corpo inválido cai no link_invalido abaixo
  }
  if (!TOKEN.test(token)) return NextResponse.json({ error: "link_invalido" }, { status: 404, headers: SEM_CACHE });

  const profissional = await buscarProfissionalPorToken(token);
  if (!profissional) return NextResponse.json({ error: "link_invalido" }, { status: 404, headers: SEM_CACHE });

  // Quem já pagou (mês pago longe do fim, ou Pix Automático em vigor) não paga de novo: recebe o plano
  // atual e o próximo vencimento, e pode trocar de plano (situacao "pode_trocar"). Sem plano pago
  // identificável, não há troca possível: plano_ja_ativo.
  let troca: { planoAtual: { planoBase: string; opcional: string | null }; proximoVencimento: string } | null = null;
  const ativo = profissional.situacao === "ja_ativo" || (await temPlanoAtivo(profissional.id));
  if (ativo) {
    const atual = await buscarPlanoAtual(profissional.id);
    const vencimento = profissional.pago_ate;
    if (!atual || !vencimento || new Date(vencimento).getTime() <= Date.now()) {
      return NextResponse.json({ error: "plano_ja_ativo" }, { status: 409, headers: SEM_CACHE });
    }
    troca = { planoAtual: { planoBase: atual.planoBase, opcional: atual.planoOpcional }, proximoVencimento: vencimento };
  }

  return NextResponse.json(
    {
      situacao: troca ? "pode_trocar" : "pode_pagar",
      ...(troca ?? {}),
      nome: profissional.nome,
      profissao: profissional.profissao,
      planoBaseEscolhido: profissional.plano_base_escolhido,
      opcionalEscolhido: profissional.opcional_escolhido,
      ...catalogoDaProfissao(profissional.profissao),
      email: profissional.email,
    },
    { headers: SEM_CACHE },
  );
}
