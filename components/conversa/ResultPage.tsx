"use client";

import { Footer } from "@/components/layout/Footer";
import { HeaderResultado } from "@/components/layout/HeaderResultado";
import { ResultMessages } from "./ResultMessages";
import { MoreOptions } from "./MoreOptions";
import { CardProfissionais } from "./CardProfissionais";
import { CardsServicosPublicos } from "./CardsServicosPublicos";
import { CardsInstituicoes } from "./CardsInstituicoes";
import { ChecklistSection } from "./ChecklistSection";
import type { CardResource, OrientationResult } from "./types";
import type { ProfissionalCadastrado } from "@/lib/supabase";

type ResultPageProps = {
  message: string;
  orientation: OrientationResult | null;
  isLoading: boolean;
  isResourcesLoading: boolean;
  resources: {
    profissionais: ProfissionalCadastrado[];
    servicos_publicos: CardResource[];
    instituicoes: CardResource[];
  } | null;
  error: string | null;
  onRetry: () => void;
};

export function ResultPage({ message, orientation, isLoading, isResourcesLoading, resources, error, onRetry }: ResultPageProps) {
  const realSteps = orientation?.checklist_agora ?? [];
  const planningSteps = orientation?.checklist_proximo ?? [];
  const profissionais = resources?.profissionais ?? [];
  const servicosPublicos = resources?.servicos_publicos ?? [];
  const instituicoes = resources?.instituicoes ?? [];
  const mostrarSecoes = Boolean(orientation);
  const carregamentoInicial = (isLoading || Boolean(error)) && !orientation;

  return (
    <main className={`figma-result-page${carregamentoInicial ? " figma-result-page-initial-loading" : ""}`}>
      <HeaderResultado />
      <div className="figma-result-main">
        <ResultMessages message={message} orientation={orientation} isLoading={isLoading} error={error} onRetry={onRetry} />
        {mostrarSecoes && <MoreOptions isLoading={isResourcesLoading} />}
      </div>
      {mostrarSecoes && (
        <div className="figma-result-sections">
          <CardProfissionais profissionais={profissionais} isLoading={isResourcesLoading} />
          <CardsServicosPublicos services={servicosPublicos} isLoading={isResourcesLoading} />
          <CardsInstituicoes spaces={instituicoes} isLoading={isResourcesLoading} />
          <ChecklistSection
            title="Passos reais, para fazer agora"
            description="Escolha um ou dois passos para fazer hoje ou amanhã"
            items={realSteps}
            isLoading={isResourcesLoading}
          />
          <ChecklistSection
            title="Para planejar"
            description="Escolha o que faz sentido para você nas próximas semanas"
            items={planningSteps}
            isLoading={isResourcesLoading}
          />
        </div>
      )}
      <Footer />
    </main>
  );
}
