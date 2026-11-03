"use client";

import type { ComponentType } from "react";
import { ContatoLink } from "@/components/ui/ContatoLink";
import { IconeWhatsappMenu, IconeInstagramMenu, IconeEmailMenu, IconeFacebookMenu } from "@/components/icons";
import { CONTATOS, LINK_GRUPO_FACEBOOK, type TipoContato } from "@/lib/contatos";
import { track } from "@/lib/mixpanel";

const ICONES: Record<TipoContato, ComponentType<{ className?: string }>> = {
  whatsapp: IconeWhatsappMenu,
  instagram: IconeInstagramMenu,
  email: IconeEmailMenu,
};

// Figma: menu, "Contatos e redes". O grupo do Facebook fica entre o Instagram e o e-mail.
export function MenuContatos({ comGrupo = false }: { comGrupo?: boolean }) {
  function aoClicarNoGrupo() {
    track("grupo_facebook_clicado", { origem: "menu" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "grupo_facebook_clicado", origem: "menu" });
  }

  const itens = CONTATOS.map((contato) => {
    const Icone = ICONES[contato.tipo];
    return (
      <ContatoLink
        key={contato.tipo}
        href={contato.href}
        texto={contato.texto}
        externo={contato.externo}
        icone={<Icone />}
        onClick={() => track("contato_site_clicado", { origem: "menu", tipo_contato: contato.tipo })}
      />
    );
  });

  if (comGrupo) {
    itens.splice(
      itens.findIndex((item) => item.key === "email"),
      0,
      <ContatoLink
        key="grupo"
        href={LINK_GRUPO_FACEBOOK}
        texto="Grupo para bater papo"
        externo
        icone={<IconeFacebookMenu />}
        onClick={aoClicarNoGrupo}
      />,
    );
  }

  return <div className="side-menu-contacts">{itens}</div>;
}
