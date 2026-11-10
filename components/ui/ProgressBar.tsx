// Barra de progresso. Não existe no Figma: criada para o diagnóstico do programa para familiares
// (uma pergunta por tela). Trilho em alpha, preenchimento na cor primária.
type ProgressBarProps = {
  atual: number;
  total: number;
  // Lido por leitor de tela, ex.: "Pergunta 3 de 12".
  rotulo: string;
};

export function ProgressBar({ atual, total, rotulo }: ProgressBarProps) {
  const porcentagem = total > 0 ? Math.min(100, Math.max(0, (atual / total) * 100)) : 0;
  return (
    <div className="progress-bar" role="progressbar" aria-label={rotulo} aria-valuemin={0} aria-valuemax={total} aria-valuenow={atual}>
      <span className="progress-bar-preenchimento" style={{ width: `${porcentagem}%` }} />
    </div>
  );
}
