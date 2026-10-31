import { CENARIOS, ENDERECO_CURTO, ITENS, spriteDe, type CenarioId, type Tribo } from "./conteudo";
import { NOME_POLO, type Eixo } from "./eixos";
import type { Rotulo } from "./rotulo";
import { fileiras } from "./encaixe";

// Desenha no canvas o card compartilhável, igual à tela U2-Card do Claude Design (Stories
// 1080x1920 e feed 1080x1440). Roda no navegador e, pela prévia do link de desafio, no servidor
// (lib/mochila/card-servidor.ts), que troca o Ambiente. As cores vêm dos tokens do CSS na hora de
// desenhar, então trocar um token troca o card junto. A mochila do card é redesenhada só com os
// itens visíveis no nível escolhido: as fileiras sempre fecham, sem espaço vazio que entregue algo.

export type Formato = "stories" | "feed";
export type Fontes = { pixel: string; texto: string };

// O que muda entre navegador e servidor: de onde vêm as cores, as imagens, as fontes e o canvas.
export type Ambiente = {
  cor: (token: string) => string;
  imagem: (src: string) => Promise<HTMLImageElement>;
  fonte: (especificacao: string) => Promise<unknown>;
  canvas: (largura: number, altura: number) => HTMLCanvasElement;
};

const LARGURA = 1080;
export const ALTURA_FEED = 1440;
const MARGEM_LADO = 80;

function fonte(peso: number, tamanho: number, familia: string): string {
  return `${peso} ${tamanho}px ${familia}`;
}

