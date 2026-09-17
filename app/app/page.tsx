"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyboardDiagnostics } from "@/components/app/KeyboardDiagnostics";
import { Footer } from "@/components/layout/Footer";
import { SideMenu } from "@/components/layout/SideMenu";
import { HeaderHome } from "@/components/layout/HeaderHome";
import { HomeHero } from "@/components/app/HomeHero";
import { CardHomeGroup } from "@/components/app/CardHomeGroup";
import { CARDS_HOME } from "@/lib/cards-home";
import { registrar, track } from "@/lib/mixpanel";

export default function AppPage() {
  const router = useRouter();
  const [checkingConsent, setCheckingConsent] = useState(true);
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("margem-consentimento") !== "true") {
        router.replace("/bem-vindo");
        return;
      }
    } catch {
      router.replace("/bem-vindo");
      return;
    }
    setCheckingConsent(false);
  }, [router]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const value = text.trim();
    if (!value) return;
    registrar({ origem_entrada: "texto", card_titulo: null });
    track("texto_livre_enviado", { tamanho_texto: value.length });
    try {
      window.sessionStorage.setItem("margem-mensagem", value);
      window.sessionStorage.removeItem("margem-cardIndex");
    } catch {}
    router.push("/conversa");
  }

  function handleCardClick(index: number) {
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
    track("menu_clicado", { rota: "/app" });
  }

  if (checkingConsent) return null;

  return (
    <main className="app-shell">
      <KeyboardDiagnostics />
      <HeaderHome onOpenMenu={openMenu} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <HomeHero text={text} onChangeText={setText} onSubmit={submit} onShowTopics={showTopics} />
      <CardHomeGroup onSelect={handleCardClick} />
      <Footer />
    </main>
  );
}
