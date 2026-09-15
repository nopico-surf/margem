"use client";

import { useRouter } from "next/navigation";

const logo = "https://www.figma.com/api/mcp/asset/3d60e40c-e0dd-4dce-b476-6b678a353bfd.svg";

function IntroHeader() {
  return <header className="intro-header"><img className="intro-logo" src={logo} alt="Margem" /></header>;
}

function EmergencyPanel() {
  return <div className="emergency-panel"><strong>Se for urgente, ligue</strong><span>188 • CVV • para apoio emocional</span><span>192 • SAMU • se tem risco pro corpo</span><span>190 • Polícia • se tem risco de violência</span><span>121 • Disque social • para assistência social</span></div>;
}

export default function BemVindoPage() {
  const router = useRouter();

  return (
    <main className="intro-page">
      <div className="intro-content">
        <IntroHeader />
        <div className="intro-bubble">Oi, nós somos a Margem</div>
        <div className="intro-copy">
          <p>Aqui dá pra falar sobre álcool e outras drogas do jeito que for possível pra você. Não precisa querer parar, não precisa ter certeza de nada, não precisa saber explicar direito. Se você só quer entender melhor o que tá acontecendo, já vale.</p>
          <p>A gente não faz atendimento e não substitui profissional, serviço público ou grupo de apoio. <strong>O que a gente faz é te dar uma orientação inicial e te conectar com profissionais, grupos de apoio e serviços públicos que já existem, pra facilitar que você encontre a melhor forma de lidar com o seu momento.</strong></p>
        </div>
      </div>
      <div className="intro-actions">
        <EmergencyPanel />
        <button className="intro-button" type="button" onClick={() => router.push("/protecao-de-dados")}>Continuar</button>
      </div>
    </main>
  );
}
