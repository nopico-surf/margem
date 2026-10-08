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
};

export default nextConfig;