function corDoCss(token: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--colors-${token}`).trim();
}

const imagens = new Map<string, Promise<HTMLImageElement>>();
function carregar(src: string): Promise<HTMLImageElement> {
  let p = imagens.get(src);
  if (!p) {
    p = new Promise((ok, erro) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => {
        // Sem isso a falha ficava guardada e o "Tentar de novo" repetia o erro sem baixar de novo.
        imagens.delete(src);
        erro(new Error(`imagem não carregou: ${src}`));
      };
      img.src = src;
    });
    imagens.set(src, p);
  }
  return p;
}

const NAVEGADOR: Ambiente = {
  cor: corDoCss,
  imagem: carregar,
  fonte: (especificacao) => document.fonts.load(especificacao),
  canvas: (largura, altura) => {
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    return canvas;
  },
};

// O mesmo recorte em degrau do clip-path .px do design.
function pxRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s);
  ctx.lineTo(x + s, y + s);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x + w - s, y);
  ctx.lineTo(x + w - s, y + s);
  ctx.lineTo(x + w, y + s);
  ctx.lineTo(x + w, y + h - s);
  ctx.lineTo(x + w - s, y + h - s);
  ctx.lineTo(x + w - s, y + h);
  ctx.lineTo(x + s, y + h);
  ctx.lineTo(x + s, y + h - s);
  ctx.lineTo(x, y + h - s);
  ctx.closePath();
}

function quebrar(ctx: CanvasRenderingContext2D, texto: string, max: number): string[] {
  const palavras = texto.split(" ");
  const linhas: string[] = [];
  let atual = "";
  for (const p of palavras) {
    const teste = atual ? `${atual} ${p}` : p;
    if (atual && ctx.measureText(teste).width > max) {
      linhas.push(atual);
      atual = p;
    } else atual = teste;
  }
  if (atual) linhas.push(atual);
  return linhas;
}

// text-wrap: balance. Mesmo número de linhas da quebra comum, com a menor largura possível.
function quebrarEquilibrado(ctx: CanvasRenderingContext2D, texto: string, max: number): string[] {
  const n = quebrar(ctx, texto, max).length;
  let lo = 0;
  let hi = max;
  for (let i = 0; i < 20; i++) {
    const meio = (lo + hi) / 2;
    if (quebrar(ctx, texto, meio).length > n) lo = meio;
    else hi = meio;
  }
  return quebrar(ctx, texto, hi);
}

// Medidas da tela U2-Card. O feed é desenhado direto em 1080x1440.
const MEDIDAS = {
  stories: { inset: 236, gap: 22, logoW: 348, logoH: 48, logoGap: 16, titulo: 66, sprite: 120, destino: 36, f1: 46, f2: 38, rPadY: 18, rPadX: 32, tGap: 14, frase: 38, barra: 30, barraH: 28, barraB: 4, barraGap: 10, eGap: 20, ePad: 28, selo: { s: 10, padY: 12, padX: 24, gap: 16, icone: 64, b: 4, fonte: 40 }, tagTop: 62, bagTop: 60, bagPad: 26, convite: 40 },
  feed: { inset: 80, gap: 18, logoW: 261, logoH: 36, logoGap: 12, titulo: 54, sprite: 96, destino: 30, f1: 40, f2: 32, rPadY: 14, rPadX: 28, tGap: 12, frase: 34, barra: 26, barraH: 22, barraB: 3, barraGap: 8, eGap: 16, ePad: 22, selo: { s: 8, padY: 10, padX: 20, gap: 14, icone: 48, b: 3, fonte: 34 }, tagTop: 44, bagTop: 46, bagPad: 22, convite: 34 },
};

export async function desenharCard(opcoes: {
  cenario: CenarioId;
  itens: string[];
  rotulo: Rotulo;
  eixos: Eixo[];
  tribo: Tribo | undefined;
  formato: Formato;
  fontes: Fontes;
  ambiente?: Ambiente;
}): Promise<HTMLCanvasElement> {
  const { cenario, itens, rotulo, eixos, tribo, formato, fontes, ambiente = NAVEGADOR } = opcoes;
  const { cor, imagem } = ambiente;
  const feed = formato === "feed";
  const z = MEDIDAS[formato];
  const altura = feed ? ALTURA_FEED : 1920;
  const largura = LARGURA - MARGEM_LADO * 2;

  // Se a fonte não carregar, o card sai com a fonte de reserva em vez de não sair.
  await Promise.all([
    ambiente.fonte(fonte(700, z.titulo, fontes.pixel)),
    ambiente.fonte(fonte(600, z.f1, fontes.pixel)),
    ambiente.fonte(fonte(600, z.f2, fontes.texto)),
    ambiente.fonte(fonte(400, z.barra, fontes.texto)),
  ]).catch((e) => console.error("[mochila] fonte do card não carregou", e));
  const virada = cenario === "virada";
  const [logo, mochila, fogos, icone, ...sprites] = await Promise.all([
    imagem("/icons/logo-margem.svg"),
    imagem(spriteDe("mochila-fechada")),
    virada ? imagem(spriteDe("fogos")) : Promise.resolve(null),
    tribo ? imagem(spriteDe(`tribo-${tribo.id}`)) : Promise.resolve(null),
    ...itens.map((id) => imagem(spriteDe(id))),
  ]);
  const spriteDoItem = new Map(itens.map((id, i) => [id, sprites[i]]));

  const canvas = ambiente.canvas(LARGURA, altura);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.textBaseline = "middle";

  // Fundo
  ctx.fillStyle = cor("brand-secondary-300");
  ctx.fillRect(0, 0, LARGURA, altura);
  if (fogos) {
    const k = Math.max(LARGURA / fogos.width, altura / fogos.height);
    ctx.drawImage(fogos, (LARGURA - fogos.width * k) / 2, (altura - fogos.height * k) / 2, fogos.width * k, fogos.height * k);
  } else {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = cor("brand-primary-700");
    const passo = feed ? 45 : 60;
    for (let x = 0; x < LARGURA; x += passo) ctx.fillRect(x, 0, 3, altura);
    for (let y = 0; y < altura; y += passo) ctx.fillRect(0, y, LARGURA, 3);
    ctx.restore();
  }

  // Medidas da mochila
  const rows = fileiras(itens);
  const muitas = rows.length >= 3;
  const escala = feed ? (muitas ? 2.5 : 3) : muitas ? 3 : 4;
  const fonteNome = feed ? (muitas ? 24 : 26) : muitas ? 26 : 28;
  const [padTopo, padLado, padBase] = feed ? (muitas ? [12, 10, 12] : [16, 12, 14]) : muitas ? [14, 12, 14] : [20, 14, 16];
  const rowGap = feed ? (muitas ? 12 : 14) : muitas ? 14 : 18;

  // Cabeçalho: logo, título e destino à esquerda, mochila fechada à direita, da mesma altura do
  // bloco de texto. A mochila maior estreita o texto, que pode quebrar em mais linhas e crescer,
  // então o tamanho é recalculado até assentar.
  const destino = `Destino: ${CENARIOS.find((c) => c.id === cenario)?.nome ?? ""}`;
  let tamanhoMochila = z.sprite;
  let linhasTitulo: string[] = [];
  let linhasDestino: string[] = [];
  let blocoTexto = 0;
  for (let i = 0; i < 4; i++) {
    ctx.font = fonte(700, z.titulo, fontes.pixel);
    linhasTitulo = quebrarEquilibrado(ctx, "Minha mochila pro rolê", largura - tamanhoMochila - 24);
    ctx.font = fonte(600, z.destino, fontes.texto);
    linhasDestino = quebrar(ctx, destino, largura - tamanhoMochila - 24);
    blocoTexto = z.logoH + z.logoGap * 2 + linhasTitulo.length * z.titulo * 1.02 + linhasDestino.length * z.destino * 1.2;
    if (blocoTexto === tamanhoMochila) break;
    tamanhoMochila = blocoTexto;
  }
  const alturaCabeca = Math.max(tamanhoMochila, blocoTexto);

  // Rótulo: pílula com as duas linhas, e a frase embaixo
  const pilulaInterna = largura - 12;
  ctx.font = fonte(600, z.f1, fontes.pixel);
  const linhasNome = quebrarEquilibrado(ctx, rotulo.nome, pilulaInterna - z.rPadX * 2);
  ctx.font = fonte(600, z.f2, fontes.texto);
  const linhasTambem = quebrar(ctx, rotulo.tambem, pilulaInterna - z.rPadX * 2);
  const alturaPilula = 12 + z.rPadY * 2 + linhasNome.length * z.f1 * 1.12 + 4 + linhasTambem.length * z.f2 * 1.25;
  ctx.font = fonte(600, z.frase, fontes.texto);
  const linhasFrase = quebrarEquilibrado(ctx, rotulo.frase, largura);
  const alturaRotulo = alturaPilula + z.tGap + linhasFrase.length * z.frase * 1.25;

  const interna = largura - 20 - z.bagPad * 2;
  ctx.font = fonte(600, fonteNome, fontes.texto);
  const medidas = rows.map((row) => {
    const soma = row.reduce((s, b) => s + b.espacos, 0);
    const livre = interna - (row.length - 1) * rowGap;
    const tiles = row.map((b) => {
      const w = (livre * b.espacos) / soma;
      const linhas = quebrar(ctx, ITENS[b.id].curto, w - 8 - padLado * 2);
      const h = 8 + padTopo + padBase + 32 * escala + 10 + linhas.length * fonteNome * 1.2;
      return { b, w, linhas, h };
    });
    return { tiles, h: Math.max(...tiles.map((t) => t.h)) };
  });
  const alturaMochila = 20 + z.bagTop + z.bagPad + medidas.reduce((s, r) => s + r.h, 0) + (medidas.length - 1) * rowGap;

  // Eixos: grade de 2 colunas
  const alturaEixo = z.barra * 1.25 + z.barraGap + z.barraH;
  const alturaEixos = 8 + z.ePad * 2 + alturaEixo * 2 + z.eGap;

  const total = alturaCabeca + alturaRotulo + z.tagTop + alturaMochila + alturaEixos + z.convite * 1.2 + z.gap * 4;
  let y = z.inset + (altura - z.inset * 2 - total) / 2;
  const x0 = MARGEM_LADO;

  // No feed, mochila cheia encostava na borda. Se não couber com o inset em cima e embaixo, o
  // bloco inteiro diminui por igual a partir do centro, sem apertar nada por dentro.
  if (feed) {
    const k = Math.min(1, (altura - z.inset * 2) / total);
    ctx.setTransform(k, 0, 0, k, ((1 - k) * LARGURA) / 2, ((1 - k) * altura) / 2);
  }

  // Cabeçalho
  let ty = y + (alturaCabeca - blocoTexto) / 2;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(logo, x0, ty, z.logoW, z.logoH);
  ctx.imageSmoothingEnabled = false;
  ty += z.logoH + z.logoGap;
  ctx.textAlign = "left";
  ctx.font = fonte(700, z.titulo, fontes.pixel);
  ctx.fillStyle = cor("brand-primary-950");
  linhasTitulo.forEach((l, i) => ctx.fillText(l, x0, ty + z.titulo * 1.02 * (i + 0.5)));
  ty += linhasTitulo.length * z.titulo * 1.02 + z.logoGap;
  ctx.font = fonte(600, z.destino, fontes.texto);
  ctx.fillStyle = cor("brand-primary-900");
  linhasDestino.forEach((l, i) => ctx.fillText(l, x0, ty + z.destino * 1.2 * (i + 0.5)));
  ctx.drawImage(mochila, x0 + largura - tamanhoMochila, y + (alturaCabeca - tamanhoMochila) / 2, tamanhoMochila, tamanhoMochila);
  y += alturaCabeca + z.gap;

  // Pílula com o rótulo e o "e também"
  ctx.fillStyle = cor("brand-primary-700");
  pxRect(ctx, x0, y, largura, alturaPilula, 12);
  ctx.fill();
  ctx.fillStyle = cor("brand-primary-900");
  pxRect(ctx, x0 + 6, y + 6, pilulaInterna, alturaPilula - 12, 6);
  ctx.fill();
  ctx.textAlign = "center";
  let py = y + 6 + z.rPadY;
  ctx.font = fonte(600, z.f1, fontes.pixel);
  ctx.fillStyle = cor("brand-secondary-300");
  linhasNome.forEach((l, i) => ctx.fillText(l, LARGURA / 2, py + z.f1 * 1.12 * (i + 0.5)));
  py += linhasNome.length * z.f1 * 1.12 + 4;
  ctx.font = fonte(600, z.f2, fontes.texto);
  ctx.fillStyle = cor("brand-primary-300");
  linhasTambem.forEach((l, i) => ctx.fillText(l, LARGURA / 2, py + z.f2 * 1.25 * (i + 0.5)));
  y += alturaPilula + z.tGap;
  ctx.font = fonte(600, z.frase, fontes.texto);
  ctx.fillStyle = cor("neutral-950");
  linhasFrase.forEach((l, i) => ctx.fillText(l, LARGURA / 2, y + z.frase * 1.25 * (i + 0.5)));
  y += linhasFrase.length * z.frase * 1.25 + z.gap + z.tagTop;

  // Mochila
  const topoMochila = y;
  ctx.fillStyle = cor("brand-primary-900");
  pxRect(ctx, x0, y, largura, alturaMochila, 24);
  ctx.fill();
  ctx.fillStyle = cor("brand-primary-700");
  pxRect(ctx, x0 + 10, y + 10, largura - 20, alturaMochila - 20, 14);
  ctx.fill();
  let ry = y + 10 + z.bagTop;
  ctx.font = fonte(600, fonteNome, fontes.texto);
  for (const row of medidas) {
    let rx = x0 + 10 + z.bagPad;
    for (const t of row.tiles) {
      ctx.fillStyle = cor("neutral-950");
      ctx.fillRect(rx, ry, t.w, row.h);
      ctx.fillStyle = cor("neutral-100");
      ctx.fillRect(rx + 4, ry + 4, t.w - 8, row.h - 8);
      const conteudo = 32 * escala + 10 + t.linhas.length * fonteNome * 1.2;
      let cy = ry + (row.h - conteudo) / 2;
      const iw = 32 * escala * t.b.espacos;
      const img = spriteDoItem.get(t.b.id);
      if (img) ctx.drawImage(img, rx + (t.w - iw) / 2, cy, iw, 32 * escala);
      cy += 32 * escala + 10;
      ctx.fillStyle = cor("neutral-950");
      t.linhas.forEach((l, i) => ctx.fillText(l, rx + t.w / 2, cy + fonteNome * 1.2 * (i + 0.5)));
      rx += t.w + rowGap;
    }
    ry += row.h + rowGap;
  }
  y += alturaMochila + z.gap;

  // Selo da tribo, pendurado no topo da mochila como etiqueta
  if (tribo) {
    const s = z.selo;
    const texto = `${tribo.nome} · ${tribo.estilo}`;
    ctx.font = fonte(600, s.fonte, fontes.pixel);
    const w = s.b * 2 + s.padX * 2 + s.icone + s.gap + ctx.measureText(texto).width;
    const h = s.b * 2 + s.padY * 2 + Math.max(s.icone, s.fonte * 1.1);
    const sx = (LARGURA - w) / 2;
    const sy = topoMochila - z.tagTop;
    ctx.fillStyle = cor("neutral-950");
    pxRect(ctx, sx, sy, w, h, s.s);
    ctx.fill();
    ctx.fillStyle = cor("neutral-100");
    pxRect(ctx, sx + s.b, sy + s.b, w - s.b * 2, h - s.b * 2, Math.max(2, s.s - s.b));
    ctx.fill();
    if (icone) ctx.drawImage(icone, sx + s.b + s.padX, sy + (h - s.icone) / 2, s.icone, s.icone);
    ctx.textAlign = "left";
    ctx.fillStyle = cor("brand-primary-900");
    ctx.fillText(texto, sx + s.b + s.padX + s.icone + s.gap, sy + h / 2);
  }

  // Eixos
  ctx.fillStyle = cor("neutral-950");
  pxRect(ctx, x0, y, largura, alturaEixos, 12);
  ctx.fill();
  ctx.fillStyle = cor("neutral-0");
  pxRect(ctx, x0 + 4, y + 4, largura - 8, alturaEixos - 8, 8);
  ctx.fill();
  const colGap = 36;
  const colW = (largura - 8 - z.ePad * 2 - colGap) / 2;
  eixos.forEach((e, i) => {
    const ex = x0 + 4 + z.ePad + (i % 2) * (colW + colGap);
    const ey = y + 4 + z.ePad + Math.floor(i / 2) * (alturaEixo + z.eGap);
    const domA = e.dominante === e.a;
    const linhaY = ey + (z.barra * 1.25) / 2;
    const polo = (texto: string, forte: boolean, lado: "left" | "right") => {
      ctx.font = fonte(forte ? 600 : 400, z.barra, fontes.texto);
      ctx.fillStyle = cor("neutral-950");
      ctx.globalAlpha = forte ? 1 : 0.72;
      ctx.textAlign = lado;
      ctx.fillText(texto, lado === "left" ? ex : ex + colW, linhaY);
      ctx.globalAlpha = 1;
    };
    polo(domA ? `${NOME_POLO[e.a]} ${e.percentual}%` : NOME_POLO[e.a], domA, "left");
    polo(domA ? NOME_POLO[e.b] : `${e.percentual}% ${NOME_POLO[e.b]}`, !domA, "right");
    const by = ey + z.barra * 1.25 + z.barraGap;
    const b = z.barraB;
    ctx.fillStyle = cor("neutral-950");
    ctx.fillRect(ex, by, colW, z.barraH);
    ctx.fillStyle = cor("neutral-100");
    ctx.fillRect(ex + b, by + b, colW - b * 2, z.barraH - b * 2);
    const preenchido = ((colW - b * 2) * e.percentual) / 100;
    ctx.fillStyle = cor("brand-primary-700");
    ctx.fillRect(domA ? ex + b : ex + colW - b - preenchido, by + b, preenchido, z.barraH - b * 2);
    ctx.fillStyle = cor("neutral-950");
    ctx.globalAlpha = 0.35;
    const meio = Math.max(2, b);
    ctx.fillRect(ex + colW / 2 - meio / 2, by + b, meio, z.barraH - b * 2);
    ctx.globalAlpha = 1;
  });
  y += alturaEixos + z.gap;

  // Convite
  ctx.textAlign = "center";
  ctx.font = fonte(600, z.convite, fontes.texto);
  ctx.fillStyle = cor("status-success-950");
  ctx.fillText(`Monte a sua: ${ENDERECO_CURTO}`, LARGURA / 2, y + z.convite * 0.6);

  return canvas;
}

// Checklist como imagem: o mesmo bloco "Pra levar no bolso do rolê" da tela de resultado.
export async function desenharChecklist(linhas: string[], fontes: Fontes): Promise<HTMLCanvasElement> {
  const cor = corDoCss;
  const largura = 1080;
  const pad = 80;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  await document.fonts.load(fonte(600, 40, fontes.texto));
  ctx.font = fonte(400, 36, fontes.texto);
  const texto = linhas.map((l) => quebrar(ctx, l, largura - pad * 2 - 96));
  const alturaLinhas = texto.reduce((s, l) => s + l.length * 50 + 32, 0);
  canvas.width = largura;
  canvas.height = pad * 2 + 70 + 48 + alturaLinhas;
  ctx.fillStyle = cor("brand-secondary-300");
  ctx.fillRect(0, 0, largura, canvas.height);
  ctx.textBaseline = "middle";
  ctx.font = fonte(600, 48, fontes.texto);
  ctx.fillStyle = cor("brand-primary-900");
  ctx.fillText("Pra levar no bolso do rolê:", pad, pad + 30);
  let y = pad + 70 + 24;
  ctx.fillStyle = cor("neutral-0");
  ctx.beginPath();
  ctx.roundRect(pad - 24, y - 24, largura - pad * 2 + 48, alturaLinhas + 32, 32);
  ctx.fill();
  for (const l of texto) {
    ctx.fillStyle = cor("brand-primary-700");
    ctx.beginPath();
    ctx.roundRect(pad, y + 5, 40, 40, 8);
    ctx.fill();
    ctx.strokeStyle = cor("neutral-0");
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(pad + 10, y + 25);
    ctx.lineTo(pad + 17, y + 33);
    ctx.lineTo(pad + 31, y + 16);
    ctx.stroke();
    ctx.font = fonte(400, 36, fontes.texto);
    ctx.fillStyle = cor("neutral-950");
    l.forEach((linha, i) => ctx.fillText(linha, pad + 64, y + 25 + i * 50));
    y += l.length * 50 + 32;
  }
  return canvas;
}

export function checklistTexto(linhas: string[]): string {
  return ["Pra levar no bolso do rolê:", ...linhas.map((l) => `☐ ${l}`)].join("\n");
}

// Texto alternativo da prévia do card: o que a imagem mostra, na ordem em que aparece.
export function altDoCard(itens: string[], rotulo: Rotulo, eixos: Eixo[], tribo: Tribo | undefined): string {
  return `Mochila em pixel art com ${itens.map((id) => ITENS[id].curto.toLowerCase()).join(", ")}. Escrito: ${rotulo.nome}, ${rotulo.tambem}. ${rotulo.frase}${tribo ? ` Tribo ${tribo.nome}, ${tribo.estilo}.` : ""} ${eixos.map((e) => `${NOME_POLO[e.dominante]} ${e.percentual}%`).join(", ")}.`;
}

export function paraBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error("sem imagem"))), "image/png"));
}
