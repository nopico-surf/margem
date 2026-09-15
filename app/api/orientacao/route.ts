import { NextResponse } from "next/server";
import { gerarOrientacao } from "@/lib/gemini";
import { normalizarTexto } from "@/lib/normalizar";
import { detectarRisco } from "@/lib/risco";
import { buscarRespostaPorChave, registrarInteracao, salvarRespostaGerada } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const texto = typeof body.texto === "string" ? body.texto.trim() : "";
    const sessaoId = typeof body.sessaoId === "string" ? body.sessaoId : "";
    if (!texto) return NextResponse.json({ error: "Texto obrigatório" }, { status: 400 });
    if (!sessaoId) return NextResponse.json({ error: "sessaoId obrigatório" }, { status: 400 });

    const chave = normalizarTexto(texto);
    const risco = detectarRisco(texto);
    const cached = await buscarRespostaPorChave(chave);
    const orientation = cached ?? (await gerarOrientacao(texto));
    const respostaId = cached ? cached.id : await salvarRespostaGerada(chave, orientation);
    if (sessaoId) await registrarInteracao({ sessaoId, texto, respostaId, foiCacheHit: Boolean(cached) });

    return NextResponse.json({ ...orientation, risco, foi_cache_hit: Boolean(cached) });
  } catch {
    return NextResponse.json({ error: "Não foi possível preparar a orientação." }, { status: 500 });
  }
}
