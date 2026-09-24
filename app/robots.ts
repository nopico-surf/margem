import type { MetadataRoute } from "next";

// Só as telas de entrada e a política ficam no índice. O resto depende de consentimento ou é interno.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/inicio", "/conversa", "/protecao-de-dados", "/ui", "/api/"],
    },
    sitemap: "https://www.somosmargem.com.br/sitemap.xml",
  };
}
