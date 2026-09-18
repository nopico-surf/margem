// Cada ícone é um asset exportado do Figma e salvo em /public/icons. Um componente por ícone: as URLs
// não se repetem mais dentro das telas.
//
// O nome do arquivo é o nome do glifo no Figma, nunca o lugar onde ele aparece. Ícone da biblioteca
// Material vem em inglês (`question_answer`, `place`); emoji nosso vem em português
// (`cerebro-emocional`). Regra completa em /docs/componentes.md, seção 6.
//
// Ainda sobram nomes com sufixo (Menu, Rodape, Resultado): são o mesmo glifo em cores ou tamanhos
// diferentes, e unificar exige mover a cor do arquivo para o CSS com currentColor. Enquanto isso não
// for feito, unificar aqui mudaria o visual da tela.

import {
  GlifoEmail, GlifoWhatsapp, GlifoInstagram, GlifoMenu, GlifoClose, GlifoSetaBaixo, GlifoCheckBox,
} from "./glifos";

type IconProps = { className?: string };

function icone(src: string, alt = "") {
  return function Icone({ className }: IconProps) {
    return <img className={className} src={src} alt={alt} />;
  };
}

/* Logo */

// Os três apontam para o mesmo arquivo: as cópias `-resultado` e `-modal` eram byte a byte iguais.
export const LogoMargem = icone("/icons/logo-margem.svg", "Margem");
export const LogoMargemResultado = icone("/icons/logo-margem.svg", "Margem");
export const LogoMargemModal = icone("/icons/logo-margem.svg", "Margem");

/* Menu e fechar */

// As cores abaixo são as que já estavam dentro de cada SVG. Ficam explícitas aqui porque agora o
// desenho é um só e quem define a cor é o lugar que usa.
export const IconeMenu = (p: IconProps) => <GlifoMenu {...p} color="#012A1C" />;
export const IconeMenuResultado = (p: IconProps) => <GlifoMenu {...p} color="#171B18" />;
// Branco porque fica sobre o overlay escuro do menu.
export const IconeFecharMenu = (p: IconProps) => <GlifoClose {...p} size={32} color="var(--neutral-0)" />;
export const IconeFecharModal = (p: IconProps) => <GlifoClose {...p} color="#012A1C" />;

/* Setas */

// seta.svg e seta-resultado.svg eram o mesmo traçado na mesma cor, exportados duas vezes.
export const IconeSeta = (p: IconProps) => <GlifoSetaBaixo {...p} color="#055C40" />;
export const IconeSetaResultado = IconeSeta;
export const IconeSetaCard = icone("/icons/seta-card.svg");

/* Home */

export const IconeSeguranca = icone("/icons/seguranca.svg");

// Um ícone por card de caminho, na ordem em que os cards aparecem na home. Cada um é um emoji do
// arquivo Emojis do Figma, e o nome do arquivo é o nome do componente lá.
export const ICONES_CAMINHO = [
  "/icons/broto-crescimento-renascendo.svg",
  "/icons/emergencia-sirene.svg",
  "/icons/cerebro-emocional.svg",
  "/icons/aperto-de-mao.svg",
  "/icons/coracao-enfaixado.svg",
  "/icons/poker-face.svg",
];

export function IconeCaminho({ indice, className }: { indice: number; className?: string }) {
  return <img className={className} src={ICONES_CAMINHO[indice]} alt="" />;
}

/* Resultado */

// O X do loader "Preparando informações...". Único ícone em <svg> no código em vez de <img>: a
// animação aumenta o X até 1,5x, e um <img> é desenhado em 12px e esticado, ficando pixelado.
// O desenho vem do componente `loader` da página Loader do Margem System. Os três arquivos
// loader-1/2/3.svg que existiam eram cópias idênticas e ninguém os carregava.
export function IconeLoader({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M10.3396 7.51471C9.59711 6.73393 8.69843 6.22222 7.65318 5.96276C8.68161 5.6985 9.57068 5.18198 10.318 4.3964C11.4329 3.22643 11.988 1.75856 12 0H9.12615C9.12134 1.00901 8.8354 1.83303 8.26832 2.47928C7.69643 3.13033 6.94433 3.45465 6.01441 3.45465C5.09891 3.45465 4.34681 3.12793 3.76051 2.47928C3.17661 1.83544 2.88586 1.00901 2.88106 0H0C0 1.79459 0.555066 3.26967 1.6652 4.43003C2.41009 5.20841 3.30636 5.71772 4.34922 5.97237C3.34481 6.23904 2.45815 6.75315 1.70605 7.53634C0.569483 8.72072 0 10.2078 0 12H2.87865C2.87865 11.9928 2.87625 11.9856 2.87625 11.9784C2.87625 10.9622 3.1646 10.1237 3.73648 9.46787C4.30837 8.80961 5.06047 8.47808 5.99038 8.47808C6.90588 8.47808 7.65798 8.81201 8.24429 9.47748C8.83059 10.1429 9.12615 10.979 9.12615 11.9784C9.12615 11.9856 9.12374 11.9928 9.12374 12H11.9976C11.9976 11.9832 12 11.9712 12 11.9568C12.0024 10.1622 11.4497 8.68228 10.3396 7.51471Z" fill="#171B18" />
    </svg>
  );
}

