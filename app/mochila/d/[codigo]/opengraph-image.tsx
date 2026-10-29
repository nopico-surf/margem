import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { decodificar } from "@/lib/mochila/codigo";
import { cenarioPorId } from "@/lib/mochila/conteudo";

// Prévia do link de desafio: a mochila fechada, o nome do cenário e o convite. A mochila aparece
// fechada de propósito, e nenhum item vai na imagem. As cores vêm do tokens.css.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Monta sua mochila pro rolê";

async function token(nome: string, css: string) {
  return css.match(new RegExp(`--colors-${nome}:\\s*([^;]+);`))?.[1].trim() ?? "black";
}

export default async function Image({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const cenario = cenarioPorId(decodificar(codigo)?.cenario ?? "");
  const [css, mochila] = await Promise.all([
    readFile(join(process.cwd(), "app/tokens.css"), "utf8"),
    readFile(join(process.cwd(), "public/mochila/mochila-fechada.svg"), "utf8"),
  ]);
  const [fundo, verde, texto, apoio] = await Promise.all([
    token("brand-secondary-300", css),
    token("brand-primary-900", css),
    token("neutral-950", css),
    token("brand-secondary-950", css),
  ]);
  const src = `data:image/svg+xml;base64,${Buffer.from(mochila).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 64, padding: 80, background: fundo }}>
        <img src={src} width={320} height={320} alt="" style={{ imageRendering: "pixelated" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, color: verde }}>Monta sua mochila pro rolê</div>
          <div style={{ fontSize: 34, lineHeight: 1.3, color: texto }}>Alguém já montou a dela. Vê quantas coisas vocês levam igual.</div>
          {cenario && <div style={{ fontSize: 30, fontWeight: 600, color: apoio }}>{`Destino: ${cenario.nome}`}</div>}
        </div>
      </div>
    ),
    size,
  );
}
