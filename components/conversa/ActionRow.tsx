"use client";

import { PointerEvent, ReactNode, useRef } from "react";

// Fila horizontal de ações. No desktop dá pra arrastar com o mouse; no toque o scroll nativo
// já resolve, então o arrasto fica desligado para não competir com ele.
export function ActionRow({ children }: { children: ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    if ((event.target as Element).closest("a, button")) return;
    const row = rowRef.current;
    if (!row) return;
    dragState.current = { active: true, startX: event.clientX, startScrollLeft: row.scrollLeft };
    row.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const row = rowRef.current;
    if (!row || !dragState.current.active) return;
    row.scrollLeft = dragState.current.startScrollLeft - (event.clientX - dragState.current.startX);
  }

  function stopDragging() {
    dragState.current.active = false;
  }

  return (
    <div
      ref={rowRef}
      className="figma-action-row"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      {children}
    </div>
  );
}
