import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfissionaisCliente } from "./ProfissionaisCliente";
import { ProfissionaisCarregando } from "./ProfissionaisCarregando";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

const TITULO = "Profissionais que podem ajudar";
const DESCRICAO = "Psicólogos e psiquiatras parceiros da Margem, disponíveis para sessões com valor social e atendimento acolhedor para quem precisar.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/profissionais" },
  openGraph: { type: "website", title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

// A lista vem do cache (lib/supabase.ts) e entra no shell, então os cards já chegam no prefetch do menu.
// A especialidade da URL é lida no cliente (ProfissionaisCliente): ler searchParams aqui tiraria a lista
// do shell. No HTML estático o useSearchParams suspende e aparece o ProfissionaisCarregando até hidratar.
async function ProfissionaisConteudo() {
  const profissionais = await buscarTodosProfissionaisAtivos();
  return <ProfissionaisCliente profissionais={profissionais} />;
}

export default function ProfissionaisPage() {
  return (
    <Suspense fallback={<ProfissionaisCarregando />}>
      <ProfissionaisConteudo />
    </Suspense>
  );
}
