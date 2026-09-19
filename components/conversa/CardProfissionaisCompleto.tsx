"use client";

import { IconeInfo } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { BotaoAgendar } from "@/components/ui/BotaoAgendar";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// Figma: "card-profissionais-completo".

const especialidadeLabel: Record<ProfissionalCadastrado["especialidade"], string> = {
  psicologo: "Psicologia",
  psiquiatra: "Psiquiatria",
  assistente_social: "Assistência Social",
};

const registroLabel: Record<ProfissionalCadastrado["especialidade"], string> = {
  psicologo: "CRP",
  psiquiatra: "CRM",
  assistente_social: "CRESS",
};

type CardProfissionaisCompletoProps = {
  profissional?: ProfissionalCadastrado;
  estado?: "default" | "in-construction";
};

export function CardProfissionaisCompleto({ profissional, estado = "default" }: CardProfissionaisCompletoProps) {
  if (estado === "in-construction") {
    return (
      <article className="figma-professional-card figma-professional-card-construction">
        <div className="figma-professional-construction">
          <Avatar className="figma-professional-construction-avatar" />
          <div className="figma-professional-construction-copy">
            <h3 className="header-small">Estamos construindo a nossa rede de profissionais</h3>
            <p className="text-medium-regular">Por enquanto, você pode acessar os serviços públicos gratuitos</p>
          </div>
        </div>
      </article>
    );
  }

  if (!profissional) return null;

  const whatsappDigits = profissional.whatsapp_link?.replace(/\D/g, "");
  const whatsappText = encodeURIComponent(
    `Oi Vitor, achei o(a) ${profissional.nome} na Margem e gostaria de agendar uma sessão`
  );
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${whatsappText}`
    : undefined;

  return (
    <article className="figma-professional-card">
      <div className="figma-professional-head">
        <Avatar className="figma-professional-avatar" src={profissional.foto_url} />
        <div className="figma-professional-copy">
          <div className="figma-professional-identity">
            <strong>{profissional.nome}</strong>
            <span>{especialidadeLabel[profissional.especialidade]}</span>
          </div>
          <small>{profissional.registro_profissional && <>{registroLabel[profissional.especialidade]}: {profissional.registro_profissional}<br /></>}{profissional.anos_experiencia != null && `${profissional.anos_experiencia} anos de experiência`}</small>
        </div>
        <IconeInfo className="figma-info-icon" />
      </div>
      {profissional.tags.length > 0 && (
        <div className="figma-badges">
          {profissional.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
      {profissional.bio && <p>{profissional.bio}</p>}
      <BotaoAgendar
        label="Agendar por WhatsApp"
        href={whatsappHref}
        disabled={!whatsappHref}
        onClick={() =>
          track("agendar_whatsapp_clicado", {
            profissional_id: profissional.id,
            especialidade: profissional.especialidade,
          })
        }
      />
    </article>
  );
}
