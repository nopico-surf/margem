// Gera a versão pequena (192x192 webp) de cada foto de profissional em public/assets.
// Os cards mostram a foto em 96x96; 192 cobre tela retina. A original (1200x1200) continua
// servindo a página interna do profissional. Só gera o que falta ou o que ficou mais velho que a
// original (foto trocada com o mesmo nome): rodar de novo é seguro.
//
// Uso: node scripts/fotos-pequenas.mjs
// O nome da versão pequena tem que bater com `fotoPequena` em lib/foto-pequena.ts.

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PASTA = path.join(process.cwd(), "public", "assets");
const LADO = 192;

const arquivos = await readdir(PASTA);
const fotos = arquivos.filter(
  (nome) =>
    /^professional-.+\.(webp|jpe?g|png)$/i.test(nome) &&
    !nome.startsWith("professional-avatar") &&
    !nome.endsWith(`-${LADO}.webp`),
);

for (const nome of fotos) {
  const origem = path.join(PASTA, nome);
  const destino = path.join(PASTA, nome.replace(/\.[^.]+$/, `-${LADO}.webp`));
  const pequena = await stat(destino).catch(() => null);
  if (pequena && pequena.mtimeMs >= (await stat(origem)).mtimeMs) continue;
  const info = await sharp(origem)
    .resize(LADO, LADO, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(destino);
  console.log(`${path.basename(destino)}  ${(info.size / 1024).toFixed(1)} KiB`);
}
