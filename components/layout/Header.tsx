"use client";

import { LogoMargem } from "@/components/icons";
import { BotaoMenu } from "@/components/ui/BotaoMenu";

// Figma: página Header, componente `header`.
//
// Eram dois componentes, HeaderHome e HeaderResultado, e foi por isso que as duas telas acabaram
// com o hambúrguer em distâncias diferentes da borda. Agora é um só, e a única coisa que varia é
// o fundo e se o logo leva para algum lugar.
//
// A classe .app-header é lida pelo MessageInput para medir o teto do hero quando o teclado abre.
// O fundo da home vem de `.app-shell > .app-header`, porque lá ele fica sobre o hero.

type HeaderProps = {
  onOpenMenu: () => void;
  // Só muda a cor do ícone: sobre o hero ele é mais escuro.
  sobreHero?: boolean;
  // Quando vem, o logo vira link. Na home ele não vem, porque a pessoa já está no início.
  hrefDoLogo?: string;
  onLogoClick?: () => void;
};

export function Header({ onOpenMenu, sobreHero = false, hrefDoLogo, onLogoClick }: HeaderProps) {
  const logo = <LogoMargem className="app-logo" />;

  return (
    <header className="app-header">
      {hrefDoLogo ? (
        <a href={hrefDoLogo} aria-label="Ir para o início" onClick={onLogoClick}>
          {logo}
        </a>
      ) : (
        logo
      )}
      <BotaoMenu onClick={onOpenMenu} variante={sobreHero ? "home" : "resultado"} />
    </header>
  );
}
