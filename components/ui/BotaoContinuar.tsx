"use client";

type BotaoContinuarProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function BotaoContinuar({ onClick, disabled }: BotaoContinuarProps) {
  return (
    <button className="intro-button" type="button" disabled={disabled} onClick={onClick}>
      Continuar
    </button>
  );
}
