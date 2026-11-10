"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { URL_SAIR_RAPIDO } from "@/lib/familia/config";

// "Sair rápido" (briefing, seção 11.1): o programa pode ser descoberto pela pessoa com o problema.
// Troca a página atual por um site comum com replace, pra o "voltar" não trazer o programa de volta.
// Também funciona com a tecla Esc, em qualquer lugar da tela.
//
// Visual: o mesmo botão transparent x-small que o header padrão usa em "Psicólogos" e "Psiquiatras".
export function sairRapido() {
  window.location.replace(URL_SAIR_RAPIDO);
}

// `atalho={false}` só na galeria /ui, pra o Esc não tirar ninguém da galeria.
export function SairRapido({ atalho = true }: { atalho?: boolean }) {
  useEffect(() => {
    if (!atalho) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") sairRapido();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [atalho]);

  return (
    <Button variante="transparent" tamanho="x-small" semPadding onClick={sairRapido}>
      Sair rápido
    </Button>
  );
}
