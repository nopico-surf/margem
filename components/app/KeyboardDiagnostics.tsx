"use client";

import { useEffect, useState } from "react";

type VirtualKeyboardLike = { overlaysContent: boolean; boundingRect: DOMRect };

type Snapshot = {
  navegador: string;
  focado: boolean;
  innerH: number;
  innerHMin: number;
  vvH: number;
  vvHMin: number;
  offsetTop: number;
  eventosVV: number;
  eventosWindow: number;
  vkDisponivel: boolean;
  vkAtivo: boolean;
  vkAltura: number;
  shift: string;
  classActive: boolean;
  modo: string;
  painelFolga: string;
};

function detectarNavegador(ua: string) {
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV/i.test(ua)) return "Facebook";
  if (/TikTok|musical_ly|BytedanceWebview/i.test(ua)) return "TikTok";
  if (/; wv\)/.test(ua)) return "WebView Android";
  if (/CriOS/.test(ua)) return "Chrome iOS";
  if (/Chrome/.test(ua)) return "Chrome";
  if (/Safari/.test(ua)) return "Safari";
  return "outro";
}

export function KeyboardDiagnostics() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("kb")) return;
    setVisible(true);

    const vv = window.visualViewport;
    const vk = (navigator as Navigator & { virtualKeyboard?: VirtualKeyboardLike }).virtualKeyboard;
    let eventosVV = 0;
    let eventosWindow = 0;
    let innerHMin = window.innerHeight;
    let vvHMin = vv ? vv.height : window.innerHeight;
    // Distância entre o fim do painel inferior e o fim da janela: se varia ao rolar, é o pulo.
    let folgaMin = Infinity;
    let folgaMax = -Infinity;

    const contarVV = () => { eventosVV += 1; };
    const contarWindow = () => { eventosWindow += 1; };
    vv?.addEventListener("resize", contarVV);
    window.addEventListener("resize", contarWindow);

    // Lê por polling: se o navegador não dispara evento nenhum, o painel ainda mostra o valor atual.
    const timer = window.setInterval(() => {
      const root = document.documentElement;
      innerHMin = Math.min(innerHMin, window.innerHeight);
      if (vv) vvHMin = Math.min(vvHMin, vv.height);
      const painel = document.querySelector('.painel-inferior[data-visivel="true"]');
      let painelFolga = "sem painel";
      if (painel) {
        const folga = Math.round(window.innerHeight - painel.getBoundingClientRect().bottom);
        folgaMin = Math.min(folgaMin, folga);
        folgaMax = Math.max(folgaMax, folga);
        painelFolga = `${folga} (min ${folgaMin}, max ${folgaMax})`;
      }
      setData({
        navegador: detectarNavegador(navigator.userAgent),
        focado: document.activeElement?.tagName === "TEXTAREA",
        innerH: window.innerHeight,
        innerHMin,
        vvH: vv ? Math.round(vv.height) : -1,
        vvHMin: Math.round(vvHMin),
        offsetTop: vv ? Math.round(vv.offsetTop) : -1,
        eventosVV,
        eventosWindow,
        vkDisponivel: Boolean(vk),
        vkAtivo: Boolean(vk?.overlaysContent),
        vkAltura: vk ? Math.round(vk.boundingRect.height) : -1,
        shift: root.style.getPropertyValue("--hero-track-shift").trim() || "0px",
        classActive: root.classList.contains("keyboard-open"),
        modo: root.dataset.keyboardMode ?? "-",
        painelFolga,
      });
    }, 250);

    return () => {
      window.clearInterval(timer);
      vv?.removeEventListener("resize", contarVV);
      window.removeEventListener("resize", contarWindow);
    };
  }, []);

  if (!visible || !data) return null;

  function ativarVirtualKeyboard() {
    const vk = (navigator as Navigator & { virtualKeyboard?: VirtualKeyboardLike }).virtualKeyboard;
    if (vk) vk.overlaysContent = true;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#000",
        color: "#0f0",
        font: "12px monospace",
        padding: "6px 8px",
        zIndex: 9999,
        lineHeight: "1.45",
      }}
    >
      <div>navegador: {data.navegador} | campo focado: {String(data.focado)}</div>
      <div>innerHeight: {data.innerH} (min {data.innerHMin})</div>
      <div>visualViewport.height: {data.vvH} (min {data.vvHMin})</div>
      <div>offsetTop: {data.offsetTop}</div>
      <div>eventos resize: visualViewport {data.eventosVV} | window {data.eventosWindow}</div>
      <div>
        virtualKeyboard: {data.vkDisponivel ? `sim, ativo ${data.vkAtivo}, altura ${data.vkAltura}` : "nao"}
      </div>
      <div>keyboard-open: {String(data.classActive)} | modo: {data.modo} | shift: {data.shift}</div>
      <div>painel folga embaixo: {data.painelFolga}</div>
      {data.vkDisponivel && !data.vkAtivo && (
        <button type="button" onClick={ativarVirtualKeyboard} style={{ marginTop: 4, font: "12px monospace", padding: "2px 6px" }}>
          testar virtualKeyboard
        </button>
      )}
    </div>
  );
}
