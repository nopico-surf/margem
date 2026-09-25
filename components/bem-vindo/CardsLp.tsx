import type { ReactNode } from "react";

// Figma: componente `cards-lp` (na instância aparece como "Cards LP"). Ícone de 24, título e uma linha.
// Não tem clique, por isso não tem hover.
type CardsLpProps = {
  icone: ReactNode;
  titulo: string;
  texto: string;
};

export function CardsLp({ icone, titulo, texto }: CardsLpProps) {
  return (
    <div className="cards-lp">
      {icone}
      <div className="cards-lp-texto">
        <h3 className="cards-lp-titulo">{titulo}</h3>
        <p className="cards-lp-descricao">{texto}</p>
      </div>
    </div>
  );
}
