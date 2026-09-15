"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const logo = "https://www.figma.com/api/mcp/asset/3d60e40c-e0dd-4dce-b476-6b678a353bfd.svg";
const checkboxSelectedIcon = "https://www.figma.com/api/mcp/asset/ae8f8ca3-9062-4066-abfb-8dd5bed8e56b.svg";

function IntroHeader() {
  return <header className="intro-header"><img className="intro-logo" src={logo} alt="Margem" /></header>;
}

export default function ProtecaoDeDadosPage() {
  const router = useRouter();
  const [consent, setConsent] = useState(false);

  function onContinue() {
    try {
      window.localStorage.setItem("margem-consentimento", "true");
    } catch {}
    router.push("/app");
  }

  return (
    <main className="intro-page">
      <div className="intro-content">
        <IntroHeader />
        <div className="intro-bubble">Antes de continuar, uma coisa importante</div>
        <div className="intro-copy">
          <p>A gente não pede seu nome, seu e-mail nem seu documento. O que você compartilhar fica guardado sem estar ligado a você, nós armazenamos tudo de forma <strong>anônima, segura e sigilosa</strong>, pra te devolver uma orientação melhor e pra entender o que as pessoas mais precisam.</p>
          <p>Se você tem <strong>menos de 18 anos</strong>, conversas com seus responsáveis sobre o que você tá buscando aqui podem ser importantes.</p>
        </div>
        <a className="privacy-link" href="/privacidade">Ver como a gente cuida dos seus dados</a>
      </div>
      <div className="intro-actions">
        <label className="consent-card">
          <input className="consent-input" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span className="consent-checkbox-control" aria-hidden="true"><span className="consent-checkbox-box" /><img className="consent-checkbox-selected" src={checkboxSelectedIcon} alt="" /></span>
          <span className="consent-copy">Li e concordo que a Margem guarde e use o que eu escrever aqui, incluindo informações sobre meu uso ou sobre o uso de alguém</span>
        </label>
        <button className="intro-button" type="button" disabled={!consent} onClick={onContinue}>Continuar</button>
      </div>
    </main>
  );
}
