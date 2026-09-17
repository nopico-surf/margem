"use client";

import { useEffect, useState } from "react";
import { CardBackground } from "./CardBackground";
import { CardHeader } from "./CardHeader";
import { CardProfissionaisCompleto } from "./CardProfissionaisCompleto";
import { FiltroEspecialidade, type Especialidade } from "./FiltroEspecialidade";
import { BotaoServicosPublicos } from "@/components/ui/BotaoServicosPublicos";
import { URL_AVATAR_PADRAO } from "@/components/icons";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

const ID_PROFISSIONAL_TESTE = "00000000-0000-0000-0000-000000000005";

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

    Promise.all(urlsDasFotos.map((url) => new Promise<void>((resolve) => {
      const imagem = new Image();
      imagem.onload = imagem.onerror = () => resolve();
      imagem.src = url;
    }))).then(() => {
      if (!cancelado) setFotosCarregadas(urlsDasFotos);
    });

    return () => { cancelado = true; };
  }, [chaveDasFotos]);

  const fotosProntas = urlsDasFotos.length === 0 || urlsDasFotos.every((url) => fotosCarregadas.includes(url));

  if (isLoading || !fotosProntas) {
    return (
      <CardBackground id="figma-section-professionals">
        <div className="figma-skeleton-description" aria-hidden="true"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        <div className="figma-skeleton-filter" aria-hidden="true"><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        <article className="figma-professional-card figma-skeleton-professional" aria-hidden="true"><div className="figma-professional-head"><span className="figma-skeleton figma-skeleton-avatar" /><div><span className="figma-skeleton figma-skeleton-name" /><span className="figma-skeleton figma-skeleton-specialty" /><span className="figma-skeleton figma-skeleton-detail" /><span className="figma-skeleton figma-skeleton-detail" /></div></div><div className="figma-skeleton-tags"><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div><div className="figma-skeleton-description"><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div><span className="figma-skeleton figma-skeleton-button" /></article>
        <span className="figma-skeleton figma-skeleton-public-link" aria-hidden="true" />
      </CardBackground>
    );
  }

  if (profissionais.length === 0) return null;

  const profissionaisFiltrados = profissionais.filter(
    (profissional) => profissional.especialidade === especialidadeSelecionada,
  );
  const profissionalFake = profissionais.find((profissional) => profissional.id === ID_PROFISSIONAL_TESTE);
  const profissionaisParaExibir =
    profissionaisFiltrados.length > 0
      ? profissionaisFiltrados
      : profissionalFake && especialidadeSelecionada === "psiquiatra"
        ? [{ ...profissionalFake, especialidade: "psiquiatra" as const }]
        : [];

  function selecionarEspecialidade(especialidade: Especialidade) {
    setEspecialidadeSelecionada(especialidade);
    track("filtro_profissional_clicado", {
      filtro: especialidade === "psicologo" ? "psicologos" : "psiquiatras",
    });
  }

  return (
    <CardBackground id="figma-section-professionals">
      <CardHeader
        title="Profissionais que podem ajudar"
        description="É recomendado falar com psiquiatra e psicólogo. Você pode fazer isso pelo SUS, sem custo. Para atendimento online, você pode falar com um de nossos parceiros."
      />
      <FiltroEspecialidade selecionada={especialidadeSelecionada} onChange={selecionarEspecialidade} />
      {profissionaisParaExibir.map((profissional) => (
        <CardProfissionaisCompleto profissional={profissional} key={profissional.id} />
      ))}
      <BotaoServicosPublicos onClick={() => track("ver_servicos_publicos_clicado")} />
    </CardBackground>
  );
}
