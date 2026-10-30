"use client";

import { useLayoutEffect, useRef, useState, type ImgHTMLAttributes } from "react";

// Componente novo (autorizado em 30/10/2026, sem equivalente no código): o sprite de pixel art do
// jogo, que mostra o osso de `.figma-skeleton` no próprio lugar enquanto a imagem não chega, em vez
// de o tile ficar vazio e o desenho aparecer do nada. É o mesmo <img>, então tamanho e seletores de
// `.mochila-sprite` não mudam. No HTML do servidor fica sem osso: até o JavaScript chegar não dá pra
// saber se a imagem já carregou, e o osso por trás de um sprite pronto apareceria nos vãos dele.
export function SpriteMochila({ className, src, ...resto }: Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> & { src: string }) {
  const ref = useRef<HTMLImageElement>(null);
  // null: ainda o HTML do servidor.
  const [carregando, setCarregando] = useState<boolean | null>(null);
  // Antes da pintura, pra imagem já em cache não piscar o osso. `complete` também vale pra imagem que
  // falhou: nela o osso some e fica o vazio de sempre.
  useLayoutEffect(() => setCarregando(!ref.current?.complete), [src]);
  const classes = ["mochila-sprite", className, carregando && "figma-skeleton mochila-osso"].filter(Boolean).join(" ");
  return <img {...resto} ref={ref} src={src} alt="" className={classes} onLoad={() => setCarregando(false)} onError={() => setCarregando(false)} />;
}
