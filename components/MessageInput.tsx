"use client";

import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const MIN_HEIGHT = 36; // 1 linha (20px de texto + 16px de padding vertical)
const MAX_HEIGHT = 76; // 3 linhas (60px de texto + 16px de padding vertical)

export function MessageInput({ value, onChange, onSubmit }: MessageInputProps) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialFocusRef = useRef(true);
  const state = value.length > 0 ? "filed" : focused ? "focused" : "default";

  // Autofocus real ao abrir a home. Marca o estado como focado no mesmo efeito:
  // o autoFocus do navegador pode focar o campo antes do React conectar o onFocus,
  // deixando o estado interno dessincronizado do foco real do DOM.
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    textarea?.focus({ preventScroll: true });

    const frame = requestAnimationFrame(() => {
      initialFocusRef.current = false;
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  // Fallback: se o foco real não pegou (ex: janela sem foco no load), qualquer tecla digitada é redirecionada para o campo.
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
    <form className={`message-component message-component-${state}`} onSubmit={onSubmit} onClick={() => textareaRef.current?.focus()}>
      {state === "default" && (
        <div className="message-component-placeholder" aria-hidden="true">
          <span className="message-component-caret" />
          <span>Como as drogas têm afetado você?</span>
        </div>
      )}
      <textarea
        ref={textareaRef}
        autoFocus
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
          <button type="submit" disabled={!value.trim()}>Enviar</button>
        </div>
      )}
    </form>
  );
}
