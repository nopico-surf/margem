"use client";

import type { ComponentType } from "react";
import { ContatoLink } from "@/components/ui/ContatoLink";
import { IconeWhatsappRodape, IconeInstagramRodape, IconeEmailRodape } from "@/components/icons";
import { CONTATOS, type TipoContato } from "@/lib/contatos";
import { track } from "@/lib/mixpanel";

const ICONES: Record<TipoContato, ComponentType<{ className?: string }>> = {
  whatsapp: IconeWhatsappRodape,
  instagram: IconeInstagramRodape,
  email: IconeEmailRodape,
};

export function Footer() {
  return (
    <footer className="app-footer">
      <p className="app-footer-title">Contatos</p>
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
    </footer>
  );
}
