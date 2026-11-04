// Gera o recorte do card da lista do blog (public/blog/<slug>-card.webp, 1300x605) a partir da imagem
// do topo (public/blog/<slug>.webp, 2:1). O card mostra a imagem mais de perto que o banner.
//
// Regra: os elementos centrais (as pessoas) ficam centralizados, com a mesma distância nas duas
// laterais. Por isso cada guia declara `sujeito`, o x onde o conjunto central começa e termina na
// imagem original (cadeira, pessoa, objeto: o que tem que aparecer inteiro). O script centraliza o
// recorte nesse intervalo, nunca num x escolhido no olho.
//
// Guia novo: adicionar uma linha em RECORTES, rodar e olhar o card antes de subir. `topo` é onde o
// recorte começa na vertical (px da original); `largura` é a largura do recorte (maior = mais aberto).
//
// Uso: node scripts/cards-blog.mjs
// O nome do arquivo tem que bater com `caminhoDaImagemDoCard` em lib/guias.ts (campo `imagemCard`).

import path from "node:path";
import sharp from "sharp";

const PASTA = path.join(process.cwd(), "public", "blog");
const SAIDA = { largura: 1300, altura: 605 };

const RECORTES = {
  "terapia-barata": { sujeito: [575, 1755], topo: 60, largura: 1700 },
  "psiquiatra-barato": { sujeito: [245, 1430], topo: 100, largura: 1500 },
  "psicologo-alcool-e-drogas": { sujeito: [180, 1900], topo: 80, largura: 1800 },
  "reducao-de-danos": { sujeito: [620, 1580], topo: 0, largura: 1700 },
  "como-saber-se-o-psicologo-e-registrado": { sujeito: [880, 1640], topo: 60, largura: 1500 },
  "como-parar-de-fumar": { sujeito: [520, 1330], topo: 0, largura: 1800 },
  "como-parar-de-beber": { sujeito: [690, 1260], topo: 200, largura: 1700 },
  "como-parar-de-fumar-maconha": { sujeito: [470, 1480], topo: 100, largura: 1800 },
  "como-parar-de-usar-cocaina": { sujeito: [880, 1360], topo: 160, largura: 1800 },
  "lei-de-drogas": { sujeito: [600, 1570], topo: 50, largura: 1900 },
};

for (const [slug, { sujeito, topo, largura }] of Object.entries(RECORTES)) {
  const origem = path.join(PASTA, `${slug}.webp`);
  const { width } = await sharp(origem).metadata();
  const altura = Math.round((largura * SAIDA.altura) / SAIDA.largura);
  const centro = (sujeito[0] + sujeito[1]) / 2;
  const esquerda = Math.min(Math.max(Math.round(centro - largura / 2), 0), width - largura);
  const margemEsq = sujeito[0] - esquerda;
  const margemDir = esquerda + largura - sujeito[1];
  const destino = path.join(PASTA, `${slug}-card.webp`);
  await sharp(origem)
    .extract({ left: esquerda, top: topo, width: largura, height: altura })
    .resize(SAIDA.largura, SAIDA.altura)
    .webp({ quality: 82 })
    .toFile(destino);
  console.log(`${slug}-card.webp  margem esq ${margemEsq}px, dir ${margemDir}px`);
}
