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

// O Instagram tem card próprio no rodapé, então não repete na lista de contatos.
const CONTATOS_RODAPE = CONTATOS.filter((contato) => contato.tipo !== "instagram");
const LINK_INSTAGRAM = CONTATOS.find((contato) => contato.tipo === "instagram")!.href;
const SIZES_FOTO = "(min-width: 86rem) 25vw, (min-width: 48em) 50vw, 100vw";

// Figma: componente `rodape` (Margem System, 670:1425: mobile, desk1 e desk 2). Contatos e redes,
// card do Instagram e card do grupo do Facebook. O título do Instagram troca no corte do desk 2
// (86rem), como no Figma. Decidido com o usuário: o Instagram não aparece na lista de contatos e o
// card do Facebook usa o texto novo em todas as larguras.
export function Footer() {
  function aoClicarNoGrupo() {
    track("grupo_facebook_clicado", { origem: "rodape" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "grupo_facebook_clicado", origem: "rodape" });
  }

  function aoClicarNoInstagram() {
    track("grupo_instagram_clicado", { origem: "rodape" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "grupo_instagram_clicado", origem: "rodape" });
  }

  return (
    <footer className="app-footer">
      <div className="app-footer-contatos">
        <LogoMargem className="app-footer-logo" />
        <div className="app-footer-redes">
          <p className="app-footer-title">Contatos</p>
          <div className="app-footer-list">
            {CONTATOS_RODAPE.map((contato) => {
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

      <section className="app-footer-card" aria-labelledby="app-footer-instagram-titulo">
        <div className="app-footer-card-texto">
          <div className="app-footer-card-cabecalho">
            <h2 id="app-footer-instagram-titulo">
              <span className="app-footer-so-estreito">Conteúdo e presença no seu dia a dia</span>
              <span className="app-footer-so-largo">Conteúdo para o seu dia a dia</span>
            </h2>
            <p>Informação, escuta e caminhos de cuidado sem julgamento para a sua rotina</p>
          </div>
          <Button tamanho="x-small" href={LINK_INSTAGRAM} alvoExterno onClick={aoClicarNoInstagram}>
            Seguir no Instagram
            <IconeFavorito />
          </Button>
        </div>
        <div className="app-footer-card-foto">
          <Image src="/assets/grupo-conteudo-instagram.webp" alt="" fill sizes={SIZES_FOTO} />
        </div>
      </section>

      <section className="app-footer-card" aria-labelledby="app-footer-card-titulo">
        <div className="app-footer-card-texto">
          <div className="app-footer-card-cabecalho">
            <h2 id="app-footer-card-titulo">Um espaço pra bater papo de perto</h2>
            <p>Troca de ideias, conversas de perto e acolhimento na comunidade</p>
          </div>
          <Button tamanho="x-small" href={LINK_GRUPO_FACEBOOK} alvoExterno onClick={aoClicarNoGrupo}>
            Participar no Facebook
            <IconeFavorito />
          </Button>
        </div>
        <div className="app-footer-card-foto">
          <Image src="/assets/grupo-conversa-parque.webp" alt="" fill sizes={SIZES_FOTO} />
        </div>
      </section>
    </footer>
  );
}
