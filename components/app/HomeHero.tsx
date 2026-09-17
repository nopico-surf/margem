"use client";

import { FormEvent } from "react";
import { MessageInput } from "./MessageInput";
import { IdentityBadge } from "./IdentityBadge";
import { BotaoTopicos } from "@/components/ui/BotaoTopicos";

// As classes .hero-focus-track e .hero-message-group são medidas pelo MessageInput quando o
// teclado virtual abre. Renomear qualquer uma delas quebra o posicionamento no celular.
type HomeHeroProps = {
  text: string;
  onChangeText: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onShowTopics: () => void;
};

export function HomeHero({ text, onChangeText, onSubmit, onShowTopics }: HomeHeroProps) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-focus-track">
        <div className="hero-input-group">
          <IdentityBadge />
          <h1 id="home-title">Este é um espaço<br /> seguro e acolhedor</h1>
        </div>
        <div className="hero-message-group">
          <MessageInput value={text} onChange={onChangeText} onSubmit={onSubmit} />
        </div>
      </div>
      <BotaoTopicos onClick={onShowTopics} />
    </section>
  );
}
