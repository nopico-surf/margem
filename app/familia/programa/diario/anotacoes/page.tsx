import type { Metadata } from "next";
import { AnotacoesCliente } from "./AnotacoesCliente";

// Lista das anotações do diário, com editar e apagar (briefing M2, "Ver todas as minhas anotações").
export const metadata: Metadata = { title: "Minhas anotações", robots: { index: false, follow: false } };

export default function AnotacoesPage() {
  return <AnotacoesCliente />;
}
