"use client";

import type { ReactNode } from "react";

type SystemButtonProps = {
  label: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  variant?: "primary" | "white";
  onClick?: () => void;
};

export function SystemButton({ label, iconLeft, iconRight, disabled = false, variant = "primary", onClick }: SystemButtonProps) {
  return <button className={`system-button system-button-${variant}`} type="button" disabled={disabled} onClick={onClick}>{iconLeft}<span>{label}</span>{iconRight}</button>;
}
