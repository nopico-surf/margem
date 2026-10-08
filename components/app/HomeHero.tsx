"use client";

import Image from "next/image";
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MessageInput } from "./MessageInput";
import { IdentityBadge } from "./IdentityBadge";
import { Header } from "@/components/layout/Header";

// Figma: "Frame 197" da home (header + Container) e, com o campo aberto, o frame "Home" de 628 de
// altura no mobile (1365:9790).
//
// Ao tocar no campo, o hero ocupa a tela inteira: badge e título no alto, campo no pé, X no lugar do
// menu. Anotação do Figma: animação suave de movimento, não troca seca de tela. O hero vira fixo e
// cada peça desliza do lugar onde estava até o novo (FLIP), enquanto o fundo verde cresce do recorte
// antigo até a tela toda.
//
// .home-hero é lido pelo MessageInput para saber se o campo focado é o da home e para medir se badge
// e título cabem acima do teclado. Aberto, ele ocupa a tela toda e o conteúdo para na linha do teclado
// (--teclado-linha, em home.css): é assim que o campo, no pé, sobe junto com o teclado.

// `foto` e `fotoOpacidade` só valem com a foto na tela (do tablet em diante); sem ela o retângulo vem zerado.
type Retangulos = { hero: DOMRect; texto: DOMRect; campo: DOMRect; foto: DOMRect; fotoOpacidade: number };

// Os tokens de movimento (tokens.css), lidos na hora: a Web Animations API não aceita var().
// O build reescreve "420ms" como ".42s", então a unidade precisa ser lida junto com o número.
function tokenDeMovimento(token = "--duration-420") {
  const estilo = getComputedStyle(document.documentElement);
  const duracao = estilo.getPropertyValue(token).trim();
  const numero = parseFloat(duracao) || 0;
  return {
    duration: duracao.endsWith("ms") ? numero : duracao.endsWith("s") ? numero * 1000 : numero,
    easing: estilo.getPropertyValue("--easing-out-expo").trim() || "ease-out",
  };
}

type HomeHeroProps = {
  text: string;
  onChangeText: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onOpenMenu: () => void;
  onExpandir: () => void;
  onFechar: () => void;
};

