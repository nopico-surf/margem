import type { Metadata } from "next";
import { RedeCliente } from "./RedeCliente";

// "A sua rede de apoio" (briefing M7, C10). Tudo no cliente: a rede é da pessoa logada e passa pela
// rota /api/familia/rede.
export const metadata: Metadata = { title: "A sua rede de apoio", robots: { index: false, follow: false } };

export default function RedePage() {
  return <RedeCliente />;
}
