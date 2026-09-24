import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.somosmargem.com.br/bem-vindo" },
    { url: "https://www.somosmargem.com.br/privacidade" },
  ];
}
