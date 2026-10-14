"use client";

import { Button } from "@/components/ui/Button";

export type Especialidade = "psicologo" | "psiquiatra";

export type OpcaoDoFiltro<T extends string> = { valor: T; rotulo: string };

export const OPCOES_ESPECIALIDADE: OpcaoDoFiltro<Especialidade>[] = [
  { valor: "psicologo", rotulo: "Psicologos" },
  { valor: "psiquiatra", rotulo: "Psiquiatras" },
];

type FiltroEspecialidadeProps<T extends string> = {
  opcoes: OpcaoDoFiltro<T>[];
  selecionada: T;
  onChange: (valor: T) => void;
};

// Figma: `button-select`. O filtro é o botão x-small: selecionado é `primary`, o resto é `secondary`.
// Serve à /profissionais (especialidade) e à /redes-de-apoio (públicas e independentes).
export function FiltroEspecialidade<T extends string>({ opcoes, selecionada, onChange }: FiltroEspecialidadeProps<T>) {
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
