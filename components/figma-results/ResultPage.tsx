"use client";

import { PointerEvent, ReactNode, useRef } from "react";

const assets = {
  logo: "https://www.figma.com/api/mcp/asset/789e43e1-39be-4b2b-9e0e-30064f2b0bc1.svg",
  menu: "https://www.figma.com/api/mcp/asset/8ad57a97-c590-4f92-aaa9-ea8a555ac520.svg",
  arrow: "https://www.figma.com/api/mcp/asset/c599dd4c-61c3-42b3-865b-c827f1bdce06.svg",
  info: "https://www.figma.com/api/mcp/asset/e159a9c0-daaa-4a74-a378-8cad748d03cf.svg",
  phone: "https://www.figma.com/api/mcp/asset/dca240a9-7b65-4a90-8d8c-817f709ccd33.svg",
  chat: "https://www.figma.com/api/mcp/asset/990063e9-02bc-497a-aace-465e3993b1ef.svg",
  whatsapp: "https://www.figma.com/api/mcp/asset/1459e6c0-f362-4458-a22e-c494b157ac42.svg",
  whatsappSchedule: "https://www.figma.com/api/mcp/asset/820451d9-7e93-43b6-aec1-7d33e7e91aef.svg",
  telegram: "https://www.figma.com/api/mcp/asset/fb5cf6d4-79bf-4b5b-b48d-15f9acf37edb.svg",
  libras: "https://www.figma.com/api/mcp/asset/0c2b1cbe-022b-42b0-8699-de703c12b610.svg",
  place: "https://www.figma.com/api/mcp/asset/0249441f-bd37-44d3-963e-4f7aefb81271.svg",
  email: "https://www.figma.com/api/mcp/asset/185ced22-e534-4048-9c99-e8a00f602260.svg",
  link: "https://www.figma.com/api/mcp/asset/5b79160c-12f3-4581-be31-71085597989d.svg",
  avatar: "https://www.figma.com/api/mcp/asset/31aa1f5a-a153-4928-a373-3463faab43d6.png",
  checkbox: "https://www.figma.com/api/mcp/asset/dcf154ca-9f4b-4667-82ac-937f5fe9a117.svg",
  checkboxSelected: "https://www.figma.com/api/mcp/asset/ae8f8ca3-9062-4066-abfb-8dd5bed8e56b.svg",
};

type OrientationResult = {
  acolhimento: string;
  orientacao: string;
  pilula_espiritual: string | null;
  checklist_agora: string[];
  checklist_proximo: string[];
  perguntas_aprofundamento: Array<{ pergunta: string; opcoes: string[] }>;
};

type ActionKind = keyof typeof assets;

function ActionButton({ label, icon }: { label: string; icon?: ActionKind }) {
  return <button className="figma-result-action" type="button">{icon && <img src={assets[icon]} alt="" />}{label}</button>;
}

function ActionRow({ children }: { children: ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const row = rowRef.current;
    if (!row) return;
    dragState.current = { active: true, startX: event.clientX, startScrollLeft: row.scrollLeft };
    row.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const row = rowRef.current;
    if (!row || !dragState.current.active) return;
    row.scrollLeft = dragState.current.startScrollLeft - (event.clientX - dragState.current.startX);
  }

  function stopDragging() {
    dragState.current.active = false;
  }

  return <div ref={rowRef} className="figma-action-row" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDragging} onPointerCancel={stopDragging}>{children}</div>;
}

function SectionJump({ label, targetId }: { label: string; targetId: string }) {
  function scrollToSection() {
    const target = document.getElementById(targetId);
    if (!target) return;
    const start = window.scrollY;
    const destination = target.getBoundingClientRect().top + start - 16;
    const distance = destination - start;
    const duration = 720;
    const startedAt = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      window.scrollTo(0, destination);
      return;
    }

    function animate(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2;
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
  }

  return <button className="figma-result-jump" type="button" onClick={scrollToSection}>{label}<img src={assets.arrow} alt="" /></button>;
}

