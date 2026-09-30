import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfissionalDetalhe } from "./ProfissionalDetalhe";
import { buscarProfissionalPorSlug } from "@/lib/supabase";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

const ESPECIALIDADE: Record<string, string> = {
  psicologo: "Psicologia",
  psiquiatra: "Psiquiatria",
  assistente_social: "Assistência Social",
};

function resumo(texto: string | null) {
  if (!texto) return undefined;
  return texto.length > 155 ? `${texto.slice(0, 152).trimEnd()}...` : texto;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profissional = await buscarProfissionalPorSlug(slug);
  if (!profissional) return {};

  const titulo = `${profissional.nome}, ${ESPECIALIDADE[profissional.especialidade]}`;
  const descricao = resumo(profissional.bio) ?? `${ESPECIALIDADE[profissional.especialidade]} parceira da Margem.`;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/profissionais/${slug}` },
    openGraph: { type: "profile", title: titulo, description: descricao, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
  };
}

export default async function ProfissionalPage({ params }: Props) {
  const { slug } = await params;
  const profissional = await buscarProfissionalPorSlug(slug);
  if (!profissional) notFound();

  return <ProfissionalDetalhe profissional={profissional} />;
}
