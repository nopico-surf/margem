"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyboardDiagnostics } from "@/components/app/KeyboardDiagnostics";
import { Footer } from "@/components/layout/Footer";
import { SideMenu } from "@/components/layout/SideMenu";
import { Header } from "@/components/layout/Header";
import { HomeHero } from "@/components/app/HomeHero";
import { CardHomeGroup } from "@/components/app/CardHomeGroup";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { CARDS_HOME } from "@/lib/cards-home";
import { conceder, jaConsentiu, jaRecusou, recusar, type ContextoConsentimento } from "@/lib/consentimento";
import { registrar, track } from "@/lib/mixpanel";

export default function AppPage() {
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

  // Quem chega direto na /inicio (digitando a URL, por exemplo) sem ter respondido ao painel o vê
  // logo ao abrir. Quem recusou nesta aba não: o painel volta a cada tentativa de conversar (card ou
  // campo livre), não a cada abertura.
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

  function comConsentimento(motivo: ContextoConsentimento["gatilho"], acao: () => void) {
    if (consentiu) {
      acao();
      return;
    }
    acaoPendente.current = acao;
    gatilho.current = motivo;
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

  function verDadosDosCookies() {
    track("politica_dados_aberta");
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

  function showTopics() {
    track("topicos_clicado");
    document.querySelector(".pathways")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <main className="app-shell">
      <KeyboardDiagnostics />
      <Header onOpenMenu={openMenu} />
      <SideMenu open={menuOpen} onClose={closeMenu} rota="/inicio" />

      <HomeHero text={text} onChangeText={setText} onSubmit={submit} onShowTopics={showTopics} />
      <CardHomeGroup onSelect={handleCardClick} />
      <Footer />

      <PainelInferior
        variante="cookies"
        visivel={cookiesVisivel}
        onAceitar={aceitarPersonalizacao}
        onRecusar={navegarSemPersonalizacao}
        onVerDados={verDadosDosCookies}
      />
    </main>
  );
}
