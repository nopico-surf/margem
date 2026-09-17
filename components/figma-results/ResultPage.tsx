"use client";

import { PointerEvent, ReactNode, useRef, useState, useEffect } from "react";
import type { ProfissionalCadastrado } from "@/lib/supabase";
import { Footer } from "@/components/Footer";
import { SideMenu } from "@/components/SideMenu";
import { track } from "@/lib/mixpanel";

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

type ActionKind = keyof typeof assets;

export type CardAction = { label: string; icon?: ActionKind; href?: string };
export type CardResource = { id: string; title: string; description: string; actions: CardAction[] };

type OrientationResult = {
  acolhimento: string;
  orientacao: string;
  pilula_espiritual: string | null;
  checklist_agora: string[];
  checklist_proximo: string[];
  perguntas_aprofundamento: Array<{ pergunta: string; opcoes: string[] }>;
  profissionais?: ProfissionalCadastrado[];
  servicos_publicos?: CardResource[];
  instituicoes?: CardResource[];
};

// ícone da ação -> kind salvo no banco (inverso de ICONE_POR_KIND em app/api/orientacao/route.ts)
const KIND_POR_ICONE: Partial<Record<ActionKind, string>> = { place: "nearby", link: "site" };

type TipoRecurso = "servico_publico" | "instituicao";

function ActionButton({ label, icon, href, onClick }: CardAction & { onClick?: () => void }) {
  const content = <>{icon && <img src={assets[icon]} alt="" />}{label}</>;
  if (href) return <a className="figma-result-action" href={href} target="_blank" rel="noreferrer" onClick={onClick}>{content}</a>;
  return <button className="figma-result-action" type="button" onClick={onClick}>{content}</button>;
}

function ResourceActions({ resource, tipoRecurso }: { resource: CardResource; tipoRecurso: TipoRecurso }) {
  return <ActionRow>{resource.actions.map((action, index) => <ActionButton key={`${resource.id}-${index}`} {...action} onClick={() => track("contato_clicado", { tipo_recurso: tipoRecurso, recurso_nome: resource.title, acao_tipo: action.icon ? KIND_POR_ICONE[action.icon] ?? action.icon : null, acao_label: action.label, posicao: index + 1 })} />)}<ActionButton label="Saiba mais" onClick={() => track("saiba_mais_clicado", { tipo_recurso: tipoRecurso, recurso_nome: resource.title })} /></ActionRow>;
}