function Header() {
  return <header className="figma-result-header"><img className="figma-result-logo" src={assets.logo} alt="Margem" /><button className="figma-result-menu" type="button" aria-label="Abrir menu"><img src={assets.menu} alt="" /></button></header>;
}

function MoreOptions() {
  const options = [["Profissionais que podem ajudar", "figma-section-professionals"], ["Serviços publicos", "figma-section-public-services"], ["Espaços de apoio e escuta", "figma-section-support-spaces"], ["Passos reais, para fazer agora", "figma-section-real-steps"], ["Para planejar", "figma-section-planning"]];
  return <section className="figma-result-more"><h2>Além disso, você pode ver</h2><div>{options.map(([label, targetId]) => <SectionJump key={label} label={label} targetId={targetId} />)}</div></section>;
}

function ProfessionalCard() {
  return <article className="figma-professional-card"><div className="figma-professional-head"><img className="figma-professional-avatar" src={assets.avatar} alt="" /><div><strong>Amanda Fernande de Bezerra</strong><span>Psicologia</span><small>CRP: 00/00000<br />11 anos de experiência</small></div><img className="figma-info-icon" src={assets.info} alt="" /></div><div className="figma-badges"><span>Recaídas</span><span>Redução de danos</span><span>Abstinência</span></div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><button className="figma-schedule-button" type="button"><img src={assets.whatsappSchedule} alt="" />Agendar por WhatsApp</button></article>;
}

function Professionals() {
  return <section id="figma-section-professionals" className="figma-result-band"><div className="figma-section-inner"><SectionHeading title="Profissionais que podem ajudar" description="É recomendado falar com psiquiatra e psicólogo. Você pode fazer isso pelo SUS, sem custo. Para atendimento online, você pode falar com um de nossos parceiros." /><div className="figma-filter-row"><button className="is-selected" type="button">Psicologos</button><button type="button">Psiquiatras</button></div><ProfessionalCard /><button className="figma-public-link" type="button">Se preferir, veja os serviços públicos <img src={assets.arrow} alt="" /></button></div></section>;
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return <header className="figma-section-heading"><h2>{title}</h2><p>{description}</p></header>;
}

function FigmaCheckbox({ selected }: { selected: boolean }) {
  return <><input className="figma-checklist-input" type="checkbox" defaultChecked={selected} /><span className="figma-checkbox-control" aria-hidden="true"><span className="figma-checkbox-box" /><img className="figma-checkbox-selected" src={assets.checkboxSelected} alt="" /></span></>;
}

const publicServices = [
  ["188 • CVV • Centro de Valorização da Vida", "Serviço de apoio emocional, escuta e prevenção do suicídio. O atendimento pode ser feito por telefone, chat ou e-mail, de forma gratuita e sigilosa", ["phone", "chat", "email", "place", "link"] as ActionKind[]],
  ["CAPS AD • Centro de Atenção Psicossocial (Álcool e Outras Drogas)", "Serviço público do SUS que oferece atendimento especializado com equipe multidisciplinar para acolhimento, cuidado e apoio no uso de substâncias", ["phone", "place"] as ActionKind[]],
  ["Disque 100 • Disque Direitos Humanos", "Canal anônimo de denúncia e proteção aos direitos humanos, acolhendo crianças, idosos, populações vulneráveis e pessoas em situação de violência", ["phone", "whatsapp", "telegram", "libras", "link"] as ActionKind[]],
];

