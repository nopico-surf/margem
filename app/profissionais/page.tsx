import type { Metadata } from "next";
import { ProfissionaisCliente } from "./ProfissionaisCliente";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import type { Especialidade } from "@/components/conversa/FiltroEspecialidade";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

const TITULO = "Profissionais que podem ajudar";
const DESCRICAO = "Profissionais parceiros da Margem para sessões com valor social";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/profissionais" },
  openGraph: { title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

type Props = { searchParams: Promise<{ especialidade?: string }> };

export default async function ProfissionaisPage({ searchParams }: Props) {
  const { especialidade } = await searchParams;
  const especialidadeInicial: Especialidade = especialidade === "psiquiatra" ? "psiquiatra" : "psicologo";
  const profissionais = await buscarTodosProfissionaisAtivos();

  // key força remontagem ao navegar entre /profissionais?especialidade=... vindo do menu: sem isso o
  // useState de especialidadeSelecionada mantém o valor do primeiro mount e ignora o novo query param.
  return <ProfissionaisCliente key={especialidadeInicial} profissionais={profissionais} especialidadeInicial={especialidadeInicial} />;
}
