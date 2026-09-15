import { NextResponse } from "next/server";
import { getCachedResponse, setCachedResponse } from "@/lib/cache";
import { gerarOrientacao } from "@/lib/gemini";
import { normalizarTexto } from "@/lib/normalizar";
import { detectarRisco } from "@/lib/risco";
import { registrarInteracao } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const texto = typeof body.texto === "string" ? body.texto.trim() : "";
    if (!texto) return NextResponse.json({ error: "Texto obrigatório" }, { status: 400 });

    const chave = normalizarTexto(texto);
    const risco = detectarRisco(texto);
    const cached = getCachedResponse(`v2:${chave}`);
    const orientation = cached ?? await gerarOrientacao(texto);
    if (!cached) setCachedResponse(`v2:${chave}`, orientation);
    await registrarInteracao({ texto, foiCacheHit: Boolean(cached) });

    return NextResponse.json({ ...orientation, risco, foi_cache_hit: Boolean(cached) });
  } catch {
    return NextResponse.json({ error: "Não foi possível preparar a orientação." }, { status: 500 });
  }
}
