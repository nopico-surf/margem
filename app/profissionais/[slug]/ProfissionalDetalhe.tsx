"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { especialidadeLabel, hrefWhatsappProfissional, registroLabel } from "@/components/conversa/CardProfissionaisCompleto";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { BotaoAgendar } from "@/components/ui/BotaoAgendar";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// Figma: Margem System, frames 668:924 (mobile), 670:2049 (tablet) e 670:1273 (desktop). É o mesmo
// conteúdo dos cards de /profissionais, reorganizado. Sem nenhum componente novo.

export function ProfissionalDetalhe({ profissional }: { profissional: ProfissionalCadastrado }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const whatsappHref = hrefWhatsappProfissional(profissional);

  function agendar() {
    track("agendar_whatsapp_clicado", {
      rota: pathname,
      tipo_recurso: "profissional",
      profissional_id: profissional.id,
      recurso_nome: profissional.nome,
      especialidade: profissional.especialidade,
      posicao: null,
    });
  }

  function botaoAgendar(className: string) {
    return (
      <div className={className}>
        <BotaoAgendar tamanho="medium" label="Agendar por WhatsApp" href={whatsappHref} disabled={!whatsappHref} onClick={agendar} />
      </div>
    );
  }

  return (
    <main className="figma-result-page profissional-pagina">
      <Header
        onOpenMenu={() => {
          setMenuOpen(true);
          track("menu_clicado", { rota: pathname });
        }}
        hrefDoLogo="/inicio"
        onLogoClick={() => track("logo_clicado", { rota: pathname })}
      />
      <SideMenu
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          track("menu_fechado", { rota: pathname });
        }}
      />

      <div className="profissional-conteudo">
        <div className="profissional-topo">
          <div className="profissional-foto-moldura">
            <Avatar className="profissional-foto" src={profissional.foto_url} />
          </div>

          <article className="profissional-card">
            <div className="profissional-identidade">
              <h1 className="profissional-nome">{profissional.nome}</h1>
              <p className="profissional-especialidade">{especialidadeLabel[profissional.especialidade]}</p>
              <div className="profissional-registro">
                <span>{profissional.registro_profissional && `${registroLabel[profissional.especialidade]}: ${profissional.registro_profissional}`}</span>
                <span>
                  {profissional.anos_experiencia != null &&
                    `${profissional.anos_experiencia} ${profissional.anos_experiencia === 1 ? "ano" : "anos"} de experiência`}
                </span>
              </div>
            </div>

            {profissional.especialidade === "psicologo" && (
              <div className="figma-session-price">
                <Badge color="secondary">Sessões de <strong>R$ 60</strong> a <strong>R$ 200</strong></Badge>
                <p className="figma-session-price-text">Você escolhe o valor dentro dessa faixa, sem precisar justificar</p>
              </div>
            )}

            {profissional.tags.length > 0 && (
              <div className="figma-badges profissional-tags">
                {profissional.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}

            {botaoAgendar("profissional-agendar-card")}
          </article>
        </div>

        {profissional.bio && (
          <section className="profissional-sobre">
            <CardHeader variante="cartao" title="Sobre" description={profissional.bio} />
          </section>
        )}
      </div>

      <Footer />

      {botaoAgendar("profissional-agendar-barra")}
    </main>
  );
}
