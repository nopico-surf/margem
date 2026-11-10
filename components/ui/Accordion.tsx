"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { GlifoExpandLess } from "@/components/icons/glifos";

// Sanfona: pergunta que abre e fecha a resposta. Não existe no Figma: criada em 09/11/2026 pro FAQ da
// LP do programa para familiares, a partir de referência do fundador.
//
// Por baixo é um <details>, então abre com teclado e leitor de tela. A animação (altura e opacidade da
// resposta) é feita aqui, com a duração e a curva dos tokens: só com CSS o fechar não anima no Safari
// nem no Firefox. Com prefers-reduced-motion, abre e fecha na hora.
//
// O fundo do cartão segue o atributo `open` do <details>: ao abrir ele já fica branco; ao fechar, só
// volta ao cinza quando a resposta termina de recolher. A seta gira na hora do clique.
type AccordionProps = {
  titulo: string;
  children: ReactNode;
  abertoAoCarregar?: boolean;
};

function lerToken(nome: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

function duracaoEmMs(valor: string) {
  const numero = Number.parseFloat(valor);
  if (!Number.isFinite(numero)) return 0;
  return valor.endsWith("ms") ? numero : numero * 1000;
}

export function Accordion({ titulo, children, abertoAoCarregar = false }: AccordionProps) {
  const detalhes = useRef<HTMLDetailsElement>(null);
  const corpo = useRef<HTMLDivElement>(null);
  const animacao = useRef<Animation | null>(null);
  const [expandido, setExpandido] = useState(abertoAoCarregar);

  function alternar(evento: MouseEvent<HTMLElement>) {
    evento.preventDefault();
    const elemento = detalhes.current;
    const caixa = corpo.current;
    if (!elemento || !caixa) return;

    const abrir = !expandido;
    setExpandido(abrir);
    animacao.current?.cancel();

    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const opcoes: KeyframeAnimationOptions = {
      duration: semMovimento ? 0 : duracaoEmMs(lerToken("--duration-350")),
      easing: lerToken("--easing-out-expo") || "ease-out",
    };

    if (abrir) {
      elemento.open = true;
      const altura = caixa.scrollHeight;
      animacao.current = caixa.animate(
        [
          { height: "0", opacity: 0 },
          { height: `${altura}px`, opacity: 1 },
        ],
        opcoes,
      );
      return;
    }

    const altura = caixa.offsetHeight;
    const fechando = caixa.animate(
      [
        { height: `${altura}px`, opacity: 1 },
        { height: "0", opacity: 0 },
      ],
      // Segura o último quadro (altura zero) até o <details> fechar, pra a resposta não reaparecer
      // inteira por um instante entre o fim da animação e o fechamento.
      { ...opcoes, fill: "forwards" },
    );
    animacao.current = fechando;
    fechando.onfinish = () => {
      elemento.open = false;
      fechando.cancel();
    };
  }

  return (
    <details ref={detalhes} className="accordion" data-expandido={expandido} open={abertoAoCarregar}>
      <summary className="accordion-titulo" onClick={alternar}>
        <span>{titulo}</span>
        <GlifoExpandLess className="accordion-seta" size={24} />
      </summary>
      <div ref={corpo} className="accordion-corpo">
        <div className="accordion-conteudo">{children}</div>
      </div>
    </details>
  );
}
