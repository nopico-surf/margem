import type { MetadataRoute } from "next";
import { CARDS_HOME } from "@/lib/cards-home";
import { GUIAS } from "@/lib/guias";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { slugsDosProfissionais } from "@/lib/slug-profissional";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profissionais = slugsDosProfissionais(await buscarTodosProfissionaisAtivos());

  return [
    { url: "https://www.somosmargem.com.br/inicio" },
    { url: "https://www.somosmargem.com.br/privacidade" },
    { url: "https://www.somosmargem.com.br/profissionais" },
    { url: "https://www.somosmargem.com.br/redes-de-apoio" },
    { url: "https://www.somosmargem.com.br/blog" },
    ...GUIAS.map((guia) => ({ url: `https://www.somosmargem.com.br/blog/${guia.slug}` })),
    ...profissionais.map(({ slug }) => ({ url: `https://www.somosmargem.com.br/profissionais/${slug}` })),
    ...CARDS_HOME.map((card) => ({ url: `https://www.somosmargem.com.br/conversa/${card.slug}` })),
  ];
}
