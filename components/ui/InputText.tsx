"use client";

import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";

// Figma: Margem System, página Input text, componente `input-text` (5:2372), `size=small`.
//
// O rótulo fica dentro da caixa no tamanho do texto (`default`, `hover`) e sobe pequeno quando o
// campo tem foco ou valor (`focus`, `texting`, `filled`). O `error` pinta a borda de vermelho e troca a
// descrição pela mensagem de erro; o `success` pinta de verde, com a descrição na mesma cor.
//
// Os ícones das laterais do Figma (16, a 8 da borda e a 8 do texto) são opcionais. Hoje só a busca do
// blog usa: a lupa no começo e o botão de limpar no fim. O do fim vem pronto de quem usa, porque é
// botão, com ação e nome próprios.
//
// `estadoForcado` existe só para a galeria /ui mostrar hover e foco parados.
type InputTextProps = {
  id: string;
  rotulo: string;
  value: string;
  onChange: (valor: string) => void;
  // Ao sair do campo: é onde a tela confere o valor e mostra o erro, sem esperar o envio.
  onBlur?: () => void;
  onKeyDown?: (evento: KeyboardEvent<HTMLInputElement>) => void;
  erro?: string;
  sucesso?: boolean;
  descricao?: string;
  tipo?: "text" | "email" | "search";
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  enterKeyHint?: HTMLAttributes<HTMLInputElement>["enterKeyHint"];
  autoComplete?: string;
  autoCapitalize?: string;
  spellCheck?: boolean;
  maxLength?: number;
  iconeInicio?: ReactNode;
  iconeFim?: ReactNode;
  estadoForcado?: "hover" | "focus";
};

export function InputText({
  id,
  rotulo,
  value,
  onChange,
  onBlur,
  onKeyDown,
  erro,
  sucesso = false,
  descricao,
  tipo = "text",
  inputMode,
  enterKeyHint,
  autoComplete,
  autoCapitalize,
  spellCheck,
  maxLength,
  iconeInicio,
  iconeFim,
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
        {iconeInicio && <span className="input-text-icone">{iconeInicio}</span>}
        <div className="input-text-campo">
          <label htmlFor={id}>{rotulo}</label>
          <input
            id={id}
            type={tipo}
            value={value}
            onChange={(evento) => onChange(evento.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            inputMode={inputMode}
            enterKeyHint={enterKeyHint}
            autoComplete={autoComplete}
            autoCapitalize={autoCapitalize}
            spellCheck={spellCheck}
            maxLength={maxLength}
            aria-invalid={erro ? true : undefined}
            aria-describedby={textoAbaixo ? idTextoAbaixo : undefined}
          />
        </div>
        {iconeFim && <span className="input-text-icone">{iconeFim}</span>}
      </div>
      {textoAbaixo && (
        <p id={idTextoAbaixo} className="input-text-descricao">
          {textoAbaixo}
        </p>
      )}
    </div>
  );
}
