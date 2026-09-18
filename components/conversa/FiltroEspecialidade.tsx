"use client";

import { Button } from "@/components/ui/Button";

export type Especialidade = "psicologo" | "psiquiatra";

type FiltroEspecialidadeProps = {
  selecionada: Especialidade;
  onChange: (especialidade: Especialidade) => void;
};

// O filtro é o botão x-small: selecionado é `primary`, o resto é `secondary`.
export function FiltroEspecialidade({ selecionada, onChange }: FiltroEspecialidadeProps) {
  const opcoes: { valor: Especialidade; rotulo: string }[] = [
    { valor: "psicologo", rotulo: "Psicologos" },
    { valor: "psiquiatra", rotulo: "Psiquiatras" },
  ];

  return (
    <div className="figma-filter-row">
      {opcoes.map(({ valor, rotulo }) => (
        <Button
          key={valor}
          tamanho="x-small"
          redondo
          variante={selecionada === valor ? "primary" : "secondary"}
          onClick={() => onChange(valor)}
        >
          {rotulo}
        </Button>
      ))}
    </div>
  );
}
