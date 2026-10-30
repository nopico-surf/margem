import { desenharPrevia, TAMANHO } from "@/lib/mochila/previa";

// Prévia do link do jogo, o que vai junto do card compartilhado.

export const size = TAMANHO;
export const contentType = "image/png";
export const alt = "Mochila do Rolê";

export default function Image() {
  return desenharPrevia({
    titulo: "Mochila do Rolê",
    apoio: "Antes de sair, uma pergunta: o que vai na sua mochila?",
  });
}
