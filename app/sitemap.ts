import type { MetadataRoute } from "next";
import { CARDS_HOME } from "@/lib/cards-home";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.somosmargem.com.br/bem-vindo" },
    { url: "https://www.somosmargem.com.br/privacidade" },
    { url: "https://www.somosmargem.com.br/profissionais" },
    ...CARDS_HOME.map((card) => ({ url: `https://www.somosmargem.com.br/conversa/${card.slug}` })),
  ];
}
