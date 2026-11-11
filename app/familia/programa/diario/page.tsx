import type { Metadata } from "next";
import { DiarioCliente } from "./DiarioCliente";

// Diário (briefing M2): anotar um momento difícil ou um momento bom, em telas curtas de toque.
// Tudo no cliente: as anotações são da pessoa logada e passam pela rota /api/familia/diario.
export const metadata: Metadata = { title: "Anotar no diário", robots: { index: false, follow: false } };

export default function DiarioPage() {
  return <DiarioCliente />;
}
