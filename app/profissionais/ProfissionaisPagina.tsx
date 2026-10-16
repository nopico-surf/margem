import { Suspense } from "react";
import { ProfissionaisCliente } from "./ProfissionaisCliente";
import { ProfissionaisCarregando } from "./ProfissionaisCarregando";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import type { Especialidade } from "@/components/conversa/FiltroEspecialidade";

// A lista vem do cache (lib/supabase.ts) e entra no shell, então os cards já chegam no prefetch do menu.
// A especialidade da URL é lida no cliente (ProfissionaisCliente): ler searchParams aqui tiraria a lista
// do shell. No HTML estático o useSearchParams suspende e aparece o ProfissionaisCarregando até hidratar,
// com a aba que veio da rota: /profissionais (Psicologos) ou o rewrite pra /profissionais/aba-psiquiatras.
async function ProfissionaisConteudo() {
  const profissionais = await buscarTodosProfissionaisAtivos();
  return <ProfissionaisCliente profissionais={profissionais} />;
}

export function ProfissionaisPagina({ especialidadeInicial }: { especialidadeInicial: Especialidade }) {
  return (
    <Suspense fallback={<ProfissionaisCarregando especialidadeInicial={especialidadeInicial} />}>
      <ProfissionaisConteudo />
    </Suspense>
  );
}
