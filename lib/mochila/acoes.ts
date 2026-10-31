import { URL_DO_JOGO, type Cenario, type CenarioId, type Tribo } from "./conteudo";
import type { Rotulo } from "./rotulo";

// Pequenas ações do navegador usadas pelas telas da Mochila do Rolê.

export function link(caminho: string, canal: string, cenario: CenarioId) {
  return `${URL_DO_JOGO}${caminho}?utm_source=mochila&utm_medium=${canal}&utm_campaign=${cenario}`;
}

// Texto que vai junto da imagem no desafio e no compartilhar. O Instagram ignora o texto na folha
// de compartilhar; no Direct ele é copiado sozinho e o link gera a imagem. Quem escolhe o WhatsApp
// por qualquer um dos dois caminhos manda a mesma coisa.
export function textoDesafio(opcoes: { cenario: Cenario; rotulo: Rotulo; tribo: Tribo | undefined; qtdItens: number; url: string }) {
  const { cenario, rotulo, tribo, qtdItens, url } = opcoes;
  return [
    `Montei minha Mochila do Rolê ${cenario.pra} e saiu assim:`,
    "",
    `🎒 ${rotulo.nome}, ${rotulo.tambem}`,
    ...(tribo ? [`🎶 Tribo: ${tribo.nome} (${tribo.estilo})`] : []),
    `✅ ${qtdItens === 1 ? "1 coisa" : `${qtdItens} coisas`} na mochila`,
    "",
    "No caminho, você ainda aprende umas coisas sobre redução de danos.",
    "",
    "E você, levaria o quê? Monta a sua pro mesmo rolê e compara com a minha:",
    url,
  ].join("\n");
}

// No Android, o sistema confirma cópia e download com aviso próprio, que a página não consegue esconder.
// Aí o nosso toast fica de fora, pra nunca aparecerem os dois.
export function sistemaAvisa() {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

export async function copiar(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

export function baixar(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
