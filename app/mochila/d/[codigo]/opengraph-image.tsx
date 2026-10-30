import { decodificar } from "@/lib/mochila/codigo";
import { cenarioPorId } from "@/lib/mochila/conteudo";
import { desenharPrevia, TAMANHO } from "@/lib/mochila/previa";

// Prévia do link de desafio: a mochila fechada, o nome do cenário e o convite.

export const size = TAMANHO;
export const contentType = "image/png";
export const alt = "Monta sua mochila pro rolê";

export default async function Image({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const cenario = cenarioPorId(decodificar(codigo)?.cenario ?? "");
  return desenharPrevia({
    titulo: "Monta sua mochila pro rolê",
    apoio: "Alguém já montou a dela. Vê quantas coisas vocês levam igual.",
    destino: cenario && `Destino: ${cenario.nome}`,
  });
}
