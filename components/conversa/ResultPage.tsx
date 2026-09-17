"use client";

import { Footer } from "@/components/layout/Footer";
import { HeaderResultado } from "@/components/layout/HeaderResultado";
import { ResultMessages } from "./ResultMessages";
import { MoreOptions } from "./MoreOptions";
import { CardProfissionais } from "./CardProfissionais";
import { CardsServicosPublicos } from "./CardsServicosPublicos";
import { CardsInstituicoes } from "./CardsInstituicoes";
import { ChecklistSection } from "./ChecklistSection";
import type { OrientationResult } from "./types";

type ResultPageProps = {
  message: string;
  orientation: OrientationResult | null;
  isLoading: boolean;
  error: string | null;
};

export function ResultPage({ message, orientation, isLoading, error }: ResultPageProps) {
  const realSteps = orientation?.checklist_agora ?? [];
  const planningSteps = orientation?.checklist_proximo ?? [];
  const profissionais = orientation?.profissionais ?? [];
  const servicosPublicos = orientation?.servicos_publicos ?? [];
  const instituicoes = orientation?.instituicoes ?? [];
  const mostrarSecoes = !isLoading && orientation;

  return (
    <main className="figma-result-page">
      <HeaderResultado />
      <div className="figma-result-main">
        <ResultMessages message={message} orientation={orientation} isLoading={isLoading} error={error} />
        {mostrarSecoes && <MoreOptions />}
      </div>
      {mostrarSecoes && (
        <div className="figma-result-sections">
          <CardProfissionais profissionais={profissionais} />
          <CardsServicosPublicos services={servicosPublicos} />
          <CardsInstituicoes spaces={instituicoes} />
          <ChecklistSection
            title="Passos reais, para fazer agora"
            description="Escolha um ou dois passos para fazer hoje ou amanhã"
            items={realSteps}
          />
          <ChecklistSection
            title="Para planejar"
            description="Escolha o que faz sentido para você nas próximas semanas"
            items={planningSteps}
          />
        </div>
      )}
      <Footer />
    </main>
  );
}
