"use client";

import { PointerEvent, ReactNode, useRef } from "react";
import { track } from "@/lib/mixpanel";

const LIMIAR_ARRASTO_PX = 10;

// Fila horizontal de ações. No desktop dá pra arrastar com o mouse; no toque o scroll nativo
// já resolve, então o arrasto fica desligado para não competir com ele.
export function ActionRow({
  children,
  className = "figma-action-row",
  origem,
}: {
  children: ReactNode;
  className?: string;
  origem?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, startScrollLeft: 0, moveu: false });

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const row = rowRef.current;
    if (!row) return;
    dragState.current = { active: true, startX: event.clientX, startScrollLeft: row.scrollLeft, moveu: false };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const row = rowRef.current;
    if (!row || !dragState.current.active) return;
    const delta = event.clientX - dragState.current.startX;
    if (!dragState.current.moveu) {
      if (Math.abs(delta) < LIMIAR_ARRASTO_PX) return;
      dragState.current.moveu = true;
      row.setPointerCapture(event.pointerId);
      row.style.userSelect = "none";
    }
    event.preventDefault();
    row.scrollLeft = dragState.current.startScrollLeft - delta;
  }

  function stopDragging() {
    const { active, moveu } = dragState.current;
    if (origem && active && moveu) track("fileira_arrastada", { origem });
    if (active && moveu) {
      const engolir = (e: MouseEvent) => e.stopPropagation();
      window.addEventListener("click", engolir, { capture: true, once: true });
      setTimeout(() => window.removeEventListener("click", engolir, { capture: true }), 100);
    }
    dragState.current.active = false;
    const row = rowRef.current;
    if (row) row.style.userSelect = "";
  }

  return (
    <div
      ref={rowRef}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onDragStart={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}
