import type { Metadata } from "next";
import { CabecalhoFamilia } from "@/components/familia/CabecalhoFamilia";

// Fora do Google por padrão: diagnóstico, login, resultado, módulos e exercícios são da pessoa (ou
// conteúdo pago), e telas assim só atrapalham a LP na busca. A LP (page.tsx) libera a própria indexação.
export const metadata: Metadata = { title: "Fôlego · Margem", robots: { index: false, follow: false } };

// Programa para familiares (briefing em docs/familia-briefing.md). Toda tela tem o header padrão com
// o "Sair rápido". O rodapé "Precisa de ajuda agora?" saiu em 09/11/2026, a pedido do fundador.
// O título da aba é "Fôlego · Margem" em toda a área do programa (briefing N1); as páginas internas não definem o próprio.
export default function FamiliaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="familia">
      <CabecalhoFamilia />
      <main className="familia-conteudo">{children}</main>
    </div>
  );
}
