import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { AdiarCliente } from "./AdiarCliente";

// "Quando o combinado fica para outro dia" (briefing M4, C5). Tudo no cliente: o combinado é da pessoa
// logada e passa pela rota /api/familia/valorizar.
// A lista de profissionais (carrossel de psicólogos quando o clima pode ficar tenso) vem da busca cacheada.
export const metadata: Metadata = { title: "Quando o combinado fica para outro dia", robots: { index: false, follow: false } };

export default function AdiarPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  return <AdiarCliente profissionais={await buscarTodosProfissionaisAtivos()} />;
}