export const IconeInfo = icone("/icons/info.svg");
// Mesmo desenho do WhatsApp, em branco, porque fica sobre o fundo escuro do botão de agendar.
export const IconeAgendarWhatsapp = (p: IconProps) => <GlifoWhatsapp {...p} color="white" />;
// Avatar do profissional: o cadastro pode trazer foto própria, e aí a padrão não é usada.
export const URL_AVATAR_PADRAO = "/assets/professional-avatar-fallback.svg";

export function AvatarProfissional({ src, className }: { src?: string | null; className?: string }) {
  return <img className={className} src={src || URL_AVATAR_PADRAO} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = URL_AVATAR_PADRAO; }} alt="" />;
}
export const IconeCheckboxSelecionado = (p: IconProps) => <GlifoCheckBox {...p} color="#055C40" />;

/* Contatos
   Menu e rodapé usam o mesmo desenho na mesma cor, mudando só o tamanho: 20 no menu, 16 no rodapé.
   Eram seis arquivos para três desenhos. */

const CONTATO = { color: "#171B18", opacity: 0.88 } as const;

export const IconeWhatsappMenu = (p: IconProps) => <GlifoWhatsapp {...p} {...CONTATO} size={20} />;
export const IconeInstagramMenu = (p: IconProps) => <GlifoInstagram {...p} {...CONTATO} size={20} />;
export const IconeEmailMenu = (p: IconProps) => <GlifoEmail {...p} {...CONTATO} size={20} />;

export const IconeWhatsappRodape = (p: IconProps) => <GlifoWhatsapp {...p} {...CONTATO} size={16} />;
export const IconeInstagramRodape = (p: IconProps) => <GlifoInstagram {...p} {...CONTATO} size={16} />;
export const IconeEmailRodape = (p: IconProps) => <GlifoEmail {...p} {...CONTATO} size={16} />;

/* Ações de recurso
   A chave vem do banco (campo `icon` de cada ação), então a busca é por nome, não por componente. */

// Os que ainda são arquivo continuam sendo arquivo. Os que tinham cópia viraram glifo com a cor do
// lugar. A chave não mudou, porque ela vem do banco.
export const ICONES_ACAO = {
  info: icone("/icons/info.svg"),
  phone: icone("/icons/acao-telefone.svg"),
  chat: icone("/icons/acao-chat.svg"),
  telegram: icone("/icons/acao-telegram.svg"),
  libras: icone("/icons/acao-libras.svg"),
  place: icone("/icons/acao-local.svg"),
  link: icone("/icons/acao-link.svg"),
  logo: icone("/icons/logo-margem.svg", "Margem"),
  avatar: icone(URL_AVATAR_PADRAO),
  email: (p: IconProps) => <GlifoEmail {...p} color="#055C40" />,
  whatsapp: (p: IconProps) => <GlifoWhatsapp {...p} color="#055C40" />,
  whatsappSchedule: (p: IconProps) => <GlifoWhatsapp {...p} color="white" />,
  menu: (p: IconProps) => <GlifoMenu {...p} color="#171B18" />,
  arrow: (p: IconProps) => <GlifoSetaBaixo {...p} color="#055C40" />,
  checkboxSelected: (p: IconProps) => <GlifoCheckBox {...p} color="#055C40" />,
} as const;

// A tela de resultado espera as imagens carregarem antes de aparecer. Glifo inline já vem no HTML e
// não tem o que esperar, então só as URLs que sobraram entram nessa lista.
export const URLS_DE_ICONE = [
  "/icons/info.svg",
  "/icons/acao-telefone.svg",
  "/icons/acao-chat.svg",
  "/icons/acao-telegram.svg",
  "/icons/acao-libras.svg",
  "/icons/acao-local.svg",
  "/icons/acao-link.svg",
  "/icons/logo-margem.svg",
  "/icons/seta-card.svg",
  URL_AVATAR_PADRAO,
];

export type IconeAcao = keyof typeof ICONES_ACAO;

export function IconeDeAcao({ nome }: { nome: IconeAcao }) {
  const Icone = ICONES_ACAO[nome];
  return <Icone />;
}
