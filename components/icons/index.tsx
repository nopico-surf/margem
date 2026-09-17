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

export const IconeInfo = icone("/icons/info.svg");
export const IconeAgendarWhatsapp = icone("/icons/agendar-whatsapp.svg");
// Avatar do profissional: o cadastro pode trazer foto própria, e aí a padrão não é usada.
export const URL_AVATAR_PADRAO = "/assets/professional-avatar.png";

export function AvatarProfissional({ src, className }: { src?: string | null; className?: string }) {
  return <img className={className} src={src || URL_AVATAR_PADRAO} alt="" />;
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
  avatar: "/assets/professional-avatar.png",
  checkbox: "/icons/checkbox.svg",
  checkboxSelected: "/icons/checkbox-selecionado.svg",
} as const;

export type IconeAcao = keyof typeof ICONES_ACAO;

export function IconeDeAcao({ nome }: { nome: IconeAcao }) {
  return <img src={ICONES_ACAO[nome]} alt="" />;
}
