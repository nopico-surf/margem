"use client";

import { useEffect, useState } from "react";

export function KeyboardDiagnostics() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<{
    innerH?: number;
    vvH?: number;
    offsetTop?: number;
    inset?: string;
    shift?: string;
    classActive?: boolean;
  }>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const show = params.has("kb") || params.get("kb") === "1";
    setVisible(show);

    if (!show) return;

    function update() {
      const root = document.documentElement;
      const vv = window.visualViewport;
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);

      setData({
        innerH: window.innerHeight,
        vvH: Math.round(vv.height),
        offsetTop: Math.round(vv.offsetTop),
        inset: root.style.getPropertyValue("--keyboard-inset").trim() || "0px",
        shift: root.style.getPropertyValue("--hero-track-shift").trim() || "0px",
        classActive: root.classList.contains("keyboard-open"),
      });
    }

    update();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);

    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#000",
        color: "#0f0",
        font: "11px monospace",
        padding: "4px 8px",
        zIndex: 9999,
        lineHeight: "1.4",
      }}
    >
      <div>innerHeight: {data.innerH}px</div>
      <div>visualViewport.height: {data.vvH}px</div>
      <div>visualViewport.offsetTop: {data.offsetTop}px</div>
      <div>inset: {data.inset}</div>
      <div>shift: {data.shift}</div>
      <div>keyboard-open: {data.classActive ? "true" : "false"}</div>
    </div>
  );
}
