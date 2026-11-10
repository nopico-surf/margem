import type { ReactNode } from "react";

// Texto por cima de uma foto de fundo. Não existe no Figma: criado em 09/11/2026 pro topo da LP do
// programa para familiares e pros blocos "Sem julgamento" e "Sua privacidade", a partir de referência
// do fundador. Sem foto, o fundo fica num cinza escuro até a imagem chegar, pra o texto branco ser
// legível desde já.
//
// - `topo`: ocupa a tela inteira no desktop e um pouco menos no celular; o header fica por cima.
// - `bloco`: cartão arredondado dentro do conteúdo.
type BlocoComImagemProps = {
  variante: "topo" | "bloco";
  imagem?: string;
  children: ReactNode;
};

export function BlocoComImagem({ variante, imagem, children }: BlocoComImagemProps) {
  return (
    <section className="bloco-imagem" data-variante={variante}>
      {imagem && <img className="bloco-imagem-foto" src={imagem} alt="" />}
      <div className="bloco-imagem-texto">{children}</div>
    </section>
  );
}
