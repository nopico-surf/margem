import { TRIBOS } from "./conteudo";

// Som da Mochila do Rolê: o bip 8 bits de cada toque e a música de fundo da tribo. Um AudioContext só,
// criado no primeiro toque (o navegador não deixa tocar nada antes disso). A música passa por ele pra
// o volume funcionar também no iPhone, que ignora o `volume` do elemento de áudio.

let contexto: AudioContext | null = null;
let ganhoMusica: GainNode | null = null;
let musica: HTMLAudioElement | null = null;
let faixaAtual: string | null = null;
let triboAtual: string | null = null;

const VOLUME_MUSICA = 0.35;
// Com música tocando o bip sobe, senão some por baixo dela.
const VOLUME_BIP = 0.06;
const VOLUME_BIP_COM_MUSICA = 0.14;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!contexto) contexto = new AudioContext();
    if (contexto.state === "suspended") void contexto.resume();
    return contexto;
  } catch {
    return null;
  }
}

function tocandoMusica() {
  return musica !== null && !musica.paused;
}

export function bip(freq: number) {
  const ac = ctx();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const ganho = ac.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    ganho.gain.setValueAtTime(tocandoMusica() ? VOLUME_BIP_COM_MUSICA : VOLUME_BIP, ac.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.12);
    osc.connect(ganho).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.13);
  } catch {}
}

// "Do fluxo" é de tudo um pouco: sorteia uma das outras faixas cada vez que é escolhida.
function faixaDa(triboId: string) {
  if (triboId !== "fluxo") return triboId;
  const outras = TRIBOS.filter((t) => t.id !== "fluxo");
  return outras[Math.floor(Math.random() * outras.length)].id;
}

// Chamar de dentro do toque: fora dele o iPhone recusa o play.
export function tocarMusica(triboId: string) {
  const ac = ctx();
  if (!ac) return;
  // Mesma tribo retoma a faixa onde parou, então "Do fluxo" só sorteia quando vem de outra tribo.
  const faixa = triboId === triboAtual && faixaAtual ? faixaAtual : faixaDa(triboId);
  triboAtual = triboId;
  try {
    if (!musica) {
      musica = new Audio();
      musica.loop = true;
      musica.preload = "auto";
      ganhoMusica = ac.createGain();
      ganhoMusica.gain.value = VOLUME_MUSICA;
      ac.createMediaElementSource(musica).connect(ganhoMusica).connect(ac.destination);
    }
    if (faixa !== faixaAtual) {
      faixaAtual = faixa;
      musica.src = `/mochila/musica/${faixa}.mp3`;
    }
    void musica.play().catch(() => {});
  } catch {}
}

export function pararMusica() {
  musica?.pause();
}