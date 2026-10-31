import { ALTURA_FEED } from "@/lib/mochila/card";
import { desenharCardServidor } from "@/lib/mochila/card-servidor";
import { decodificar } from "@/lib/mochila/codigo";
import { cenarioPorId } from "@/lib/mochila/conteudo";
import { desenharPrevia } from "@/lib/mochila/previa";

// Prévia do link de desafio: o mesmo card do feed que a pessoa mandou, com os itens visíveis no
// nível que ela escolheu. Link da versão 1 (sem tribo e sem eixos) ou inválido mantém a prévia
// antiga, da mochila fechada com o nome do cenário.

export const size = { width: 1080, height: ALTURA_FEED };
export const contentType = "image/png";
export const alt = "Monta sua mochila pro rolê";

export default async function Image({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const desafio = decodificar(codigo);
  if (desafio?.eixos) {
    const png = await desenharCardServidor({ ...desafio, eixos: desafio.eixos });
    return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
  }
  const cenario = cenarioPorId(desafio?.cenario ?? "");
  return desenharPrevia({
    titulo: "Monta sua mochila pro rolê",
    apoio: "Alguém já montou a dela. Vê quantas coisas vocês levam igual.",
    destino: cenario && `Destino: ${cenario.nome}`,
  });
}
