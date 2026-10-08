"use client";

import { MouseEvent } from "react";
import { IconeCaminho } from "@/components/icons";

// Figma: "card-background" com o "card-header" de caminho dentro (home, "Você pode começar por aqui").
// O card inteiro é o clique; "Buscar apoio" é só o rótulo do botão do Figma, não um segundo link.
type CardHomeHeaderProps = {
  indice: number;
  titulo: string;
  descricao: string;
  onSelect: (indice: number) => void;
};

export function CardHomeHeader({ indice, titulo, descricao, onSelect }: CardHomeHeaderProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onSelect(indice);
  }

  return (
    <a href="/conversa" className="pathway-card" onClick={handleClick}>
      <span className="pathway-card-topo">
        <IconeCaminho indice={indice} className="pathway-icon" />
        <span className="pathway-card-texto">
          <strong>{titulo}</strong>
          <small>{descricao}</small>
        </span>
      </span>
      <span className="pathway-card-acao">Buscar apoio</span>
    </a>
  );
}
