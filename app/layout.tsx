import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { MixpanelPageView } from "@/components/MixpanelPageView";

export const metadata: Metadata = {
  title: "Margem",
  description: "Orientação inicial e caminhos de apoio.",
};

export const viewport: Viewport = {
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <GoogleTagManager />
        <MixpanelPageView />
        {children}
      </body>
    </html>
  );
}