function ActionRow({ children }: { children: ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    if ((event.target as Element).closest("a, button")) return;
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
    track("atalho_secao_clicado", { secao: label });
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
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="figma-result-header">
        <a href="/app" aria-label="Ir para o início" onClick={() => track("logo_clicado", { rota: "/conversa" })}>
          <img className="figma-result-logo" src={assets.logo} alt="Margem" />
        </a>
        <button
          className="figma-result-menu"
          type="button"
          aria-label="Abrir menu"
          onClick={() => {
            setMenuOpen(true);
            track("menu_clicado", { rota: "/conversa" });
          }}
        >
          <img src={assets.menu} alt="" />
        </button>
      </header>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MoreOptions() {
  const options = [["Profissionais que podem ajudar", "figma-section-professionals"], ["Serviços públicos", "figma-section-public-services"], ["Espaços de apoio e escuta", "figma-section-support-spaces"], ["Passos reais, para fazer agora", "figma-section-real-steps"], ["Para planejar", "figma-section-planning"]];
  return <section className="figma-result-more"><h2>Além disso, você pode ver</h2><div>{options.map(([label, targetId]) => <SectionJump key={label} label={label} targetId={targetId} />)}</div></section>;
}

const especialidadeLabel: Record<ProfissionalCadastrado["especialidade"], string> = {
  psicologo: "Psicologia",
  psiquiatra: "Psiquiatria",
  assistente_social: "Assistência Social",
};

function ProfessionalCard({ profissional }: { profissional: ProfissionalCadastrado }) {
  const buttonLabel = profissional.id === "00000000-0000-0000-0000-000000000005" ? "Profissional teste" : "Agendar por WhatsApp";
  return <article className="figma-professional-card"><div className="figma-professional-head"><img className="figma-professional-avatar" src={profissional.foto_url || assets.avatar} alt="" /><div className="figma-professional-copy"><div className="figma-professional-identity"><strong>{profissional.nome}</strong><span>{especialidadeLabel[profissional.especialidade]}</span></div><small>{profissional.crp && <>CRP: {profissional.crp}<br /></>}{profissional.anos_experiencia != null && `${profissional.anos_experiencia} anos de experiência`}</small></div><img className="figma-info-icon" src={assets.info} alt="" /></div>{profissional.tags.length > 0 && <div className="figma-badges">{profissional.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}{profissional.bio && <p>{profissional.bio}</p>}<button className="figma-schedule-button" type="button" onClick={() => track("agendar_whatsapp_clicado", { profissional_id: profissional.id, especialidade: profissional.especialidade })}><img src={assets.whatsappSchedule} alt="" />{buttonLabel}</button></article>;
}

function Professionals({ profissionais }: { profissionais: ProfissionalCadastrado[] }) {
  if (profissionais.length === 0) return null;
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<"psicologo" | "psiquiatra">("psicologo");
  const profissionaisFiltrados = profissionais.filter((profissional) => profissional.especialidade === especialidadeSelecionada);
  const profissionalFake = profissionais.find((profissional) => profissional.id === "00000000-0000-0000-0000-000000000005");
  const profissionaisParaExibir = profissionaisFiltrados.length > 0 ? profissionaisFiltrados : profissionalFake && especialidadeSelecionada === "psiquiatra" ? [{ ...profissionalFake, especialidade: "psiquiatra" as const }] : [];
  return <section id="figma-section-professionals" className="figma-result-band"><div className="figma-section-inner"><SectionHeading title="Profissionais que podem ajudar" description="É recomendado falar com psiquiatra e psicólogo. Você pode fazer isso pelo SUS, sem custo. Para atendimento online, você pode falar com um de nossos parceiros." /><div className="figma-filter-row"><button className={especialidadeSelecionada === "psicologo" ? "is-selected" : ""} type="button" onClick={() => { setEspecialidadeSelecionada("psicologo"); track("filtro_profissional_clicado", { filtro: "psicologos" }); }}>Psicologos</button><button className={especialidadeSelecionada === "psiquiatra" ? "is-selected" : ""} type="button" onClick={() => { setEspecialidadeSelecionada("psiquiatra"); track("filtro_profissional_clicado", { filtro: "psiquiatras" }); }}>Psiquiatras</button></div>{profissionaisParaExibir.map((profissional) => <ProfessionalCard profissional={profissional} key={profissional.id} />)}<button className="figma-public-link" type="button" onClick={() => track("ver_servicos_publicos_clicado")}>Se preferir, veja os serviços públicos <img src={assets.arrow} alt="" /></button></div></section>;
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return <header className="figma-section-heading"><h2>{title}</h2><p>{description}</p></header>;
}

function FigmaCheckbox({ selected, onChange }: { selected: boolean; onChange?: (checked: boolean) => void }) {
  return <><input className="figma-checklist-input" type="checkbox" defaultChecked={selected} onChange={(event) => onChange?.(event.target.checked)} /><span className="figma-checkbox-control" aria-hidden="true"><span className="figma-checkbox-box" /><img className="figma-checkbox-selected" src={assets.checkboxSelected} alt="" /></span></>;
}

function PublicServices({ services }: { services: CardResource[] }) {
  if (services.length === 0) return null;
  return <section id="figma-section-public-services" className="figma-result-band"><div className="figma-section-inner"><SectionHeading title="Serviços públicos" description="Acolhimento, saúde e assistência pública para cuidar e apoiar pessoas em uso de substâncias e familiares" /><div className="figma-resource-list">{services.map((service) => <article className="figma-resource-card" key={service.id}><div className="figma-resource-heading"><div><h3>{service.title}</h3><p>{service.description}</p></div><img src={assets.info} alt="" /></div><ResourceActions resource={service} tipoRecurso="servico_publico" /></article>)}</div></div></section>;
}

function SupportSpaces({ spaces }: { spaces: CardResource[] }) {
  if (spaces.length === 0) return null;
  return <section id="figma-section-support-spaces" className="figma-result-band"><div className="figma-section-inner"><SectionHeading title="Espaços de apoio e escuta" description="Redes e instituições que oferecem acolhimento e trocas de experiências para pessoas em uso de substâncias e seus familiares" /><div className="figma-resource-list">{spaces.map((space) => <article className="figma-resource-card" key={space.id}><div className="figma-resource-heading"><div><h3>{space.title}</h3><p>{space.description}</p></div><img src={assets.info} alt="" /></div><ResourceActions resource={space} tipoRecurso="instituicao" /></article>)}</div></div></section>;
}

function ChecklistSection({ title, description, items, selectedIndex }: { title: string; description: string; items: string[]; selectedIndex?: number }) {
  const sectionId = title === "Passos reais, para fazer agora" ? "figma-section-real-steps" : "figma-section-planning";
  return <section id={sectionId} className="figma-result-band figma-checklist-band"><div className="figma-section-inner"><SectionHeading title={title} description={description} /><div className="figma-checklist">{items.map((item, index) => <label key={`${title}-${index}`}><FigmaCheckbox selected={selectedIndex === index} onChange={(marcado) => track("checklist_item_alterado", { secao: sectionId === "figma-section-real-steps" ? "agora" : "planejar", indice: index, marcado })} /><span className="figma-checklist-copy">{item}</span></label>)}</div></div></section>;
}

function TypewriterResponse({ orientation }: { orientation: OrientationResult }) {
  const paragraphs = [
    orientation.acolhimento,
    orientation.orientacao,
    orientation.pilula_espiritual
  ].filter(Boolean) as string[];

  const fullText = paragraphs.join("\n\n");
  const [renderedLength, setRenderedLength] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRenderedLength(fullText.length);
      return;
    }

    setRenderedLength(0);

    const startedAt = performance.now();
    const charactersPerSecond = 140;
    const paragraphGapMs = 100;
    let frameId = 0;

    function animate(now: number) {
      const elapsed = now - startedAt;
      let nextLength = 0;
      let timelinePosition = 0;

      for (let index = 0; index < paragraphs.length; index += 1) {
        const paragraph = paragraphs[index];
        const paragraphDuration = (paragraph.length / charactersPerSecond) * 1000;
        const paragraphElapsed = elapsed - timelinePosition;
        const revealedInParagraph = Math.min(Math.max(Math.floor((paragraphElapsed / 1000) * charactersPerSecond), 0), paragraph.length);

        nextLength += revealedInParagraph;
        if (revealedInParagraph < paragraph.length || index === paragraphs.length - 1) break;

        const nextParagraphStart = timelinePosition + paragraphDuration + paragraphGapMs;
        if (elapsed < nextParagraphStart) break;

        nextLength += 2;
        timelinePosition = nextParagraphStart;
      }

      setRenderedLength((previousLength) => Math.max(previousLength, nextLength));
      if (nextLength < fullText.length) frameId = window.requestAnimationFrame(animate);
    }

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [fullText]);

  const displayedText = fullText.slice(0, renderedLength);
  const displayedParagraphs = displayedText.split("\n\n");

  return (
    <div className="figma-response-copy">
      {displayedParagraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function ResultPage({ message, orientation, isLoading, error }: { message: string; orientation: OrientationResult | null; isLoading: boolean; error: string | null }) {
  const realSteps = orientation?.checklist_agora ?? [];
  const planningSteps = orientation?.checklist_proximo ?? [];
  const profissionais = orientation?.profissionais ?? [];
  const servicosPublicos = orientation?.servicos_publicos ?? [];
  const instituicoes = orientation?.instituicoes ?? [];

  return (
    <main className="figma-result-page">
      <Header />
      <div className="figma-result-main">
        <section className="figma-result-messages">
          <div className="figma-user-message">{message}</div>
          {isLoading ? (
            <div className="figma-response-loading" aria-live="polite">
              Preparando uma orientação para você...
            </div>
          ) : error ? (
            <div className="figma-response-error" role="alert">
              {error}
            </div>
          ) : orientation ? (
            <TypewriterResponse orientation={orientation} />
          ) : null}
        </section>
        {!isLoading && orientation && <MoreOptions />}
      </div>
      {!isLoading && orientation && (
        <div className="figma-result-sections">
          <Professionals profissionais={profissionais} />
          <PublicServices services={servicosPublicos} />
          <SupportSpaces spaces={instituicoes} />
          <ChecklistSection
            title="Passos reais, para fazer agora"
            description="Escolha um ou dois passos para fazer hoje ou amanhã"
            items={realSteps}
          />
          <ChecklistSection
            title="Para planejar"
            description="Escolha o que faz sentido para você nas próximas semanas"
            items={planningSteps}
          />
        </div>
      )}
      <Footer />
    </main>
  );
}
