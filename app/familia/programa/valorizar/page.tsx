import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { lerCenario } from "@/lib/familia/conteudo";
import { CENARIO_DO_ELOGIO } from "@/lib/familia/valorizar";
import { ValorizarCliente } from "./ValorizarCliente";

// "Como você vai valorizar nesta semana" (briefing M4, ferramenta B). O botão "Treinar um elogio" só
// aparece quando o cenário "elogiar-sem-ironia" tem arquivo em content/familia/cenarios.
export const metadata: Metadata = { title: "Como você vai valorizar nesta semana", robots: { index: false, follow: false } };

// A leitura do arquivo fica dentro do Suspense, como a página do simulador (exigência do cacheComponents).
export default function ValorizarPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  const cenario = await lerCenario(CENARIO_DO_ELOGIO);
  return <ValorizarCliente temTreinoDeElogio={Boolean(cenario)} />;
}
