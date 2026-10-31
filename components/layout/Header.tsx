"use client";

import { IconeFecharHeader, IconeVoltar, LogoMargem, LogoMargemIcone } from "@/components/icons";
import { BotaoMenu } from "@/components/ui/BotaoMenu";
import { Button } from "@/components/ui/Button";

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
  // Botão "Psicólogos e psiquiatras" à esquerda do menu (Figma: header, psicologosEPsiquiatras).
  // Só existe no estado padrão: some com a seta de voltar e com o X, e as telas de profissionais
  // passam false.
  mostrarProfissionais?: boolean;
  // Só o logo, sem menu (Figma: telas do Pix e do código vencido, 1537:36169 e 1542:40036).
  semMenu?: boolean;
  // Botão ao lado do menu, só no header com seta (a Mochila põe o de som aqui).
  antesDoMenu?: React.ReactNode;
};

export function Header({ onOpenMenu, hrefDoLogo, onLogoClick, onVoltar, onFechar, mostrarProfissionais = true, semMenu = false, antesDoMenu }: HeaderProps) {
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
      {semMenu ? null : onFechar ? (
        // Sem o onMouseDown, o toque tira o foco do campo antes do clique: o teclado começa a fechar, o
        // campo cai pro pé da tela e só então o fechamento anima. Quem tira o foco é o próprio onFechar.
        <button className="menu-button" type="button" aria-label="Fechar" onClick={onFechar} onMouseDown={(event) => event.preventDefault()}>
          <IconeFecharHeader />
        </button>
      ) : mostrarProfissionais && !onVoltar ? (
        <div className="app-header-direita">
          <Button variante="secondary" tamanho="xx-small" href="/profissionais">
            Psicólogos e psiquiatras
          </Button>
          <BotaoMenu onClick={onOpenMenu} />
        </div>
      ) : antesDoMenu ? (
        <div className="app-header-direita">
          {antesDoMenu}
          <BotaoMenu onClick={onOpenMenu} />
        </div>
      ) : (
        <BotaoMenu onClick={onOpenMenu} />
      )}
    </header>
  );
}
