"use client";

import type { ReactNode } from "react";

type SystemBadgeProps = { text: string; icon?: ReactNode };

export function SystemBadge({ text, icon }: SystemBadgeProps) {
  return <span className="system-badge">{icon}<span>{text}</span></span>;
}
