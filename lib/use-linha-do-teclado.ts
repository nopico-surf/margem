"use client";

import { useEffect } from "react";

// Onde está o teclado virtual, pra um campo preso no pé da tela ficar logo acima dele: a busca do blog
// (.blog-busca, o padrão) e o rodapé do treino de conversa do programa para familiares
// (.familia-simulador-rodape, desde 11/11/2026).
//
// CÓPIA da detecção do campo aberto da home (components/app/MessageInput.tsx), de propósito: a home
// não é tocada por causa do blog (pedido de 07/11/2026). As mesmas variações valem aqui: o Chrome e o
// Safari encolhem o visualViewport, alguns webviews encolhem a janela inteira, outros (ex: navegador
// interno do Instagram) não informam nada, e no Chrome do Android dá pra baixar o teclado sem tirar o
// foco do campo. Se mudar uma, olhar a outra.
//
// Diferenças em relação à home: vale só pro campo dentro do `seletor`, as variáveis têm nome próprio
// (--<prefixo>-teclado-topo e --<prefixo>-teclado-linha, pra nunca cruzar com as da home) e não existe
// a medida de "tela apertada", que lá serve pra esconder badge e título.

// Usados só quando o navegador não informa o teclado de jeito nenhum.
const TEMPO_SEM_SINAL = 500;
// Fração da altura da tela. No Instagram (Android) o teclado mediu ~36%; a sobra cobre teclados um pouco mais altos.
const ESTIMATIVA_TECLADO = 0.38;

// Altura do teclado na última vez que o navegador informou, na mesma largura de tela. Serve de reserva
// provisória na próxima abertura, antes de o navegador informar de novo. Fica guardada no aparelho
// (só esse número de layout, nada da pessoa): sem isso, a primeira abertura depois de carregar a
// página usava a estimativa, e num teclado mais baixo que ela o campo subia além do ponto e voltava.
let tecladoMedido: { largura: number; altura: number } | null = null;
const CHAVE_TECLADO = "margem-teclado";

function lerTecladoGuardado() {
  if (tecladoMedido) return;
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CHAVE_TECLADO) ?? "null") as { largura?: unknown; altura?: unknown } | null;
    if (guardado && typeof guardado.largura === "number" && typeof guardado.altura === "number" && guardado.altura > 0) {
      tecladoMedido = { largura: guardado.largura, altura: guardado.altura };
    }
  } catch {}
}

function guardarTeclado(medida: { largura: number; altura: number }) {
  if (tecladoMedido?.largura === medida.largura && tecladoMedido.altura === medida.altura) return;
  tecladoMedido = medida;
  try {
    window.localStorage.setItem(CHAVE_TECLADO, JSON.stringify(medida));
  } catch {}
}

type VirtualKeyboardApi = EventTarget & { overlaysContent: boolean; boundingRect: DOMRect };

