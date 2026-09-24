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

const URL_DO_SITE = "https://www.somosmargem.com.br";
const DESCRICAO = "Orientação e conexão profissional para pessoas em uso de álcool ou outras drogas";

export const metadata: Metadata = {
  metadataBase: new URL(URL_DO_SITE),
  title: "Margem",
  description: DESCRICAO,
  openGraph: {
    title: "Margem",
    description: DESCRICAO,
    images: [{ url: "/assets/og-image.webp", width: 1200, height: 630, alt: "Margem" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og-image.webp"],
  },
};

// Dados estruturados pro Google entender o que é a Margem.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Margem",
  url: URL_DO_SITE,
  description: DESCRICAO,
};

export const viewport: Viewport = {
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${urbanist.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <GoogleTagManager />
        <MixpanelPageView />
        {children}
      </body>
    </html>
  );
}
