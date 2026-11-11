import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { psicologosDoConvite } from "@/lib/familia/convite-servidor";
import { ContarConviteCliente } from "./ContarConviteCliente";

// "Contar como foi o convite" (briefing M5, card 2 e painel). A lista de psicólogos vem do servidor só
// pra montar o "Agendar com {{profissional_salvo}}" do "Aceitou".
export const metadata: Metadata = { title: "Contar como foi o convite", robots: { index: false, follow: false } };

export default function ContarConvitePage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  return <ContarConviteCliente profissionais={await psicologosDoConvite()} />;
}
