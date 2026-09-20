import type { Metadata, Viewport } from "next";
import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { MixpanelPageView } from "@/components/MixpanelPageView";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Margem",
  description: "Orientação e conexão profissional para pessoas em uso de álcool ou outras drogas",
  openGraph: {
    title: "Margem",
    description: "Orientação e conexão profissional para pessoas em uso de álcool ou outras drogas",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Margem" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og-image.png"],
  },
};

export const viewport: Viewport = {
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${urbanist.variable}`}>
      <body>
        <GoogleTagManager />
        <MixpanelPageView />
        {children}
      </body>
    </html>
  );
}
