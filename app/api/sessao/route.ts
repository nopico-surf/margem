import { NextResponse } from "next/server";
import { registrarConsentimento } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const sessaoId = typeof body.sessaoId === "string" ? body.sessaoId : "";
  if (!sessaoId) return NextResponse.json({ error: "sessaoId obrigatório" }, { status: 400 });
  try {
    await registrarConsentimento(sessaoId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[sessao] registrarConsentimento falhou:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Não foi possível registrar o consentimento." }, { status: 500 });
  }
}
