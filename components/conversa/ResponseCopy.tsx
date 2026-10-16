"use client";

import { useEffect, useRef, useState } from "react";
import type { OrientationResult } from "./types";

const CARACTERES_POR_SEGUNDO = 300;
const PAUSA_ENTRE_PARAGRAFOS_MS = 100;

// A resposta aparece inteira, com um fade que desce de cima pra baixo (ver resultado.css). Em
// teste: para voltar à revelação letra a letra, basta NEXT_PUBLIC_ANIMACAO_RESPOSTA=letra, e o
// código da versão antiga continua aqui.
const MODO_FADE = process.env.NEXT_PUBLIC_ANIMACAO_RESPOSTA !== "letra";

function prefereMenosMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Checado a cada frame, e não por IntersectionObserver: no mobile a barra de endereço muda a
// altura do viewport de layout sem mudar o que a pessoa vê, e o observer chegou a marcar como
// visível uma tela que já tinha rolado para além do texto. `visualViewport` reflete a área
// realmente visível.
function estaVisivel(elemento: HTMLElement | null) {
  if (!elemento) return false;
  const rect = elemento.getBoundingClientRect();
  const alturaVisivel = window.visualViewport?.height ?? window.innerHeight;
  return rect.bottom > 0 && rect.top < alturaVisivel;
}

// Quem pediu menos movimento no sistema recebe o texto inteiro, sem animação.
export function ResponseCopy({ orientation }: { orientation: OrientationResult }) {
  const paragraphs = [
    orientation.acolhimento,
    orientation.orientacao,
    orientation.pilula_espiritual
  ].filter(Boolean) as string[];

  if (MODO_FADE) return <RespostaFade paragraphs={paragraphs} />;
  return <RespostaLetraALetra paragraphs={paragraphs} />;
}

function RespostaLetraALetra({ paragraphs }: { paragraphs: string[] }) {
  const fullText = paragraphs.join("\n\n");
  const [renderedLength, setRenderedLength] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefereMenosMovimento()) {
      setRenderedLength(fullText.length);
      return;
    }

    setRenderedLength(0);

    const charactersPerSecond = CARACTERES_POR_SEGUNDO;
    const paragraphGapMs = PAUSA_ENTRE_PARAGRAFOS_MS;
    let frameId = 0;
    let tempoDecorrido = 0;
    let frameAnterior = performance.now();

    function animate(now: number) {
      // Saiu da área visível no meio da animação: completa o texto inteiro de uma vez, agora que
      // ninguém está vendo, pra quando a pessoa rolar de volta não ter nenhuma mudança de altura
      // acontecendo bem onde ela está olhando.
      if (!estaVisivel(containerRef.current)) {
        setRenderedLength(fullText.length);
        return;
      }

      const delta = now - frameAnterior;
      frameAnterior = now;
      tempoDecorrido += delta;

      let nextLength = 0;
      let timelinePosition = 0;

      for (let index = 0; index < paragraphs.length; index += 1) {
        const paragraph = paragraphs[index];
        const paragraphDuration = (paragraph.length / charactersPerSecond) * 1000;
        const paragraphElapsed = tempoDecorrido - timelinePosition;
        const revealedInParagraph = Math.min(Math.max(Math.floor((paragraphElapsed / 1000) * charactersPerSecond), 0), paragraph.length);

        nextLength += revealedInParagraph;
        if (revealedInParagraph < paragraph.length || index === paragraphs.length - 1) break;

        const nextParagraphStart = timelinePosition + paragraphDuration + paragraphGapMs;
        if (tempoDecorrido < nextParagraphStart) break;

        nextLength += 2;
        timelinePosition = nextParagraphStart;
      }

      setRenderedLength((previousLength) => Math.max(previousLength, nextLength));
      if (nextLength < fullText.length) frameId = window.requestAnimationFrame(animate);
    }

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [fullText]);

  const displayedText = fullText.slice(0, renderedLength);
  const displayedParagraphs = displayedText.split("\n\n");

  return (
    <div className="figma-response-copy" ref={containerRef}>
      {displayedParagraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

// O texto entra inteiro, então o bloco já nasce com a altura final e nada abaixo dele se mexe.
// O fade é só CSS e respeita prefers-reduced-motion por lá.
function RespostaFade({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="figma-response-copy figma-response-copy--fade">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
