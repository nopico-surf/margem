import { CENARIOS, ENDERECO_CURTO, ITENS, spriteDe, type CenarioId } from "./conteudo";
import type { Rotulo } from "./rotulo";

// Desenha no canvas o card compartilhável, igual à tela B-Stories do Claude Design (Stories
// 1080x1920 e feed 1080x1350). Roda só no navegador. As cores vêm dos tokens do CSS na hora de
// desenhar, então trocar um token troca o card junto. A mochila do card é redesenhada só com os
// itens visíveis no nível escolhido: as fileiras sempre fecham, sem espaço vazio que entregue algo.

export type Formato = "stories" | "feed";
export type Fontes = { pixel: string; texto: string };

const LARGURA = 1080;
const MARGEM_LADO = 80;

function fonte(peso: number, tamanho: number, familia: string): string {
  return `${peso} ${tamanho}px ${familia}`;
}

function cor(token: string): string {
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

type Bloco = { id: string; ordem: number; espacos: 1 | 2 };

function fileiras(ids: string[]): Bloco[][] {
  const itens = ids.map((id, ordem) => ({ id, ordem, espacos: ITENS[id].espacos }));
  const total = itens.reduce((s, it) => s + it.espacos, 0);
  const dois = itens.filter((it) => it.espacos === 2);
  let n = total <= 4 ? 1 : total <= 8 ? 2 : 3;
  n = Math.max(n, Math.min(dois.length, 3));
  const rows = Array.from({ length: n }, () => ({ lista: [] as Bloco[], usado: 0 }));
  dois.forEach((it, k) => {
    rows[k % n].lista.push(it);
    rows[k % n].usado += 2;
  });
  for (const it of itens.filter((i) => i.espacos === 1)) {
    let melhor = rows[0];
    for (const r of rows) if (r.usado < melhor.usado) melhor = r;
    melhor.lista.push(it);
    melhor.usado += 1;
  }
  return rows.filter((r) => r.lista.length).map((r) => r.lista.sort((a, b) => a.ordem - b.ordem));
}

const DECOR: [number, number, number, string][] = [
  [96, 96, 24, "brand-primary-900"], [216, 156, 12, "neutral-0"], [744, 84, 12, "brand-primary-900"],
  [912, 144, 24, "neutral-0"], [540, 180, 12, "brand-primary-700"], [960, 60, 12, "brand-primary-700"],
  [120, 1740, 12, "brand-primary-900"], [300, 1800, 24, "neutral-0"], [624, 1764, 12, "brand-primary-900"],
  [852, 1812, 24, "brand-primary-700"], [984, 1740, 12, "neutral-0"], [60, 1860, 12, "brand-primary-700"],
];

export async function desenharCard(opcoes: {
  cenario: CenarioId;
  itens: string[];
  rotulo: Rotulo;
  formato: Formato;
  fontes: Fontes;
}): Promise<HTMLCanvasElement> {
  const { cenario, itens, rotulo, formato, fontes } = opcoes;
  const feed = formato === "feed";
  const altura = feed ? 1350 : 1920;
  const inset = feed ? 80 : 250;
  const largura = LARGURA - MARGEM_LADO * 2;

  // Se a fonte não carregar, o card sai com a fonte de reserva em vez de não sair.
  await Promise.all([
    document.fonts.load(fonte(700, 92, fontes.pixel)),
    document.fonts.load(fonte(600, 48, fontes.pixel)),
    document.fonts.load(fonte(600, 46, fontes.texto)),
  ]).catch((e) => console.error("[mochila] fonte do card não carregou", e));
  const virada = cenario === "virada";
  const [logo, mochila, fogos, ...sprites] = await Promise.all([
    carregar("/icons/logo-margem.svg"),
    carregar(spriteDe("mochila-fechada")),
    virada ? carregar(spriteDe("fogos")) : Promise.resolve(null),
    ...itens.map((id) => carregar(spriteDe(id))),
  ]);
  const spriteDoItem = new Map(itens.map((id, i) => [id, sprites[i]]));

  const canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = altura;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

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
    for (let x = 0; x < LARGURA; x += 60) ctx.fillRect(x, 0, 3, altura);
    for (let y = 0; y < altura; y += 60) ctx.fillRect(0, y, LARGURA, 3);
    ctx.restore();
    if (!feed) for (const [x, y, s, c] of DECOR) {
      ctx.fillStyle = cor(c);
      ctx.fillRect(x, y, s, s);
    }
  }

  // Medidas
  const rows = fileiras(itens);
  const muitas = rows.length >= 3;
  const gap = feed ? 28 : muitas ? 20 : 44;
  const escala = feed ? (muitas ? 3 : 4) : muitas ? 4 : 5;
  const fonteNome = feed ? (muitas ? 26 : 28) : muitas ? 28 : 30;
  const [padTopo, padLado, padBase] = muitas ? [20, 14, 18] : [28, 16, 24];
  const rowGap = muitas ? 16 : 20;

  const logoW = feed ? 261 : 348;
  const logoH = feed ? 36 : 48;
  const logoGap = feed ? 14 : 20;
  const spriteLado = feed ? 96 : 192;
  const fonteTitulo = feed ? 64 : 92;
  ctx.font = fonte(700, fonteTitulo, fontes.pixel);
  const linhasTitulo = quebrarEquilibrado(ctx, "Minha mochila pro rolê", Math.min(feed ? 800 : 700, largura - spriteLado - 24));
  const alturaTitulo = linhasTitulo.length * fonteTitulo * 1.02;
  const alturaCabeca = Math.max(spriteLado, logoH + logoGap + alturaTitulo);

  const fontePilula = feed ? 40 : 48;
  const [pilulaPadY, pilulaPadX] = feed ? [12, 28] : [16, 36];
  const pilulaInterna = largura - 12;
  const alturaPilula = fontePilula * 1.1 + pilulaPadY * 2 + 12;

  // Frase do rótulo, logo abaixo da pílula e menor que ela.
  const fonteFrase = feed ? 32 : 38;
  const gapFrase = feed ? 16 : 20;
  ctx.font = fonte(600, fonteFrase, fontes.texto);
  const linhasFrase = quebrarEquilibrado(ctx, rotulo.frase, largura - 40);
  const alturaFrase = gapFrase + linhasFrase.length * fonteFrase * 1.3;

  const interna = largura - 20 - 60;
  ctx.font = fonte(600, fonteNome, fontes.texto);
  const medidas = rows.map((row) => {
    const soma = row.reduce((s, b) => s + b.espacos, 0);
    const livre = interna - (row.length - 1) * rowGap;
    const tiles = row.map((b) => {
      const w = (livre * b.espacos) / soma;
      const linhas = quebrar(ctx, ITENS[b.id].curto, w - 8 - padLado * 2);
      const h = 8 + padTopo + padBase + 32 * escala + 12 + linhas.length * fonteNome * 1.2;
      return { b, w, linhas, h };
    });
    return { tiles, h: Math.max(...tiles.map((t) => t.h)) };
  });
  const alturaMochila = 20 + 60 + medidas.reduce((s, r) => s + r.h, 0) + (medidas.length - 1) * rowGap;

  const fonteDestino = feed ? 40 : 46;
  const fonteEndereco = feed ? 38 : 44;
  const destino = `Destino: ${CENARIOS.find((c) => c.id === cenario)?.nome ?? ""}`;
  ctx.font = fonte(600, fonteDestino, fontes.texto);
  const linhasDestino = quebrar(ctx, destino, largura);
  const alturaRodape = linhasDestino.length * fonteDestino * 1.2 + 12 + fonteEndereco * 1.2;

  const total = alturaCabeca + alturaPilula + alturaFrase + alturaMochila + alturaRodape + gap * 3;
  let y = inset + (altura - inset * 2 - total) / 2;
  const x0 = MARGEM_LADO;

  // Cabeçalho: logo + título à esquerda, mochila fechada à direita
  const blocoTexto = logoH + logoGap + alturaTitulo;
  let ty = y + (alturaCabeca - blocoTexto) / 2;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(logo, x0, ty, logoW, logoH);
  ctx.imageSmoothingEnabled = false;
  ty += logoH + logoGap;
  ctx.font = fonte(700, fonteTitulo, fontes.pixel);
  ctx.fillStyle = cor("brand-primary-950");
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  linhasTitulo.forEach((l, i) => ctx.fillText(l, x0, ty + fonteTitulo * 1.02 * (i + 0.5)));
  ctx.drawImage(mochila, x0 + largura - spriteLado, y + (alturaCabeca - spriteLado) / 2, spriteLado, spriteLado);
  y += alturaCabeca + gap;

  // Pílula com o rótulo
  const pilulaW = pilulaInterna + 12;
  ctx.fillStyle = cor("brand-primary-700");
  pxRect(ctx, x0, y, pilulaW, alturaPilula, 12);
  ctx.fill();
  ctx.fillStyle = cor("brand-primary-900");
  pxRect(ctx, x0 + 6, y + 6, pilulaInterna, alturaPilula - 12, 6);
  ctx.fill();
  let fp = fontePilula;
  ctx.font = fonte(600, fp, fontes.pixel);
  while (ctx.measureText(rotulo.nome).width > pilulaInterna - pilulaPadX * 2 && fp > 24) {
    fp -= 1;
    ctx.font = fonte(600, fp, fontes.pixel);
  }
  ctx.fillStyle = cor("brand-secondary-300");
  ctx.textAlign = "center";
  ctx.fillText(rotulo.nome, x0 + 6 + pilulaInterna / 2, y + alturaPilula / 2);
  y += alturaPilula + gapFrase;
  ctx.font = fonte(600, fonteFrase, fontes.texto);
  ctx.fillStyle = cor("brand-secondary-950");
  linhasFrase.forEach((l, i) => ctx.fillText(l, LARGURA / 2, y + fonteFrase * 1.3 * (i + 0.5)));
  y += alturaFrase - gapFrase + gap;

  // Mochila
  ctx.fillStyle = cor("brand-primary-900");
  pxRect(ctx, x0, y, largura, alturaMochila, 24);
  ctx.fill();
  ctx.fillStyle = cor("brand-primary-700");
  pxRect(ctx, x0 + 10, y + 10, largura - 20, alturaMochila - 20, 14);
  ctx.fill();
  let ry = y + 40;
  ctx.font = fonte(600, fonteNome, fontes.texto);
  for (const row of medidas) {
    let rx = x0 + 40;
    for (const t of row.tiles) {
      ctx.fillStyle = cor("neutral-950");
      ctx.fillRect(rx, ry, t.w, row.h);
      ctx.fillStyle = cor("neutral-100");
      ctx.fillRect(rx + 4, ry + 4, t.w - 8, row.h - 8);
      const conteudo = 32 * escala + 12 + t.linhas.length * fonteNome * 1.2;
      let cy = ry + (row.h - conteudo) / 2;
      const iw = 32 * escala * t.b.espacos;
      const img = spriteDoItem.get(t.b.id);
      if (img) ctx.drawImage(img, rx + (t.w - iw) / 2, cy, iw, 32 * escala);
      cy += 32 * escala + 12;
      ctx.fillStyle = cor("neutral-950");
      t.linhas.forEach((l, i) => ctx.fillText(l, rx + t.w / 2, cy + fonteNome * 1.2 * (i + 0.5)));
      rx += t.w + rowGap;
    }
    ry += row.h + rowGap;
  }
  y += alturaMochila + gap;

  // Rodapé
  ctx.textAlign = "left";
  ctx.font = fonte(600, fonteDestino, fontes.texto);
  ctx.fillStyle = cor("neutral-950");
  linhasDestino.forEach((l, i) => ctx.fillText(l, x0, y + fonteDestino * 1.2 * (i + 0.5)));
  y += linhasDestino.length * fonteDestino * 1.2 + 12;
  ctx.font = fonte(600, fonteEndereco, fontes.texto);
  ctx.fillStyle = cor("status-success-950");
  ctx.fillText(`Monte a sua: ${ENDERECO_CURTO}`, x0, y + fonteEndereco * 0.6);

  return canvas;
}

// Checklist como imagem: o mesmo bloco "Pra levar no bolso do rolê" da tela de resultado.
export async function desenharChecklist(linhas: string[], fontes: Fontes): Promise<HTMLCanvasElement> {
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

export function paraBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error("sem imagem"))), "image/png"));
}
