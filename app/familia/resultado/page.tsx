import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";
import { titulosDosModulosPagos } from "@/lib/familia/conteudo";
import { ResultadoCliente } from "./ResultadoCliente";

// Os títulos dos módulos 1 a 8 (lista do banner de oferta) vêm do content/familia, lidos no build,
// como no painel.
export default function ResultadoPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  return <ResultadoCliente modulosPagos={await titulosDosModulosPagos()} />;
}
