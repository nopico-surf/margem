"use client";

import { useEffect } from "react";

const DURACAO = 4000;

// Toast de confirmação: fixo no rodapé, some sozinho. Só para aviso sem ação; o que tem ação fica na tela.
export function AvisoMochila({ texto, aoFechar }: { texto: string | null; aoFechar?: () => void }) {
  useEffect(() => {
    if (!texto || !aoFechar) return;
    const t = setTimeout(aoFechar, DURACAO);
    return () => clearTimeout(t);
  }, [texto, aoFechar]);

  return (
    <div role="status" className="mochila-toast-area">
      {texto && (
        <p className="mochila-toast" key={texto}>
          <svg className="mochila-toast-check" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 6l3 3 5-6" />
          </svg>
          <span>{texto}</span>
        </p>
      )}
    </div>
  );
}
