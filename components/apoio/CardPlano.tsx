"use client";

import { Button } from "@/components/ui/Button";
import { formatarCentavos } from "@/lib/apoio/formatar";

// Figma: Experiência do produto, conjunto "Planos" (1537:29643). No Figma as variantes se chamam
// `Property 1=Prata`, `Property 1=destaque` etc.: são os seis planos, mas o desenho é um só em dois
// arranjos. `base` (Prata, Ouro, Diamante): texto à esquerda e o botão à direita, no meio da altura.
// `opcional` (Destaque, Divulgação, Divulgação Plus): tudo em coluna, com "+" antes do preço.
// No desktop os dois viram coluna (frame 1538:39338).
//
// "Selecionar" é o `button` x-small: primary no card do meio de cada grupo (Ouro e Divulgação), que é o
// destaque fixo do Figma, e secondary nos outros. Quem volta pelo lápis do "Planos selecionados" vê o
// plano que já tinha escolhido em primary, com "Selecionado", e os outros em secondary (anotação do
// Figma, 1537:36150); tocar nele de novo também avança.
//
// O card inteiro é clicável: o clique no botão sobe até ele, e o botão continua lá para quem navega
// pelo teclado.
type CardPlanoProps = {
  arranjo: "base" | "opcional";
  nome: string;
  descricao: string;
  // A segunda linha das descrições de Divulgação e Divulgação Plus, em negrito.
  complemento?: string;
  centavos: number;
  destaque?: boolean;
  selecionado?: boolean;
  onSelecionar?: () => void;
};

export function CardPlano({ arranjo, nome, descricao, complemento, centavos, destaque = false, selecionado = false, onSelecionar }: CardPlanoProps) {
  return (
    <article className="card-plano" data-arranjo={arranjo} onClick={onSelecionar}>
      <div className="card-plano-info">
        <div className="card-plano-cabecalho">
          <h2>{nome}</h2>
          <p>{descricao}</p>
          {complemento && <p className="card-plano-complemento">{complemento}</p>}
        </div>
        <p className="card-plano-preco">
          <span>{arranjo === "opcional" ? "+ R$ " : "R$ "}</span>
          <span className="card-plano-valor">{formatarCentavos(centavos)}</span>
          <span className="card-plano-por-mes"> por mês</span>
        </p>
      </div>
      <Button
        variante={destaque || selecionado ? "primary" : "secondary"}
        tamanho="x-small"
        aria-label={`Selecionar ${nome}`}
      >
        {selecionado ? "Selecionado" : "Selecionar"}
      </Button>
    </article>
  );
}
