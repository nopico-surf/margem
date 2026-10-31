import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GlobalFonts, createCanvas, loadImage, type Canvas } from "@napi-rs/canvas";
import { desenharCard, type Ambiente, type Fontes } from "./card";
import { triboPorId, type CenarioId } from "./conteudo";
import { eixosDeValores } from "./eixos";
import { rotulo as rotuloDe } from "./rotulo";

// O card do feed desenhado no servidor, pra prévia do link de desafio: o mesmo desenharCard do
// navegador, com cores lidas do tokens.css, imagens e fontes lidas do /public.

const ler = (caminho: string) => readFile(join(process.cwd(), caminho));

const FONTES: Fontes = { pixel: "Pixelify", texto: "Inter" };
let registradas = false;
function registrarFontes() {
  if (registradas) return;
  for (const [arquivo, familia] of [
    ["pixelify-sans-600.ttf", FONTES.pixel],
    ["pixelify-sans-700.ttf", FONTES.pixel],
    ["inter-400.ttf", FONTES.texto],
    ["inter-600.ttf", FONTES.texto],
  ]) {
    GlobalFonts.registerFromPath(join(process.cwd(), "public/assets/fonts", arquivo), familia);
  }
  registradas = true;
}

export async function desenharCardServidor({ cenario, itens, combinados, tribo, eixos: valores }: {
  cenario: CenarioId;
  itens: string[];
  combinados: number[];
  tribo?: string;
  eixos: number[];
}): Promise<Buffer> {
  registrarFontes();
  const css = String(await ler("app/tokens.css"));
  const ambiente: Ambiente = {
    cor: (token) => css.match(new RegExp(`--colors-${token}:\\s*([^;]+);`))?.[1].trim() ?? "black",
    imagem: async (src) => (await loadImage(await ler(join("public", src)))) as unknown as HTMLImageElement,
    fonte: async () => {},
    canvas: (largura, altura) => createCanvas(largura, altura) as unknown as HTMLCanvasElement,
  };
  const eixos = eixosDeValores(valores);
  const canvas = await desenharCard({
    cenario,
    itens,
    rotulo: rotuloDe(cenario, itens, combinados, eixos),
    eixos,
    tribo: triboPorId(tribo ?? null),
    formato: "feed",
    fontes: FONTES,
    ambiente,
  });
  return (canvas as unknown as Canvas).encode("png");
}
