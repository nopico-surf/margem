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

type Item =
  | { tipo: "espaco"; texto: string; indiceAnterior: number }
  | { tipo: "pedaco"; texto: string; indice: number };

// O bloco cresce conforme o texto aparece, como na versão letra a letra: só o que já foi revelado
// ocupa espaço, então não há área em branco reservada esperando o texto chegar.
//
// Uma palavra já visível nunca se move, porque a quebra de linha é sequencial: as primeiras N
// palavras quebram onde quebrariam no texto inteiro. Isso só vale enquanto os spans forem inline.
// Com display inline-block cada pedaço vira uma caixa indivisível, a linha deixa de poder quebrar
// dentro dele e a diagramação muda.
//
// Os espaços entre um pedaço e outro ficam fora dos spans, pelo mesmo motivo.
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
          itens.push({ tipo: "espaco", texto: token, indiceAnterior: indice - 1 });
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

    function animate(now: number) {
      // Saiu da área visível no meio da animação: completa tudo de uma vez, agora que ninguém está
      // vendo, pra quando a pessoa rolar de volta não ter nenhuma mudança de altura acontecendo bem
      // onde ela está olhando.
      if (!estaVisivel(containerRef.current)) {
        setReveladas(total);
        return;
      }

      const delta = now - frameAnterior;
      frameAnterior = now;
      tempoDecorrido += delta;

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
      {blocos.map((itens, i) => {
        const primeiro = itens.find((item) => item.tipo === "pedaco");
        if (!primeiro || primeiro.indice >= reveladas) return null;

        return (
          <p key={i}>
            {itens.map((item, j) => {
              if (item.tipo === "espaco") {
                return item.indiceAnterior < reveladas ? (
                  <Fragment key={`e${j}`}>{item.texto}</Fragment>
                ) : null;
              }

              return item.indice < reveladas ? (
                <span key={`p${item.indice}`} className="figma-response-copy__pedaco">
                  {item.texto}
                </span>
              ) : null;
            })}
          </p>
        );
      })}
    </div>
  );
}
