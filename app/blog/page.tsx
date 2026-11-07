import type { Metadata } from "next";
import { GuiaCabecalho } from "./[slug]/GuiaCabecalho";
import { CardPublico } from "@/components/bem-vindo/CardPublico";
import { CardHeader } from "@/components/conversa/CardHeader";
import { Footer } from "@/components/layout/Footer";
import { GUIAS, caminhoDaImagemDoCard, formatarDataDoGuia } from "@/lib/guias";
import { montarIndiceBlog } from "@/lib/busca-blog";
import { BuscaBlog } from "./BuscaBlog";
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
// meta description de cada texto (lib/guias.ts). A busca (BuscaBlog) recebe os cards prontos e um índice
// enxuto de cada texto: o texto inteiro dos guias não vai pro navegador.
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
        <BuscaBlog
          indice={montarIndiceBlog(GUIAS)}
          cards={GUIAS.map((guia, index) => ({
            slug: guia.slug,
            card: (
              <CardPublico
                href={`/blog/${guia.slug}`}
                foto={guia.imagem ? caminhoDaImagemDoCard(guia) : undefined}
                // A largura do slot, não a da viewport: o card perde os 16 de padding da página no
                // celular e os 32 mais o gap do grid no tablet. Sem isso o navegador pede um degrau
                // de imagem acima do que vai mostrar.
                sizesDaFoto="(min-width: 68em) 22rem, (min-width: 48em) calc(50vw - 2.5rem), calc(100vw - 2rem)"
                // Só o primeiro card nasce fora do lazy: é a imagem da dobra, o LCP da lista.
                prioridade={index === 0}
                titulo={guia.h1}
                tituloComo="h2"
                data={
                  <>
                    Atualizado em <time dateTime={guia.atualizadoEm}>{formatarDataDoGuia(guia.atualizadoEm)}</time>
                  </>
                }
                texto={guia.descricao}
              />
            ),
          }))}
        />
      </div>
      <Footer />
    </main>
  );
}
