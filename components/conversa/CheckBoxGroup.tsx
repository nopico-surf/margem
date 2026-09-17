"use client";

import { Checkbox } from "@/components/ui/Checkbox";

// Figma: "Check-box-group". Uma linha do checklist.
type CheckBoxGroupProps = {
  item: string;
  selected: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckBoxGroup({ item, selected, onChange }: CheckBoxGroupProps) {
  return (
    <label>
      <Checkbox selected={selected} onChange={onChange} />
      <span className="figma-checklist-copy">{item}</span>
    </label>
  );
}
