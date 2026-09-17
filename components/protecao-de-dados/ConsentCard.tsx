"use client";

import { IconeCheckboxSelecionado } from "@/components/icons";

type ConsentCardProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ConsentCard({ checked, onChange }: ConsentCardProps) {
  return (
    <label className="consent-card">
      <input
        className="consent-input"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="consent-checkbox-control" aria-hidden="true">
        <span className="consent-checkbox-box" />
        <IconeCheckboxSelecionado className="consent-checkbox-selected" />
      </span>
      <span className="consent-copy">
        Li e concordo que a Margem guarde e use o que eu escrever aqui, incluindo informações sobre meu uso ou sobre o uso de alguém
      </span>
    </label>
  );
}
