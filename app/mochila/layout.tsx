import type { Metadata } from "next";
import { Pixelify_Sans, Press_Start_2P } from "next/font/google";
import { PartidaProvider } from "@/components/mochila/Partida";
import "./mochila.css";

// Mochila do Rolê: minijogo de redução de danos (spec de 29/10/2026). Fica fora do fluxo de
// boas-vindas e do painel de dados: o jogo roda sem coletar nada.
// Pixelify Sans no nome do jogo e no rótulo; Press Start 2P só no contador. Urbanist e Inter vêm
// do layout raiz.

const pixelify = Pixelify_Sans({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-pixelify" });
const pressStart = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-press-start" });

// openGraph e twitter próprios: sem eles a prévia do link herdava título e imagem da Margem. A
// imagem vem do opengraph-image.tsx; o twitter sem images cai no og:image.
export const metadata: Metadata = {
  title: "Mochila do Rolê",
  description: "Antes de sair, uma pergunta: o que vai na sua mochila?",
  openGraph: {
    title: "Mochila do Rolê",
    description: "Antes de sair, uma pergunta: o que vai na sua mochila?",
  },
  twitter: { card: "summary_large_image" },
};

export default function MochilaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${pixelify.variable} ${pressStart.variable}`}>
      <PartidaProvider>{children}</PartidaProvider>
    </div>
  );
}
