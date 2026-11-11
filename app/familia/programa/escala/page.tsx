import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { EscalaCliente } from "./EscalaCliente";

// Escala "Como está a sua vida" e meta da semana (componentes-parte1, C1). Tudo no cliente: as notas
// e a meta são da pessoa logada e passam pelas rotas /api/familia/escala e /api/familia/meta.
// A lista de profissionais (carrossel de psicólogos da nota muito baixa) vem da busca cacheada.
export const metadata: Metadata = { title: "Como está a sua vida", robots: { index: false, follow: false } };

export default function EscalaPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  return <EscalaCliente profissionais={await buscarTodosProfissionaisAtivos()} />;
}
