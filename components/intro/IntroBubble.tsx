import { ReactNode } from "react";

export function IntroBubble({ children }: { children: ReactNode }) {
  // h1 porque a bolha é o título de cada tela de entrada (SEO); o visual vem todo do .intro-bubble.
  return <h1 className="intro-bubble">{children}</h1>;
}
