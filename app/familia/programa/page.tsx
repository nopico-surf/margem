import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader } from "@/components/ui/Loader";
import { MOSTRAR_REVISAO_CLINICA } from "@/lib/familia/config";
import { lerModulo, TOTAL_MODULOS } from "@/lib/familia/conteudo";
import { PainelCliente, type ModuloDoPainel } from "./PainelCliente";

// Painel do programa (componentes-parte2, "Painel do programa"). Os títulos dos módulos vêm do
// content/familia, lidos no build; o resto (progresso, meta, diagnóstico) é da pessoa logada e vem
// pelas rotas /api/familia, no cliente. Como na página do módulo, o módulo 1 é aberto pra quem tem
// conta e os módulos 2 a 8 ([REVISÃO CLÍNICA]) abrem só no servidor local até a revisão; a liberação
// semanal e a compra são da Fase 2.
export const metadata: Metadata = { title: "Seu painel", robots: { index: false, follow: false } };

export default function ProgramaPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo />
    </Suspense>
  );
}

async function Conteudo() {
  const numeros = Array.from({ length: TOTAL_MODULOS }, (_, indice) => indice + 1);
  const lidos = await Promise.all(numeros.map((numero) => lerModulo(numero)));
  const modulos: ModuloDoPainel[] = lidos
    .filter((modulo): modulo is NonNullable<typeof modulo> => modulo !== null && modulo.publicado)
    .map((modulo) => ({
      numero: modulo.numero,
      titulo: modulo.titulo,
      liberado: modulo.numero === 1 || MOSTRAR_REVISAO_CLINICA,
      bloqueadoEmModoSeguranca: modulo.bloqueadoEmModoSeguranca,
    }));
  return <PainelCliente modulos={modulos} />;
}
