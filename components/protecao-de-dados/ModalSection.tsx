import { ReactNode } from "react";

export function ModalSection({ titulo, id, children }: { titulo: string; id?: string; children: ReactNode }) {
  return (
    <section className="dados-modal-section" id={id}>
      <h3>{titulo}</h3>
      {children}
    </section>
  );
}
