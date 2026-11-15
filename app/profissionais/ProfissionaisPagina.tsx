import { Suspense } from "react";
import { ProfissionaisCliente } from "./ProfissionaisCliente";
import { ProfissionaisCarregando } from "./ProfissionaisCarregando";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { anoAtualCacheado } from "@/lib/ano-atual";
import type { Especialidade } from "@/components/conversa/FiltroEspecialidade";

// A lista vem do cache (lib/supabase.ts) e entra no shell, então os cards já chegam no prefetch do menu.
// A especialidade nasce da rota: /profissionais (Psicólogos) ou o rewrite pra /profissionais/aba-psiquiatras.
// O ?especialidade= da URL é lido no cliente depois da hidratação (ProfissionaisCliente), sem
// useSearchParams: o hook jogava a lista inteira pro navegador e o HTML ficava só com o skeleton.
async function ProfissionaisConteudo({ especialidadeInicial }: { especialidadeInicial: Especialidade }) {
  const [profissionais, anoAtual] = await Promise.all([buscarTodosProfissionaisAtivos(), anoAtualCacheado()]);
  return <ProfissionaisCliente profissionais={profissionais} especialidadeInicial={especialidadeInicial} anoAtual={anoAtual} />;
}

export function ProfissionaisPagina({ especialidadeInicial }: { especialidadeInicial: Especialidade }) {
  return (
    <Suspense fallback={<ProfissionaisCarregando especialidadeInicial={especialidadeInicial} />}>
      <ProfissionaisConteudo especialidadeInicial={especialidadeInicial} />
    </Suspense>
  );
}
