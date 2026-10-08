import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// "/" sempre leva pra /inicio, a entrada da Margem desde 07/10/2026 (juntou a /bem-vindo e a
// /inicio). Redirecionar no servidor evita tela vazia e piscar. A query (UTMs) segue junto: o
// Mixpanel lê da URL de destino.
export function proxy(request: NextRequest) {
  const destino = request.nextUrl.clone();
  destino.pathname = "/inicio";
  return NextResponse.redirect(destino);
}

export const config = {
  matcher: ["/"],
};
