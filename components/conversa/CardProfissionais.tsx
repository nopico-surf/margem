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
//
// `variante="guia"` é o carrossel dos textos do blog (/blog/[slug]): título, faixa de preço e fileira de
// cards, nas especialidades que o guia pede (seletor só quando são as duas). `origem` (o slug do guia) vai
// no evento de abertura do perfil, e `id` separa os dois carrosséis da mesma página.
//
// Briefing M56 (11/11/2026): o programa para familiares usa a variante `home` com `titulo` próprio
// ("Profissionais que podem atender você") e `origem` (`programa-painel`, `programa-modulo-5`...).
export function CardProfissionais({
  profissionais,
  isLoading = false,
  variante = "resultado",
  especialidades,
  origem,
  id = "figma-section-professionals",
  titulo = "Profissionais que podem ajudar",
}: {
  profissionais: ProfissionalCadastrado[];
  isLoading?: boolean;
  variante?: "resultado" | "home" | "guia";
  especialidades?: Especialidade[];
  origem?: string;
  id?: string;
  titulo?: string;
}) {
  const naHome = variante === "home";
  const noGuia = variante === "guia";
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Especialidade>("psicologo");
  const [fotosCarregadas, setFotosCarregadas] = useState<string[]>([]);

  // Guia com as duas especialidades (álcool e outras drogas): o seletor da home volta, e a faixa de
  // preço e os cards seguem a aba escolhida. Com uma só, fica a faixa dela, sem seletor.
  const comSeletor = noGuia && (especialidades?.length ?? 0) > 1;

  // Sem seletor, só uma especialidade vai aparecer na tela: adiantar a foto das outras segura o
  // carrossel no esqueleto sem servir pra nada. Com seletor a pessoa troca de aba a qualquer momento,
  // então as duas listas precisam estar prontas antes.
  const profissionaisDasFotos =
    especialidades && !comSeletor
      ? profissionais.filter((profissional) => (especialidades as string[]).includes(profissional.especialidade))
      : profissionais;
  const urlsDasFotos = profissionaisDasFotos.map((profissional) => fotoPequena(profissional.foto_url || URL_AVATAR_PADRAO));
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

  // No guia a faixa de preço não depende da lista, então já aparece no esqueleto e a tela não pula.
  const valorDoGuia = (
    <ValorSessaoPsicologos especialidade={comSeletor || !especialidades ? especialidadeSelecionada : especialidades[0]} />
  );

  if ((isLoading || !fotosProntas || !sessaoId) && noGuia) {
    return (
      <ContainerConteudo id={id}>
        <CardHeader title={titulo} />
        {comSeletor && (
          <div className="figma-skeleton-filter" aria-hidden="true"><span className="figma-skeleton" /><span className="figma-skeleton" /></div>
        )}
        {valorDoGuia}
        <ActionRow className="figma-professionals-row" origem="profissionais">
          {[0, 1, 2, 3, 4].map((i) => <CardProfissionalSkeleton key={i} />)}
        </ActionRow>
      </ContainerConteudo>
    );
  }

  if (isLoading || !fotosProntas || !sessaoId) {
    return (
      <ContainerConteudo id={id} className={naHome ? "home-profissionais" : undefined}>
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
  ).filter((profissional) =>
    especialidades && !comSeletor
      ? (especialidades as string[]).includes(profissional.especialidade)
      : profissional.especialidade === especialidadeSelecionada,
  );

  function selecionarEspecialidade(especialidade: Especialidade) {
    setEspecialidadeSelecionada(especialidade);
    track("filtro_profissional_clicado", {
      filtro: especialidade === "psicologo" ? "psicologos" : "psiquiatras",
    });

    // Se o bloco não está todo na tela, rola pra deixá-lo visível. Espera a lista nova renderizar pra medir
    // a altura final.
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      const secao = document.getElementById(id);
      if (!secao) return;
      const { top, bottom } = secao.getBoundingClientRect();
      if (top < 0 || bottom > window.innerHeight) rolarAteSecao(id);
    }));
  }

  if (noGuia) {
    return (
      <ContainerConteudo id={id}>
        <CardHeader title={titulo} />
        {comSeletor && (
          <FiltroEspecialidade opcoes={OPCOES_ESPECIALIDADE} selecionada={especialidadeSelecionada} onChange={selecionarEspecialidade} />
        )}
        {valorDoGuia}
        {profissionaisFiltrados.length === 0 ? (
          <CardProfissionaisCompleto estado="in-construction" />
        ) : profissionaisFiltrados.length === 1 ? (
          <CardProfissionaisCompleto profissional={profissionaisFiltrados[0]} posicao={1} origem={origem} />
        ) : (
          <ActionRow className="figma-professionals-row" origem="profissionais">
            {profissionaisFiltrados.map((profissional, index) => (
              <CardProfissionaisCompleto profissional={profissional} posicao={index + 1} origem={origem} key={profissional.id} />
            ))}
          </ActionRow>
        )}
      </ContainerConteudo>
    );
  }

  return (
    <ContainerConteudo id={id} className={naHome ? "home-profissionais" : undefined}>
      <CardHeader
        title={titulo}
        description={naHome ? undefined : "É recomendado falar com psiquiatra e psicólogo. Você pode fazer isso pelo SUS, sem custo. Para atendimento online, você pode falar com um de nossos parceiros"}
      />
      <FiltroEspecialidade opcoes={OPCOES_ESPECIALIDADE} selecionada={especialidadeSelecionada} onChange={selecionarEspecialidade} />
      <ValorSessaoPsicologos especialidade={especialidadeSelecionada} />
      {profissionaisFiltrados.length === 0 ? (
        <CardProfissionaisCompleto estado="in-construction" />
      ) : profissionaisFiltrados.length === 1 ? (
        <CardProfissionaisCompleto profissional={profissionaisFiltrados[0]} posicao={1} origem={origem} />
      ) : (
        <ActionRow className={naHome ? "figma-professionals-row figma-professionals-row--esquerda" : "figma-professionals-row"} origem="profissionais">
          {profissionaisFiltrados.map((profissional, index) => (
            <CardProfissionaisCompleto profissional={profissional} posicao={index + 1} origem={origem} key={profissional.id} />
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
