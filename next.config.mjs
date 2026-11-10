// CSP só em modo relatório: GTM, Clarity, Mixpanel e Formbricks usam script inline e domínios
// variados. As violações aparecem no console do navegador; endurecer depois de ver o que aparece.
const cspRelatorio = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.*'],
  cacheComponents: true,
  partialPrefetching: true,
  // Canvas nativo da prévia do link de desafio da Mochila (lib/mochila/card-servidor.ts): o
  // binário .node não entra no bundle, fica em node_modules.
  serverExternalPackages: ["@napi-rs/canvas"],
  // No Next 16 a lista de qualidades é obrigatória e o padrão é só [75]. O 60 existe pro banner dos
  // textos do blog, que numa tela 2x é pedido em 2048 de largura e passava de 110 KB em q75.
  images: {
    qualities: [60, 75],
  },
  // A /bem-vindo (e a etapa de proteção de dados, que já tinha virado o painel dela) se juntou à
  // /inicio em 07/10/2026.
  async redirects() {
    return [
      { source: "/protecao-de-dados", destination: "/inicio", permanent: false },
      { source: "/bem-vindo", destination: "/inicio", permanent: false },
      // Os guias de SEO viraram o blog em 01/11/2026, um dia depois de publicados.
      { source: "/guias", destination: "/blog", permanent: true },
      { source: "/guias/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
  // A /profissionais é HTML estático e não conhece a query: sem isso, o link da aba de psiquiatras
  // nascia com Psicologos marcado até o JavaScript carregar. A URL que a pessoa vê não muda.
  // beforeFiles porque a /profissionais existe como página e ganharia de um rewrite comum.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/profissionais",
          has: [{ type: "query", key: "especialidade", value: "(medicos-psiquiatras|psiquiatra)" }],
          destination: "/profissionais/aba-psiquiatras",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Microfone só pra própria Margem: o treino de conversa do programa para familiares deixa
          // falar a mensagem (reconhecimento de voz do navegador, nada é gravado).
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
          { key: "Content-Security-Policy-Report-Only", value: cspRelatorio },
        ],
      },
    ];
  },
};

export default nextConfig;
