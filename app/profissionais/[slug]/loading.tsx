"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

// Figma: Experiência do produto, frames 1399:18476 (mobile) e 1399:18470 (tablet e desktop). É o
// esqueleto da própria página do profissional: mesmo header, mesma grade, mesmo rodapé e mesma barra
// fixa. Só o conteúdo vira bone, com o shimmer de `.figma-skeleton`. Sem nenhum componente novo.

function Tags({ quantidade }: { quantidade: number }) {
  return (
    <div className="profissional-skeleton-tags">
      {Array.from({ length: quantidade }, (_, i) => (
        <span key={i} className="figma-skeleton" />
      ))}
    </div>
  );
}

function CardSobre() {
  return (
    <div className="profissional-skeleton-sobre">
      <span className="figma-skeleton profissional-skeleton-sobre-titulo" />
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="figma-skeleton profissional-skeleton-sobre-linha" />
      ))}
    </div>
  );
}

export default function CarregandoProfissional() {
  return (
    <main className="figma-result-page profissional-pagina profissional-pagina-carregando" aria-busy="true">
      <Header onOpenMenu={() => {}} hrefDoLogo="/inicio" onVoltar={() => {}} />

      <div className="profissional-conteudo" aria-hidden="true">
        <div className="profissional-topo">
          <div className="profissional-foto-moldura figma-skeleton" />

          <div className="profissional-card">
            <div className="profissional-skeleton-bloco">
              <span className="figma-skeleton profissional-skeleton-nome" />
              <span className="figma-skeleton profissional-skeleton-especialidade" />
              <div className="profissional-skeleton-registro">
                <span className="figma-skeleton" />
                <span className="figma-skeleton" />
              </div>
            </div>

            <div className="profissional-skeleton-preco">
              <span className="figma-skeleton profissional-skeleton-preco-titulo" />
              <span className="figma-skeleton profissional-skeleton-preco-texto" />
            </div>

            <div className="profissional-skeleton-bloco profissional-skeleton-tags-bloco">
              <Tags quantidade={3} />
              <Tags quantidade={3} />
              <div className="profissional-skeleton-tags-extra">
                <Tags quantidade={3} />
              </div>
            </div>

            <div className="profissional-agendar-card">
              <span className="figma-skeleton profissional-skeleton-botao" />
            </div>
          </div>
        </div>

        <section className="profissional-sobre">
          {/* Sobre mim, Minha abordagem e Minhas formações. */}
          {Array.from({ length: 3 }, (_, i) => (
            <CardSobre key={i} />
          ))}
        </section>
      </div>

      <Footer />

      <div className="profissional-agendar-barra" aria-hidden="true">
        <span className="figma-skeleton profissional-skeleton-botao" />
      </div>
    </main>
  );
}
