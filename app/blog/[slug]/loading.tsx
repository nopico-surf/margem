import { GuiaCabecalho } from "./GuiaCabecalho";
import { GuiaEsqueleto } from "./GuiaEsqueleto";
import { Footer } from "@/components/layout/Footer";

// Esqueleto do texto do blog: mesmo cabeçalho, mesma coluna de leitura e mesmo rodapé da tela
// pronta. O miolo mora no GuiaEsqueleto, que a própria página também usa como fallback do Suspense.
export default function CarregandoGuia() {
  return (
    <main className="figma-result-page guia-pagina" aria-busy="true">
      <GuiaCabecalho />
      <GuiaEsqueleto />
      <Footer />
    </main>
  );
}
