"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { fotoPequena } from "@/lib/foto-pequena";
import { rotuloAnosDeExperiencia } from "@/lib/anos-experiencia";
import { BotaoAgendar } from "@/components/ui/BotaoAgendar";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";
import { slugDoNome } from "@/lib/slug-profissional";

// Figma: "card-profissionais-completo".

export const especialidadeLabel: Record<ProfissionalCadastrado["especialidade"], string> = {
  psicologo: "Psicologia",
  psiquiatra: "Psiquiatria",
  assistente_social: "Assistência Social",
};

// O que a pessoa escreveu como especialidade no formulário; sem isso, o rótulo fixo da categoria.
export function rotuloEspecialidade(profissional: Pick<ProfissionalCadastrado, "especialidade" | "especialidade_rotulo">) {
  return profissional.especialidade_rotulo ?? especialidadeLabel[profissional.especialidade];
}

export const registroLabel: Record<ProfissionalCadastrado["especialidade"], string> = {
  psicologo: "CRP",
  psiquiatra: "CRM",
  assistente_social: "CRESS",
};

// Origens do programa para familiares (briefing M56): `programa-painel`, `programa-modulo-5`...
export function veioDoPrograma(origem?: string | null): origem is string {
  return Boolean(origem?.startsWith("programa-"));
}

// Quem vem do programa é familiar e a sessão é pra essa pessoa (briefing M56, item 3). Sem substância
// nem detalhe da situação: a mensagem sai do número da própria pessoa.
export function hrefWhatsappProfissional(profissional: ProfissionalCadastrado, origem?: string | null) {
  const digitos = profissional.whatsapp_link?.replace(/\D/g, "");
  if (!digitos) return undefined;
  const mensagem = veioDoPrograma(origem)
    ? `Olá! Achei o(a) ${profissional.nome} na Margem. Estou fazendo o programa para familiares e gostaria de agendar uma sessão para mim.`
    : `Olá! Achei o(a) ${profissional.nome} na Margem e gostaria de agendar uma sessão`;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

type CardProfissionaisCompletoProps = {
  profissional?: ProfissionalCadastrado;
  estado?: "default" | "in-construction";
  // posição na lista filtrada que a pessoa está vendo, começando em 1
  posicao?: number;
  // De onde o perfil foi aberto, quando a rota não basta (nos guias de SEO, o slug do guia).
  origem?: string;
};

export function CardProfissionaisCompleto({ profissional, estado = "default", posicao, origem }: CardProfissionaisCompletoProps) {
  const pathname = usePathname();

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

  const whatsappHref = hrefWhatsappProfissional(profissional, origem);
  // A página do perfil precisa saber que a pessoa veio do programa, pra mensagem do WhatsApp de lá.
  const hrefPerfil = `/profissionais/${slugDoNome(profissional.nome)}${veioDoPrograma(origem) ? `?origem=${origem}` : ""}`;

  return (
    <article className="figma-professional-card">
      <div className="figma-professional-head">
        <Avatar className="figma-professional-avatar" src={profissional.foto_url && fotoPequena(profissional.foto_url)} />
        <div className="figma-professional-copy">
          <div className="figma-professional-identity">
            <strong>
              {/* O ::after do link cobre o card inteiro: tocar em qualquer parte abre a página, menos no botão. */}
              <Link
                className="figma-professional-link"
                href={hrefPerfil}
                onClick={() =>
                  track("card_profissional_clicado", {
                    rota: pathname,
                    profissional_id: profissional.id,
                    recurso_nome: profissional.nome,
                    especialidade: profissional.especialidade,
                    posicao: posicao ?? null,
                    ...(origem ? { origem } : {}),
                  })
                }
              >
                {profissional.nome}
              </Link>
            </strong>
            <span>{rotuloEspecialidade(profissional)}</span>
          </div>
          <small>{profissional.registro_profissional && <>{registroLabel[profissional.especialidade]}: {profissional.registro_profissional}<br /></>}{rotuloAnosDeExperiencia(profissional.ano_inicio_experiencia)}</small>
        </div>
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
        onClick={() => {
          track("agendar_whatsapp_clicado", {
            rota: pathname,
            tipo_recurso: "profissional",
            profissional_id: profissional.id,
            recurso_nome: profissional.nome,
            especialidade: profissional.especialidade,
            posicao: posicao ?? null,
            ...(origem ? { origem } : {}),
          });
          // Conversão da Meta, configurada no GTM. Vai sem nenhum dado do profissional.
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "agendar_whatsapp" });
        }}
      />
    </article>
  );
}
