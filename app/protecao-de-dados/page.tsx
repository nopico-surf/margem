"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateSessaoId } from "@/lib/sessao-client";
import { grantGoogleConsent } from "@/components/GoogleTagManager";
import { IntroShell } from "@/components/intro/IntroShell";
import { IntroHeader } from "@/components/intro/IntroHeader";
import { IntroBubble } from "@/components/intro/IntroBubble";
import { IntroCopy } from "@/components/intro/IntroCopy";
import { ConsentCard } from "@/components/protecao-de-dados/ConsentCard";
import { LinkPoliticaDados } from "@/components/protecao-de-dados/LinkPoliticaDados";
import { BotaoContinuar } from "@/components/ui/BotaoContinuar";
import { track } from "@/lib/mixpanel";

export default function ProtecaoDeDadosPage() {
  const router = useRouter();
  const [consent, setConsent] = useState(false);

  function onContinue() {
    try {
      window.localStorage.setItem("margem-consentimento", "true");
    } catch {}
    grantGoogleConsent();
    track("consentimento_concedido");
    const sessaoId = getOrCreateSessaoId();
    fetch("/api/sessao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessaoId }),
    })
      .then((response) => {
        if (!response.ok) track("consentimento_falhou");
      })
      .catch(() => track("consentimento_falhou"));
    router.push("/inicio");
  }

  function onChangeConsent(value: boolean) {
    if (value) track("consentimento_marcado");
    setConsent(value);
  }

  function abrirModal() {
    track("politica_dados_aberta");
    router.push("/privacidade");
  }

  return (
    <IntroShell
      conteudo={
        <>
          <IntroHeader />
          <IntroBubble>Antes de continuar, uma coisa importante</IntroBubble>
          <IntroCopy>
            <p>A gente não pede seu nome, seu e-mail nem seu documento. O que você compartilhar fica guardado sem estar ligado a você, nós armazenamos tudo de forma <strong>anônima, segura e sigilosa</strong>, pra te devolver uma orientação melhor e pra entender o que as pessoas mais precisam.</p>
            <p>Se você tem <strong>menos de 18 anos</strong>, conversas com seus responsáveis sobre o que você tá buscando aqui podem ser importantes.</p>
          </IntroCopy>
          <LinkPoliticaDados onClick={abrirModal} />
        </>
      }
      acoes={
        <>
          <ConsentCard checked={consent} onChange={onChangeConsent} />
          <BotaoContinuar onClick={onContinue} disabled={!consent} />
        </>
      }
    />
  );
}
