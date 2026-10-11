"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ContatoLink } from "@/components/ui/ContatoLink";
import { IconeWhatsappRodape, IconeInstagramRodape, IconeEmailRodape, IconeFavorito, LogoMargem } from "@/components/icons";
import { CONTATOS, LINK_GRUPO_FACEBOOK, type TipoContato } from "@/lib/contatos";
import { track } from "@/lib/mixpanel";

const ICONES: Record<TipoContato, ComponentType<{ className?: string }>> = {
  whatsapp: IconeWhatsappRodape,
  instagram: IconeInstagramRodape,
  email: IconeEmailRodape,
};

// Figma: componente `rodape` da Home (Experiência do produto, 1472:9223 mobile, 1472:9293 desk1 e
// 1433:182920 largo). Contatos e redes de um lado, card do grupo do Facebook do outro.
export function Footer() {
  function aoClicarNoGrupo() {
    track("grupo_facebook_clicado", { origem: "rodape" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "grupo_facebook_clicado", origem: "rodape" });
  }

  return (
    <footer className="app-footer">
      <div className="app-footer-contatos">
        <LogoMargem className="app-footer-logo" />
        <div className="app-footer-redes">
          <p className="app-footer-title">Contatos e Redes</p>
          <div className="app-footer-list">
            {CONTATOS.map((contato) => {
              const Icone = ICONES[contato.tipo];
              return (
                <ContatoLink
                  key={contato.tipo}
                  className="app-footer-item"
                  href={contato.href}
                  texto={contato.texto}
                  externo={contato.externo}
                  icone={<Icone />}
                  onClick={() => track("contato_site_clicado", { origem: "rodape", tipo_contato: contato.tipo })}
                />
              );
            })}
          </div>
        </div>
      </div>

      <section className="app-footer-card" aria-labelledby="app-footer-card-titulo">
        <div className="app-footer-card-texto">
          <div className="app-footer-card-cabecalho">
            <h2 id="app-footer-card-titulo">Um espaço pra bater papo de perto</h2>
            <p>Grupo no Facebook pra aproximar a nossa comunidade</p>
          </div>
          <Button tamanho="x-small" href={LINK_GRUPO_FACEBOOK} alvoExterno onClick={aoClicarNoGrupo}>
            Fazer parte
            <IconeFavorito />
          </Button>
        </div>
        <div className="app-footer-card-foto">
          <Image src="/assets/grupo-conversa-parque.webp" alt="" fill sizes="(min-width: 86rem) 25vw, (min-width: 48em) 50vw, 100vw" />
        </div>
      </section>
    </footer>
  );
}
