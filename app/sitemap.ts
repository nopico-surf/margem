import type { MetadataRoute } from "next";
import { CARDS_HOME } from "@/lib/cards-home";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { slugsDosProfissionais } from "@/lib/slug-profissional";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profissionais = slugsDosProfissionais(await buscarTodosProfissionaisAtivos());

  return [
    { url: "https://www.somosmargem.com.br/bem-vindo" },
    { url: "https://www.somosmargem.com.br/privacidade" },
    { url: "https://www.somosmargem.com.br/profissionais" },
    ...profissionais.map(({ slug }) => ({ url: `https://www.somosmargem.com.br/profissionais/${slug}` })),
    ...CARDS_HOME.map((card) => ({ url: `https://www.somosmargem.com.br/conversa/${card.slug}` })),
  ];
}
