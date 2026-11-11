import type { Metadata } from "next";
import { ResumoCliente } from "./ResumoCliente";

// Resumo da semana do diário (briefing M2): contagem simples dos últimos 7 dias, sem IA.
export const metadata: Metadata = { title: "O que a sua semana mostrou", robots: { index: false, follow: false } };

export default function ResumoPage() {
  return <ResumoCliente />;
}
