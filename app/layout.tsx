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

// Dados estruturados pro Google entender o que é a Margem. O `sameAs` liga o site ao Instagram e ao
// grupo do Facebook (que se chama "Outros olhares sobre Álcool e outras Drogas", mas é da Margem): é
// como as máquinas entendem que são a mesma organização. Endereço canônico do grupo, sem o link de
// compartilhamento nem utm.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Margem",
  url: URL_DO_SITE,
  description: DESCRICAO,
  sameAs: ["https://instagram.com/somos_margem_", "https://www.facebook.com/groups/1462309285950947/"],
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
