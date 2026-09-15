"use client";

export type PublicServiceAction = {
  label: string;
  kind: "phone" | "whatsapp" | "chat" | "email" | "nearby" | "site" | "telegram" | "libras" | "agenda" | "custom";
};

export type PublicService = {
  id: string;
  title: string;
  description: string;
  actions: PublicServiceAction[];
};

type PublicServicesListProps = {
  services: PublicService[];
};

const actionSymbols: Record<PublicServiceAction["kind"], string> = {
  phone: "☎",
  whatsapp: "◉",
  chat: "▣",
  email: "✉",
  nearby: "⌖",
  site: "↔",
  telegram: "➤",
  libras: "☝",
  agenda: "↗",
  custom: "•",
};

export function PublicServicesList({ services }: PublicServicesListProps) {
  return <section className="public-services" aria-labelledby="public-services-title"><header className="public-services-header"><h2 id="public-services-title">Serviços públicos</h2><p>Acolhimento, saúde e assistência pública para cuidar e apoiar pessoas em uso de substâncias e familiares</p></header><div className="public-services-list">{services.map((service) => <article className="public-service-card" key={service.id}><div className="public-service-heading"><div><h3>{service.title}</h3><p>{service.description}</p></div><button type="button" aria-label={`Sobre ${service.title}`}>i</button></div><div className="public-service-actions">{service.actions.map((action) => <button type="button" key={`${service.id}-${action.kind}-${action.label}`}><span aria-hidden="true">{actionSymbols[action.kind]}</span>{action.label}</button>)}</div></article>)}</div></section>;
}
