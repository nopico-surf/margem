"use client";

import { useEffect, useRef } from "react";
import { GlifoCheckCircle, GlifoClose, GlifoLock } from "@/components/icons/glifos";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DIAS_PARA_DESISTIR, VALORES_PROGRAMA, VALORES_PROGRAMA_COM_ACOMPANHAMENTO } from "@/lib/familia/oferta";
import { track } from "@/lib/mixpanel";

// Banner de oferta do programa para familiares. Todos os textos são do briefing 01d; o topo da LP e o
// lightbox "Saiba mais" são do 01c. Design: canvas "Banner de oferta", o mesmo cartão em quatro
// variações: faixa verde-escura em cima (título e, na LP, o preço) e corpo branco embaixo.
// - lp (variação a): bloco "Quanto custa", antes da FAQ da LP.
// - resultado (b): no resultado do diagnóstico, com a lista dos módulos 1 a 8 trancados.
// - treino (c): abaixo da mensagem do fim do treino grátis.
// - bloqueado (d): na página de um módulo que a pessoa ainda não comprou.
//
// Nunca em modal, pop-up ou barra fixa, no máximo um por tela, e some depois da compra (quem decide
// se aparece é a tela). Nunca acima de conteúdo de segurança. O preço e os 14 dias aparecem uma vez
// por tela. O desconto de 20% é no programa, nunca na sessão.

export type VarianteOferta = "lp" | "resultado" | "treino" | "bloqueado";

type OfertaProgramaProps = {
  variante: VarianteOferta;
  // "{{apelido}}" dos textos do resultado e do treino.
  apelido?: string;
  // Títulos dos módulos 1 a 8, na ordem (só no resultado).
  modulos?: string[];
  // Modo de segurança (só no resultado): acrescenta a frase sobre ter um profissional junto.
  seguranca?: boolean;
};

const MINIMO = VALORES_PROGRAMA[0];
const MAXIMO = VALORES_PROGRAMA[VALORES_PROGRAMA.length - 1];
const MINIMO_COM_ACOMPANHAMENTO = VALORES_PROGRAMA_COM_ACOMPANHAMENTO[0];
const APOIO_PRECO = `R$ ${MINIMO} a R$ ${MAXIMO}, você escolhe. Uma vez só, no Pix, com ${DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta.`;

const ITENS_LP = [
  "8 módulos, um por semana, também em áudio",
  "Diário e escala da sua vida",
  "Treino de conversa, para ensaiar antes de falar",
  "Plano de segurança",
];

const HREF_GRATUITO = "/familia/acesso-gratuito";

export function OfertaPrograma({ variante, apelido = "", modulos = [], seguranca = false }: OfertaProgramaProps) {
  const lightbox = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    track("oferta_vista", { variacao: variante });
  }, [variante]);

  const clicar = (acao: string) => () => track("oferta_clicada", { variacao: variante, acao });
  const idTitulo = `oferta-${variante}-titulo`;

  const titulo = {
    lp: "Quanto custa",
    resultado: "Seu programa já está montado",
    treino: "Esse foi o seu treino de graça",
    bloqueado: "Esta semana faz parte do programa",
  }[variante];

  const textos = {
    lp: [],
    resultado: [
      `As 8 semanas foram pensadas para a sua situação com ${apelido}.`,
      `Antes de decidir, você pode treinar de graça a sua primeira conversa com ${apelido}.`,
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

  return (
    <section className="oferta-programa" data-variante={variante} aria-labelledby={idTitulo}>
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
              Você escolhe quanto pagar. Uma vez só, no Pix, com {DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta.
            </p>
            <button type="button" className="oferta-programa-saiba-mais" onClick={abrirLightbox}>
              Saiba mais
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

        {variante === "lp" && (
          <div className="oferta-programa-inclui">
            <p className="oferta-programa-subtitulo">O que está incluído</p>
            <ul className="oferta-programa-lista">
              {ITENS_LP.map((item) => (
                <li key={item}>
                  <GlifoCheckCircle size={20} color="var(--colors-brand-primary-800)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {variante === "lp" && (
          <div className="oferta-programa-planos">
            <div className="oferta-programa-plano">
              <p className="oferta-programa-plano-nome">Programa de 8 semanas</p>
              <p className="oferta-programa-texto">
                <strong>R$ {MINIMO} a R$ {MAXIMO}</strong>, e você escolhe quanto pode pagar.
              </p>
            </div>
            <div className="oferta-programa-plano">
              <div className="oferta-programa-plano-cabecalho">
                <p className="oferta-programa-plano-nome">Programa com acompanhamento</p>
                <Badge color="primary">20% de desconto</Badge>
              </div>
              <p className="oferta-programa-texto">
                <strong>A partir de R$ {MINIMO_COM_ACOMPANHAMENTO}</strong> pelo programa, mais a primeira sessão com um profissional parceiro, no valor que você escolher.
              </p>
              <p className="oferta-programa-texto">Com um profissional junto, você não precisa decidir sem ajuda o que fazer em casa.</p>
            </div>
          </div>
        )}

        {variante === "resultado" && modulos.length > 0 && (
          <ul className="oferta-programa-modulos">
            {modulos.map((tituloDoModulo, indice) => (
              <li key={tituloDoModulo}>
                <GlifoLock size={20} color="var(--colors-neutral-700)" />
                <span>
                  Módulo {indice + 1} · {tituloDoModulo}
                </span>
              </li>
            ))}
          </ul>
        )}

        {variante === "resultado" && seguranca && (
          <p className="oferta-programa-texto">Na sua situação, ter um profissional junto faz ainda mais diferença.</p>
        )}

        <div className="oferta-programa-acoes">
          {variante === "lp" ? (
            <>
              <Button tamanho="medium" larguraTotal href="/familia/checkout?origem=lp" onClick={clicar("garantir_acesso")}>
                Já quero garantir meu acesso
              </Button>
              <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/diagnostico" onClick={clicar("diagnostico")}>
                Começar pelo diagnóstico grátis
              </Button>
            </>
          ) : (
            <>
              <Button tamanho="medium" larguraTotal href={`/familia/checkout?origem=${variante}`} onClick={clicar("escolher_valor")}>
                Escolher meu valor e continuar
              </Button>
              {variante === "resultado" && (
                <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/programa/simulador/primeira-conversa" onClick={clicar("treinar")}>
                  Treinar o meu roteiro
                </Button>
              )}
            </>
          )}
        </div>

        <div className="oferta-programa-rodape">
          {variante === "lp" ? (
            <p>Você pode fazer o diagnóstico e experimentar um treino de conversa de graça, antes de decidir.</p>
          ) : (
            <>
              <p>{APOIO_PRECO}</p>
              <Button variante="transparent" tamanho="small" semPadding href={`${HREF_GRATUITO}?origem=${variante}`} onClick={clicar("gratuito")}>
                Pedir acesso gratuito
              </Button>
            </>
          )}
        </div>
      </div>

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
