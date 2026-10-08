"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { ActionRow } from "@/components/conversa/ActionRow";
import { GlifoCannabis, GlifoExpandLess, GlifoWork } from "@/components/icons/glifos";
import { LINK_WHATSAPP_CANNABIS } from "@/lib/contatos";
import { track } from "@/lib/mixpanel";

// Figma: "Frame 212" na home (Experiência do produto, 1431:87344). Os passos de como a Margem
// funciona, um aviso "Se preferir, navegue por aqui" e dois atalhos verdes.
//
// Anotação do Figma: anda devagar da direita para a esquerda, e a pessoa pode arrastar. Para andar
// sem fim, a fileira aparece duas vezes e a rolagem volta meia volta quando chega na segunda cópia.
// Para enquanto a pessoa encosta, passa o mouse ou navega pelo teclado, e não anda com
// prefers-reduced-motion. Se tudo cabe na tela, não anda e fica centralizada.

const PASSOS = [
  { numero: 0, icone: "/icons/help_outline.svg", titulo: "Como funciona", texto: "Um guia simples para se conectar" },
  { numero: 1, titulo: "Conte ou escolha um tópico", texto: "Digite no campo acima ou escolha uma das opções abaixo" },
  { numero: 2, titulo: "Você recebe", texto: "Informações claras pensadas para o seu momento" },
  { numero: 3, titulo: "A gente conecta", texto: "Rede pública, profissionais e outras redes de apoio" },
];

// Pixels por segundo.
const VELOCIDADE = 24;
// Depois de a pessoa soltar, espera antes de voltar a andar.
const ESPERA_PARA_VOLTAR = 2500;
// Mouse que só passa por cima não deve travar a faixa.
const ESPERA_PARA_PARAR = 400;

const COR_DO_ICONE = "var(--colors-brand-primary-900)";

function Atalho({
  href,
  externo = false,
  icone,
  titulo,
  texto,
  atalho,
  copia,
}: {
  href: string;
  externo?: boolean;
  icone: ReactNode;
  titulo: string;
  texto: string;
  atalho: string;
  copia: boolean;
}) {
  const conteudo = (
    <>
      <span className="faixa-atalho-icone">{icone}</span>
      <span className="faixa-item-texto">
        <span className="faixa-item-titulo">{titulo}</span>
        <span className="faixa-item-descricao">{texto}</span>
      </span>
    </>
  );
  const props = {
    className: "faixa-item faixa-atalho",
    onClick: () => track("atalho_clicado", { atalho }),
    ...(copia ? { tabIndex: -1 } : {}),
  };

  return externo ? (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {conteudo}
    </a>
  ) : (
    <Link href={href} {...props}>
      {conteudo}
    </Link>
  );
}

function Fileira({ copia }: { copia: boolean }) {
  return (
    <div className="faixa-fileira" aria-hidden={copia || undefined}>
      {PASSOS.map((passo) => (
        <div className="faixa-item faixa-passo" key={passo.numero}>
          <span className="faixa-passo-numero">
            {passo.icone ? <img src={passo.icone} alt="" width={16} height={16} /> : passo.numero}
          </span>
          <span className="faixa-item-texto">
            <span className="faixa-item-titulo">{passo.titulo}</span>
            <span className="faixa-item-descricao">{passo.texto}</span>
          </span>
        </div>
      ))}
      <div className="faixa-aviso">
        <span>Se preferir, navegue por aqui</span>
        <GlifoExpandLess className="faixa-aviso-seta" color="var(--colors-neutral-400)" />
      </div>
      <Atalho
        href="/profissionais"
        icone={<GlifoWork size={16} color={COR_DO_ICONE} />}
        titulo="Psicólogos parceiros"
        texto="Acesse para encontrar o seu apoio"
        atalho="psicologos_parceiros"
        copia={copia}
      />
      <Atalho
        href={LINK_WHATSAPP_CANNABIS}
        externo
        icone={<GlifoCannabis size={16} color={COR_DO_ICONE} />}
        titulo="Cannabis medicinal"
        texto="Veja como acessar esse tratamento"
        atalho="cannabis_medicinal"
        copia={copia}
      />
    </div>
  );
}

