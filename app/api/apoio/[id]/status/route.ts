import { NextResponse } from "next/server";
import { buscarStatusApoio } from "@/lib/apoio/registro";

// A tela do QR code consulta aqui até o pagamento cair. Devolve só o status e se o primeiro pagamento
// já caiu: nem valor, nem plano, nem nada do Asaas. O id é um UUID aleatório gerado pelo banco, que só
// quem criou o apoio conhece.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SEM_CACHE = { "Cache-Control": "no-store" };

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "nao_encontrado" }, { status: 404, headers: SEM_CACHE });

  const apoio = await buscarStatusApoio(id);
  if (!apoio) return NextResponse.json({ error: "nao_encontrado" }, { status: 404, headers: SEM_CACHE });
  return NextResponse.json(apoio, { headers: SEM_CACHE });
}
