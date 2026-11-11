import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { titulosDosModulosPagos } from "@/lib/familia/conteudo";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { ResultadoCliente } from "./ResultadoCliente";

// Os títulos dos módulos 1 a 8 (lista do banner de oferta) vêm do content/familia, lidos no build,
// como no painel. Os profissionais (carrosséis do aviso e da segurança) vêm da busca cacheada.
export default function ResultadoPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  const [modulosPagos, profissionais] = await Promise.all([titulosDosModulosPagos(), buscarTodosProfissionaisAtivos()]);
  return <ResultadoCliente modulosPagos={modulosPagos} profissionais={profissionais} />;
}
