import type { Metadata, Viewport } from "next";
import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { MixpanelPageView } from "@/components/MixpanelPageView";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Margem",
  description: "Orientação inicial e caminhos de apoio.",
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
