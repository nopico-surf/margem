import type { Metadata, Viewport } from "next";
import { Inter, Urbanist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { MixpanelPageView } from "@/components/MixpanelPageView";
import { OG_SITE_NAME } from "@/lib/metadata";

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
    type: "website",
    title: "Margem",
    description: DESCRICAO,
    images: [{ url: "/assets/og-margem.webp", width: 1200, height: 630, alt: "Margem" }],
    siteName: OG_SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og-margem.webp"],
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
        <Suspense fallback={null}>
          <MixpanelPageView />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
