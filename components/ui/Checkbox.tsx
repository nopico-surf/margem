"use client";

import { IconeCheckboxSelecionado } from "@/components/icons";

// O input real fica escondido pelo CSS; o que aparece é o .figma-checkbox-control ao lado dele.
type CheckboxProps = {
  selected: boolean;
  onChange?: (checked: boolean) => void;
};

export function Checkbox({ selected, onChange }: CheckboxProps) {
  return (
    <>
      <input
        className="figma-checklist-input"
        type="checkbox"
        defaultChecked={selected}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span className="figma-checkbox-control" aria-hidden="true">
        <span className="figma-checkbox-box" />
        <IconeCheckboxSelecionado className="figma-checkbox-selected" />
      </span>
    </>
  );
}
