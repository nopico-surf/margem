import { GuiaCabecalho } from "./GuiaCabecalho";
import { Footer } from "@/components/layout/Footer";
import { ActionRow } from "@/components/conversa/ActionRow";
import { CardHeader } from "@/components/conversa/CardHeader";
import { CardProfissionalSkeleton } from "@/components/conversa/CardProfissionalSkeleton";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";

// Esqueleto do texto do blog: mesmo cabeçalho, mesmo banner, mesma coluna de leitura e mesmo rodapé,
// com os ossos de `.figma-skeleton` no lugar do texto. Componente de servidor, então nada de
// useParams: o esqueleto não sabe qual guia é e desenha a forma que vale pra todos (abertura, um
// carrossel e três seções). Por isso a faixa de preço vem como osso, não como ValorSessaoPsicologos:
// a faixa muda entre psicólogo e psiquiatra, e mostrar o valor errado por um instante seria pior.
function Linhas({ quantidade }: { quantidade: number }) {
  return (
    <>
      {Array.from({ length: quantidade }, (_, i) => (
        <span
          key={i}
          className={i === quantidade - 1 ? "figma-skeleton blog-osso-linha blog-osso-linha-curta" : "figma-skeleton blog-osso-linha"}
        />
      ))}
    </>
  );
}

export default function CarregandoGuia() {
  return (
    <main className="figma-result-page guia-pagina" aria-busy="true">
      <GuiaCabecalho />
      <div className="guia" aria-hidden="true">
        <div className="figma-section-inner guia-texto guia-abertura">
          <div className="guia-imagem blog-osso-foto" />
          <div className="blog-osso-h1-bloco">
            <span className="figma-skeleton blog-osso-h1" />
            <span className="figma-skeleton blog-osso-h1 blog-osso-linha-curta" />
          </div>
          <span className="figma-skeleton blog-osso-linha blog-osso-data" />
          {/* Dez linhas: é o que a abertura mediana ocupa no celular. No desktop a coluna é larga e a
              mesma abertura cabe em quatro, então as outras seis somem por CSS. */}
          <div className="blog-osso-paragrafo blog-osso-paragrafo-abertura">
            <Linhas quantidade={10} />
          </div>
        </div>

        <div className="guia-carrossel">
          <ContainerConteudo id="guia-profissionais-topo">
            <CardHeader title="Profissionais que podem ajudar" />
            <span className="figma-skeleton blog-osso-valor" />
            <ActionRow className="figma-professionals-row figma-professionals-row--esquerda" origem="profissionais">
              {[0, 1, 2, 3, 4].map((i) => (
                <CardProfissionalSkeleton key={i} />
              ))}
            </ActionRow>
          </ContainerConteudo>
        </div>

        <div className="figma-section-inner guia-texto">
          {[0, 1, 2].map((i) => (
            <section key={i}>
              <span className="figma-skeleton blog-osso-h2" />
              <div className="blog-osso-paragrafo">
                <Linhas quantidade={4} />
              </div>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
