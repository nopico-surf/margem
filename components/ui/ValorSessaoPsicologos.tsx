import { Badge } from "./Badge";

const FAIXA: Record<"psicologo" | "psiquiatra", [string, string]> = {
  psicologo: ["R$ 60", "R$ 200"],
  psiquiatra: ["R$ 110", "R$ 290"],
};

// Figma: `valor sessao psicologos` (1438:341815). A mesma caixa em toda tela, só a faixa muda com a
// especialidade. Coluna no mobile e linha no desktop, por media query em resultado.css.
export function ValorSessaoPsicologos({ especialidade = "psicologo" }: { especialidade?: keyof typeof FAIXA }) {
  const [minimo, maximo] = FAIXA[especialidade];
  return (
    <div className="valor-sessao">
      <Badge color="secondary">Sessões de <strong>{minimo}</strong> a <strong>{maximo}</strong></Badge>
      <p className="valor-sessao-texto">Você escolhe o valor dentro dessa faixa, sem precisar justificar</p>
    </div>
  );
}
