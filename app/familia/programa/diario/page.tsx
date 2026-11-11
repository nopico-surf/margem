import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { DiarioCliente } from "./DiarioCliente";

// Diário (briefing M2): anotar um momento difícil ou um momento bom, em telas curtas de toque.
// Tudo no cliente: as anotações são da pessoa logada e passam pela rota /api/familia/diario.
// A lista de profissionais (carrossel de psicólogos depois de uma reação de risco) vem da busca cacheada.
export const metadata: Metadata = { title: "Anotar no diário", robots: { index: false, follow: false } };

export default function DiarioPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  return <DiarioCliente profissionais={await buscarTodosProfissionaisAtivos()} />;
}
