import { useLayoutEffect, useRef } from "react";

// Os cards mostram duas linhas de tags (.figma-badges, max-height 54px). Sem isso, a tag que não cabe
// inteira pula pra linha de baixo e deixa espaço em branco na de cima. Aqui a próxima tag entra no
// espaço que sobrou, cortada com "..." (o text-overflow já está no CSS), desde que sobre ao menos
// LARGURA_MINIMA. As que passam da segunda linha continuam escondidas pelo overflow.
const LINHAS = 2;
const LARGURA_MINIMA = 72;

export function useTagsPreenchendo<T extends HTMLElement>(chave: string) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    function encaixar() {
      if (!container) return;
      const tags = Array.from(container.children) as HTMLElement[];
      tags.forEach((tag) => { tag.style.maxWidth = ""; });

      const larguraTotal = container.clientWidth;
      const folga = parseFloat(getComputedStyle(container).columnGap) || 0;
      let linha = 0;
      let usado = 0;

      for (const tag of tags) {
        if (linha >= LINHAS) break;
        const largura = tag.offsetWidth;

        if (usado === 0) {
          usado = largura;
          continue;
        }
        if (usado + folga + largura <= larguraTotal) {
          usado += folga + largura;
          continue;
        }
        const sobra = larguraTotal - usado - folga;
        if (sobra >= LARGURA_MINIMA) {
          // -2px: a largura do contêiner chega arredondada e, sem folga, a tag quebra de linha.
          tag.style.maxWidth = `${Math.floor(sobra) - 2}px`;
          linha += 1;
          usado = 0;
        } else {
          linha += 1;
          if (linha >= LINHAS) break;
          usado = largura;
        }
      }
    }

    encaixar();
    const observador = new ResizeObserver(encaixar);
    observador.observe(container);
    document.fonts?.ready.then(encaixar);
    return () => observador.disconnect();
  }, [chave]);

  return ref;
}
