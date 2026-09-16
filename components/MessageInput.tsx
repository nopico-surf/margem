"use client";

import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

// REGRA: se um botão ou input está num container que muda de visibilidade/layout baseado em outro
// elemento perder foco (ex: textarea.onBlur desativa state que esconde o botão), adicione
// onMouseDown={(e) => e.preventDefault()} no botão. Sem isso, tocar no botão tira o foco do outro
// elemento, o container desaparece no meio do clique, e o toque cai fora do alvo.
// Ver: https://github.com/anthropics/claude-code/issues/... (não existe issue, é padrão local)

const MIN_HEIGHT = 36; // 1 linha (20px de texto + 16px de padding vertical)
const MAX_HEIGHT = 76; // 3 linhas (60px de texto + 16px de padding vertical)
// Usados só quando o navegador não informa o teclado de jeito nenhum.
const TEMPO_SEM_SINAL = 500;
// Fração da altura da tela. No Instagram (Android) o teclado mediu ~36%; a sobra cobre teclados um pouco mais altos.
const ESTIMATIVA_TECLADO = 0.38;

type VirtualKeyboardApi = EventTarget & { overlaysContent: boolean; boundingRect: DOMRect };

export function MessageInput({ value, onChange, onSubmit }: MessageInputProps) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialFocusRef = useRef(true);
  const state = value.length > 0 ? "filed" : focused ? "focused" : "default";

  // Mantém título + campo logo acima do teclado virtual. Cada navegador informa o teclado de
  // um jeito: o Chrome e o Safari encolhem o visualViewport, alguns webviews encolhem a janela
  // inteira e outros (ex: navegador interno do Instagram) não informam nada.
  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    let alturaSemTeclado = window.innerHeight;
    let larguraAtual = window.innerWidth;
    let focoEm = 0;
    let timers: number[] = [];
    // API que informa abertura e fechamento do teclado. Só é ligada quando nenhum outro sinal
    // chega, porque ligada ela impede o Chrome de encolher o visualViewport.
    const virtualKeyboard = (navigator as Navigator & { virtualKeyboard?: VirtualKeyboardApi }).virtualKeyboard;
    let virtualKeyboardInformou = false;
    const aoMudarVirtualKeyboard = () => {
      if (virtualKeyboard && virtualKeyboard.boundingRect.height > 0) virtualKeyboardInformou = true;
      update();
    };

    const alturaVisivel = () => (viewport ? viewport.height : window.innerHeight);
    const campoFocado = () => {
      const el = document.activeElement;
      return el instanceof HTMLTextAreaElement && el.closest(".hero-focus-track") !== null;
    };

    function update() {
      if (window.innerWidth !== larguraAtual) {
        larguraAtual = window.innerWidth;
        alturaSemTeclado = window.innerHeight;
      }
      const focado = campoFocado();
      // O teclado fechando ainda dispara resize depois do blur, por isso guarda o maior valor.
      if (!focado) alturaSemTeclado = Math.max(alturaSemTeclado, window.innerHeight);

      // Sem subtrair offsetTop: no iOS a página rola ao abrir o teclado e isso esconderia a altura dele.
      const tecladoReal = alturaSemTeclado - alturaVisivel();
      let modo: "fechado" | "real" | "estimado" = "fechado";
      let linhaDoTeclado = alturaVisivel() + (viewport ? viewport.offsetTop : 0);

      const alturaVirtualKeyboard = virtualKeyboard?.overlaysContent ? virtualKeyboard.boundingRect.height : 0;

      if (focado && tecladoReal > 120) {
        modo = "real";
      } else if (focado && alturaVirtualKeyboard > 0 && virtualKeyboard) {
        modo = "real";
        linhaDoTeclado = virtualKeyboard.boundingRect.top;
      } else if (focado && virtualKeyboardInformou) {
        // A API já provou que funciona e agora diz altura 0: o teclado foi fechado sem tirar o foco.
        modo = "fechado";
      } else if (focado && touch && performance.now() - focoEm >= TEMPO_SEM_SINAL) {
        modo = "estimado";
        linhaDoTeclado = window.innerHeight - alturaSemTeclado * ESTIMATIVA_TECLADO;
        if (virtualKeyboard && !virtualKeyboard.overlaysContent) virtualKeyboard.overlaysContent = true;
      }

      const aberto = modo !== "fechado";
      root.classList.toggle("keyboard-open", aberto);
      root.dataset.keyboardMode = modo;
      // Se a janela inteira encolheu, trava o hero na altura original pra ele não refluir.
      root.style.setProperty("--viewport-sem-teclado", `${alturaSemTeclado}px`);
      root.classList.toggle("keyboard-resized", aberto && window.innerHeight < alturaSemTeclado - 120);

      const track = document.querySelector(".hero-focus-track");
      if (!track) return;

      // Mede sempre no estado cheio: sem deslocamento (getBoundingClientRect já devolve a
      // posição com o transform aplicado) e sem nada escondido, senão esconder o badge e o
      // título mudaria a própria medida que gerou a decisão, e ela ficaria oscilando.
      root.style.setProperty("--hero-track-shift", "0px");
      root.classList.remove("keyboard-cramped");

      const limite = linhaDoTeclado - 16;
      const header = document.querySelector(".app-header");
      const teto = header ? header.getBoundingClientRect().bottom : 0;
      root.classList.toggle("keyboard-cramped", aberto && track.getBoundingClientRect().height > limite - teto);

      const folga = limite - track.getBoundingClientRect().bottom;
      root.style.setProperty("--hero-track-shift", aberto ? `${Math.min(0, folga)}px` : "0px");
    }

    function aoFocar(event: FocusEvent) {
      if (!(event.target instanceof HTMLTextAreaElement)) return;
      focoEm = performance.now();
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

    // O track também muda de altura sem o teclado se mexer: o bloco "Conte do seu jeito"
    // aparecendo e a textarea crescendo de linha. Sem remedir aqui, o deslocamento fica
    // velho e a margem até o teclado encolhe (ou some).
    const trackObservado = document.querySelector(".hero-focus-track");
    const observer = new ResizeObserver(update);
    if (trackObservado) observer.observe(trackObservado);

    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", aoFocar);
      document.removeEventListener("focusout", update);
      virtualKeyboard?.removeEventListener("geometrychange", aoMudarVirtualKeyboard);
      root.style.setProperty("--hero-track-shift", "0px");
      root.classList.remove("keyboard-open", "keyboard-cramped", "keyboard-resized");
      delete root.dataset.keyboardMode;
    };
  }, []);

  // Sem foco automático: no celular isso abriria o teclado sozinho ao entrar na tela.
  useEffect(() => {
    initialFocusRef.current = false;
  }, []);

  // No desktop, dá pra digitar direto sem clicar no campo. O foco só acontece quando uma
  // tecla de verdade é pressionada, então o teclado virtual do celular nunca abre sozinho.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const textarea = textareaRef.current;
      if (!textarea || document.activeElement === textarea) return;
      const target = event.target as HTMLElement | null;
      if (target && target !== document.body && target.closest("input, textarea, select, button, a")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.length === 1) {
        event.preventDefault();
        onChange(textarea.value + event.key);
        textarea.focus();
      } else if (event.key === "Backspace") {
        event.preventDefault();
        onChange(textarea.value.slice(0, -1));
        textarea.focus();
      } else if (event.key === "Enter") {
        event.preventDefault();
        onChange(`${textarea.value}\n`);
        textarea.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value, onChange]);

  // Cresce linha a linha (via scrollHeight real, cobre quebra por largura) até 3 linhas, depois ativa scroll interno.
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = `${MIN_HEIGHT}px`;
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [value]);

  return (
    <form className={`message-component message-component-${state}`} onSubmit={onSubmit} onClick={() => { setFocused(true); textareaRef.current?.focus(); }}>
      {state === "default" && (
        <div className="message-component-placeholder" aria-hidden="true">
          <span className="message-component-caret" />
          <span>Como as drogas têm afetado você?</span>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => {
          if (!initialFocusRef.current) setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        placeholder=""
        aria-label="Como as drogas têm afetado você?"
        rows={1}
      />
      {(state === "focused" || state === "filed") && (
        <div className="message-component-meta">
          <span>Conte do seu jeito</span>
          {/* Sem isso o toque tira o foco da textarea, o campo volta ao centro antes do dedo soltar e o clique erra o botão. */}
          <button type="submit" disabled={!value.trim()} onMouseDown={(event) => event.preventDefault()}>Enviar</button>
        </div>
      )}
    </form>
  );
}
