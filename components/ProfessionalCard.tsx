"use client";

import { SystemBadge } from "./SystemBadge";
import { SystemButton } from "./SystemButton";
const professionalPhoto = "/assets/professional-avatar.png";
const whatsappIcon = "/icons/whatsapp-card-profissional.svg";
const infoIcon = "/icons/info-card-profissional.svg";

type ProfessionalCardProps = {
  state?: "complete" | "loading";
};

export function ProfessionalCard({ state = "complete" }: ProfessionalCardProps) {
  if (state === "loading") {
    return <article className="professional-card professional-card-loading" aria-label="Carregando profissional"><div className="professional-skeleton photo" /><div className="professional-skeleton title" /><div className="professional-skeleton line" /><div className="professional-skeleton line short" /><div className="professional-skeleton tags" /><div className="professional-skeleton description" /><div className="professional-skeleton button" /></article>;
  }

  return <article className="professional-card"><div className="professional-card-top"><img className="professional-photo" src={professionalPhoto} alt="Amanda Fernande de Bezerra" /><div className="professional-meta"><div className="professional-identity"><strong>Amanda Fernande de Bezerra</strong><span>Psicologia</span></div><div className="professional-registration"><small>CRP: 00/00000</small><small>11 anos de experiência</small></div></div><div className="professional-info"><img src={infoIcon} alt="Informações do profissional" /></div></div><div className="professional-tags"><SystemBadge text="Recaídas" /><SystemBadge text="Redução de danos" /><SystemBadge text="Abstinência" /></div><p className="professional-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p><SystemButton label="Agendar por WhatsApp" iconLeft={<img className="button-whatsapp-icon" src={whatsappIcon} alt="" />} /></article>;
}
