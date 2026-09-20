"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { OrientationResult } from "./types";

const CARACTERES_POR_SEGUNDO = 300;
const PAUSA_ENTRE_PARAGRAFOS_MS = 100;

// A resposta aparece por grupos de palavras com fade. Em teste: para voltar à revelação letra a
// letra, basta NEXT_PUBLIC_ANIMACAO_RESPOSTA=letra, e o código da versão antiga continua aqui.
const MS_ENTRE_PEDACOS = 110;
const DURACAO_FADE_MS = 260;
const PALAVRAS_POR_PEDACO = 5;
const PAUSA_ENTRE_PARAGRAFOS_FADE_MS = 160;

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

// A resposta aparece sendo escrita, um parágrafo por vez. Quem pediu menos movimento no sistema
// recebe o texto inteiro de uma vez.
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
      const delta = now - frameAnterior;
      frameAnterior = now;
      if (estaVisivel(containerRef.current)) tempoDecorrido += delta;

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

type Item = { tipo: "espaco"; texto: string } | { tipo: "pedaco"; texto: string; indice: number };

// O texto inteiro está no DOM desde o primeiro frame, com a diagramação final já formada: cada
// pedaço só vai de opacidade 0 para 1 no lugar onde já estava. Nada entra ou sai do fluxo, então
// nenhuma linha se move enquanto a resposta aparece.
//
// Os espaços entre um pedaço e outro ficam fora dos spans, e os spans são inline, para que a
// quebra de linha caia exatamente onde cairia se o parágrafo fosse texto puro.
function montarPedacos(paragraphs: string[]) {
  const inicios: number[] = [];
  let indice = 0;
  let relogio = 0;

  const blocos = paragraphs.map((paragrafo) => {
    const tokens = paragrafo.match(/\s+|\S+/g) ?? [];
    const itens: Item[] = [];
    let acumulado: string[] = [];
    let palavrasAcumuladas = 0;

    function fecharPedaco() {
      if (acumulado.length === 0) return;
      itens.push({ tipo: "pedaco", texto: acumulado.join(""), indice });
      inicios[indice] = relogio;
      relogio += MS_ENTRE_PEDACOS;
      indice += 1;
      acumulado = [];
      palavrasAcumuladas = 0;
    }

    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        if (palavrasAcumuladas >= PALAVRAS_POR_PEDACO) {
          fecharPedaco();
          itens.push({ tipo: "espaco", texto: token });
        } else {
          acumulado.push(token);
        }
        continue;
      }

      acumulado.push(token);
      palavrasAcumuladas += 1;
    }

    fecharPedaco();
    relogio += PAUSA_ENTRE_PARAGRAFOS_FADE_MS;
    return itens;
  });

  return { blocos, inicios, total: indice };
}

function RespostaFade({ paragraphs }: { paragraphs: string[] }) {
  const fullText = paragraphs.join("\n\n");
  const { blocos, inicios, total } = useMemo(() => montarPedacos(paragraphs), [fullText]);
  const [reveladas, setReveladas] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefereMenosMovimento()) {
      setReveladas(total);
      return;
    }

    setReveladas(0);

    let frameId = 0;
    let tempoDecorrido = 0;
    let frameAnterior = performance.now();
    let contagem = 0;

    // O relógio corre em JS, e não por animation-delay do CSS, pelo mesmo motivo da versão letra
    // a letra: o tempo só avança enquanto o texto está na área visível.
    function animate(now: number) {
      const delta = now - frameAnterior;
      frameAnterior = now;
      if (estaVisivel(containerRef.current)) tempoDecorrido += delta;

      while (contagem < total && inicios[contagem] <= tempoDecorrido) contagem += 1;

      setReveladas((anterior) => Math.max(anterior, contagem));
      if (contagem < total) frameId = window.requestAnimationFrame(animate);
    }

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [fullText, inicios, total]);

  return (
    <div
      className="figma-response-copy figma-response-copy--fade"
      ref={containerRef}
      style={{ "--duracao-fade-pedaco": `${DURACAO_FADE_MS}ms` } as React.CSSProperties}
    >
      {blocos.map((itens, i) => (
        <p key={i}>
          {itens.map((item, j) =>
            item.tipo === "espaco" ? (
              <Fragment key={`e${j}`}>{item.texto}</Fragment>
            ) : (
              <span
                key={`p${item.indice}`}
                className={
                  item.indice < reveladas
                    ? "figma-response-copy__pedaco esta-visivel"
                    : "figma-response-copy__pedaco"
                }
              >
                {item.texto}
              </span>
            )
          )}
        </p>
      ))}
    </div>
  );
}
