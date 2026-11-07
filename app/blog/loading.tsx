import { GuiaCabecalho } from "./[slug]/GuiaCabecalho";
import { Footer } from "@/components/layout/Footer";
import { GUIAS } from "@/lib/guias";

// Esqueleto da própria /blog: mesmo cabeçalho, mesmo container, mesma grade e mesmo rodapé, com os
// ossos de `.figma-skeleton` no lugar do título e dos cards. Sem componente novo: a marcação é a do
// card-publico, como o InicioCarregando já faz na home. Componente de servidor, pra o texto dos
// guias (lib/guias.ts) não entrar no bundle do cliente: daqui só sai quantos cards desenhar.
function CardOsso() {
  return (
    <span className="card-publico blog-osso-card">
      <span className="card-publico-foto blog-osso-foto" />
      <span className="card-publico-texto">
        <span className="figma-skeleton blog-osso-titulo" />
        <span className="figma-skeleton blog-osso-titulo blog-osso-linha-curta" />
        <span className="figma-skeleton blog-osso-linha" />
        <span className="figma-skeleton blog-osso-linha" />
        <span className="figma-skeleton blog-osso-linha blog-osso-linha-curta" />
        <span className="figma-skeleton blog-osso-linha blog-osso-data" />
      </span>
    </span>
  );
}

export default function CarregandoBlog() {
  return (
    <main className="figma-result-page guia-pagina blog-pagina" aria-busy="true">
      <GuiaCabecalho />
      <div className="figma-section-inner blog" aria-hidden="true">
        <div className="figma-section-heading blog-osso-cabecalho">
          <span className="figma-skeleton blog-osso-h1" />
          <span className="figma-skeleton blog-osso-linha" />
          <span className="figma-skeleton blog-osso-linha" />
          <span className="figma-skeleton blog-osso-linha blog-osso-linha-curta" />
        </div>
        <div className="blog-lista">
          {GUIAS.map((guia) => (
            <CardOsso key={guia.slug} />
          ))}
        </div>
        <span className="figma-skeleton blog-osso-busca" />
      </div>
      <Footer />
    </main>
  );
}
