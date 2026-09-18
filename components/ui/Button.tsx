"use client";

import type { ReactNode } from "react";

// Figma: página Button core, componente `button`.
//
// Eram sete componentes no código (ActionButton, BotaoAgendar, BotaoContinuar,
// BotaoServicosPublicos, BotaoTopicos, mais os dois de ícone) para um único set no Figma. Cada um
// tinha o estilo escrito num CSS diferente, e nenhum tinha hover, foco, pressionado ou carregando.
//
// Aqui estão só os eixos que aparecem em tela. O Figma tem `mode`, `padding` e `function=danger`
// também, mas nenhuma tela usa, e criar abstração para caso que não apareceu é o que o CLAUDE.md
// proíbe. Quando aparecer, acrescenta.

type ButtonProps = {
  children: ReactNode;
  variante?: "primary" | "secondary" | "transparent";
  tamanho?: "x-small" | "small" | "medium";
  // Canto 999 em vez de 12. No Figma é a propriedade `radius-full`.
  redondo?: boolean;
  larguraTotal?: boolean;
  // Vira <a>. Serve para as ações de recurso, que são link de verdade.
  href?: string;
  alvoExterno?: boolean;
  disabled?: boolean;
  carregando?: boolean;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

export function Button({
  children,
  variante = "primary",
  tamanho = "small",
  redondo = false,
  larguraTotal = false,
  href,
  alvoExterno = false,
  disabled = false,
  carregando = false,
  className,
  onClick,
  ...resto
}: ButtonProps) {
  const atributos = {
    className: ["btn", className].filter(Boolean).join(" "),
    "data-variante": variante,
    "data-tamanho": tamanho,
    "data-redondo": String(redondo),
    "data-largura": larguraTotal ? "total" : "conteudo",
    ...(carregando ? { "data-carregando": "true" } : {}),
    ...resto,
  };

  const conteudo = <span className="btn-conteudo">{children}</span>;

  if (href) {
    return (
      <a {...atributos} href={href} onClick={onClick} {...(alvoExterno ? { target: "_blank", rel: "noreferrer" } : {})}>
        {conteudo}
      </a>
    );
  }

  return (
    <button {...atributos} type="button" disabled={disabled || carregando} onClick={onClick}>
      {conteudo}
    </button>
  );
}
