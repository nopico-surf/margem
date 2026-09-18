"use client";

import { useRouter } from "next/navigation";
import { DadosPrivacidadeModal } from "@/components/protecao-de-dados/DadosPrivacidadeModal";
import { track } from "@/lib/mixpanel";

export default function PrivacidadePage() {
  const router = useRouter();

  function voltar() {
    track("politica_dados_fechada");
    router.back();
  }

  return (
    <main className="dados-page">
      <DadosPrivacidadeModal onClose={voltar} />
    </main>
  );
}