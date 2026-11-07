import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";

// Grava o que as pessoas buscam no blog, pra saber que texto falta escrever (tabela buscas_blog,
// migração 0037). Anônimo: só termo, quantos textos apareceram e quando, sem sessão e sem IP. Vale
// pra todo mundo, sem depender do aceite (decidido em 07/11/2026).
//
// Termo com e-mail ou com 8 números ou mais (telefone, CPF) não é gravado: é dado de alguém, não
// assunto. A resposta é sempre 204, gravando ou não: quem busca não espera por isso.

const EMAIL = /\S+@\S+/;
const MUITOS_NUMEROS = /(\d\D{0,2}){8,}/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const { termo, resultados } = (body ?? {}) as { termo?: unknown; resultados?: unknown };
  if (typeof termo !== "string" || typeof resultados !== "number" || !Number.isInteger(resultados) || resultados < 0) {
    return new NextResponse(null, { status: 400 });
  }

  const limpo = termo.replace(/\s+/g, " ").trim().toLowerCase().slice(0, 100);
  if (limpo.length < 2 || EMAIL.test(limpo) || MUITOS_NUMEROS.test(limpo)) return new NextResponse(null, { status: 204 });

  const supabase = getServerClient();
  if (!supabase) return new NextResponse(null, { status: 204 });

  const { error } = await supabase.from("buscas_blog").insert({ termo: limpo, resultados });
  if (error) console.error("[blog/busca] gravar busca falhou:", error.message);
  return new NextResponse(null, { status: 204 });
}
