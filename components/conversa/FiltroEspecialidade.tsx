"use client";

export type Especialidade = "psicologo" | "psiquiatra";

type FiltroEspecialidadeProps = {
  selecionada: Especialidade;
  onChange: (especialidade: Especialidade) => void;
};

export function FiltroEspecialidade({ selecionada, onChange }: FiltroEspecialidadeProps) {
  return (
    <div className="figma-filter-row">
      <button
        className={selecionada === "psicologo" ? "is-selected" : ""}
        type="button"
        onClick={() => onChange("psicologo")}
      >
        Psicologos
      </button>
      <button
        className={selecionada === "psiquiatra" ? "is-selected" : ""}
        type="button"
        onClick={() => onChange("psiquiatra")}
      >
        Psiquiatras
      </button>
    </div>
  );
}
