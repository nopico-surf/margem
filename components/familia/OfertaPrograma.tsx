"use client";

import { useEffect, useRef, useState } from "react";
import { GlifoCheckCircle, GlifoClose } from "@/components/icons/glifos";
import { SeloDevolucao } from "@/components/familia/SeloDevolucao";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DIAS_PARA_DESISTIR,
  SESSAO_MAXIMA,
  SESSAO_MINIMA,
  VALOR_SUGERIDO,
  VALORES_PROGRAMA,
  VALORES_PROGRAMA_COM_ACOMPANHAMENTO,
} from "@/lib/familia/oferta";
import { track } from "@/lib/mixpanel";

// Banner de oferta do programa para familiares. Todos os textos são do briefing 01d; o topo da LP e o
// lightbox "Saiba mais" são do 01c. Design: canvas "Banner de oferta", o mesmo cartão em quatro
// variações: faixa verde-escura em cima (título e, na LP, o preço) e corpo branco embaixo.
// - lp (variação a): bloco "Quanto custa", antes da FAQ da LP.
// - resultado (b): no resultado do diagnóstico, com os módulos 1 a 8 numerados.
// - treino (c): abaixo da mensagem do fim do treino grátis.
// - bloqueado (d): na página de um módulo que a pessoa ainda não comprou.
//
// Nunca em modal ou pop-up, no máximo um por tela, e some depois da compra (quem decide se aparece é a
// tela). Nunca acima de conteúdo de segurança. O desconto de 20% é no programa, nunca na sessão.
//
// Canvas "Ofertas do Fôlego" (25/11/2026): a LP e o resultado trazem os dois jeitos de fazer o Fôlego,
// o selo dos 14 dias acima dos botões e, no desktop, os dois botões lado a lado. Decisão do fundador
// em 25/11/2026: no celular, quando a pessoa chega ao bloco (LP e resultado), o "Escolher meu valor e
// continuar" fica fixo embaixo, no mesmo desenho da barra do "Agendar" do profissional. Ele só
// aparece enquanto o botão do próprio bloco ainda não está na tela, e some quando esse botão aparece
// ou o bloco fica pra trás. Treino e bloqueado ficam sem barra e sem os dois jeitos, como estavam.
//
// O pedido de acesso gratuito não aparece no resultado: foi escondido em 25/11/2026 (ver
// app/familia/acesso-gratuito/page.tsx).

export type VarianteOferta = "lp" | "resultado" | "treino" | "bloqueado";

type OfertaProgramaProps = {
  variante: VarianteOferta;
  // "{{apelido}}" dos textos do resultado e do treino.
  apelido?: string;
  // Títulos dos módulos 1 a 8, na ordem (só no resultado).
  modulos?: string[];
  // Modo de segurança (só no resultado): acrescenta a frase sobre ter um profissional junto.
  seguranca?: boolean;
  // Barra fixa do "Escolher meu valor e continuar" no celular (só LP e resultado). A galeria /ui desliga:
  // lá há várias ofertas na mesma página.
  barraFixa?: boolean;
};

const MINIMO = VALORES_PROGRAMA[0];
const MAXIMO = VALORES_PROGRAMA[VALORES_PROGRAMA.length - 1];
const MINIMO_COM_ACOMPANHAMENTO = VALORES_PROGRAMA_COM_ACOMPANHAMENTO[0];
// O menor programa com acompanhamento mais a menor sessão: R$ 37 + R$ 60.
const TOTAL_MINIMO_COM_ACOMPANHAMENTO = MINIMO_COM_ACOMPANHAMENTO + SESSAO_MINIMA;
const APOIO_PRECO = `R$ ${MINIMO} a R$ ${MAXIMO}, você escolhe. Uma vez só, no Pix, com ${DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta.`;

const ITENS_INCLUIDOS = [
  "8 módulos, um por semana, também em áudio",
  "Diário e escala da sua vida",
  "Treino de conversa, para ensaiar antes de falar",
  "Plano de segurança",
];

// Altura que a barra fixa ocupa no rodapé da tela (padding 16 + botão 48 + padding 16). A área de
// "bloco na tela" é a de cima dela: o que está atrás da barra não conta como visto.
const ALTURA_DA_BARRA = 96;

