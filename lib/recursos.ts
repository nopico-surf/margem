import type { IconeAcao } from "@/components/icons";
import type { AcaoContato } from "@/lib/supabase";

export const CATEGORIA_PADRAO = "geral";

// kind salvo no banco -> chave de ícone que ResultPage.tsx já usa (assets em figma-results/ResultPage.tsx)
const ICONE_POR_KIND: Record<string, IconeAcao | undefined> = {
  phone: "phone",
  chat: "chat",
  email: "email",
  nearby: "place",
  site: "link",
  whatsapp: "whatsapp",
  telegram: "telegram",
  libras: "libras",
};

function paraHref(acao: AcaoContato) {
  if (!acao.value) return undefined;
  if (acao.kind === "phone") return `tel:${acao.value.replace(/\D/g, "")}`;
  if (acao.kind === "whatsapp") return `https://wa.me/${acao.value.replace(/\D/g, "")}`;
  if (acao.kind === "email" && !/^https?:\/\//.test(acao.value)) return `mailto:${acao.value}`;
  return acao.value;
}

export function paraCardResource(id: string, nome: string, descricao: string | null, acoes: AcaoContato[]) {
  return {
    id,
    title: nome,
    description: descricao ?? "",
    actions: acoes.map((acao) => ({ label: acao.label, icon: ICONE_POR_KIND[acao.kind], href: paraHref(acao) })),
  };
}
