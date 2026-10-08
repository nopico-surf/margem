"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";

// Figma: Experiência do produto, frame 1438:365597 (home carregando). Mesmo esqueleto da tela pronta,
// com os ossos no lugar de cada bloco. O de profissionais é o próprio CardProfissionais carregando.
export function InicioCarregando() {
  return (
    <main className="home-pagina" aria-busy="true">
      <div className="home-hero-lugar">
        <section className="home-hero" data-expandido="false">
          <Header onOpenMenu={() => {}} />
          <div className="home-hero-corpo">
            <div className="home-hero-foto home-osso-foto" aria-hidden="true" />
            <div className="home-hero-coluna home-osso-hero" aria-hidden="true">
              <span className="figma-skeleton home-osso-badge" />
              <span className="figma-skeleton home-osso-titulo" />
              <span className="figma-skeleton home-osso-titulo" />
              <span className="figma-skeleton home-osso-campo" />
            </div>
          </div>
        </section>
      </div>

      <div className="home-conteudo">
        <div className="home-osso-faixa" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span className="home-osso-chip" key={i}>
              <span className="figma-skeleton home-osso-chip-numero" />
              <span className="home-osso-chip-texto">
                <span className="figma-skeleton" />
                <span className="figma-skeleton" />
              </span>
            </span>
          ))}
        </div>

        <div className="home-secoes">
          <div className="pathways" aria-hidden="true">
            <span className="figma-skeleton home-osso-secao-titulo" />
            <div className="pathway-list">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span className="pathway-card home-osso-caminho" key={i}>
                  <span className="figma-skeleton home-osso-caminho-icone" />
                  <span className="figma-skeleton home-osso-caminho-titulo" />
                  <span className="figma-skeleton" />
                  <span className="figma-skeleton" />
                  <span className="figma-skeleton home-osso-caminho-acao" />
                </span>
              ))}
            </div>
          </div>

          <CardProfissionais profissionais={[]} isLoading variante="home" />

          <div className="home-osso-cannabis" aria-hidden="true">
            <div className="home-osso-cannabis-copy">
              <span className="figma-skeleton home-osso-caminho-titulo" />
              <span className="figma-skeleton" />
              <span className="figma-skeleton" />
              <span className="figma-skeleton home-osso-cannabis-botao" />
            </div>
            <span className="figma-skeleton home-osso-cannabis-foto" />
          </div>

          <div className="home-publico-secao" aria-hidden="true">
            <span className="figma-skeleton home-osso-secao-titulo" />
            <div className="home-publico">
              {[0, 1].map((i) => (
                <span className="card-publico home-osso-publico" key={i}>
                  <span className="card-publico-foto" />
                  <span className="card-publico-texto">
                    <span className="figma-skeleton" />
                    <span className="figma-skeleton" />
                  </span>
                </span>
              ))}
              <span className="home-importante home-osso-importante">
                <span className="figma-skeleton home-osso-caminho-titulo" />
                <span className="figma-skeleton" />
                <span className="figma-skeleton" />
                <span className="figma-skeleton" />
                <span className="figma-skeleton home-osso-caminho-acao" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="home-rodape">
        <Footer />
      </div>
    </main>
  );
}
