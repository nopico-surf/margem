import type { Metadata } from "next";
import { AcessoGratuitoCliente } from "./AcessoGratuitoCliente";

// "Pedir acesso gratuito" (briefing 01). Exige login, pra o acesso ser liberado na conta certa.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AcessoGratuitoPage() {
  return <AcessoGratuitoCliente />;
}
