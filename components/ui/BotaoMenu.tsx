"use client";

import { IconeMenu } from "@/components/icons";

// Uma classe só e uma cor só. Antes eram duas classes, `.menu-button` e `.figma-result-menu`, e só
// uma delas zerava o padding que o navegador dá a todo <button>: por isso o ícone da home vazava
// 6px para a direita. E o ícone tinha duas cores, uma por tela, para o mesmo desenho no mesmo
// lugar.
export function BotaoMenu({ onClick }: { onClick: () => void }) {
  return (
    <button className="menu-button" type="button" aria-label="Abrir menu" onClick={onClick}>
      <IconeMenu />
    </button>
  );
}
