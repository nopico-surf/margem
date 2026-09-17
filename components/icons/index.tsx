// Cada ícone é um asset exportado do Figma e salvo em /public/icons. Um componente por ícone: as URLs
// não se repetem mais dentro das telas.
//
// Os nomes com sufixo (Home, Resultado, Modal, Menu, Rodape) existem porque o mesmo desenho foi
// exportado mais de uma vez no Figma e cada tela aponta para uma URL diferente. Enquanto as URLs
// não forem unificadas no Figma, unificar aqui trocaria o arquivo que a tela carrega hoje.

type IconProps = { className?: string };

function icone(src: string, alt = "") {
  return function Icone({ className }: IconProps) {
    return <img className={className} src={src} alt={alt} />;
  };
}

/* Logo */

export const LogoMargem = icone("/icons/logo-margem.svg", "Margem");
export const LogoMargemResultado = icone("/icons/logo-margem-resultado.svg", "Margem");
export const LogoMargemModal = icone("/icons/logo-margem-modal.svg", "Margem");

/* Menu e fechar */

export const IconeMenu = icone("/icons/menu.svg");
export const IconeMenuResultado = icone("/icons/menu-resultado.svg");
export const IconeFecharMenu = icone("/icons/fechar-menu.svg");
export const IconeFecharModal = icone("/icons/fechar-modal.svg");

/* Setas */

export const IconeSeta = icone("/icons/seta.svg");
export const IconeSetaCard = icone("/icons/seta-card.svg");
export const IconeSetaResultado = icone("/icons/seta-resultado.svg");

/* Home */

export const IconeSeguranca = icone("/icons/seguranca.svg");

// Um ícone por card de caminho, na ordem em que os cards aparecem na home.
export const ICONES_CAMINHO = [
  "/icons/caminho-1.svg",
  "/icons/caminho-2.svg",
  "/icons/caminho-3.svg",
  "/icons/caminho-4.svg",
  "/icons/caminho-5.svg",
  "/icons/caminho-6.svg",
];

export function IconeCaminho({ indice, className }: { indice: number; className?: string }) {
  return <img className={className} src={ICONES_CAMINHO[indice]} alt="" />;
}

/* Resultado */

// O X do loader "Preparando informações...": o Figma exporta três arquivos, mas o desenho é o mesmo.
// Único ícone em <svg> no código em vez de <img>: a animação aumenta o X até 1,5x, e um <img> é
// desenhado em 12px e esticado, ficando pixelado. O desenho é o de /icons/loader-1.svg.
export function IconeLoader({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M10.3396 7.51471C9.59711 6.73393 8.69843 6.22222 7.65318 5.96276C8.68161 5.6985 9.57068 5.18198 10.318 4.3964C11.4329 3.22643 11.988 1.75856 12 0H9.12615C9.12134 1.00901 8.8354 1.83303 8.26832 2.47928C7.69643 3.13033 6.94433 3.45465 6.01441 3.45465C5.09891 3.45465 4.34681 3.12793 3.76051 2.47928C3.17661 1.83544 2.88586 1.00901 2.88106 0H0C0 1.79459 0.555066 3.26967 1.6652 4.43003C2.41009 5.20841 3.30636 5.71772 4.34922 5.97237C3.34481 6.23904 2.45815 6.75315 1.70605 7.53634C0.569483 8.72072 0 10.2078 0 12H2.87865C2.87865 11.9928 2.87625 11.9856 2.87625 11.9784C2.87625 10.9622 3.1646 10.1237 3.73648 9.46787C4.30837 8.80961 5.06047 8.47808 5.99038 8.47808C6.90588 8.47808 7.65798 8.81201 8.24429 9.47748C8.83059 10.1429 9.12615 10.979 9.12615 11.9784C9.12615 11.9856 9.12374 11.9928 9.12374 12H11.9976C11.9976 11.9832 12 11.9712 12 11.9568C12.0024 10.1622 11.4497 8.68228 10.3396 7.51471Z" fill="#171B18" />
    </svg>
  );
}

export const IconeInfo = icone("/icons/info.svg");
export const IconeAgendarWhatsapp = icone("/icons/agendar-whatsapp.svg");
// Avatar do profissional: o cadastro pode trazer foto própria, e aí a padrão não é usada.
export const URL_AVATAR_PADRAO = "/assets/professional-avatar-fallback.svg";

export function AvatarProfissional({ src, className }: { src?: string | null; className?: string }) {
  return <img className={className} src={src || URL_AVATAR_PADRAO} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = URL_AVATAR_PADRAO; }} alt="" />;
}
export const IconeCheckboxSelecionado = icone("/icons/checkbox-selecionado.svg");

/* Contatos */

export const IconeWhatsappMenu = icone("/icons/whatsapp-menu.svg");
export const IconeInstagramMenu = icone("/icons/instagram-menu.svg");
export const IconeEmailMenu = icone("/icons/email-menu.svg");

export const IconeWhatsappRodape = icone("/icons/whatsapp-rodape.svg");
export const IconeInstagramRodape = icone("/icons/instagram-rodape.svg");
export const IconeEmailRodape = icone("/icons/email-rodape.svg");

/* Ações de recurso
   A chave vem do banco (campo `icon` de cada ação), então a busca é por nome, não por componente. */

export const ICONES_ACAO = {
  info: "/icons/info.svg",
  phone: "/icons/acao-telefone.svg",
  chat: "/icons/acao-chat.svg",
  whatsapp: "/icons/acao-whatsapp.svg",
  whatsappSchedule: "/icons/agendar-whatsapp.svg",
  telegram: "/icons/acao-telegram.svg",
  libras: "/icons/acao-libras.svg",
  place: "/icons/acao-local.svg",
  email: "/icons/acao-email.svg",
  link: "/icons/acao-link.svg",
  logo: "/icons/logo-margem-resultado.svg",
  menu: "/icons/menu-resultado.svg",
  arrow: "/icons/seta-resultado.svg",
  avatar: URL_AVATAR_PADRAO,
  checkbox: "/icons/checkbox.svg",
  checkboxSelected: "/icons/checkbox-selecionado.svg",
} as const;

export type IconeAcao = keyof typeof ICONES_ACAO;

export function IconeDeAcao({ nome }: { nome: IconeAcao }) {
  return <img src={ICONES_ACAO[nome]} alt="" />;
}
