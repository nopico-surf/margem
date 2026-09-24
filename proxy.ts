import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Decide no servidor para onde vai quem abre "/", pra tela nunca aparecer vazia nem piscar.
// O cookie é gravado junto com o localStorage no consentimento (app/protecao-de-dados/page.tsx).
// A query (UTMs) segue junto: o Mixpanel lê da URL de destino.
export function proxy(request: NextRequest) {
  const consentiu = request.cookies.get("margem-consentimento")?.value === "true";
  const destino = request.nextUrl.clone();
  destino.pathname = consentiu ? "/inicio" : "/bem-vindo";
  return NextResponse.redirect(destino);
}

export const config = {
  matcher: "/",
};
