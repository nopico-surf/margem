import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import { lerCenario, titulosDosModulosPagos } from "@/lib/familia/conteudo";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { SimuladorCliente } from "./SimuladorCliente";

type Props = { params: Promise<{ cenario: string }> };

// Cenários do simulador, em content/familia/cenarios (briefing, seção 8).
export function generateStaticParams() {
  return [{ cenario: "primeira-conversa" }, { cenario: "nega-o-problema" }, { cenario: "elogiar-sem-ironia" }];
}

// O params fica dentro do Suspense, como no blog (exigência do cacheComponents).
export default function SimuladorPage({ params }: Props) {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo params={params} />
    </Suspense>
  );
}

async function Conteudo({ params }: Props) {
  const { cenario: id } = await params;
  const [cenario, modulos, profissionais] = await Promise.all([lerCenario(id), titulosDosModulosPagos(), buscarTodosProfissionaisAtivos()]);
  if (!cenario) notFound();
  // Os títulos dos módulos vão pro banner de oferta que aparece quando o treino grátis acaba (briefing 01b).
  // Os profissionais vão pro carrossel dos contatos de emergência (busca cacheada).
  return <SimuladorCliente cenario={cenario} modulosDaOferta={modulos} profissionais={profissionais} />;
}
