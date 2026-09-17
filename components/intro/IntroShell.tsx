import { ReactNode } from "react";

// Esqueleto das duas telas de entrada: conteúdo que rola em cima, ações fixas embaixo.
// `children` recebe o que fica fora desse fluxo, como o modal de privacidade.
type IntroShellProps = {
  conteudo: ReactNode;
  acoes: ReactNode;
  children?: ReactNode;
};

export function IntroShell({ conteudo, acoes, children }: IntroShellProps) {
  return (
    <main className="intro-page">
      <div className="intro-content">{conteudo}</div>
      <div className="intro-actions">{acoes}</div>
      {children}
    </main>
  );
}
