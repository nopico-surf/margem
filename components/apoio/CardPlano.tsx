"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatarCentavos } from "@/lib/apoio/formatar";

// Figma: Experiência do produto, conjunto "Planos" (1537:29643). No Figma as variantes se chamam
// `Property 1=Prata`, `Property 1=destaque` etc.: são os seis planos, mas o desenho é um só em dois
// arranjos. `base` (Prata, Ouro, Diamante): texto à esquerda e o botão à direita, no meio da altura.
// `opcional` (Destaque, Divulgação, Divulgação Plus): tudo em coluna, com "+" antes do preço.
// No desktop os dois viram coluna (frame 1538:39338).
//
// Plano gratuito (Bronze, `Property 1=bronze`, 1552:40948): "Gratuito" em Header/Small no lugar do preço.
//
// "Selecionar" é o `button` x-small: primary no card do meio de cada grupo (Ouro e Divulgação), que é o
// destaque fixo do Figma, e secondary nos outros. Quem volta pelo lápis do "Planos selecionados" vê o
// plano que já tinha escolhido em primary, com "Selecionado", e os outros em secondary (anotação do
// Figma, 1537:36150); tocar nele de novo também avança.
//
// Na troca de plano, o plano que a pessoa já tem mostra o `badge` "Plano atual" no lugar do botão.
//
// O card inteiro é clicável: o clique no botão sobe até ele, e o botão continua lá para quem navega
// pelo teclado.
//
// No checkout do programa para familiares (briefing 01, etapa 1) o mesmo card, no arranjo `opcional`,
// leva o `selo` (o `badge` "Recomendado") acima do nome, a lista do que inclui (`itens`) e nenhum preço
// (`centavos` ausente): a pessoa escolhe o valor na etapa seguinte.
type CardPlanoProps = {
  arranjo: "base" | "opcional";
  nome: string;
  descricao: string;
  // A segunda linha das descrições de Divulgação e Divulgação Plus, em negrito.
  complemento?: string;
  centavos?: number;
  // Checkout do programa: faixa de preço no mesmo desenho do valor do /plano ("R$ 47 a R$ 147", ou
  // "A partir de" + "R$ 37" + "+ sessão"), com o valor em Header/Large.
  faixa?: { antes?: string; valor: string; depois?: string };
  selo?: string;
  itens?: string[];
  destaque?: boolean;
  selecionado?: boolean;
  atual?: boolean;
  onSelecionar?: () => void;
};

export function CardPlano({ arranjo, nome, descricao, complemento, centavos, faixa, selo, itens, destaque = false, selecionado = false, atual = false, onSelecionar }: CardPlanoProps) {
  return (
    <article className="card-plano" data-arranjo={arranjo} onClick={onSelecionar}>
      <div className="card-plano-info">
        <div className="card-plano-cabecalho">
          {selo && <Badge color="primary">{selo}</Badge>}
          <h2>{nome}</h2>
          {itens && itens.length > 0 && (
            <ul className="card-plano-itens">
              {itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <p>{descricao}</p>
          {complemento && <p className="card-plano-complemento">{complemento}</p>}
        </div>
        {faixa ? (
          <p className="card-plano-preco">
            {faixa.antes && <span>{faixa.antes}</span>}
            <span className="card-plano-valor">{faixa.valor}</span>
            {faixa.depois && <span className="card-plano-por-mes">{faixa.depois}</span>}
          </p>
        ) : centavos === undefined ? null : centavos === 0 ? (
          <p className="card-plano-preco card-plano-gratuito">Gratuito</p>
        ) : (
          <p className="card-plano-preco">
            <span>{arranjo === "opcional" ? "+ R$ " : "R$ "}</span>
            <span className="card-plano-valor">{formatarCentavos(centavos).split(",")[0]}</span>
            <span>,{formatarCentavos(centavos).split(",")[1]}</span>
            <span className="card-plano-por-mes"> por mês</span>
          </p>
        )}
      </div>
      {atual ? (
        <Badge color="secondary">Plano atual</Badge>
      ) : (
        <Button
          variante={destaque || selecionado ? "primary" : "secondary"}
          tamanho="x-small"
          aria-label={`Selecionar ${nome}`}
        >
          {selecionado ? "Selecionado" : "Selecionar"}
        </Button>
      )}
    </article>
  );
}
