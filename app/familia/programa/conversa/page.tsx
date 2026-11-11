import type { Metadata } from "next";
import { ConversaCliente } from "./ConversaCliente";

// "Como foi a conversa" (briefing M1, item 2): registro curto de uma conversa real. Tudo no cliente:
// o registro é da pessoa logada e passa pela rota /api/familia/conversa.
export const metadata: Metadata = { title: "Como foi a conversa", robots: { index: false, follow: false } };

export default function ConversaPage() {
  return <ConversaCliente />;
}
