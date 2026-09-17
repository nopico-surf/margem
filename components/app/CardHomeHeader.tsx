"use client";

import { MouseEvent } from "react";
import { IconeCaminho, IconeSetaCard } from "@/components/icons";

// Figma: "card_header" dentro de "card home".
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
      <IconeCaminho indice={indice} className="pathway-icon" />
      <span>
        <strong>{titulo}</strong>
        <small>{descricao}</small>
      </span>
      <IconeSetaCard className="pathway-arrow" />
    </a>
  );
}
