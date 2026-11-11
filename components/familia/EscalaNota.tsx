"use client";

import { Button } from "@/components/ui/Button";

// Botões numerados em 2 linhas (componentes-parte1, C1). Não existe no Figma: autorizado pelo
// fundador em 10/11/2026. Composição do Button: o número marcado é primary (verde da Margem), os
// outros secondary, todos neutros entre si (sem vermelho no 1 nem verde no 10, a nota não é
// julgamento). Sem avanço automático: a pessoa pode trocar a nota.
//
// Serve à escala da vida (1 a 10, com legendas) e à pergunta de confiança da meta (0 a 10).

type EscalaNotaProps = {
  minimo: number;
  maximo: number;
  valor: number | null;
  onEscolher: (nota: number) => void;
  // Lido por leitor de tela, ex.: a pergunta da tela.
  rotulo: string;
  // Fixas e sempre visíveis: à esquerda da primeira linha e à direita da segunda.
  legendaMinimo?: string;
  legendaMaximo?: string;
};

export function EscalaNota({ minimo, maximo, valor, onEscolher, rotulo, legendaMinimo, legendaMaximo }: EscalaNotaProps) {
  const numeros = Array.from({ length: maximo - minimo + 1 }, (_, indice) => minimo + indice);
  const metade = Math.ceil(numeros.length / 2);
  const linhas = [numeros.slice(0, metade), numeros.slice(metade)];

  return (
    <div className="escala-nota" role="radiogroup" aria-label={rotulo} style={{ ["--escala-colunas" as string]: metade }}>
      {legendaMinimo && <span className="label-x-small escala-nota-legenda">{legendaMinimo}</span>}
      {linhas.map((linha, indice) => (
        <div key={indice} className="escala-nota-linha">
          {linha.map((numero) => (
            <Button
              key={numero}
              variante={valor === numero ? "primary" : "secondary"}
              tamanho="medium"
              redondo
              larguraTotal
              aria-label={valor === numero ? `${numero}, marcado` : String(numero)}
              onClick={() => onEscolher(numero)}
            >
              {numero}
            </Button>
          ))}
        </div>
      ))}
      {legendaMaximo && <span className="label-x-small escala-nota-legenda" data-lado="direita">{legendaMaximo}</span>}
    </div>
  );
}
