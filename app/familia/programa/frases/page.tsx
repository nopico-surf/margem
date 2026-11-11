import type { Metadata } from "next";
import { FrasesCliente } from "./FrasesCliente";

// "Reescrever minhas frases" (briefing M3). Tudo no cliente: as frases são da pessoa logada e passam
// pela rota /api/familia/frases.
export const metadata: Metadata = { title: "Reescrever frases que viram briga", robots: { index: false, follow: false } };

export default function FrasesPage() {
  return <FrasesCliente />;
}
