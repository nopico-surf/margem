"use client";

const realSteps = [
  "Ligar pra CAPS ou UBS mais perto pra saber como funciona",
  "Fazer a primeira observação do seu padrão de uso",
  "Ligar pra CAPS ou UBS mais perto pra saber como funciona",
  "Ligar pro CVV só pra conversar",
  "Baixar um app de meditação/respiração",
];

const planningSteps = [
  'Identificar o "antes e depois": o que você tá sentindo/pensando antes de usar? E depois que passa o efeito, como fica?',
  "Manter contato diário com seu corpo: 5 minutos. Senta, respira fundo 5 vezes e pergunta pra si: como tá o meu corpo agora?",
  "Quando bater a vontade: antes de usar, faz algo diferente por 15 minutos. Pode ser caminhada, tomar água gelada, conversar com alguém de confiança, fazer algo com as mãos, ouvir música ou escrever.",
];

function ChecklistSection({ title, subtitle, items }: { title: string; subtitle: string; items: string[] }) {
  return <section className="action-plans-section"><header><h2>{title}</h2><p>{subtitle}</p></header><div className="action-plan-list">{items.map((item, index) => <label className="action-plan-item" key={`${title}-${index}`}><input type="checkbox" /><span>{item}</span></label>)}</div></section>;
}

export function ActionPlans() {
  return <><ChecklistSection title="Passos reais, para fazer agora" subtitle="Escolha um ou dois passos para fazer hoje ou amanhã" items={realSteps} /><ChecklistSection title="Para planejar" subtitle="Escolha o que faz sentido para você nas próximas semanas" items={planningSteps} /></>;
}
