import type { Metadata } from "next";
import { GostaCliente } from "./GostaCliente";

// "Do que a pessoa gosta" (briefing M4, ferramenta A). Tudo no cliente: a lista é da pessoa logada e
// passa pela rota /api/familia/valorizar.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function GostaPage() {
  return <GostaCliente />;
}
