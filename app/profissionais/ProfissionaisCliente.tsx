"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { CardProfissionaisCompleto } from "@/components/conversa/CardProfissionaisCompleto";
import { CardProfissionalSkeleton } from "@/components/conversa/CardProfissionalSkeleton";
import {
  FiltroEspecialidade,
  OPCOES_ESPECIALIDADE,
  especialidadeDaUrl,
  urlDaEspecialidade,
  type Especialidade,
} from "@/components/conversa/FiltroEspecialidade";
import { ValorSessaoPsicologos } from "@/components/ui/ValorSessaoPsicologos";
import { URL_AVATAR_PADRAO } from "@/components/ui/Avatar";
import { fotoPequena } from "@/lib/foto-pequena";
import { track } from "@/lib/mixpanel";
import { carregarImagem } from "@/lib/carregar-imagem";
import { embaralharComSeed } from "@/lib/embaralhar";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import type { ProfissionalCadastrado } from "@/lib/supabase";

type ProfissionaisClienteProps = {
  profissionais: ProfissionalCadastrado[];
  especialidadeInicial: Especialidade;
  anoAtual: number;
};

export function ProfissionaisCliente({ profissionais, especialidadeInicial, anoAtual }: ProfissionaisClienteProps) {
  // A especialidade continua morando na URL, mas lida depois da hidratação, não com useSearchParams:
  // o hook suspende a árvore do cliente e o HTML que chega a quem não roda JavaScript (robô de IA)
  // fica sem a lista. O primeiro quadro usa a aba da rota, que já vem certa nos dois links do menu.
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Especialidade>(especialidadeInicial);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const daUrl = new URLSearchParams(window.location.search).get("especialidade");
    if (daUrl) setEspecialidadeSelecionada(especialidadeDaUrl(daUrl));
  }, []);
  const [fotosCarregadas, setFotosCarregadas] = useState<string[]>([]);

  const urlsDasFotos = profissionais.map((profissional) => fotoPequena(profissional.foto_url || URL_AVATAR_PADRAO));
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

  // Mesma ordem aleatória por sessão da home e da resposta (ver CardProfissionais). O esqueleto fica até
  // a sessão ser lida no navegador, então os cards já nascem na ordem final.
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  useEffect(() => setSessaoId(getOrCreateSessaoId()), []);

  const fotosProntas =
    sessaoId !== null && (urlsDasFotos.length === 0 || urlsDasFotos.every((url) => fotosCarregadas.includes(url)));

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
    window.history.replaceState(null, "", urlDaEspecialidade(especialidade));
  }

  function selecionarEspecialidade(especialidade: Especialidade) {
    trocarEspecialidade(especialidade);
    track("filtro_profissional_clicado", {
      filtro: especialidade === "psicologo" ? "psicologos" : "psiquiatras",
    });
  }

  const profissionaisOrdenados = sessaoId
    ? embaralharComSeed([...profissionais].sort((a, b) => a.nome.localeCompare(b.nome)), sessaoId)
    : profissionais;

  const profissionaisFiltrados = profissionaisOrdenados.filter(
    (profissional) => profissional.especialidade === especialidadeSelecionada,
  );

  return (
    <main className="figma-result-page profissionais-pagina">
      <Header
        onOpenMenu={abrirMenu}
        hrefDoLogo="/inicio"
        onLogoClick={() => track("logo_clicado", { rota: "/profissionais" })}
        mostrarProfissionais={false}
      />
      <SideMenu
        open={menuOpen}
        onClose={fecharMenu}
        rota="/profissionais"
        onSelecionarEspecialidade={trocarEspecialidade}
      />

      <div className="profissionais-cabecalho">
        <CardHeader as="h1" title="Profissionais que podem ajudar" />
        <FiltroEspecialidade opcoes={OPCOES_ESPECIALIDADE} selecionada={especialidadeSelecionada} onChange={selecionarEspecialidade} />
        <ValorSessaoPsicologos especialidade={especialidadeSelecionada} />
      </div>

      {profissionaisFiltrados.length === 0 ? (
        <ContainerConteudo id="profissionais-sem-resultado">
          <CardProfissionaisCompleto estado="in-construction" />
        </ContainerConteudo>
      ) : !fotosProntas ? (
        <>
          <div className="profissionais-grid">
            {profissionaisFiltrados.map((profissional) => (
              <CardProfissionalSkeleton key={profissional.id} />
            ))}
          </div>
          {/* Enquanto o skeleton aparece, os cards de verdade (em ordem alfabética, sem o sorteio da
              sessão) ficam no HTML fora da tela, pros robôs que não rodam JavaScript. Quem usa a tela
              e o leitor de tela não vê nem alcança: aria-hidden e inert. Some quando os cards entram. */}
          <div className="profissionais-grid figma-oculto-visual" aria-hidden="true" inert>
            {profissionaisFiltrados.map((profissional) => (
              <CardProfissionaisCompleto profissional={profissional} anoAtual={anoAtual} key={profissional.id} />
            ))}
          </div>
        </>
      ) : (
        <div className="profissionais-grid">
          {profissionaisFiltrados.map((profissional, index) => (
            <CardProfissionaisCompleto profissional={profissional} posicao={index + 1} anoAtual={anoAtual} key={profissional.id} />
          ))}
        </div>
      )}

      <Footer />
    </main>
  );
}