export function OfertaPrograma({ variante, apelido = "", modulos = [], seguranca = false, barraFixa = true }: OfertaProgramaProps) {
  const lightbox = useRef<HTMLDialogElement>(null);
  const secao = useRef<HTMLElement>(null);
  const acoes = useRef<HTMLDivElement>(null);
  const [barraVisivel, setBarraVisivel] = useState(false);
  const comBarra = barraFixa && (variante === "lp" || variante === "resultado");
  const comDoisJeitos = variante === "lp" || variante === "resultado";

  useEffect(() => {
    track("oferta_vista", { variacao: variante });
  }, [variante]);

  // A barra aparece com o bloco na tela e o botão principal dele ainda fora dela.
  useEffect(() => {
    const bloco = secao.current;
    const botao = acoes.current?.firstElementChild;
    if (!comBarra || !bloco || !botao) return;

    let blocoVisto = false;
    let botaoVisto = false;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.target === bloco) blocoVisto = entrada.isIntersecting;
          else botaoVisto = entrada.isIntersecting;
        }
        setBarraVisivel(blocoVisto && !botaoVisto);
      },
      { rootMargin: [0, 0, -ALTURA_DA_BARRA, 0].map((n) => `${n}px`).join(" ") },
    );
    observador.observe(bloco);
    observador.observe(botao);
    return () => observador.disconnect();
  }, [comBarra]);

  // Na LP o diagnóstico já tem a própria barra fixa embaixo: enquanto a da oferta aparece, ela sai.
  useEffect(() => {
    if (!barraVisivel) return;
    document.documentElement.dataset.ofertaBarra = "true";
    return () => {
      delete document.documentElement.dataset.ofertaBarra;
    };
  }, [barraVisivel]);

  const clicar = (acao: string) => () => track("oferta_clicada", { variacao: variante, acao });
  const idTitulo = `oferta-${variante}-titulo`;

  const titulo = {
    lp: "Quanto custa",
    resultado: `Os próximos passos com ${apelido}`,
    treino: "Esse foi o seu treino de graça",
    bloqueado: "Esta semana faz parte do programa",
  }[variante];

  const textos = {
    lp: [],
    resultado: [
      `Você já tem o mapa da situação e o roteiro da primeira conversa com ${apelido}. Nas 8 semanas do Fôlego, você aprende e treina o que dizer e o que fazer, um módulo por semana.`,
    ],
    treino: [
      `No programa, você treina outras conversas com ${apelido}. Você ensaia o que dizer quando ${apelido} nega o problema, como recusar um pedido de dinheiro, como elogiar sem soar como cobrança, e como fazer o convite para aceitar ajuda.`,
    ],
    bloqueado: [
      "O conteúdo desta semana abre com a compra. Os 8 módulos chegam um por semana, e as ferramentas ficam disponíveis para você.",
    ],
  }[variante];

  function abrirLightbox() {
    lightbox.current?.showModal();
    track("oferta_clicada", { variacao: variante, acao: "saiba_mais" });
  }

  const botaoPrincipal = (
    <Button tamanho="medium" larguraTotal href={`/familia/checkout?origem=${variante}`} onClick={clicar("escolher_valor")}>
      Escolher meu valor e continuar
    </Button>
  );

  return (
    <section ref={secao} className="oferta-programa" data-variante={variante} aria-labelledby={idTitulo}>
      <div className="oferta-programa-faixa">
        {variante === "lp" ? (
          <>
            <h2 id={idTitulo} className="oferta-programa-rotulo">
              {titulo}
            </h2>
            <p className="oferta-programa-preco">
              R$ {MINIMO} a R$ {MAXIMO}
            </p>
            <p className="oferta-programa-apoio">
              Você escolhe quanto pagar, e o valor sugerido é R$ {VALOR_SUGERIDO}. Uma vez só, no Pix, com {DIAS_PARA_DESISTIR} dias para pedir o dinheiro
              de volta.
            </p>
            <button type="button" className="oferta-programa-saiba-mais" onClick={abrirLightbox}>
              Ver como funciona o valor
            </button>
          </>
        ) : (
          <h2 id={idTitulo} className="oferta-programa-titulo">
            {titulo}
          </h2>
        )}
      </div>

      <div className="oferta-programa-corpo">
        {textos.map((texto) => (
          <p key={texto} className="oferta-programa-texto">
            {texto}
          </p>
        ))}

        {variante === "resultado" && modulos.length > 0 && (
          <div className="oferta-programa-modulos">
            <h3 className="oferta-programa-subtitulo-urbanist">O que vem nas 8 semanas do Fôlego</h3>
            <ol className="oferta-programa-modulos-lista">
              {modulos.map((tituloDoModulo, indice) => (
                <li key={tituloDoModulo}>
                  <span className="oferta-programa-modulo-numero">{indice + 1}</span>
                  <span>{tituloDoModulo}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {comDoisJeitos && (
          <div className="oferta-programa-inclui">
            <h3 className="oferta-programa-subtitulo-urbanist">O que está incluído</h3>
            <ul className="oferta-programa-lista">
              {ITENS_INCLUIDOS.map((item) => (
                <li key={item}>
                  <GlifoCheckCircle size={20} color="var(--colors-brand-primary-800)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Badge color="primary" className="oferta-programa-selo-conteudo">O conteúdo é o mesmo em qualquer valor</Badge>
          </div>
        )}

        {variante === "resultado" && seguranca && (
          <p className="oferta-programa-seguranca">Na sua situação, ter um profissional junto faz ainda mais diferença.</p>
        )}

        {comDoisJeitos && (
          <div className="oferta-programa-inclui">
            <div className="oferta-programa-cabecalho-planos">
              <h3 className="oferta-programa-subtitulo-urbanist">Os dois jeitos de fazer o Fôlego</h3>
              <p className="oferta-programa-nota">Você escolhe o jeito e o valor na próxima tela.</p>
            </div>
            <div className="oferta-programa-planos">
              <div className="oferta-programa-plano">
                <div className="oferta-programa-plano-cabecalho">
                  <h4 className="oferta-programa-plano-nome">Fôlego</h4>
                </div>
                <p className="oferta-programa-plano-preco">
                  R$ {MINIMO} a R$ {MAXIMO}
                </p>
                <p className="oferta-programa-nota">Você faz as 8 semanas por conta própria, um módulo por semana.</p>
                <p className="oferta-programa-nota oferta-programa-nota-forte">Você escolhe o valor dentro dessa faixa, sem precisar justificar.</p>
              </div>
              <div className="oferta-programa-plano">
                <div className="oferta-programa-plano-cabecalho">
                  <h4 className="oferta-programa-plano-nome">Fôlego com acompanhamento</h4>
                  <Badge color="primary">20% de desconto no programa</Badge>
                </div>
                <p className="oferta-programa-plano-preco">
                  R$ {MINIMO_COM_ACOMPANHAMENTO} a R$ {MAXIMO}
                </p>
                <p className="oferta-programa-nota">
                  Inclui a primeira sessão com um psicólogo parceiro da Margem, e você escolhe quanto paga por ela, de R$ {SESSAO_MINIMA} a R$ {SESSAO_MAXIMA}.
                </p>
                <p className="oferta-programa-nota oferta-programa-nota-forte">O total começa em R$ {TOTAL_MINIMO_COM_ACOMPANHAMENTO}, pago num Pix só.</p>
              </div>
            </div>
          </div>
        )}

        <div className="oferta-programa-fim">
          {comDoisJeitos && <SeloDevolucao />}

          <div ref={acoes} className="oferta-programa-acoes">
            {variante === "lp" ? (
              <>
                {botaoPrincipal}
                <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/diagnostico" onClick={clicar("diagnostico")}>
                  Começar pelo diagnóstico grátis
                </Button>
              </>
            ) : (
              <>
                {botaoPrincipal}
                {variante === "resultado" && (
                  <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/programa/simulador/primeira-conversa" onClick={clicar("treinar")}>
                    Treinar o meu roteiro
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="oferta-programa-rodape">
          {variante === "lp" ? (
            <p>Você pode fazer o diagnóstico e experimentar um treino de conversa de graça, antes de decidir.</p>
          ) : variante === "resultado" ? (
            <p>Você escolhe quanto pagar, e o valor sugerido é R$ {VALOR_SUGERIDO}. Uma vez só, no Pix.</p>
          ) : (
            <p>{APOIO_PRECO}</p>
          )}
        </div>
      </div>

      {comBarra && barraVisivel && (
        <div className="familia-lp-cta-barra oferta-programa-barra">{botaoPrincipal}</div>
      )}

      {variante === "lp" && (
        <dialog
          ref={lightbox}
          className="oferta-programa-lightbox"
          aria-labelledby="oferta-lightbox-titulo"
          onClick={(evento) => {
            if (evento.target === evento.currentTarget) lightbox.current?.close();
          }}
        >
          <div className="oferta-programa-lightbox-conteudo">
            <button type="button" className="oferta-programa-lightbox-x" aria-label="Fechar" onClick={() => lightbox.current?.close()}>
              <GlifoClose size={24} />
            </button>
            <h2 id="oferta-lightbox-titulo">Como funciona o valor</h2>
            <p>
              O programa é o mesmo em qualquer valor que você escolher: os 8 módulos, as ferramentas e os treinos de conversa. Nada fica de fora se você
              pagar menos.
            </p>
            <p>Você escolhe dentro da faixa, sem precisar justificar.</p>
            <p>Quem pode pagar mais ajuda a manter o programa aberto para quem está sem nada agora.</p>
            <p>É um pagamento só, no Pix. Não tem mensalidade e ninguém vai cobrar você de novo depois.</p>
            <p>Se não for para você, peça o dinheiro de volta em até {DIAS_PARA_DESISTIR} dias. Num toque, sem precisar explicar por quê.</p>
            <Button tamanho="medium" larguraTotal onClick={() => lightbox.current?.close()}>
              Fechar
            </Button>
          </div>
        </dialog>
      )}
    </section>
  );
}
