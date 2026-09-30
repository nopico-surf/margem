import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfissionaisCliente } from "./ProfissionaisCliente";
import { ProfissionaisCarregando } from "./ProfissionaisCarregando";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import type { Especialidade } from "@/components/conversa/FiltroEspecialidade";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

const TITULO = "Profissionais que podem ajudar";
const DESCRICAO = "Psicólogos e psiquiatras parceiros da Margem, disponíveis para sessões com valor social e atendimento acolhedor para quem precisar.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/profissionais" },
  openGraph: { type: "website", title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

type Props = { searchParams: Promise<{ especialidade?: string }> };

async function ProfissionaisConteudo({ searchParams }: Props) {
  const { especialidade } = await searchParams;
  const especialidadeInicial: Especialidade = especialidade === "psiquiatra" ? "psiquiatra" : "psicologo";
  const profissionais = await buscarTodosProfissionaisAtivos();

  // key força remontagem ao navegar entre /profissionais?especialidade=... vindo do menu: sem isso o
  // useState de especialidadeSelecionada mantém o valor do primeiro mount e ignora o novo query param.
  return <ProfissionaisCliente key={especialidadeInicial} profissionais={profissionais} especialidadeInicial={especialidadeInicial} />;
}

// A página em si é só o shell. searchParams e o Supabase só existem depois da resposta, então ficam
// dentro do Suspense; até lá aparece ProfissionaisCarregando, que já é a tela com os cards em skeleton.
export default function ProfissionaisPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<ProfissionaisCarregando />}>
      <ProfissionaisConteudo searchParams={searchParams} />
    </Suspense>
  );
}
