import type { MetadataRoute } from "next";

// As telas de entrada, a política e as respostas dos cards (/conversa/[slug], conteúdo fixo do banco)
// ficam no índice. "/conversa" sozinho é o resultado do campo livre, gerado por IA por sessão: fica de
// fora. "$" marca fim de URL pro Google, senão o prefixo bloquearia os slugs também.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/inicio", "/conversa$", "/ui", "/api/"],
    },
    sitemap: "https://www.somosmargem.com.br/sitemap.xml",
  };
}
