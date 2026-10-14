import type { Metadata } from "next";
import { Suspense } from "react";
import { RedesApoioCliente } from "./RedesApoioCliente";
import { RedesApoioCarregando } from "./RedesApoioCarregando";
import { buscarRedesIndependentes, buscarRedesPublicas } from "@/lib/supabase";
import { CATEGORIA_PADRAO, paraCardResource } from "@/lib/recursos";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

const TITULO = "Redes de apoio";
// Mesma frase que abre os serviços públicos na /conversa.
const DESCRICAO = "Acolhimento, saúde e assistência pública para cuidar e apoiar pessoas em uso de substâncias e familiares";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/redes-de-apoio" },
  openGraph: { type: "website", title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

// As duas listas vêm do cache (lib/supabase.ts) e entram no shell. A aba da URL é lida no cliente
// (RedesApoioCliente): ler searchParams aqui tiraria as listas do shell. No HTML estático o
// useSearchParams suspende e aparece o RedesApoioCarregando até hidratar.
async function RedesApoioConteudo() {
  const [publicas, independentes] = await Promise.all([
    buscarRedesPublicas(CATEGORIA_PADRAO),
    buscarRedesIndependentes(CATEGORIA_PADRAO),
  ]);

  return (
    <RedesApoioCliente
      publicas={publicas.map((servico) => paraCardResource(servico.id, servico.nome, servico.descricao, servico.acoes))}
      independentes={independentes.map((instituicao) =>
        paraCardResource(instituicao.id, instituicao.nome, instituicao.descricao, instituicao.contatos),
      )}
    />
  );
}

export default function RedesApoioPage() {
  return (
    <Suspense fallback={<RedesApoioCarregando />}>
      <RedesApoioConteudo />
    </Suspense>
  );
}
