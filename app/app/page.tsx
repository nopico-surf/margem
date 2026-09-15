"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageInput } from "@/components/MessageInput";

const logo = "https://www.figma.com/api/mcp/asset/3d60e40c-e0dd-4dce-b476-6b678a353bfd.svg";
const menu = "https://www.figma.com/api/mcp/asset/2b2b0245-44e5-4dbe-a618-042679b2614d.svg";
const securityIcon = "https://www.figma.com/api/mcp/asset/36a4a0dd-9a1a-48b0-be2f-6f703907dcad.svg";
const arrowIcon = "https://www.figma.com/api/mcp/asset/e1f68123-9587-49c9-9b52-a55d1f19db73.svg";
const cardArrowIcon = "https://www.figma.com/api/mcp/asset/1a66caf4-8fb3-40b9-a268-f3224ac95eb4.svg";
const pathwayIcons = [
  "https://www.figma.com/api/mcp/asset/efbc6f65-16a9-41cf-a7bb-a5d0da541f2c.svg",
  "https://www.figma.com/api/mcp/asset/93f9ed1f-bc1c-405d-ab87-381c623da872.svg",
  "https://www.figma.com/api/mcp/asset/2bb6ae35-7cdf-4f33-9d30-4a4965295425.svg",
  "https://www.figma.com/api/mcp/asset/3e940b99-3a7d-47e4-b868-8f1712b2a961.svg",
  "https://www.figma.com/api/mcp/asset/aea480ed-8230-49de-9227-bd560f21b76c.svg",
  "https://www.figma.com/api/mcp/asset/835d1770-27b1-452d-a3cd-ac7edfbf1a69.svg",
];

const cards = [
  ["Quero mudar o uso", "Informações para reduzir ou parar e caminhos para buscar apoio"],
  ["Estou fisicamente mal", "Orientações imediatas para o seu corpo e contatos de emergência"],
  ["Estou emocionalmente mal", "Orientação para lidar com o momento e canais para falar sobre o que sente"],
  ["Quero ajudar alguém próximo", "Formas de oferecer suporte a quem você ama e grupos de acolhimento"],
  ["Fiz uso e quero ajuda", "Cuidados para você passar por isso agora e apoio acolhedor sem julgamento"],
  ["Estou com vontade de usar", "Dicas práticas para atravessar a fissura e canais para conversar agora"],
];

export default function AppPage() {
  const router = useRouter();
  const [checkingConsent, setCheckingConsent] = useState(true);
  const [text, setText] = useState("");

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
    try {
      window.sessionStorage.setItem("margem-mensagem", value);
    } catch {}
    router.push("/conversa");
  }

  if (checkingConsent) return null;

  return (
    <main className="app-shell">
      <header className="app-header">
        <img className="app-logo" src={logo} alt="Margem" />
        <button className="menu-button" type="button" aria-label="Abrir menu"><img src={menu} alt="" /></button>
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-input-group">
          <div className="identity-badge"><img src={securityIcon} alt="" />Você não precisa se identificar</div>
          <h1 id="home-title">Este é um espaço<br />seguro e acolhedor</h1>
        </div>
        <div className="hero-message-group">
          <MessageInput value={text} onChange={setText} onSubmit={submit} />
          <button className="topics-button" type="button">Se preferir, veja os tópicos <img src={arrowIcon} alt="" /></button>
        </div>
      </section>
      <section className="pathways" aria-labelledby="pathways-title">
        <h2 id="pathways-title">Você pode começar por aqui</h2>
        <p>Não precisa escolher a opção perfeita. Apenas dê o primeiro passo</p>
        <div className="pathway-list">
          {cards.map(([title, description], index) => (
            <a href="#orientacao" className="pathway-card" key={title}>
              <img className="pathway-icon" src={pathwayIcons[index]} alt="" />
              <span><strong>{title}</strong><small>{description}</small></span>
              <img className="pathway-arrow" src={cardArrowIcon} alt="" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
