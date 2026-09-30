"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { CardProfissionaisCompleto } from "@/components/conversa/CardProfissionaisCompleto";
import { CardProfissionalSkeleton } from "@/components/conversa/CardProfissionalSkeleton";
import { FiltroEspecialidade, type Especialidade } from "@/components/conversa/FiltroEspecialidade";
import { Badge } from "@/components/ui/Badge";
import { URL_AVATAR_PADRAO } from "@/components/ui/Avatar";
import { track } from "@/lib/mixpanel";
import { carregarImagem } from "@/lib/carregar-imagem";
import type { ProfissionalCadastrado } from "@/lib/supabase";

type ProfissionaisClienteProps = {
  profissionais: ProfissionalCadastrado[];
  especialidadeInicial: Especialidade;
};

export function ProfissionaisCliente({ profissionais, especialidadeInicial }: ProfissionaisClienteProps) {
  const pathname = usePathname();
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Especialidade>(especialidadeInicial);
  const [menuOpen, setMenuOpen] = useState(false);
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

  function abrirMenu() {
    setMenuOpen(true);
    track("menu_clicado", { rota: "/profissionais" });
  }

  function fecharMenu() {
    setMenuOpen(false);
    track("menu_fechado", { rota: "/profissionais" });
  }

  function trocarEspecialidade(especialidade: Especialidade) {
    setEspecialidadeSelecionada(especialidade);
    window.history.replaceState(null, "", `${pathname}?especialidade=${especialidade}`);
  }

  function selecionarEspecialidade(especialidade: Especialidade) {
    trocarEspecialidade(especialidade);
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
      <SideMenu
        open={menuOpen}
        onClose={fecharMenu}
        rota="/profissionais"
        onSelecionarEspecialidade={trocarEspecialidade}
      />

      <div className="profissionais-cabecalho">
        <CardHeader as="h1" title="Profissionais que podem ajudar" />
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
      ) : !fotosProntas ? (
        <div className="profissionais-grid">
          {profissionaisFiltrados.map((profissional) => (
            <CardProfissionalSkeleton key={profissional.id} />
          ))}
        </div>
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
