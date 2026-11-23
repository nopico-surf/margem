import type { ReactNode } from "react";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";

// Esqueleto das telas do programa para familiares, no lugar do loader enquanto os dados da pessoa
// chegam. Não existe no Figma (as telas do /familia também não): segue o padrão do código, que é a
// própria tela com os ossos de `.figma-skeleton` no lugar do conteúdo (blog, profissional, home).
// Cada variante copia a estrutura da tela pronta, com as mesmas classes, pra a página não dar pulo:
//
// - `secao`: telas de exercício, login, diagnóstico e pedidos (título, texto, opções e botão).
// - `painel`: /familia/programa.
// - `modulo`: /familia/programa/modulo/[n]. Com `cabecalho`, o rótulo e o título reais (já vêm do
//   build) no lugar dos ossos do topo.
// - `resultado`: /familia/resultado.
// - `checkout`: primeira etapa do /familia/checkout (os dois planos).
//
// Componente de servidor: serve de fallback do Suspense das páginas e do estado de carregando das
// telas de cliente, o mesmo desenho nos dois, pra não piscar de um pro outro.

type EsqueletoFamiliaProps = {
  variante?: "secao" | "painel" | "modulo" | "resultado" | "checkout";
  cabecalho?: ReactNode;
};

function Osso({ classe }: { classe?: string }) {
  return <span className={classe ? `figma-skeleton ${classe}` : "figma-skeleton"} />;
}

// Linhas de texto: a última mais curta, como um parágrafo de verdade.
function Paragrafo({ linhas }: { linhas: number }) {
  return (
    <span className="familia-osso-paragrafo">
      {Array.from({ length: linhas }, (_, i) => (
        <Osso key={i} classe={i === linhas - 1 ? "familia-osso-linha familia-osso-curto" : "familia-osso-linha"} />
      ))}
    </span>
  );
}

function Titulo({ linhas = 1 }: { linhas?: number }) {
  return (
    <div className="familia-titulo">
      {Array.from({ length: linhas }, (_, i) => (
        <Osso key={i} classe={i === linhas - 1 && linhas > 1 ? "familia-osso-titulo familia-osso-curto" : "familia-osso-titulo"} />
      ))}
    </div>
  );
}

function Secao() {
  return (
    <section className="familia-secao">
      <Titulo linhas={2} />
      <Paragrafo linhas={3} />
      {[0, 1, 2].map((i) => (
        <span key={i} className="familia-osso-opcao" />
      ))}
      <Osso classe="familia-osso-botao" />
    </section>
  );
}

function Painel() {
  return (
    <>
      <section className="familia-secao">
        <Osso classe="familia-osso-titulo familia-osso-titulo-tela" />
      </section>
      <section className="familia-secao">
        <Osso classe="familia-osso-subtitulo" />
        <div className="familia-cartao">
          <Osso classe="familia-osso-rotulo" />
          <Osso classe="familia-osso-cartao-titulo" />
          <Osso classe="familia-osso-botao" />
        </div>
      </section>
      <section className="familia-secao">
        <Osso classe="familia-osso-subtitulo" />
        {[0, 1].map((i) => (
          <div key={i} className="familia-cartao">
            <Osso classe="familia-osso-cartao-titulo" />
            <Osso classe="familia-osso-rotulo" />
            <Osso classe="familia-osso-botao familia-osso-botao-pequeno" />
          </div>
        ))}
      </section>
      <section className="familia-secao">
        <Osso classe="familia-osso-subtitulo" />
        <div className="painel-modulos">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="painel-modulo">
              <Osso classe="familia-osso-rotulo" />
              <Osso classe="familia-osso-cartao-titulo" />
              <Paragrafo linhas={2} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Modulo({ cabecalho }: { cabecalho?: ReactNode }) {
  return (
    <article className="familia-secao familia-modulo">
      {cabecalho ?? (
        <header className="familia-titulo">
          <Osso classe="familia-osso-rotulo" />
          <Osso classe="familia-osso-titulo" />
          <Osso classe="familia-osso-titulo familia-osso-curto" />
        </header>
      )}
      <Paragrafo linhas={4} />
      <Paragrafo linhas={5} />
      <Osso classe="familia-osso-subtitulo" />
      <Paragrafo linhas={4} />
    </article>
  );
}

function Resultado() {
  return (
    <>
      <section className="familia-secao familia-resultado-topo">
        <Osso classe="familia-osso-titulo familia-osso-titulo-tela" />
        <Paragrafo linhas={4} />
      </section>
      <section className="familia-secao">
        <Osso classe="familia-osso-subtitulo" />
        <Paragrafo linhas={3} />
      </section>
      <section className="familia-secao">
        <div className="familia-cartao familia-cartao-destaque">
          <Osso classe="familia-osso-subtitulo" />
          <Osso classe="familia-osso-cartao-titulo" />
          <Paragrafo linhas={3} />
          <Osso classe="familia-osso-cartao-titulo" />
          <Paragrafo linhas={2} />
        </div>
      </section>
    </>
  );
}

function Checkout() {
  return (
    <div className="plano-pagina familia-checkout">
      <ContainerConteudo id="familia-carregando">
        <Osso classe="familia-osso-titulo" />
        <div className="plano-cards">
          {[0, 1].map((i) => (
            <div key={i} className="card-plano familia-osso-plano">
              <Osso classe="familia-osso-cartao-titulo" />
              <Paragrafo linhas={2} />
              <Osso classe="familia-osso-rotulo" />
            </div>
          ))}
        </div>
      </ContainerConteudo>
    </div>
  );
}

export function EsqueletoFamilia({ variante = "secao", cabecalho }: EsqueletoFamiliaProps) {
  const conteudo =
    variante === "painel" ? (
      <Painel />
    ) : variante === "modulo" ? (
      <Modulo cabecalho={cabecalho} />
    ) : variante === "resultado" ? (
      <Resultado />
    ) : variante === "checkout" ? (
      <Checkout />
    ) : (
      <Secao />
    );
  return (
    <div className="familia-esqueleto" aria-busy="true">
      <div aria-hidden="true">{conteudo}</div>
    </div>
  );
}