export function useLinhaDoTeclado({ seletor = ".blog-busca", prefixo = "busca" }: { seletor?: string; prefixo?: string } = {}) {
  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const varTopo = `--${prefixo}-teclado-topo`;
    const varLinha = `--${prefixo}-teclado-linha`;
    const chaveDataset = `${prefixo}Teclado`;
    let alturaSemTeclado = window.innerHeight;
    let larguraAtual = window.innerWidth;
    let focoEm = 0;
    let timers: number[] = [];
    // API que informa abertura e fechamento do teclado. Só é ligada quando nenhum outro sinal
    // chega, porque ligada ela impede o Chrome de encolher o visualViewport.
    const virtualKeyboard = (navigator as Navigator & { virtualKeyboard?: VirtualKeyboardApi }).virtualKeyboard;
    let virtualKeyboardInformou = false;
    // O visualViewport (ou a janela) já encolheu com o teclado alguma vez: campo focado e teclado
    // fechado é teclado baixado sem tirar o foco, não falta de sinal.
    let viewportInformou = false;
    const aoMudarVirtualKeyboard = () => {
      if (virtualKeyboard && virtualKeyboard.boundingRect.height > 0) virtualKeyboardInformou = true;
      update();
    };

    lerTecladoGuardado();
    let maiorNaAbertura = 0;
    const reservaProvisoria = () =>
      tecladoMedido?.largura === larguraAtual ? tecladoMedido.altura : alturaSemTeclado * ESTIMATIVA_TECLADO;

    const alturaVisivel = () => (viewport ? viewport.height : window.innerHeight);
    const campoObservado = (el: Element | null) =>
      (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && el.closest(seletor) !== null;

    function update() {
      if (window.innerWidth !== larguraAtual) {
        larguraAtual = window.innerWidth;
        alturaSemTeclado = window.innerHeight;
      }
      const focado = campoObservado(document.activeElement);
      // O teclado fechando ainda dispara resize depois do blur, por isso guarda o maior valor.
      if (!focado) alturaSemTeclado = Math.max(alturaSemTeclado, window.innerHeight);

      // Sem subtrair offsetTop: no iOS a página rola ao abrir o teclado e isso esconderia a altura dele.
      const tecladoReal = alturaSemTeclado - alturaVisivel();
      let modo: "fechado" | "real" | "provisorio" | "estimado" = "fechado";
      let linhaDoTeclado = alturaVisivel() + (viewport ? viewport.offsetTop : 0);

      const alturaVirtualKeyboard = virtualKeyboard?.overlaysContent ? virtualKeyboard.boundingRect.height : 0;

      if (focado && tecladoReal > 120) {
        modo = "real";
        viewportInformou = true;
      } else if (focado && alturaVirtualKeyboard > 0 && virtualKeyboard) {
        modo = "real";
        linhaDoTeclado = virtualKeyboard.boundingRect.top;
      } else if (focado && touch && performance.now() - focoEm < TEMPO_SEM_SINAL) {
        // O teclado ainda está subindo e o navegador não informou nada: reserva o espaço já no toque,
        // pra o campo ir direto pra perto do lugar final em vez de ir até o pé da tela e saltar.
        modo = "provisorio";
        linhaDoTeclado = window.innerHeight - reservaProvisoria();
      } else if (focado && (virtualKeyboardInformou || viewportInformou)) {
        // O navegador já provou que informa o teclado e agora diz que não tem: foi fechado sem tirar o foco.
        modo = "fechado";
      } else if (focado && touch) {
        modo = "estimado";
        linhaDoTeclado = window.innerHeight - alturaSemTeclado * ESTIMATIVA_TECLADO;
        if (virtualKeyboard && !virtualKeyboard.overlaysContent) virtualKeyboard.overlaysContent = true;
      }

      const aberto = modo !== "fechado";
      root.dataset[chaveDataset] = modo;
      // No iOS a página rola ao abrir o teclado: o topo visível é o offsetTop do visualViewport.
      if (aberto) {
        const topo = modo === "real" && viewport && tecladoReal > 120 ? viewport.offsetTop : 0;
        if (modo === "real") {
          const altura = window.innerHeight - (linhaDoTeclado - topo);
          const reserva = reservaProvisoria();
          const subindo = touch && performance.now() - focoEm < TEMPO_SEM_SINAL;
          // Guarda a maior altura desta abertura: a do meio da animação (abrindo ou fechando) é menor.
          // Logo depois do toque, uma altura menor que a reserva é o teclado ainda subindo: não guarda.
          maiorNaAbertura = Math.max(maiorNaAbertura, altura);
          if (!subindo || maiorNaAbertura >= reserva) guardarTeclado({ largura: larguraAtual, altura: maiorNaAbertura });
          // E não puxa o campo pra baixo da reserva: ele desceria e subiria de novo.
          if (subindo && altura < reserva) linhaDoTeclado = window.innerHeight + topo - reserva;
        }
        root.style.setProperty(varTopo, `${topo}px`);
        root.style.setProperty(varLinha, `${linhaDoTeclado}px`);
      } else {
        root.style.removeProperty(varTopo);
        root.style.removeProperty(varLinha);
      }
    }

    function aoFocar(event: FocusEvent) {
      if (!campoObservado(event.target as Element | null)) return;
      focoEm = performance.now();
      maiorNaAbertura = 0;
      timers.forEach(window.clearTimeout);
      // Se até aqui o navegador não informou teclado nenhum, entra a estimativa.
      timers = [TEMPO_SEM_SINAL + 50, TEMPO_SEM_SINAL + 500].map((ms) => window.setTimeout(update, ms));
      update();
    }

    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    document.addEventListener("focusin", aoFocar);
    document.addEventListener("focusout", update);
    virtualKeyboard?.addEventListener("geometrychange", aoMudarVirtualKeyboard);

    return () => {
      timers.forEach(window.clearTimeout);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", aoFocar);
      document.removeEventListener("focusout", update);
      virtualKeyboard?.removeEventListener("geometrychange", aoMudarVirtualKeyboard);
      root.style.removeProperty(varTopo);
      root.style.removeProperty(varLinha);
      delete root.dataset[chaveDataset];
    };
  }, [seletor, prefixo]);
}
