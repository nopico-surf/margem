"use client";

import { useEffect, useState } from "react";
import type { OrientationResult } from "./types";

const CARACTERES_POR_SEGUNDO = 250;
const PAUSA_ENTRE_PARAGRAFOS_MS = 100;

// A resposta aparece sendo escrita, um parágrafo por vez. Quem pediu menos movimento no sistema
// recebe o texto inteiro de uma vez.
export function ResponseCopy({ orientation }: { orientation: OrientationResult }) {
  const paragraphs = [
    orientation.acolhimento,
    orientation.orientacao,
    orientation.pilula_espiritual
  ].filter(Boolean) as string[];

  const fullText = paragraphs.join("\n\n");
  const [renderedLength, setRenderedLength] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRenderedLength(fullText.length);
      return;
    }

    setRenderedLength(0);

    const startedAt = performance.now();
    const charactersPerSecond = CARACTERES_POR_SEGUNDO;
    const paragraphGapMs = PAUSA_ENTRE_PARAGRAFOS_MS;
    let frameId = 0;

    function animate(now: number) {
      const elapsed = now - startedAt;
      let nextLength = 0;
      let timelinePosition = 0;

      for (let index = 0; index < paragraphs.length; index += 1) {
        const paragraph = paragraphs[index];
        const paragraphDuration = (paragraph.length / charactersPerSecond) * 1000;
        const paragraphElapsed = elapsed - timelinePosition;
        const revealedInParagraph = Math.min(Math.max(Math.floor((paragraphElapsed / 1000) * charactersPerSecond), 0), paragraph.length);

        nextLength += revealedInParagraph;
        if (revealedInParagraph < paragraph.length || index === paragraphs.length - 1) break;

        const nextParagraphStart = timelinePosition + paragraphDuration + paragraphGapMs;
        if (elapsed < nextParagraphStart) break;

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
    <div className="figma-response-copy">
      {displayedParagraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
