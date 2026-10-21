import { NextResponse } from "next/server";
import { validarCadastro } from "@/lib/apoio/cadastro";
import { gravarCadastro } from "@/lib/apoio/registro";
import { CONTATOS } from "@/lib/contatos";

// Cadastro de "Quero fazer parte": grava o profissional como em_analise, com o plano escolhido. Nada é
// publicado nem cobrado aqui; o Vitor aprova na mão e manda o link de pagamento quando abrir vaga.
// Campos e listas em docs/apoio-telas.md (tela 3c). Nada aqui lê ou recebe o id de sessão da conversa.

const SEM_CACHE = { "Cache-Control": "no-store" };

const WHATSAPP_DA_MARGEM = CONTATOS.find((contato) => contato.tipo === "whatsapp")?.href ?? null;

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido_invalido" }, { status: 400, headers: SEM_CACHE });
  }

  const validacao = validarCadastro(corpo);
  if (!validacao.ok) return NextResponse.json({ error: validacao.motivo }, { status: 400, headers: SEM_CACHE });

  const gravado = WHATSAPP_DA_MARGEM ? await gravarCadastro(validacao.cadastro, WHATSAPP_DA_MARGEM) : false;
  if (!gravado) return NextResponse.json({ error: "cadastro_indisponivel" }, { status: 503, headers: SEM_CACHE });

  return NextResponse.json({ ok: true }, { headers: SEM_CACHE });
}
