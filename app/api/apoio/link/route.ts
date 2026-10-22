import { NextResponse } from "next/server";
import { PLANOS_BASE, PLANOS_OPCIONAIS } from "@/lib/apoio/planos";
import { buscarProfissionalPorToken, temPlanoAtivo } from "@/lib/apoio/registro";

// Dados do link pessoal de pagamento, pra tela do profissional: nome, profissão, plano base e opcional
// escolhidos no cadastro, o catálogo (preço em centavos e vagas) e o e-mail do cadastro (que preenche o
// campo da nota fiscal).
//
// POST com o token no corpo, e não na URL, pra ele não ficar no log de acesso da rota. Quem tem o link
// vê o próprio e-mail; o link só existe no WhatsApp do profissional.

const SEM_CACHE = { "Cache-Control": "no-store" };
const TOKEN = /^[0-9a-f]{64}$/;

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

  const ativo = profissional.situacao === "ja_ativo" || (await temPlanoAtivo(profissional.id));
  if (ativo) return NextResponse.json({ error: "plano_ja_ativo" }, { status: 409, headers: SEM_CACHE });

  return NextResponse.json(
    {
      nome: profissional.nome,
      profissao: profissional.profissao,
      planoBaseEscolhido: profissional.plano_base_escolhido,
      opcionalEscolhido: profissional.opcional_escolhido,
      planosBase: PLANOS_BASE,
      planosOpcionais: PLANOS_OPCIONAIS,
      email: profissional.email,
    },
    { headers: SEM_CACHE },
  );
}
