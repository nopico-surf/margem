"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyboardDiagnostics } from "@/components/app/KeyboardDiagnostics";
import { Footer } from "@/components/layout/Footer";
import { SideMenu } from "@/components/layout/SideMenu";
import { HomeHero } from "@/components/app/HomeHero";
import { FaixaComoFunciona } from "@/components/app/FaixaComoFunciona";
import { CardHomeGroup } from "@/components/app/CardHomeGroup";
import { BlocoCannabis } from "@/components/app/BlocoCannabis";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";
import { CardPublico } from "@/components/bem-vindo/CardPublico";
import { Button } from "@/components/ui/Button";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { CARDS_HOME } from "@/lib/cards-home";
import { conceder, jaConsentiu, jaRecusou, recusar, type ContextoConsentimento } from "@/lib/consentimento";
import { registrar, track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// Cada bloco marcado com data-secao conta uma vez como visto quando metade dele aparece na tela.
const LIMIAR_DE_VISTA = 0.5;

export function InicioCliente({ profissionais }: { profissionais: ProfissionalCadastrado[] }) {
  const router = useRouter();
  const [consentiu, setConsentiu] = useState(false);
  const [cookiesVisivel, setCookiesVisivel] = useState(false);
  // O que a pessoa tentou fazer sem ter consentido. Roda se ela aceitar, e se perde se ela recusar:
  // nada é gravado nem enviado, o card não abre e o texto continua no campo.
  const acaoPendente = useRef<(() => void) | null>(null);
  // O que fez o painel subir, só pra medir aceite e recusa (nunca qual card nem o que foi escrito).
  const gatilho = useRef<ContextoConsentimento["gatilho"]>("abertura");
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const paginaRef = useRef<HTMLElement>(null);

  // Quem ainda não respondeu ao painel o vê logo ao abrir. Quem recusou nesta aba não: o painel volta
  // a cada tentativa de conversar (card ou campo livre), não a cada abertura. Só depois de montar, pra
  // o painel entrar subindo em vez de já nascer no lugar.
  useEffect(() => {
    const jaAceitou = jaConsentiu();
    setConsentiu(jaAceitou);
    if (!jaAceitou && !jaRecusou()) setCookiesVisivel(true);
  }, []);

  // Cards e campo livre navegam com router.push, que não tem o prefetch automático do <Link>. Sem
  // isto, o loading da /conversa/[slug] só aparece depois que o servidor responde ao clique. Baixar a
  // rota não grava nem envia nada da pessoa. Os seis cards são a mesma rota: o Next baixa uma vez só.
  useEffect(() => {
    CARDS_HOME.forEach((card) => router.prefetch(`/conversa/${card.slug}`));
    router.prefetch("/conversa");
  }, [router]);

  useEffect(() => {
    const vistas = new Set<string>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const secao = (entrada.target as HTMLElement).dataset.secao;
          if (!secao || !entrada.isIntersecting || vistas.has(secao)) continue;
          vistas.add(secao);
          observador.unobserve(entrada.target);
          track("secao_visualizada", { secao });
        }
      },
      { threshold: LIMIAR_DE_VISTA },
    );
    paginaRef.current?.querySelectorAll("[data-secao]").forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  // Mede o que ocupa a primeira tela além da foto do hero, pra foto baixar até hero, faixa e cards
  // caberem juntos no desktop (home.css). Com o campo aberto o hero sai do fluxo: mantém a última medida.
  useEffect(() => {
    const pagina = paginaRef.current;
    const hero = pagina?.querySelector<HTMLElement>(".home-hero");
    const foto = pagina?.querySelector<HTMLElement>(".home-hero-foto");
    const cards = pagina?.querySelector<HTMLElement>('[data-secao="caminhos"]');
    if (!pagina || !hero || !foto || !cards) return;

    function medir() {
      if (!pagina || !hero || !foto || !cards || hero.dataset.expandido === "true") return;
      const alemDaFoto = hero.offsetHeight - foto.offsetHeight;
      const abaixoDoHero = cards.getBoundingClientRect().bottom - hero.getBoundingClientRect().bottom;
      pagina.style.setProperty("--home-dobra-ocupada", `${alemDaFoto + abaixoDoHero}px`);
    }

    const observador = new ResizeObserver(medir);
    [hero, foto, cards].forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  function comConsentimento(motivo: ContextoConsentimento["gatilho"], acao: () => void) {
    if (consentiu) {
      acao();
      return;
    }
    acaoPendente.current = acao;
    gatilho.current = motivo;
    (document.activeElement as HTMLElement | null)?.blur();
    setCookiesVisivel(true);
  }

  function aceitarPersonalizacao() {
    conceder({ rota: "/inicio", gatilho: gatilho.current });
    setConsentiu(true);
    setCookiesVisivel(false);
    const acao = acaoPendente.current;
    acaoPendente.current = null;
    acao?.();
  }

  function navegarSemPersonalizacao() {
    recusar({ rota: "/inicio", gatilho: gatilho.current });
    setCookiesVisivel(false);
    acaoPendente.current = null;
  }

  function verDados(origem: "painel" | "importante") {
    track("politica_dados_aberta", { origem });
    router.push("/privacidade");
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const value = text.trim();
    if (!value) return;
    comConsentimento("texto_livre", () => enviarTexto(value));
  }

  function enviarTexto(value: string) {
    registrar({ origem_entrada: "texto", card_titulo: null });
    track("texto_livre_enviado", { tamanho_texto: value.length });
    try {
      window.sessionStorage.setItem("margem-mensagem", value);
    } catch {}
    router.push("/conversa");
  }

  function handleCardClick(index: number) {
    comConsentimento("card", () => abrirCard(index));
  }

  function abrirCard(index: number) {
    registrar({ origem_entrada: "card", card_titulo: CARDS_HOME[index].titulo });
    track("card_selecionado", { card_indice: index, card_titulo: CARDS_HOME[index].titulo });
    router.push(`/conversa/${CARDS_HOME[index].slug}`);
  }

  function openMenu() {
    setMenuOpen(true);
    track("menu_clicado", { rota: "/inicio" });
  }

  function closeMenu() {
    setMenuOpen(false);
    track("menu_fechado", { rota: "/inicio" });
  }

  return (
    <main className="home-pagina" ref={paginaRef}>
      <KeyboardDiagnostics />
      <SideMenu open={menuOpen} onClose={closeMenu} rota="/inicio" />

      <HomeHero
        text={text}
        onChangeText={setText}
        onSubmit={submit}
        onOpenMenu={openMenu}
        onExpandir={() => track("campo_expandido")}
        onFechar={() => track("campo_fechado", { com_texto: text.trim().length > 0 })}
      />

      <div className="home-conteudo">
        <div data-secao="como_funciona">
          <FaixaComoFunciona />
        </div>

        <div className="home-secoes">
          <div data-secao="caminhos">
            <CardHomeGroup onSelect={handleCardClick} />
          </div>

          <div data-secao="profissionais">
            <CardProfissionais profissionais={profissionais} variante="home" />
          </div>

          <div data-secao="cannabis">
            <BlocoCannabis />
          </div>

          <section className="home-publico-secao" aria-labelledby="home-publico-titulo" data-secao="para_quem">
            <h2 id="home-publico-titulo" className="home-secao-titulo">Para quem é a Margem</h2>
            <div className="home-publico">
              <CardPublico
                foto="/assets/homem-regata-verde.webp"
                titulo="Para você"
                texto="Que quer entender melhor o próprio uso"
              />
              <CardPublico
                foto="/assets/maos-sobre-mesa.webp"
                posicaoDaFoto="center 60%"
                titulo="Por perto"
                texto="Para quem apoia alguém em uso"
              />
              <div className="home-importante">
                <div className="home-importante-texto">
                  <h3>Importante</h3>
                  <p>
                    A Margem não faz atendimento e não substitui profissional ou serviço público. Se você tem menos de
                    18 anos, conversar com seus responsáveis pode ajudar
                  </p>
                </div>
                <Button variante="transparent" tamanho="x-small" className="home-importante-dados" onClick={() => verDados("importante")}>
                  Ver como a gente cuida dos seus dados
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="home-rodape">
        <Footer />
      </div>

      <PainelInferior
        variante="cookies"
        visivel={cookiesVisivel}
        onAceitar={aceitarPersonalizacao}
        onRecusar={navegarSemPersonalizacao}
        onVerDados={() => verDados("painel")}
      />
    </main>
  );
}
