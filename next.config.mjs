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
  // A /bem-vindo (e a etapa de proteção de dados, que já tinha virado o painel dela) se juntou à
  // /inicio em 07/10/2026.
  async redirects() {
    return [
      { source: "/protecao-de-dados", destination: "/inicio", permanent: false },
      { source: "/bem-vindo", destination: "/inicio", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy-Report-Only", value: cspRelatorio },
        ],
      },
    ];
  },
};

export default nextConfig;
