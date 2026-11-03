import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuiaCabecalho } from "./GuiaCabecalho";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { GUIAS, TEXTO_VER_TODOS, URL_PROFISSIONAIS, buscarGuia, caminhoDaImagem, formatarDataDoGuia, type BlocoGuia, type Guia } from "@/lib/guias";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

const URL_DO_SITE = "https://www.somosmargem.com.br";

// Textos do blog (briefing de 31/10/2026). Tudo aqui é renderizado no servidor, então o texto chega
// inteiro no HTML. Só o carrossel de profissionais depende de JavaScript, como no resto do site.

export function generateStaticParams() {
  return GUIAS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guia = buscarGuia(slug);
  if (!guia) return {};

  const imagem = guia.imagem ? { url: caminhoDaImagem(guia), alt: guia.imagemAlt } : OG_IMAGE_PADRAO;

  return {
    title: guia.title,
    description: guia.descricao,
    alternates: { canonical: `/blog/${guia.slug}` },
    openGraph: {
      type: "article",
      title: guia.title,
      description: guia.descricao,
      images: [imagem],
      siteName: OG_SITE_NAME,
      publishedTime: guia.publicadoEm,
      modifiedTime: guia.atualizadoEm,
    },
  };
}

// Transforma `[texto](/rota)` em link. O resto do texto vai como está.
function TextoComLinks({ texto }: { texto: string }) {
  const partes: ReactNode[] = [];
  const padrao = /\[([^\]]+)\]\(([^)]+)\)/g;
  let inicio = 0;
  for (const achado of texto.matchAll(padrao)) {
    const posicao = achado.index ?? 0;
    if (posicao > inicio) partes.push(texto.slice(inicio, posicao));
    partes.push(
      <Link key={posicao} href={achado[2]}>
        {achado[1]}
      </Link>,
    );
    inicio = posicao + achado[0].length;
  }
  if (inicio < texto.length) partes.push(texto.slice(inicio));
  return <>{partes}</>;
}

function Bloco({ bloco }: { bloco: BlocoGuia }) {
  switch (bloco.tipo) {
    case "paragrafo":
      return (
        <p>
          <TextoComLinks texto={bloco.texto} />
        </p>
      );
    case "lista-numerada":
      return (
        <ol>
          {bloco.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "lista":
      return (
        <ul>
          {bloco.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "botoes":
      return (
        <div className="guia-botoes">
          {bloco.botoes.map((botao) => (
            <Button key={botao.href} href={botao.href} tamanho="medium">
              {botao.texto}
            </Button>
          ))}
        </div>
      );
  }
}

async function CarrosselComProfissionais({ guia, posicao }: { guia: Guia; posicao: "topo" | "fim" }) {
  const profissionais = await buscarTodosProfissionaisAtivos();
  return (
    <CardProfissionais
      variante="guia"
      profissionais={profissionais}
      especialidades={guia.carrossel}
      origem={guia.slug}
      id={`guia-profissionais-${posicao}`}
    />
  );
}

function Carrossel({ guia, posicao }: { guia: Guia; posicao: "topo" | "fim" }) {
  if (guia.carrossel.length === 0) return null;
  if (posicao === "topo" && !guia.carrosselTopo) return null;
  return (
    <div className="guia-carrossel">
      <Suspense
        fallback={
          <CardProfissionais
            variante="guia"
            profissionais={[]}
            especialidades={guia.carrossel}
            isLoading
            id={`guia-profissionais-${posicao}`}
          />
        }
      >
        <CarrosselComProfissionais guia={guia} posicao={posicao} />
      </Suspense>
      <div className="figma-section-inner guia-texto guia-ver-todos">
        {guia.carrossel.map((especialidade) => (
          <Button key={especialidade} variante="transparent" tamanho="medium" semPadding href={URL_PROFISSIONAIS[especialidade]}>
            {TEXTO_VER_TODOS[especialidade]}
          </Button>
        ))}
      </div>
    </div>
  );
}

// O params fica dentro do Suspense (exigência da navegação instantânea). Como os slugs saem do
// generateStaticParams, o HTML gerado no build já vem com o guia inteiro, sem o fallback vazio.
export default function GuiaPage({ params }: Props) {
  return (
    <main className="figma-result-page guia-pagina">
      <GuiaCabecalho />
      <Suspense fallback={<div className="guia" />}>
        <GuiaConteudo params={params} />
      </Suspense>
      <Footer />
    </main>
  );
}

async function GuiaConteudo({ params }: Props) {
  const { slug } = await params;
  const guia = buscarGuia(slug);
  if (!guia) notFound();

  // O texto e as perguntas frequentes no formato que o Google lê, com o mesmo conteúdo que aparece na página.
  const organizacao = { "@type": "Organization", name: "Margem", url: URL_DO_SITE };
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: guia.h1,
      description: guia.descricao,
      image: `${URL_DO_SITE}${guia.imagem ? caminhoDaImagem(guia) : OG_IMAGE_PADRAO.url}`,
      datePublished: guia.publicadoEm,
      dateModified: guia.atualizadoEm,
      author: organizacao,
      publisher: organizacao,
      mainEntityOfPage: `${URL_DO_SITE}/blog/${guia.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guia.perguntas.map(({ pergunta, resposta }) => ({
        "@type": "Question",
        name: pergunta,
        acceptedAnswer: { "@type": "Answer", text: resposta },
      })),
    },
  ];

  return (
    <article className="guia">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="figma-section-inner guia-texto guia-abertura">
        <div className="guia-imagem">
          {guia.imagem && (
            // q60 em vez do 75 padrão: é uma foto grande e suave, pedida em 2048 de largura numa tela
            // 2x, e é a maior transferência da página. O 60 está na lista do next.config.mjs.
            <Image
              src={caminhoDaImagem(guia)}
              alt={guia.imagemAlt}
              fill
              priority
              quality={60}
              sizes="(min-width: 68em) 64rem, calc(100vw - 2rem)"
            />
          )}
        </div>
        <h1>{guia.h1}</h1>
        <p className="guia-data">
          Publicado em <time dateTime={guia.publicadoEm}>{formatarDataDoGuia(guia.publicadoEm)}</time>
          {guia.atualizadoEm !== guia.publicadoEm && (
            <>
              {" · "}Atualizado em <time dateTime={guia.atualizadoEm}>{formatarDataDoGuia(guia.atualizadoEm)}</time>
            </>
          )}
        </p>
        <p>{guia.abertura}</p>
      </div>

      <Carrossel guia={guia} posicao="topo" />

      <div className="figma-section-inner guia-texto">
        {guia.secoes.map((secao) => (
          <section key={secao.titulo}>
            <h2>{secao.titulo}</h2>
            {secao.blocos.map((bloco, index) => (
              <Bloco key={index} bloco={bloco} />
            ))}
          </section>
        ))}
      </div>

      <Carrossel guia={guia} posicao="fim" />

      <div className="figma-section-inner guia-texto">
        <section className="guia-perguntas">
          <h2>Perguntas frequentes</h2>
          {guia.perguntas.map(({ pergunta, resposta }) => (
            <div key={pergunta} className="guia-pergunta">
              <h3>{pergunta}</h3>
              <p>{resposta}</p>
            </div>
          ))}
        </section>
        <Button variante="transparent" tamanho="medium" semPadding href="/blog">
          Ver todos os textos do blog
        </Button>
      </div>
    </article>
  );
}
