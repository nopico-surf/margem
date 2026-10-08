import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfissionalDetalhe } from "./ProfissionalDetalhe";
import { buscarProfissionalPorSlug, buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { slugsDosProfissionais } from "@/lib/slug-profissional";
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

export async function generateStaticParams() {
  const profissionais = await buscarTodosProfissionaisAtivos();
  const slugs = slugsDosProfissionais(profissionais).map(({ slug }) => ({ slug }));
  // Cache Components recusa lista vazia no build. Se o Supabase falhou, o slug de um perfil já
  // publicado cai fora do prerender e a página volta a ser gerada na requisição.
  return slugs.length > 0 ? slugs : [{ slug: "_" }];
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
