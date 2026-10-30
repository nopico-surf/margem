import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ENDERECO_CURTO } from "./conteudo";

// Prévia de link (og:image) do jogo, no visual do card de Stories (lib/mochila/card.ts): fundo com
// grade, quadradinhos soltos, logo, título em Pixelify e a mochila fechada numa moldura em degrau.
// Serve a /mochila e o link de desafio. A mochila aparece fechada de propósito, e nenhum item vai
// na imagem. As cores vêm do tokens.css.

export const TAMANHO = { width: 1200, height: 630 };

const DECOR: [number, number, number, string][] = [
  [36, 24, 24, "brand-primary-900"], [180, 24, 12, "neutral-0"], [564, 36, 12, "brand-primary-700"],
  [984, 24, 12, "brand-primary-900"], [1116, 36, 24, "neutral-0"], [60, 588, 12, "brand-primary-700"],
  [420, 588, 24, "neutral-0"], [696, 600, 12, "brand-primary-900"], [888, 588, 24, "brand-primary-900"],
  [1140, 600, 12, "brand-primary-700"],
];

// O mesmo recorte em degrau do pxRect do card, feito com dois retângulos sobrepostos.
function Degrau({ s, cor, children, style }: { s: number; cor: string; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      <div style={{ position: "absolute", left: s, right: s, top: 0, bottom: 0, background: cor }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: s, bottom: s, background: cor }} />
      {children}
    </div>
  );
}

function svg(conteudo: string) {
  return `data:image/svg+xml;base64,${Buffer.from(conteudo).toString("base64")}`;
}

export async function desenharPrevia({ titulo, apoio, destino }: { titulo: string; apoio: string; destino?: string }) {
  const ler = (caminho: string) => readFile(join(process.cwd(), caminho));
  const [css, mochila, logo, pixel, texto] = await Promise.all([
    ler("app/tokens.css").then(String),
    ler("public/mochila/mochila-fechada.svg").then(String),
    ler("public/icons/logo-margem.svg").then(String),
    ler("public/assets/fonts/pixelify-sans-700.ttf"),
    ler("public/assets/fonts/inter-600.ttf"),
  ]);
  const cor = (nome: string) => css.match(new RegExp(`--colors-${nome}:\\s*([^;]+);`))?.[1].trim() ?? "black";

  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", background: cor("brand-secondary-300") }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", left: i * 60, top: 0, width: 3, height: "100%", background: cor("brand-primary-700"), opacity: 0.1 }} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", top: i * 60, left: 0, height: 3, width: "100%", background: cor("brand-primary-700"), opacity: 0.1 }} />
        ))}
        {DECOR.map(([x, y, s, c]) => (
          <div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: s, height: s, background: cor(c) }} />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 56, padding: 72, width: "100%", height: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "center" }}>
            <img src={svg(logo)} width={289} height={40} alt="" />
            <div style={{ marginTop: 24, flexShrink: 0, fontFamily: "Pixelify", fontSize: 72, lineHeight: 1.02, color: cor("brand-primary-950") }}>
              {titulo}
            </div>
            <div style={{ marginTop: 20, flexShrink: 0, fontFamily: "Inter", fontSize: 30, lineHeight: 1.3, color: cor("brand-secondary-950") }}>{apoio}</div>
            {destino && (
              <Degrau s={12} cor={cor("brand-primary-700")} style={{ marginTop: 28, flexShrink: 0, alignSelf: "flex-start", padding: 6 }}>
                <Degrau s={6} cor={cor("brand-primary-900")} style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 28, paddingRight: 28 }}>
                  <div style={{ position: "relative", whiteSpace: "nowrap", fontFamily: "Pixelify", fontSize: 28, lineHeight: 1.1, color: cor("brand-secondary-300") }}>
                    {destino}
                  </div>
                </Degrau>
              </Degrau>
            )}
            <div style={{ marginTop: 28, fontFamily: "Inter", fontSize: 28, color: cor("status-success-950") }}>{ENDERECO_CURTO}</div>
          </div>

          <Degrau s={24} cor={cor("brand-primary-900")} style={{ width: 400, height: 400, padding: 10 }}>
            <Degrau s={14} cor={cor("brand-primary-700")} style={{ width: "100%", height: "100%" }}>
              <img src={svg(mochila)} width={288} height={288} alt="" style={{ position: "relative" }} />
            </Degrau>
          </Degrau>
        </div>
      </div>
    ),
    {
      ...TAMANHO,
      fonts: [
        { name: "Pixelify", data: pixel, weight: 700, style: "normal" },
        { name: "Inter", data: texto, weight: 600, style: "normal" },
      ],
    },
  );
}
