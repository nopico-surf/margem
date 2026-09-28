"use client";

import { useParams } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Messages } from "@/components/conversa/Messages";
import { CARDS_HOME, indiceDoCard } from "@/lib/cards-home";

export default function CarregandoConversaCard() {
  const params = useParams<{ slug: string }>();
  const indice = indiceDoCard(params.slug ?? "");
  const titulo = indice === -1 ? "" : CARDS_HOME[indice].titulo;

  return (
    <main className="figma-result-page figma-result-page-initial-loading">
      <Header onOpenMenu={() => {}} hrefDoLogo="/inicio" />
      <div className="figma-result-main">
        <Messages message={titulo} orientation={null} isLoading error={null} onRetry={() => {}} />
      </div>
      <Footer />
    </main>
  );
}
