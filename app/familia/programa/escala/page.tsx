import type { Metadata } from "next";
import { EscalaCliente } from "./EscalaCliente";

// Escala "Como está a sua vida" e meta da semana (componentes-parte1, C1). Tudo no cliente: as notas
// e a meta são da pessoa logada e passam pelas rotas /api/familia/escala e /api/familia/meta.
export const metadata: Metadata = { title: "Como está a sua vida", robots: { index: false, follow: false } };

export default function EscalaPage() {
  return <EscalaCliente />;
}
