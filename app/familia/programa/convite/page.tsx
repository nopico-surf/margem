import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { lerCenario } from "@/lib/familia/conteudo";
import { CENARIO_DO_CONVITE } from "@/lib/familia/convite";
import { psicologosDoConvite } from "@/lib/familia/convite-servidor";
import { ConviteCliente } from "./ConviteCliente";

// "Preparar o convite" (briefing M5, C6). A lista de psicólogos vem do servidor; o convite é da pessoa
// logada e passa pela rota /api/familia/convite. O "Treinar o convite" só aparece quando o cenário
// "convite-para-ajuda" tem arquivo em content/familia/cenarios.
export const metadata: Metadata = { title: "Preparar o convite", robots: { index: false, follow: false } };

export default function ConvitePage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  const [cenario, profissionais] = await Promise.all([lerCenario(CENARIO_DO_CONVITE), psicologosDoConvite()]);
  return <ConviteCliente profissionais={profissionais} temTreino={Boolean(cenario)} />;
}
