"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { CardProfissionaisCompleto } from "@/components/conversa/CardProfissionaisCompleto";
import { CardProfissionalSkeleton } from "@/components/conversa/CardProfissionalSkeleton";
import { FiltroEspecialidade, type Especialidade } from "@/components/conversa/FiltroEspecialidade";
import { ValorSessaoPsicologos } from "@/components/ui/ValorSessaoPsicologos";
import { URL_AVATAR_PADRAO } from "@/components/ui/Avatar";
import { track } from "@/lib/mixpanel";
import { carregarImagem } from "@/lib/carregar-imagem";
import type { ProfissionalCadastrado } from "@/lib/supabase";

type ProfissionaisClienteProps = {
  profissionais: ProfissionalCadastrado[];
};

export function ProfissionaisCliente({ profissionais }: ProfissionaisClienteProps) {
  const pathname = usePathname();
  // A especialidade mora só na URL: o replaceState de trocarEspecialidade atualiza o useSearchParams.
  const especialidadeSelecionada: Especialidade =
    useSearchParams().get("especialidade") === "psiquiatra" ? "psiquiatra" : "psicologo";
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
          <ValorSessaoPsicologos />
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
