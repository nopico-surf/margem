"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { CardProfissionaisCompleto } from "@/components/conversa/CardProfissionaisCompleto";
import { FiltroEspecialidade, type Especialidade } from "@/components/conversa/FiltroEspecialidade";
import { Badge } from "@/components/ui/Badge";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

type ProfissionaisClienteProps = {
  profissionais: ProfissionalCadastrado[];
  especialidadeInicial: Especialidade;
};

export function ProfissionaisCliente({ profissionais, especialidadeInicial }: ProfissionaisClienteProps) {
  const pathname = usePathname();
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Especialidade>(especialidadeInicial);
  const [menuOpen, setMenuOpen] = useState(false);

  function abrirMenu() {
    setMenuOpen(true);
    track("menu_clicado", { rota: "/profissionais" });
  }

  function fecharMenu() {
    setMenuOpen(false);
    track("menu_fechado", { rota: "/profissionais" });
  }

  function selecionarEspecialidade(especialidade: Especialidade) {
    setEspecialidadeSelecionada(especialidade);
    window.history.replaceState(null, "", `${pathname}?especialidade=${especialidade}`);
    track("filtro_profissional_clicado", {
      filtro: especialidade === "psicologo" ? "psicologos" : "psiquiatras",
    });
  }

  const profissionaisFiltrados = profissionais.filter(
    (profissional) => profissional.especialidade === especialidadeSelecionada,
  );

  return (
    <main className="figma-result-page profissionais-pagina">
      <Header
        onOpenMenu={abrirMenu}
        hrefDoLogo="/inicio"
        onLogoClick={() => track("logo_clicado", { rota: "/profissionais" })}
      />
      <SideMenu open={menuOpen} onClose={fecharMenu} />

      <div className="profissionais-cabecalho">
        <CardHeader
          as="h1"
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
      </div>

      {profissionaisFiltrados.length === 0 ? (
        <ContainerConteudo id="profissionais-sem-resultado">
          <CardProfissionaisCompleto estado="in-construction" />
        </ContainerConteudo>
      ) : (
        <div className="profissionais-grid">
          {profissionaisFiltrados.map((profissional, index) => (
            <CardProfissionaisCompleto profissional={profissional} posicao={index + 1} key={profissional.id} />
          ))}
        </div>
      )}

      <Footer />
    </main>
  );
}
