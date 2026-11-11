import type { Metadata } from "next";
import { DevolucaoCliente } from "./DevolucaoCliente";

// "Pedir o dinheiro de volta" (briefing 01b). Só aparece dentro do prazo, pelo rodapé do painel.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DevolucaoPage() {
  return <DevolucaoCliente />;
}