export function FaixaComoFunciona() {
  const faixaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const faixa = faixaRef.current;
    const trilho = faixa?.querySelector<HTMLDivElement>(".faixa-trilho");
    if (!faixa || !trilho) return;

    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    let posicao = trilho.scrollLeft;
    let anterior = 0;
    let quadro = 0;
    let parado = false;
    let voltarEm: number | undefined;
    let pararEm: number | undefined;
    let tocando = false;
    let arrastoMedido = false;

    // Meia volta: a largura da primeira fileira mais o vão até a segunda.
    const meiaVolta = () => {
      const [primeira, segunda] = trilho.querySelectorAll<HTMLElement>(".faixa-fileira");
      return segunda ? segunda.offsetLeft - primeira.offsetLeft : 0;
    };
    const cabe = () => {
      const primeira = trilho.querySelector<HTMLElement>(".faixa-fileira");
      return !primeira || primeira.scrollWidth <= trilho.clientWidth;
    };

    function aplicarCabe() {
      faixa!.dataset.cabe = cabe() ? "true" : "false";
    }

    function passo(agora: number) {
      const dt = anterior ? Math.min(agora - anterior, 100) : 0;
      anterior = agora;
      if (!parado && !semMovimento.matches && faixa!.dataset.cabe !== "true") {
        const meia = meiaVolta();
        posicao += (VELOCIDADE * dt) / 1000;
        if (meia > 0 && posicao >= meia) posicao -= meia;
        trilho!.scrollLeft = posicao;
      }
      quadro = requestAnimationFrame(passo);
    }

    function parar() {
      window.clearTimeout(pararEm);
      window.clearTimeout(voltarEm);
      parado = true;
    }

    function pararDepois() {
      window.clearTimeout(pararEm);
      pararEm = window.setTimeout(parar, ESPERA_PARA_PARAR);
    }

    function voltarDepois() {
      window.clearTimeout(pararEm);
      window.clearTimeout(voltarEm);
      if (tocando) return;
      voltarEm = window.setTimeout(() => {
        if (tocando) return;
        posicao = trilho!.scrollLeft;
        parado = false;
      }, ESPERA_PARA_VOLTAR);
    }

    // Arrastando para a frente, a fileira também dá a volta, senão a pessoa chegaria ao fim da cópia.
    function aoRolar() {
      const meia = meiaVolta();
      if (parado && meia > 0 && trilho!.scrollLeft >= meia) trilho!.scrollLeft -= meia;
      if (tocando && !arrastoMedido) {
        arrastoMedido = true;
        track("fileira_arrastada", { origem: "como_funciona" });
      }
    }

    const aoTocar = () => {
      tocando = true;
      arrastoMedido = false;
      parar();
    };
    const aoSoltarToque = () => {
      tocando = false;
      voltarDepois();
    };
    const aoFocar = () => parar();
    const aoDesfocar = (event: FocusEvent) => {
      if (!faixa!.contains(event.relatedTarget as Node | null)) voltarDepois();
    };

    aplicarCabe();
    const observador = new ResizeObserver(aplicarCabe);
    observador.observe(trilho);
    quadro = requestAnimationFrame(passo);

    faixa.addEventListener("pointerenter", pararDepois);
    faixa.addEventListener("pointerleave", voltarDepois);
    faixa.addEventListener("pointerdown", parar);
    faixa.addEventListener("wheel", parar, { passive: true });
    faixa.addEventListener("touchstart", aoTocar, { passive: true });
    faixa.addEventListener("touchend", aoSoltarToque);
    faixa.addEventListener("touchcancel", aoSoltarToque);
    faixa.addEventListener("focusin", aoFocar);
    faixa.addEventListener("focusout", aoDesfocar);
    trilho.addEventListener("scroll", aoRolar, { passive: true });

    return () => {
      cancelAnimationFrame(quadro);
      window.clearTimeout(voltarEm);
      window.clearTimeout(pararEm);
      observador.disconnect();
      faixa.removeEventListener("pointerenter", pararDepois);
      faixa.removeEventListener("pointerleave", voltarDepois);
      faixa.removeEventListener("pointerdown", parar);
      faixa.removeEventListener("wheel", parar);
      faixa.removeEventListener("touchstart", aoTocar);
      faixa.removeEventListener("touchend", aoSoltarToque);
      faixa.removeEventListener("touchcancel", aoSoltarToque);
      faixa.removeEventListener("focusin", aoFocar);
      faixa.removeEventListener("focusout", aoDesfocar);
      trilho.removeEventListener("scroll", aoRolar);
    };
  }, []);

  return (
    <div className="faixa-como-funciona" ref={faixaRef}>
      <ActionRow className="faixa-trilho" origem="como_funciona">
        <Fileira copia={false} />
        <Fileira copia />
      </ActionRow>
    </div>
  );
}
