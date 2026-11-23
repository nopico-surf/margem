import { useLayoutEffect, useRef } from "react";

// Os cards mostram duas linhas de tags (.figma-badges, max-height 54px). Regras:
// - tag do tema (data-tema="1": álcool, drogas, redução de danos...) tem prioridade no espaço: se não
//   cabe inteira no que sobrou da linha, vai pra linha seguinte (cortada só se passar da linha inteira);
// - o buraco que sobra é preenchido por tags que cabem inteiras e, se nenhuma couber, por uma tag que
//   não é do tema, cortada com "..." (o text-overflow já está no CSS), se sobrar ao menos LARGURA_MINIMA.
// A ordem na tela é feita com `order`, sem mexer no DOM. As que passam da segunda linha ficam
// escondidas pelo overflow.
const LINHAS = 2;
const LARGURA_MINIMA = 72;

type Item = { el: HTMLElement; largura: number; tema: boolean };

export function useTagsPreenchendo<T extends HTMLElement>(chave: string) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    function encaixar() {
      if (!container) return;
      const elementos = Array.from(container.children) as HTMLElement[];
      elementos.forEach((el) => {
        el.style.maxWidth = "";
        el.style.order = "";
      });

      // -1: a largura chega arredondada e, sem folga, a tag quebra de linha.
      const total = container.getBoundingClientRect().width - 1;
      const folga = parseFloat(getComputedStyle(container).columnGap) || 0;
      let restantes: Item[] = elementos.map((el) => ({ el, largura: el.offsetWidth, tema: el.dataset.tema === "1" }));
      let ordem = 0;

      for (let linha = 0; linha < LINHAS && restantes.length > 0; linha++) {
        let usado = 0;
        const colocar = (item: Item, larguraMaxima?: number) => {
          item.el.style.order = String(ordem++);
          if (larguraMaxima !== undefined) item.el.style.maxWidth = `${Math.floor(larguraMaxima)}px`;
          usado += (usado > 0 ? folga : 0) + (larguraMaxima ?? item.largura);
          restantes = restantes.filter((outro) => outro !== item);
        };

        for (const item of [...restantes]) {
          if (usado === 0 || usado + folga + item.largura <= total) colocar(item);
        }

        const sobra = total - usado - folga;
        if (sobra >= LARGURA_MINIMA) {
          const candidata = restantes.find((item) => !item.tema);
          if (candidata) colocar(candidata, sobra);
        }
      }

      restantes.forEach((item) => { item.el.style.order = String(ordem++); });
    }

    encaixar();
    const observador = new ResizeObserver(encaixar);
    observador.observe(container);
    document.fonts?.ready.then(encaixar);
    return () => observador.disconnect();
  }, [chave]);

  return ref;
}
