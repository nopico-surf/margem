"use client";

import { IconeMenu, IconeMenuResultado } from "@/components/icons";

// Uma classe só. Antes eram duas, `.menu-button` e `.figma-result-menu`, e só uma delas zerava o
// padding que o navegador dá a todo <button>: por isso o ícone da home vazava 6px para a direita.
//
// `variante` hoje escolhe apenas a cor do ícone, que é diferente nas duas telas. Isso é herança e
// vale rever: o mesmo desenho, no mesmo lugar, em duas cores.
type BotaoMenuProps = {
  onClick: () => void;
  variante?: "home" | "resultado";
};

export function BotaoMenu({ onClick, variante = "home" }: BotaoMenuProps) {
  return (
    <button className="menu-button" type="button" aria-label="Abrir menu" onClick={onClick}>
      {variante === "home" ? <IconeMenu /> : <IconeMenuResultado />}
    </button>
  );
}
