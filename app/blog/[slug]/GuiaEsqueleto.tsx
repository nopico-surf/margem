import { ActionRow } from "@/components/conversa/ActionRow";
import { CardProfissionalSkeleton } from "@/components/conversa/CardProfissionalSkeleton";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";

// O miolo do esqueleto do texto do blog, com os ossos de `.figma-skeleton` no lugar do texto. Mora
// aqui, e não dentro do loading.tsx, porque é usado em dois lugares: no loading.tsx da rota e como
// fallback do Suspense da própria página. Sem ele na página, quem pintava era um `.guia` vazio, que
// ganha do loading.tsx: o loading.tsx só abre se a página suspender, e ela devolve na hora.
//
// Componente de servidor, então nada de useParams: o esqueleto não sabe qual guia é e desenha a
// forma que vale pra todos (abertura, um carrossel e três seções). Por isso a faixa de preço vem
// como osso, não como ValorSessaoPsicologos: a faixa muda entre psicólogo e psiquiatra, e mostrar o
// valor errado por um instante seria pior. E por isso o título do carrossel também é osso, não o
// CardHeader: tem guia sem carrossel no topo (carrosselTopo: false), e ali "Profissionais que podem
// ajudar" por cima da Lei de Drogas dava a entender que a Margem oferece advogado.
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

export function GuiaEsqueleto() {
  return (
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
          <span className="figma-skeleton blog-osso-h2" />
          <span className="figma-skeleton blog-osso-valor" />
          <ActionRow className="figma-professionals-row" origem="profissionais">
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
  );
}
