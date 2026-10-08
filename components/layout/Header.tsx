"use client";

import { IconeFecharHeader, IconeVoltar, LogoMargem, LogoMargemIcone } from "@/components/icons";
import { BotaoMenu } from "@/components/ui/BotaoMenu";

// Figma: página Header, componente `header`.
//
// Eram dois componentes, HeaderHome e HeaderResultado, e foi por isso que as duas telas acabaram
// com o hambúrguer em distâncias diferentes da borda. Agora é um só, e a única coisa que varia é
// o fundo e se o logo leva para algum lugar.
//
// A classe .app-header é lida pelo MessageInput para medir o teto do hero quando o teclado abre.
// Na home ele fica transparente sobre o hero verde (.home-hero .app-header, em home.css).

type HeaderProps = {
  onOpenMenu: () => void;
  // Quando vem, o logo vira link. Na home ele não vem, porque a pessoa já está no início.
  hrefDoLogo?: string;
  onLogoClick?: () => void;
  // Quando vem, é a variante com seta de voltar (Figma: header, state3 no mobile e state4 no
  // tablet): seta à esquerda, logo no centro, menu à direita. No mobile o logo é só o símbolo
  // (logo, Complete?=False); a partir do tablet é o completo. Sem ele, o header é o de sempre.
  onVoltar?: () => void;
  // Quando vem, o X fica no lugar do menu (Figma: header da home com o campo aberto em tela cheia).
  onFechar?: () => void;
};

export function Header({ onOpenMenu, hrefDoLogo, onLogoClick, onVoltar, onFechar }: HeaderProps) {
  const logo = onVoltar ? (
    <>
      <LogoMargem className="app-logo app-logo-completo" />
      <LogoMargemIcone className="app-logo-icone" />
    </>
  ) : (
    <LogoMargem className="app-logo" />
  );

  return (
    <header className={onVoltar ? "app-header app-header-com-voltar" : "app-header"}>
      {onVoltar && (
        <button className="voltar-button" type="button" aria-label="Voltar" onClick={onVoltar}>
          <IconeVoltar />
        </button>
      )}
      {hrefDoLogo ? (
        <a href={hrefDoLogo} aria-label="Ir para o início" onClick={onLogoClick}>
          {logo}
        </a>
      ) : (
        logo
      )}
      {onFechar ? (
        // Sem o onMouseDown, o toque tira o foco do campo antes do clique: o teclado começa a fechar, o
        // campo cai pro pé da tela e só então o fechamento anima. Quem tira o foco é o próprio onFechar.
        <button className="menu-button" type="button" aria-label="Fechar" onClick={onFechar} onMouseDown={(event) => event.preventDefault()}>
          <IconeFecharHeader />
        </button>
      ) : (
        <BotaoMenu onClick={onOpenMenu} />
      )}
    </header>
  );
}
