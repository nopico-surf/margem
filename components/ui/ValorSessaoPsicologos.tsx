import { Badge } from "./Badge";

// Figma: `valor sessao psicologos` (1438:341815). Sem variante: a mesma caixa em toda tela. Coluna no
// mobile e linha no desktop, por media query em resultado.css.
export function ValorSessaoPsicologos() {
  return (
    <div className="valor-sessao">
      <Badge color="secondary">Sessões de <strong>R$ 60</strong> a <strong>R$ 200</strong></Badge>
      <p className="valor-sessao-texto">Você escolhe o valor dentro dessa faixa, sem precisar justificar</p>
    </div>
  );
}
