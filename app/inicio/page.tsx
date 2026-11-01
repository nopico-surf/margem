import type { Metadata } from "next";
import { Suspense } from "react";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { InicioCliente } from "./InicioCliente";
import { InicioCarregando } from "./InicioCarregando";

// Sem canonical, o Google trata /inicio?utm_source=... (links do Instagram) como cópia.
export const metadata: Metadata = {
  alternates: { canonical: "/inicio" },
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
