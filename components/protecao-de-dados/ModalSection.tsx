import { ReactNode } from "react";

export function ModalSection({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="dados-modal-section">
      <h3>{titulo}</h3>
      {children}
    </section>
  );
}
