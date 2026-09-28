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
    if ((event.target as Element).closest("a, button")) return;
    const row = rowRef.current;
    if (!row) return;
    dragState.current = { active: true, startX: event.clientX, startScrollLeft: row.scrollLeft, moveu: false };
    row.setPointerCapture(event.pointerId);
    row.style.userSelect = "none";
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const row = rowRef.current;
    if (!row || !dragState.current.active) return;
    event.preventDefault();
    const delta = event.clientX - dragState.current.startX;
    if (Math.abs(delta) >= LIMIAR_ARRASTO_PX) dragState.current.moveu = true;
    row.scrollLeft = dragState.current.startScrollLeft - delta;
  }

  function stopDragging() {
    if (origem && dragState.current.active && dragState.current.moveu) track("fileira_arrastada", { origem });
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
    >
      {children}
    </div>
  );
}
