"use client";

import type { ComponentType } from "react";
import { ContatoLink } from "@/components/ui/ContatoLink";
import { IconeWhatsappMenu, IconeInstagramMenu, IconeEmailMenu } from "@/components/icons";
import { CONTATOS, type TipoContato } from "@/lib/contatos";
import { track } from "@/lib/mixpanel";

const ICONES: Record<TipoContato, ComponentType<{ className?: string }>> = {
  whatsapp: IconeWhatsappMenu,
  instagram: IconeInstagramMenu,
  email: IconeEmailMenu,
};

export function MenuContatos() {
  return (
    <div className="side-menu-contacts">
      {CONTATOS.map((contato) => {
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
      })}
    </div>
  );
}
