import type { Metadata } from "next";
import { AdiarCliente } from "./AdiarCliente";

// "Quando o combinado fica para outro dia" (briefing M4, C5). Tudo no cliente: o combinado é da pessoa
// logada e passa pela rota /api/familia/valorizar.
export const metadata: Metadata = { title: "Quando o combinado fica para outro dia", robots: { index: false, follow: false } };

export default function AdiarPage() {
  return <AdiarCliente />;
}
