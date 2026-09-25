import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_SESSAO } from "@/lib/sessao-client";

// Decide no servidor para onde vai quem abre "/", pra tela nunca aparecer vazia nem piscar.
// O cookie é gravado junto com o localStorage no consentimento (lib/consentimento.ts).
// A query (UTMs) segue junto: o Mixpanel lê da URL de destino.
function redirecionarDaRaiz(request: NextRequest) {
  const consentiu = request.cookies.get("margem-consentimento")?.value === "true";
  const destino = request.nextUrl.clone();
  destino.pathname = consentiu ? "/inicio" : "/bem-vindo";
  return NextResponse.redirect(destino);
}

// Teste A/B do botão da /bem-vindo: o servidor precisa de um id anônimo já na primeira requisição,
// então o cookie é criado aqui e também repassado à própria requisição (senão a página, nessa
// primeira carga, não o enxergaria).
function garantirIdAnonimo(request: NextRequest) {
  if (request.cookies.has(COOKIE_SESSAO)) return NextResponse.next();
  const id = crypto.randomUUID();
  request.cookies.set(COOKIE_SESSAO, id);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(COOKIE_SESSAO, id, { path: "/", maxAge: 34560000, sameSite: "lax" });
  return response;
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/bem-vindo") return garantirIdAnonimo(request);
  return redirecionarDaRaiz(request);
}

export const config = {
  matcher: ["/", "/bem-vindo"],
};
