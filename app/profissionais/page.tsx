import type { Metadata } from "next";
import { ProfissionaisPagina } from "./ProfissionaisPagina";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

const TITULO = "Profissionais que podem ajudar";
const DESCRICAO = "Psicólogos e psiquiatras parceiros da Margem, disponíveis para sessões com valor social e atendimento acolhedor para quem precisar.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/profissionais" },
  openGraph: { type: "website", title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

export default function ProfissionaisPage() {
  return <ProfissionaisPagina especialidadeInicial="psicologo" />;
}
