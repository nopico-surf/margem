"use client";

import { useEffect, useState } from "react";
import { ContainerConteudo } from "./ContainerConteudo";
import { ActionRow } from "./ActionRow";
import { CardHeader } from "./CardHeader";
import { CardProfissionaisCompleto } from "./CardProfissionaisCompleto";
import { CardProfissionalSkeleton } from "./CardProfissionalSkeleton";
import { FiltroEspecialidade, type Especialidade } from "./FiltroEspecialidade";
import { Badge } from "@/components/ui/Badge";
import { BotaoServicosPublicos } from "@/components/ui/BotaoServicosPublicos";
import { rolarAteSecao } from "@/components/ui/SectionJump";
import { URL_AVATAR_PADRAO } from "@/components/ui/Avatar";
import { track } from "@/lib/mixpanel";
import { carregarImagem } from "@/lib/carregar-imagem";
import type { ProfissionalCadastrado } from "@/lib/supabase";

export function CardProfissionais({ profissionais, isLoading = false }: { profissionais: ProfissionalCadastrado[]; isLoading?: boolean }) {
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Especialidade>("psicologo");
  const [fotosCarregadas, setFotosCarregadas] = useState<string[]>([]);
  const urlsDasFotos = profissionais.map((profissional) => profissional.foto_url || URL_AVATAR_PADRAO);
  const chaveDasFotos = urlsDasFotos.join("|");

  useEffect(() => {
    let cancelado = false;

    if (urlsDasFotos.length === 0) {
      setFotosCarregadas([]);
      return;
    }

    Promise.all(urlsDasFotos.map(carregarImagem)).then(() => {
      if (!cancelado) setFotosCarregadas(urlsDasFotos);
    });

    return () => { cancelado = true; };
  }, [chaveDasFotos]);

  const fotosProntas = urlsDasFotos.length === 0 || urlsDasFotos.every((url) => fotosCarregadas.includes(url));

  if (isLoading || !fotosProntas) {
    return (
      <ContainerConteudo id="figma-section-professionals">
        <div className="figma-skeleton-description" aria-hidden="true"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        <div className="figma-skeleton-filter" aria-hidden="true"><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        <CardProfissionalSkeleton />
        <span className="figma-skeleton figma-skeleton-public-link" aria-hidden="true" />
      </ContainerConteudo>
    );
  }

  const profissionaisFiltrados = profissionais.filter(
    (profissional) => profissional.especialidade === especialidadeSelecionada,
  );

  function selecionarEspecialidade(especialidade: Especialidade) {
    setEspecialidadeSelecionada(especialidade);
    track("filtro_profissional_clicado", {
      filtro: especialidade === "psicologo" ? "psicologos" : "psiquiatras",
    });
  }

  return (
    <ContainerConteudo id="figma-section-professionals">
      <CardHeader
        title="Profissionais que podem ajudar"
        description="É recomendado falar com psiquiatra e psicólogo. Você pode fazer isso pelo SUS, sem custo. Para atendimento online, você pode falar com um de nossos parceiros"
      />
      <FiltroEspecialidade selecionada={especialidadeSelecionada} onChange={selecionarEspecialidade} />
      {especialidadeSelecionada === "psicologo" && (
        <div className="figma-session-price">
          <Badge color="secondary">Sessões de <strong>R$ 60</strong> a <strong>R$ 200</strong></Badge>
          <p className="figma-session-price-text">Você escolhe o valor dentro dessa faixa, sem precisar justificar</p>
        </div>
      )}
      {profissionaisFiltrados.length === 0 ? (
        <CardProfissionaisCompleto estado="in-construction" />
      ) : profissionaisFiltrados.length === 1 ? (
        <CardProfissionaisCompleto profissional={profissionaisFiltrados[0]} posicao={1} />
      ) : (
        <ActionRow className="figma-professionals-row" origem="profissionais">
          {profissionaisFiltrados.map((profissional, index) => (
            <CardProfissionaisCompleto profissional={profissional} posicao={index + 1} key={profissional.id} />
          ))}
        </ActionRow>
      )}
      <div style={{ alignSelf: "center" }}>
        <BotaoServicosPublicos onClick={() => {
          track("ver_servicos_publicos_clicado");
          rolarAteSecao("figma-section-public-services");
        }} />
      </div>
    </ContainerConteudo>
  );
}
