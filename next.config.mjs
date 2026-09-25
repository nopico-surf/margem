/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.*'],
  // A etapa de proteção de dados virou o painel de dados e cookies dentro de /bem-vindo.
  async redirects() {
    return [{ source: "/protecao-de-dados", destination: "/bem-vindo", permanent: false }];
  },
};

export default nextConfig;
