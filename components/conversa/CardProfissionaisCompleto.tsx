"use client";

import { AvatarProfissional, IconeInfo } from "@/components/icons";
import { BotaoAgendar } from "@/components/ui/BotaoAgendar";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// Figma: "card-profissionais-completo".

const especialidadeLabel: Record<ProfissionalCadastrado["especialidade"], string> = {
  psicologo: "Psicologia",
  psiquiatra: "Psiquiatria",
  assistente_social: "Assistência Social",
};

export function CardProfissionaisCompleto({ profissional }: { profissional: ProfissionalCadastrado }) {
  return (
    <article className="figma-professional-card">
      <div className="figma-professional-head">
        <AvatarProfissional className="figma-professional-avatar" src={profissional.foto_url} />
        <div className="figma-professional-copy">
          <div className="figma-professional-identity">
            <strong>{profissional.nome}</strong>
            <span>{especialidadeLabel[profissional.especialidade]}</span>
          </div>
          <small>{profissional.crp && <>CRP: {profissional.crp}<br /></>}{profissional.anos_experiencia != null && `${profissional.anos_experiencia} anos de experiência`}</small>
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