export function HomeHero({ text, onChangeText, onSubmit, onOpenMenu, onExpandir, onFechar }: HomeHeroProps) {
  const [expandido, setExpandido] = useState(false);
  const lugarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const textoRef = useRef<HTMLDivElement>(null);
  const campoRef = useRef<HTMLDivElement>(null);
  const fotoRef = useRef<HTMLDivElement>(null);
  const fotoClone = useRef<HTMLElement | null>(null);
  const antes = useRef<Retangulos | null>(null);

  function medir(): Retangulos | null {
    if (!heroRef.current || !textoRef.current || !campoRef.current || !fotoRef.current) return null;
    return {
      hero: heroRef.current.getBoundingClientRect(),
      texto: textoRef.current.getBoundingClientRect(),
      campo: campoRef.current.getBoundingClientRect(),
      foto: fotoRef.current.getBoundingClientRect(),
      fotoOpacidade: parseFloat(getComputedStyle(fotoRef.current).opacity),
    };
  }

  function expandir() {
    if (expandido) return;
    antes.current = medir();
    // O hero sai do fluxo; o lugar dele fica reservado pra página de baixo não subir. No meio de um
    // fechamento o lugar ainda está reservado e o hero está esticado pela animação: vale a altura guardada.
    if (lugarRef.current && heroRef.current && !lugarRef.current.style.height) {
      lugarRef.current.style.height = `${heroRef.current.offsetHeight}px`;
    }
    setExpandido(true);
    onExpandir();
  }

  function fechar() {
    if (!expandido) return;
    antes.current = medir();
    (document.activeElement as HTMLElement | null)?.blur();
    setExpandido(false);
    onFechar();
  }

  useLayoutEffect(() => {
    const primeiro = antes.current;
    antes.current = null;
    document.documentElement.classList.toggle("home-campo-aberto", expandido);
    const hero = heroRef.current;
    const texto = textoRef.current;
    const campo = campoRef.current;
    const foto = fotoRef.current;
    const lugar = lugarRef.current;
    if (!hero || !texto || !campo || !foto || !lugar) return;

    // Abrir no meio de um fechamento (ou o contrário): a animação em curso para, e a nova parte de onde
    // a outra estava, que já foi medida em `primeiro`.
    [hero, texto, campo, foto].forEach((el) => el.getAnimations().forEach((animacao) => animacao.cancel()));
    fotoClone.current?.remove();
    fotoClone.current = null;
    foto.style.opacity = "";
    hero.style.position = "";
    hero.style.zIndex = "";
    const devolverLugar = () => {
      lugar.style.height = "";
      hero.style.position = "";
      hero.style.zIndex = "";
    };

    if (!primeiro || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (!expandido) devolverLugar();
      return;
    }
    const ultimo = medir();
    if (!ultimo) return;

    const movimento = tokenDeMovimento();
    const deslizar = (el: HTMLElement, de: DOMRect, para: DOMRect) =>
      el.animate(
        [{ transform: `translate(${de.left - para.left}px, ${de.top - para.top}px)` }, { transform: "none" }],
        movimento,
      );

    deslizar(texto, primeiro.texto, ultimo.texto);
    deslizar(campo, primeiro.campo, ultimo.campo);

    if (expandido) {
      // A foto real já saiu do layout (display: none); um clone fica no lugar dela só pra sumir com fade.
      if (primeiro.foto.width > 0 && primeiro.fotoOpacidade > 0) {
        const clone = foto.cloneNode(true) as HTMLElement;
        Object.assign(clone.style, {
          display: "block",
          position: "fixed",
          margin: "0",
          left: `${primeiro.foto.left}px`,
          top: `${primeiro.foto.top}px`,
          width: `${primeiro.foto.width}px`,
          height: `${primeiro.foto.height}px`,
          pointerEvents: "none",
        });
        clone.setAttribute("aria-hidden", "true");
        hero.appendChild(clone);
        fotoClone.current = clone;
        const remover = () => {
          clone.remove();
          if (fotoClone.current === clone) fotoClone.current = null;
        };
        clone
          .animate([{ opacity: primeiro.fotoOpacidade }, { opacity: 0 }], {
            ...tokenDeMovimento("--duration-260"),
            fill: "forwards",
          })
          .finished.then(remover, remover);
      }

      const { hero: de } = primeiro;
      const { hero: para } = ultimo;
      const recorte = `inset(${Math.max(0, de.top - para.top)}px ${Math.max(0, para.right - de.right)}px ${Math.max(0, para.bottom - de.bottom)}px ${Math.max(0, de.left - para.left)}px round 0 0 var(--radius-2xl) 0)`;
      hero.animate([{ clipPath: recorte }, { clipPath: "inset(0 0 0 0 round 0)" }], movimento);
    } else {
      // Na volta, o espelho da ida: o verde encolhe da tela cheia até a altura do hero, por cima da
      // página, que fica parada porque o lugar continua reservado até o fim. Sem isso o hero voltava
      // pequeno de uma vez e cortava o campo, que ainda vinha deslizando lá de baixo.
      const altura = parseFloat(lugar.style.height) || ultimo.hero.height;
      const canto = getComputedStyle(hero).borderBottomRightRadius;
      hero.style.position = "relative";
      hero.style.zIndex = "calc(var(--z-index-panel) - 1)";
      // A foto reaparece com fade junto com o encolhimento e chega a 1 quando o hero chega ao lugar.
      if (getComputedStyle(foto).display !== "none") {
        const fade = foto.animate([{ opacity: 0 }, { opacity: 1 }], { ...movimento, fill: "forwards" });
        const limpar = () => fade.cancel();
        fade.finished.then(limpar, () => {});
      }
      hero
        .animate(
          [
            { height: `${primeiro.hero.bottom - ultimo.hero.top}px`, borderBottomRightRadius: "0" },
            { height: `${altura}px`, borderBottomRightRadius: canto },
          ],
          movimento,
        )
        .finished.then(devolverLugar, () => {});
    }
  }, [expandido]);

  useEffect(() => {
    if (!expandido) return;
    function aoTeclar(event: KeyboardEvent) {
      if (event.key === "Escape") fechar();
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  });

  useEffect(() => () => document.documentElement.classList.remove("home-campo-aberto"), []);

  return (
    <div className="home-hero-lugar" ref={lugarRef}>
      <section
        className="home-hero"
        ref={heroRef}
        data-expandido={expandido ? "true" : "false"}
        aria-labelledby="home-title"
        onFocus={(event) => {
          if (event.target instanceof HTMLTextAreaElement) expandir();
        }}
      >
        <Header onOpenMenu={onOpenMenu} onFechar={expandido ? fechar : undefined} />
        <div className="home-hero-corpo">
          <div className="home-hero-foto" ref={fotoRef}>
            <Image src="/assets/dois-amigos-abracando.webp" alt="" fill sizes="(min-width: 48em) 50vw, 1vw" />
          </div>
          <div className="home-hero-coluna">
            <div className="home-hero-texto" ref={textoRef}>
              <IdentityBadge />
              <h1 id="home-title">
                Conexão, apoio e escuta,<br className="home-hero-quebra" /> sem julgamentos
              </h1>
            </div>
            <div className="home-hero-campo" ref={campoRef}>
              <MessageInput value={text} onChange={onChangeText} onSubmit={onSubmit} expandido={expandido} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
