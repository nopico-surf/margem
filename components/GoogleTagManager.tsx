"use client";

import Script from "next/script";
import { useEffect } from "react";
import { HOST_LOCAL } from "@/lib/host-local";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const googleTagManagerId = process.env.NEXT_PUBLIC_GTM_ID;

export function grantGoogleConsent() {
  if (typeof window === "undefined") return;

  const consentUpdate = {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };

  if (window.gtag) {
    window.gtag("consent", "update", consentUpdate);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["consent", "update", consentUpdate]);
  }

  // O page_view inicial sai antes do aceite, sem cookie e sem origem. Este evento deixa o GTM
  // mandar um page_view novo, já consentido e com as UTMs ainda na URL.
  window.dataLayer.push({ event: "consentimento_concedido" });
}

export function GoogleTagManager() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem("margem-consentimento") === "true") {
        grantGoogleConsent();
      }
    } catch {}
  }, []);

  if (!googleTagManagerId) return null;

  return (
    <>
      <Script id="gtm-consent-default" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});`}
      </Script>
      {/* A checagem de host roda no navegador: no servidor não dá pra saber de onde a página foi aberta.
          GA e Clarity vêm como tags do GTM, então bloquear o GTM bloqueia os dois. */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`if (!new RegExp(${JSON.stringify(HOST_LOCAL.source)}).test(window.location.hostname)) (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${googleTagManagerId}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
