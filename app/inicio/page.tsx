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
import { conceder, jaConsentiu } from "@/lib/consentimento";
import { registrar, track } from "@/lib/mixpanel";

export default function AppPage() {
  const router = useRouter();
  const [consentiu, setConsentiu] = useState(false);
  const [cookiesVisivel, setCookiesVisivel] = useState(false);
  // O que a pessoa tentou fazer sem ter consentido. Roda se ela aceitar, e se perde se ela recusar.
  const acaoPendente = useRef<(() => void) | null>(null);
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Quem recusou os cookies continua usando a Margem, mas o painel volta a cada tentativa de
  // conversar (card ou campo livre) até ela aceitar.
  useEffect(() => {
    setConsentiu(jaConsentiu());
  }, []);

  function comConsentimento(acao: () => void) {
    if (consentiu) {
      acao();
      return;
    }
    acaoPendente.current = acao;
    setCookiesVisivel(true);
  }

  function aceitarCookies() {
    conceder();
    setConsentiu(true);
    setCookiesVisivel(false);
    const acao = acaoPendente.current;
    acaoPendente.current = null;
    acao?.();
  }

  function verDadosDosCookies() {
    track("politica_dados_aberta");
    router.push("/privacidade");
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const value = text.trim();
    if (!value) return;
    comConsentimento(() => enviarTexto(value));
  }

  function enviarTexto(value: string) {
    registrar({ origem_entrada: "texto", card_titulo: null });
    track("texto_livre_enviado", { tamanho_texto: value.length });
    try {
      window.sessionStorage.setItem("margem-mensagem", value);
      window.sessionStorage.removeItem("margem-cardIndex");
    } catch {}
    router.push("/conversa");
  }

  function handleCardClick(index: number) {
    comConsentimento(() => abrirCard(index));
  }

  function abrirCard(index: number) {
    registrar({ origem_entrada: "card", card_titulo: CARDS_HOME[index].titulo });
    track("card_selecionado", { card_indice: index, card_titulo: CARDS_HOME[index].titulo });
    try {
      window.sessionStorage.setItem("margem-cardIndex", String(index));
      window.sessionStorage.removeItem("margem-mensagem");
    } catch {}
    router.push("/conversa");
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
      <SideMenu open={menuOpen} onClose={closeMenu} />

      <HomeHero text={text} onChangeText={setText} onSubmit={submit} onShowTopics={showTopics} />
      <CardHomeGroup onSelect={handleCardClick} />
      <Footer />

      <PainelInferior
        variante="cookies"
        visivel={cookiesVisivel}
        onEntendi={aceitarCookies}
        onVerDados={verDadosDosCookies}
      />
    </main>
  );
}
