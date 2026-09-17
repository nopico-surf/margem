"use client";

import { useRouter } from "next/navigation";
import { IntroShell } from "@/components/intro/IntroShell";
import { IntroHeader } from "@/components/intro/IntroHeader";
import { IntroBubble } from "@/components/intro/IntroBubble";
import { IntroCopy } from "@/components/intro/IntroCopy";
import { EmergencyPanel } from "@/components/bem-vindo/EmergencyPanel";
import { BotaoContinuar } from "@/components/ui/BotaoContinuar";
import { track } from "@/lib/mixpanel";

export default function BemVindoPage() {
  const router = useRouter();

  function continuar() {
    track("boas_vindas_continuar");
    router.push("/protecao-de-dados");
  }

  return (
    <IntroShell
      conteudo={
        <>
          <IntroHeader />
          <IntroBubble>Oi, nós somos a Margem</IntroBubble>
          <IntroCopy>
            <p>Aqui dá pra falar sobre álcool e outras drogas do jeito que for possível pra você. Não precisa querer parar, não precisa ter certeza de nada, não precisa saber explicar direito. Se você só quer entender melhor o que tá acontecendo, já vale.</p>
            <p>A gente não faz atendimento e não substitui profissional, serviço público ou grupo de apoio. <strong>O que a gente faz é te dar uma orientação inicial e te conectar com profissionais, grupos de apoio e serviços públicos que já existem, pra facilitar que você encontre a melhor forma de lidar com o seu momento.</strong></p>
          </IntroCopy>
        </>
      }
      acoes={
        <>
          <EmergencyPanel />
          <BotaoContinuar onClick={continuar} />
        </>
      }
    />
  );
}
