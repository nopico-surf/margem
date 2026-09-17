"use client";

import { useState } from "react";
import { CardBackground } from "./CardBackground";
import { CardHeader } from "./CardHeader";
import { CardProfissionaisCompleto } from "./CardProfissionaisCompleto";
import { FiltroEspecialidade, type Especialidade } from "./FiltroEspecialidade";
import { BotaoServicosPublicos } from "@/components/ui/BotaoServicosPublicos";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

const ID_PROFISSIONAL_TESTE = "00000000-0000-0000-0000-000000000005";

export function CardProfissionais({ profissionais }: { profissionais: ProfissionalCadastrado[] }) {
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Especialidade>("psicologo");

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
