"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { IconeAgendarWhatsapp } from "@/components/icons";
import { GlifoCannabis } from "@/components/icons/glifos";
import { LINK_WHATSAPP_CANNABIS } from "@/lib/contatos";
import { track } from "@/lib/mixpanel";

// Figma: "Frame 214" na home (Experiência do produto, 1440:17637 no mobile). Ainda não é componente
// lá. Fundo cinza com o texto, o botão de WhatsApp, a foto e o selo girando.
//
// No mobile o selo fica por cima da foto; do tablet em diante ele sobe para o lado do texto. Quem
// troca de lugar é o CSS (home.css), por isso o selo está uma vez só no HTML.

// Anotação do Figma: o texto do selo fica girando. Usamos o vetor do Figma (1443:18230), que já
// traz fonte, peso e espaçamento exatos.
export function SeloGiratorio() {
  return (
    <div className="selo-giratorio" role="img" aria-label="Importação legalizada pela ANVISA">
      <span className="selo-giratorio-texto" aria-hidden="true">
        <img src="/assets/selo-cannabis-anvisa.svg" alt="" />
      </span>
      <span className="selo-giratorio-centro">
        <GlifoCannabis color="var(--colors-brand-primary-900)" />
      </span>
    </div>
  );
}

export function BlocoCannabis() {
  return (
    <section className="bloco-cannabis" aria-labelledby="bloco-cannabis-titulo">
      <div className="bloco-cannabis-texto">
        <SeloGiratorio />
        <div className="bloco-cannabis-copy">
          <div className="bloco-cannabis-cabecalho">
            <h2 id="bloco-cannabis-titulo">Cannabis medicinal</h2>
            <p>
              <strong>Da consulta ao tratamento:</strong> acompanhamento médico e acesso seguro ao produto
            </p>
          </div>
          <Button
            tamanho="small"
            href={LINK_WHATSAPP_CANNABIS}
            alvoExterno
            onClick={() => track("cannabis_tratamento_clicado")}
          >
            <IconeAgendarWhatsapp />
            Acessar tratamento
          </Button>
        </div>
      </div>
      <div className="bloco-cannabis-foto">
        <Image
          src="/assets/mulher-cannabis-medicinal.webp"
          alt=""
          fill
          sizes="(min-width: 48em) 50vw, 100vw"
        />
      </div>
    </section>
  );
}
