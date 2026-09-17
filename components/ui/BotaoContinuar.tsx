"use client";

type BotaoContinuarProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  fullWidth?: boolean;
};

export function BotaoContinuar({ onClick, disabled, label = "Continuar", fullWidth = true }: BotaoContinuarProps) {
  return (
    <button className={`intro-button${fullWidth ? "" : " intro-button-auto"}`} type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
