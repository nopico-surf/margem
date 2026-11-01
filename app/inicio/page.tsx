import type { Metadata } from "next";
import { Suspense } from "react";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";
import { InicioCliente } from "./InicioCliente";
import { InicioCarregando } from "./InicioCarregando";

const TITULO = "Margem: apoio e redução de danos em álcool e outras drogas";
const DESCRICAO =
  "Conte o que está vivendo e receba orientação, redução de danos e contatos de profissionais e serviços. Sem julgamento e sem precisar se identificar.";

// Sem canonical, o Google trata /inicio?utm_source=... (links do Instagram) como cópia.
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/inicio" },
  openGraph: { type: "website", title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

// A entrada da Margem desde 07/10/2026: juntou a /bem-vindo (sobre a Margem e o painel de dados e
// cookies) com a antiga /inicio (campo livre e cards). Figma: Experiência do produto, seção "Fluxo -
// Para recebimento dinâmico de dados" (1365:9775).
//
// Os profissionais vêm do cache (lib/supabase.ts) e entram no shell, como na /profissionais. Enquanto
// não chegam, aparece o skeleton da tela inteira (Figma 1438:365597).
async function InicioConteudo() {
  const profissionais = await buscarTodosProfissionaisAtivos();
  return <InicioCliente profissionais={profissionais} />;
}

export default function InicioPage() {
  return (
    <Suspense fallback={<InicioCarregando />}>
      <InicioConteudo />
    </Suspense>
  );
}
