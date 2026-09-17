"use client";

import { ReactNode } from "react";

type ContatoLinkProps = {
  href: string;
  texto: string;
  icone: ReactNode;
  externo: boolean;
  className?: string;
  onClick: () => void;
};

export function ContatoLink({ href, texto, icone, externo, className, onClick }: ContatoLinkProps) {
  const alvoExterno = externo ? { target: "_blank" as const, rel: "noreferrer" } : {};

  return (
    <a className={className} href={href} {...alvoExterno} onClick={onClick}>
      {icone}
      <span>{texto}</span>
    </a>
  );
}
