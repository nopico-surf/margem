"use client";

import type { HTMLAttributes } from "react";

// Figma: Margem System, página Input text, componente `input-text` (5:2372), `size=small`.
//
// O rótulo fica dentro da caixa no tamanho do texto (`default`, `hover`) e sobe pequeno quando o
// campo tem foco ou valor (`focus`, `texting`, `filled`). O `error` pinta a borda de vermelho e troca a
// descrição pela mensagem de erro; o `success` pinta de verde, com a descrição na mesma cor. Os ícones
// das laterais do Figma são opcionais e nenhuma tela usa, então não existem aqui.
//
// `estadoForcado` existe só para a galeria /ui mostrar hover e foco parados.
type InputTextProps = {
  id: string;
  rotulo: string;
  value: string;
  onChange: (valor: string) => void;
  // Ao sair do campo: é onde a tela confere o valor e mostra o erro, sem esperar o envio.
  onBlur?: () => void;
  erro?: string;
  sucesso?: boolean;
  descricao?: string;
  tipo?: "text" | "email";
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  autoCapitalize?: string;
  maxLength?: number;
  estadoForcado?: "hover" | "focus";
};

export function InputText({
  id,
  rotulo,
  value,
  onChange,
  onBlur,
  erro,
  sucesso = false,
  descricao,
  tipo = "text",
  inputMode,
  autoComplete,
  autoCapitalize,
  maxLength,
  estadoForcado,
}: InputTextProps) {
  const textoAbaixo = erro ?? descricao;
  const idTextoAbaixo = `${id}-descricao`;

  return (
    <div
      className="input-text"
      data-preenchido={value ? "true" : "false"}
      {...(erro ? { "data-erro": "true" } : sucesso ? { "data-sucesso": "true" } : {})}
      {...(estadoForcado ? { "data-estado-forcado": estadoForcado } : {})}
    >
      <div className="input-text-caixa">
        <label htmlFor={id}>{rotulo}</label>
        <input
          id={id}
          type={tipo}
          value={value}
          onChange={(evento) => onChange(evento.target.value)}
          onBlur={onBlur}
          inputMode={inputMode}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          aria-invalid={erro ? true : undefined}
          aria-describedby={textoAbaixo ? idTextoAbaixo : undefined}
        />
      </div>
      {textoAbaixo && (
        <p id={idTextoAbaixo} className="input-text-descricao">
          {textoAbaixo}
        </p>
      )}
    </div>
  );
}
