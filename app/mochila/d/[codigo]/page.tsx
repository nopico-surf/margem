import type { Metadata } from "next";
import { Suspense } from "react";
import { TelaInicio } from "@/components/mochila/telas/TelaInicio";
import { TelaCarregando } from "@/components/mochila/TelaCarregando";

// Entrada pelo link de desafio. O código guarda o cenário e os itens visíveis da outra pessoa;
// código inválido cai no início normal, sem erro na tela (decodificar devolve null).

export const metadata: Metadata = {
  title: "Monta sua mochila pro rolê",
  description: "Alguém já montou a dela. Vê quantas coisas vocês levam igual.",
  openGraph: {
    title: "Monta sua mochila pro rolê",
    description: "Alguém já montou a dela. Vê quantas coisas vocês levam igual.",
  },
};

async function Desafio({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  return <TelaInicio codigo={codigo} />;
}

export default function DesafioPage({ params }: { params: Promise<{ codigo: string }> }) {
  return (
    <Suspense fallback={<TelaCarregando />}>
      <Desafio params={params} />
    </Suspense>
  );
}
