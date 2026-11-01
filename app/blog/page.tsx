import type { Metadata } from "next";
import { GuiaCabecalho } from "./[slug]/GuiaCabecalho";
import { CardPublico } from "@/components/bem-vindo/CardPublico";
import { CardHeader } from "@/components/conversa/CardHeader";
import { Footer } from "@/components/layout/Footer";
import { GUIAS, caminhoDaImagemDoCard } from "@/lib/guias";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

const TITULO = "Blog: terapia a valor social, álcool e outras drogas | Margem";
const DESCRICAO =
  "Textos sobre terapia a valor social, psiquiatra, álcool e outras drogas e como conferir o registro de quem vai te atender.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

// Lista dos textos do blog, sem Figma: composta com CardHeader e CardPublico. Tudo no servidor, com os
// links no HTML, pra o Google chegar em cada texto por aqui. O título e o resumo do card são o H1 e a
// meta description de cada texto (lib/guias.ts).
export default function BlogPage() {
  return (
    <main className="figma-result-page guia-pagina blog-pagina">
      <GuiaCabecalho />
      <div className="figma-section-inner blog">
        <CardHeader
          as="h1"
          title="Blog da Margem"
          description="Textos pra entender os valores das consultas e sessões, caminhos de cuidado e como conferir quem vai te atender."
        />
        <div className="blog-lista">
          {GUIAS.map((guia) => (
            <CardPublico
              key={guia.slug}
              href={`/blog/${guia.slug}`}
              foto={guia.imagem ? caminhoDaImagemDoCard(guia) : undefined}
              sizesDaFoto="(min-width: 68em) 22rem, (min-width: 48em) 50vw, 100vw"
              titulo={guia.h1}
              tituloComo="h2"
              texto={guia.descricao}
            />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
