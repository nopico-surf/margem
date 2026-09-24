import type { ReactNode } from "react";

// Quem consentiu antes do cookie existir só tem o localStorage, então o proxy.ts manda pra cá.
// Este script roda antes da tela ser desenhada: grava o cookie e troca pra /inicio sem piscar.
const irParaInicioSeJaConsentiu = `try{if(localStorage.getItem("margem-consentimento")==="true"){document.cookie="margem-consentimento=true; path=/; max-age=34560000; samesite=lax";document.documentElement.style.visibility="hidden";location.replace("/inicio"+location.search)}}catch(e){}`;

export default function BemVindoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: irParaInicioSeJaConsentiu }} />
      {children}
    </>
  );
}
