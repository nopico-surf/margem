"use client";

import { useEffect, useState } from "react";
import { ContainerConteudo } from "./ContainerConteudo";
import { ActionRow } from "./ActionRow";
import { CardHeader } from "./CardHeader";
import { CardProfissionaisCompleto } from "./CardProfissionaisCompleto";
import { CardProfissionalSkeleton } from "./CardProfissionalSkeleton";
import { FiltroEspecialidade, OPCOES_ESPECIALIDADE, type Especialidade } from "./FiltroEspecialidade";
import { ValorSessaoPsicologos } from "@/components/ui/ValorSessaoPsicologos";
import { BotaoServicosPublicos } from "@/components/ui/BotaoServicosPublicos";
import { rolarAteSecao } from "@/components/ui/SectionJump";
import { URL_AVATAR_PADRAO } from "@/components/ui/Avatar";
import { fotoPequena } from "@/lib/foto-pequena";
import { track } from "@/lib/mixpanel";
import { carregarImagem } from "@/lib/carregar-imagem";
import { embaralharComSeed } from "@/lib/embaralhar";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// `variante="home"` é o card-profissionais da home (Figma 1434:302136): sem a descrição, com a faixa de
// preço numa caixa cinza e sem o botão de serviços públicos, que só faz sentido no resultado.
export function CardProfissionais({
  profissionais,
  isLoading = false,
  variante = "resultado",
}: {
  profissionais: ProfissionalCadastrado[];
  isLoading?: boolean;
  variante?: "resultado" | "home";
}) {
  const naHome = variante === "home";
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Especialidade>("psicologo");
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

  const fotosProntas = urlsDasFotos.length === 0 || urlsDasFotos.every((url) => fotosCarregadas.includes(url));

  // A ordem é aleatória por sessão em todo lugar (home, /profissionais e resposta). A sessão só existe no
  // navegador, então o esqueleto fica até ela ser lida e os cards já nascem na ordem final.
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  useEffect(() => setSessaoId(getOrCreateSessaoId()), []);

  if (isLoading || !fotosProntas || !sessaoId) {
    return (
      <ContainerConteudo id="figma-section-professionals" className={naHome ? "home-profissionais" : undefined}>
        {naHome ? (
          <span className="figma-skeleton home-osso-profissionais-titulo" aria-hidden="true" />
        ) : (
          <div className="figma-skeleton-description" aria-hidden="true"><span className="figma-skeleton figma-skeleton-heading" /><span className="figma-skeleton" /><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        )}
        <div className="figma-skeleton-filter" aria-hidden="true"><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        {naHome && <span className="figma-skeleton home-osso-valor" aria-hidden="true" />}
        {naHome ? (
          <ActionRow className="figma-professionals-row" origem="profissionais">
            {[0, 1, 2, 3, 4].map((i) => <CardProfissionalSkeleton key={i} />)}
          </ActionRow>
        ) : (
          <CardProfissionalSkeleton />
        )}
        {!naHome && <span className="figma-skeleton figma-skeleton-public-link" aria-hidden="true" />}
      </ContainerConteudo>
    );
  }

  // Ordena por nome antes de embaralhar: a lista chega em ordens diferentes (por nome do cache, já
  // embaralhada da resposta) e o resultado precisa ser o mesmo nas três telas.
  const profissionaisFiltrados = embaralharComSeed(
    [...profissionais].sort((a, b) => a.nome.localeCompare(b.nome)),
    sessaoId,
  ).filter(
    (profissional) => profissional.especialidade === especialidadeSelecionada,
  );

  function selecionarEspecialidade(especialidade: Especialidade) {
    setEspecialidadeSelecionada(especialidade);
    track("filtro_profissional_clicado", {
      filtro: especialidade === "psicologo" ? "psicologos" : "psiquiatras",
    });

    // Se o bloco não está todo na tela, rola pra deixá-lo visível. Espera a lista nova renderizar pra medir
    // a altura final.
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      const secao = document.getElementById("figma-section-professionals");
      if (!secao) return;
      const { top, bottom } = secao.getBoundingClientRect();
      if (top < 0 || bottom > window.innerHeight) rolarAteSecao("figma-section-professionals");
    }));
  }

  return (
    <ContainerConteudo id="figma-section-professionals" className={naHome ? "home-profissionais" : undefined}>
      <CardHeader
        title="Profissionais que podem ajudar"
        description={naHome ? undefined : "É recomendado falar com psiquiatra e psicólogo. Você pode fazer isso pelo SUS, sem custo. Para atendimento online, você pode falar com um de nossos parceiros"}
      />
      <FiltroEspecialidade opcoes={OPCOES_ESPECIALIDADE} selecionada={especialidadeSelecionada} onChange={selecionarEspecialidade} />
      <ValorSessaoPsicologos especialidade={especialidadeSelecionada} />
      {profissionaisFiltrados.length === 0 ? (
        <CardProfissionaisCompleto estado="in-construction" />
      ) : profissionaisFiltrados.length === 1 ? (
        <CardProfissionaisCompleto profissional={profissionaisFiltrados[0]} posicao={1} />
      ) : (
        <ActionRow
          className={especialidadeSelecionada === "psiquiatra" ? "figma-professionals-row figma-professionals-row--esquerda" : "figma-professionals-row"}
          origem="profissionais"
        >
          {profissionaisFiltrados.map((profissional, index) => (
            <CardProfissionaisCompleto profissional={profissional} posicao={index + 1} key={profissional.id} />
          ))}
        </ActionRow>
      )}
      {!naHome && (
        <div style={{ alignSelf: "center" }}>
          <BotaoServicosPublicos onClick={() => {
            track("ver_servicos_publicos_clicado");
            rolarAteSecao("figma-section-public-services");
          }} />
        </div>
      )}
    </ContainerConteudo>
  );
}
