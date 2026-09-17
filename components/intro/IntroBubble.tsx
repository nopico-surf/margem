import { ReactNode } from "react";

export function IntroBubble({ children }: { children: ReactNode }) {
  return <div className="intro-bubble">{children}</div>;
}
