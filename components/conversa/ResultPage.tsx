"use client";

import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { track } from "@/lib/mixpanel";
import { Messages } from "./Messages";
import { BlocoMaisOpcoes } from "./BlocoMaisOpcoes";
import { CardProfissionais } from "./CardProfissionais";
import { CardsServicosPublicos } from "./CardsServicosPublicos";
import { CardsInstituicoes } from "./CardsInstituicoes";
import { SecaoPassos } from "./SecaoPassos";
import type { CardResource, OrientationResult } from "./types";
import type { ProfissionalCadastrado } from "@/lib/supabase";

type ResultPageProps = {
  message: string;
  orientation: OrientationResult | null;
  isLoading: boolean;
  isResourcesLoading: {
    profissionais: boolean;
    servicosPublicos: boolean;
    instituicoes: boolean;
  };
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
  const [menuOpen, setMenuOpen] = useState(false);

  // O menu era do HeaderResultado. Com um header só para as duas telas, quem abre o menu é a
  // página, igual já acontecia na /inicio.
  function abrirMenu() {
    setMenuOpen(true);
    track("menu_clicado", { rota: "/conversa" });
  }

  function fecharMenu() {
    setMenuOpen(false);
    track("menu_fechado", { rota: "/conversa" });
  }

  return (
    <main className={`figma-result-page${carregamentoInicial ? " figma-result-page-initial-loading" : ""}`}>
      <Header
        onOpenMenu={abrirMenu}
        hrefDoLogo="/inicio"
        onLogoClick={() => track("logo_clicado", { rota: "/conversa" })}
      />
      <SideMenu open={menuOpen} onClose={fecharMenu} />
      <div className="figma-result-main">
        <Messages message={message} orientation={orientation} isLoading={isLoading} error={error} onRetry={onRetry} />
        {mostrarSecoes && <BlocoMaisOpcoes isLoading={Object.values(isResourcesLoading).some(Boolean)} />}
      </div>
      {mostrarSecoes && (
        <div className="figma-result-sections">
          <CardProfissionais profissionais={profissionais} isLoading={isResourcesLoading.profissionais} />
          <CardsServicosPublicos services={servicosPublicos} isLoading={isResourcesLoading.servicosPublicos} />
          <CardsInstituicoes spaces={instituicoes} isLoading={isResourcesLoading.instituicoes} />
          <SecaoPassos
            passo="agora"
            title="Passos reais, para fazer agora"
            description="Escolha um ou dois passos para fazer hoje ou amanhã"
            items={realSteps}
          />
          <SecaoPassos
            passo="planejar"
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
