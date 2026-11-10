"use client";

import { MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { IconeCaminho } from "@/components/icons";

// Figma: "card-background" com o "card-header" de caminho dentro (home, "Você pode começar por aqui").
// O card inteiro é o clique; "Buscar apoio" é só o rótulo do botão do Figma, não um segundo link.
//
// Desde 09/11/2026 também serve à LP do programa para familiares (/familia): lá o ícone vem pronto
// (`icone`), o card é um link comum (`href`) e o rótulo da ação muda ou some (`acao={null}`, em
// "Como funciona", que não tem clique). Sem essas propriedades, o card é exatamente o da home.
type CardHomeHeaderProps = {
  titulo: string;
  descricao: string;
  indice?: number;
  onSelect?: (indice: number) => void;
  icone?: ReactNode;
  href?: string;
  acao?: string | null;
};

export function CardHomeHeader({ indice = 0, titulo, descricao, onSelect, icone, href, acao = "Buscar apoio" }: CardHomeHeaderProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!onSelect) return;
    event.preventDefault();
    onSelect(indice);
  }

  const conteudo = (
    <>
      <span className="pathway-card-topo">
        {icone ?? <IconeCaminho indice={indice} className="pathway-icon" />}
        <span className="pathway-card-texto">
          <strong>{titulo}</strong>
          <small>{descricao}</small>
        </span>
      </span>
      {acao && <span className="pathway-card-acao">{acao}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="pathway-card">
        {conteudo}
      </Link>
    );
  }

  if (!onSelect) return <div className="pathway-card">{conteudo}</div>;

  return (
    <a href="/conversa" className="pathway-card" onClick={handleClick}>
      {conteudo}
    </a>
  );
}
