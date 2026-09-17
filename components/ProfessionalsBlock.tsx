"use client";

import { ProfessionalCard } from "./ProfessionalCard";

const servicesArrow = "/icons/seta.svg";

export function ProfessionalsBlock() {
  return <section className="professionals-block" aria-labelledby="professionals-title"><header><h2 id="professionals-title">Profissionais que podem ajudar</h2><p>É recomendado falar com psiquiatra e psicólogo. Você pode fazer isso pelo SUS, sem custo. Para atendimento online, você pode falar com um de nossos parceiros.</p></header><div className="professionals-filters"><button type="button">Psicologos</button><button type="button">Psiquiatras</button></div><ProfessionalCard /><button className="topics-button" type="button"><span>Se preferir, veja os serviços públicos</span><img src={servicesArrow} alt="" /></button></section>;
}
