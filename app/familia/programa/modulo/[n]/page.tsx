import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import { lerModulo, TOTAL_MODULOS } from "@/lib/familia/conteudo";
import { ModuloCliente } from "./ModuloCliente";

type Props = { params: Promise<{ n: string }> };

// Módulos do programa para familiares, escritos em content/familia/modulos (briefing, seção 7).
// O texto é lido no build; quem pode ver, o apelido e as variações por problema são resolvidos no
// cliente, com o diagnóstico da pessoa. Na Fase 1 só o módulo 1 existe e ele é aberto pra quem tem
// conta, mesmo sem ter comprado. A liberação semanal dos outros é da Fase 2.
export async function generateStaticParams() {
  const numeros = Array.from({ length: TOTAL_MODULOS }, (_, indice) => indice + 1);
  const existentes = await Promise.all(numeros.map(async (numero) => ((await lerModulo(numero)) ? numero : null)));
  return existentes.filter((numero): numero is number => numero !== null).map((numero) => ({ n: String(numero) }));
}

// O params fica dentro do Suspense, como no blog (exigência do cacheComponents).
export default function ModuloPage({ params }: Props) {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo params={params} />
    </Suspense>
  );
}

async function Conteudo({ params }: Props) {
  const { n } = await params;
  const modulo = await lerModulo(Number(n));
  if (!modulo || !modulo.publicado || modulo.numero !== 1) notFound();
  return <ModuloCliente modulo={modulo} />;
}