function PublicServices() {
  return <section id="figma-section-public-services" className="figma-result-band"><div className="figma-section-inner"><SectionHeading title="Serviços públicos" description="Acolhimento, saúde e assistência pública para cuidar e apoiar pessoas em uso de substâncias e familiares" /><div className="figma-resource-list">{publicServices.map(([title, description, icons]) => <article className="figma-resource-card" key={title as string}><div className="figma-resource-heading"><div><h3>{title}</h3><p>{description}</p></div><img src={assets.info} alt="" /></div><ActionRow>{(icons as ActionKind[]).map((icon) => <ActionButton key={`${title}-${icon}`} label={icon === "phone" ? "Telefone" : icon === "place" ? "Perto de mim" : icon === "link" ? "Site" : icon === "whatsapp" ? "WhatsApp" : icon === "telegram" ? "Telegram" : icon === "libras" ? "Libras" : icon === "chat" ? "Chat" : "E-mail"} icon={icon} />)}<ActionButton label="Saiba mais" /></ActionRow></article>)}</div></div></section>;
}

function SupportSpaces() {
  const spaces = [["NA • Narcóticos anônimos", "Grupo de apoio mútuo e escuta para pessoas que buscam a abstinência de álcool e outras drogas, com encontros presenciais e online para troca de experiências"], ["AA • Alcoólicos anônimos", "Grupo de apoio e escuta voltada para a recuperação do uso de álcool, oferecendo reuniões presenciais e online para a troca de experiências"]];
  return <section id="figma-section-support-spaces" className="figma-result-band"><div className="figma-section-inner"><SectionHeading title="Espaços de apoio e escuta" description="Redes e instituições que oferecem acolhimento e trocas de experiências para pessoas em uso de substâncias e seus familiares" /><div className="figma-resource-list">{spaces.map(([title, description]) => <article className="figma-resource-card" key={title}><div className="figma-resource-heading"><div><h3>{title}</h3><p>{description}</p></div><img src={assets.info} alt="" /></div><ActionRow><ActionButton label="Telefone" icon="phone" /><ActionButton label="WhatsApp" icon="whatsapp" /><ActionButton label="Grupos online" icon="chat" /><ActionButton label="Grupos presenciais" icon="chat" /><ActionButton label="Site" icon="link" /><ActionButton label="Saiba mais" /></ActionRow></article>)}</div></div></section>;
}

function ChecklistSection({ title, description, items, selectedIndex }: { title: string; description: string; items: string[]; selectedIndex?: number }) {
  const sectionId = title === "Passos reais, para fazer agora" ? "figma-section-real-steps" : "figma-section-planning";
  return <section id={sectionId} className="figma-result-band figma-checklist-band"><div className="figma-section-inner"><SectionHeading title={title} description={description} /><div className="figma-checklist">{items.map((item, index) => <label key={`${title}-${index}`}><FigmaCheckbox selected={selectedIndex === index} /><span className="figma-checklist-copy">{item}</span></label>)}</div></div></section>;
}

export function ResultPage({ message, orientation, isLoading, error }: { message: string; orientation: OrientationResult | null; isLoading: boolean; error: string | null }) {
  const realSteps = orientation?.checklist_agora ?? [];
  const planningSteps = orientation?.checklist_proximo ?? [];
  return <main className="figma-result-page"><Header /><div className="figma-result-main"><section className="figma-result-messages"><div className="figma-user-message">{message}</div>{isLoading ? <div className="figma-response-loading" aria-live="polite">Preparando uma orientação para você...</div> : error ? <div className="figma-response-error" role="alert">{error}</div> : orientation ? <div className="figma-response-copy"><p>{orientation.acolhimento}</p><p>{orientation.orientacao}</p>{orientation.pilula_espiritual && <p>{orientation.pilula_espiritual}</p>}</div> : null}</section>{!isLoading && orientation && <MoreOptions />}</div>{!isLoading && orientation && <div className="figma-result-sections"><Professionals /><PublicServices /><SupportSpaces /><ChecklistSection title="Passos reais, para fazer agora" description="Escolha um ou dois passos para fazer hoje ou amanhã" items={realSteps} /><ChecklistSection title="Para planejar" description="Escolha o que faz sentido para você nas próximas semanas" items={planningSteps} /></div>}</main>;
}