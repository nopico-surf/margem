"use client";

import { useEffect, useRef, useState } from "react";
import { GlifoPause, GlifoPlayArrow } from "@/components/icons/glifos";

// Player de áudio simples. Não existe no Figma: criado para a narração dos módulos do programa para
// familiares. Lembra onde a pessoa parou (localStorage, por `chave`), e funciona sem ele.
type AudioPlayerProps = {
  src: string;
  rotulo: string;
  chave: string;
};

function formatar(segundos: number) {
  if (!Number.isFinite(segundos) || segundos < 0) return "0:00";
  const minutos = Math.floor(segundos / 60);
  return `${minutos}:${String(Math.floor(segundos % 60)).padStart(2, "0")}`;
}

export function AudioPlayer({ src, rotulo, chave }: AudioPlayerProps) {
  const audio = useRef<HTMLAudioElement>(null);
  const [tocando, setTocando] = useState(false);
  const [posicao, setPosicao] = useState(0);
  const [duracao, setDuracao] = useState(0);

  useEffect(() => {
    const elemento = audio.current;
    if (!elemento) return;
    let salvo = 0;
    try {
      salvo = Number(window.localStorage.getItem(chave) ?? "0") || 0;
    } catch {}
    const aoCarregar = () => {
      setDuracao(elemento.duration);
      if (salvo > 0 && salvo < elemento.duration - 1) elemento.currentTime = salvo;
    };
    elemento.addEventListener("loadedmetadata", aoCarregar);
    return () => elemento.removeEventListener("loadedmetadata", aoCarregar);
  }, [chave]);

  function aoAvancar() {
    const elemento = audio.current;
    if (!elemento) return;
    setPosicao(elemento.currentTime);
    try {
      window.localStorage.setItem(chave, String(Math.floor(elemento.currentTime)));
    } catch {}
  }

  function alternar() {
    const elemento = audio.current;
    if (!elemento) return;
    if (elemento.paused) void elemento.play();
    else elemento.pause();
  }

  return (
    <div className="audio-player">
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
        onEnded={() => setTocando(false)}
        onTimeUpdate={aoAvancar}
      />
      <button className="audio-player-botao" type="button" onClick={alternar} aria-label={tocando ? "Pausar áudio" : "Ouvir áudio"}>
        {tocando ? <GlifoPause /> : <GlifoPlayArrow />}
      </button>
      <div className="audio-player-corpo">
        <span className="label-small-medium">{rotulo}</span>
        <input
          className="audio-player-trilho"
          type="range"
          min={0}
          max={duracao || 0}
          step={1}
          value={posicao}
          aria-label="Posição do áudio"
          onChange={(evento) => {
            if (audio.current) audio.current.currentTime = Number(evento.target.value);
          }}
        />
        <span className="label-xx-small audio-player-tempo">
          {formatar(posicao)} / {formatar(duracao)}
        </span>
      </div>
    </div>
  );
}
