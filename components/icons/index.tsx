// Este arquivo é a ponte entre o desenho e a tela: `glifos.tsx` tem o desenho, sem cor; aqui cada
// export diz onde o ícone aparece e com que cor e tamanho.
//
// Todo ícone é glifo inline. Continuam sendo arquivo em /public/icons só o logo, que é marca, e os
// seis emojis dos cards da home, que são ilustração colorida e não dá para recolorir.
//
// O nome do glifo é o nome do componente no Figma, nunca o lugar onde ele aparece. Foi nomear por
// lugar que gerou `whatsapp-menu`, `whatsapp-rodape` e `whatsapp-card-profissional` para um desenho
// só. Regra completa em /docs/componentes.md, seção 6.
//
// CUIDADO AO MEXER: como estes ícones são <svg> e não <img>, qualquer regra de CSS escrita como
// `.alguma-coisa img` não pega neles. Ao acrescentar um ícone, conferir se o componente tem regra
// assim e estender para `svg`.

import {
  GlifoEmail, GlifoWhatsapp, GlifoInstagram, GlifoMenu, GlifoClose, GlifoDoubleArrowDown, GlifoCheckBox,
  GlifoQuestionAnswer, GlifoPanTool, GlifoLink, GlifoPlace, GlifoPhone, GlifoMessageFlye,
  GlifoSecurity, GlifoArrowForwardIos, GlifoInfo,
} from "./glifos";
// O caminho da foto padrão mora no `avatar`, em components/ui. Aqui ele serve só à chave `avatar`
// de ICONES_ACAO, que vem do banco, e ao preload de URLS_DE_ICONE.
import { URL_AVATAR_PADRAO } from "@/components/ui/Avatar";

// Cores que se repetem entre ícones. São as que já estavam dentro de cada SVG.
const ACAO = { color: "var(--colors-brand-primary-800)" } as const;
const SUAVE = { color: "var(--colors-neutral-950)", opacity: 0.64 } as const;

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
// Uma cor só nas duas telas. Era #012A1C na home e #171B18 no resultado, para o mesmo ícone.
export const IconeMenu = (p: IconProps) => <GlifoMenu {...p} color="var(--colors-neutral-950)" />;
// Branco porque fica sobre o overlay escuro do menu.
export const IconeFecharMenu = (p: IconProps) => <GlifoClose {...p} size={32} color="var(--neutral-0)" />;
export const IconeFecharModal = (p: IconProps) => <GlifoClose {...p} color="var(--colors-brand-primary-950)" />;

/* Setas */

// seta.svg e seta-resultado.svg eram o mesmo traçado na mesma cor, exportados duas vezes.
// Segue a cor do botão onde está, para acompanhar o hover.
export const IconeSeta = (p: IconProps) => <GlifoDoubleArrowDown {...p} />;
export const IconeSetaResultado = IconeSeta;
export const IconeSetaCard = (p: IconProps) => <GlifoArrowForwardIos {...p} {...SUAVE} />;

/* Home */

export const IconeSeguranca = (p: IconProps) => <GlifoSecurity {...p} {...ACAO} />;

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
      <path d="M10.3396 7.51471C9.59711 6.73393 8.69843 6.22222 7.65318 5.96276C8.68161 5.6985 9.57068 5.18198 10.318 4.3964C11.4329 3.22643 11.988 1.75856 12 0H9.12615C9.12134 1.00901 8.8354 1.83303 8.26832 2.47928C7.69643 3.13033 6.94433 3.45465 6.01441 3.45465C5.09891 3.45465 4.34681 3.12793 3.76051 2.47928C3.17661 1.83544 2.88586 1.00901 2.88106 0H0C0 1.79459 0.555066 3.26967 1.6652 4.43003C2.41009 5.20841 3.30636 5.71772 4.34922 5.97237C3.34481 6.23904 2.45815 6.75315 1.70605 7.53634C0.569483 8.72072 0 10.2078 0 12H2.87865C2.87865 11.9928 2.87625 11.9856 2.87625 11.9784C2.87625 10.9622 3.1646 10.1237 3.73648 9.46787C4.30837 8.80961 5.06047 8.47808 5.99038 8.47808C6.90588 8.47808 7.65798 8.81201 8.24429 9.47748C8.83059 10.1429 9.12615 10.979 9.12615 11.9784C9.12615 11.9856 9.12374 11.9928 9.12374 12H11.9976C11.9976 11.9832 12 11.9712 12 11.9568C12.0024 10.1622 11.4497 8.68228 10.3396 7.51471Z" fill="var(--colors-neutral-950)" />
    </svg>
  );
}

export const IconeInfo = (p: IconProps) => <GlifoInfo {...p} {...SUAVE} />;
// Segue a cor do botão: branco quando ativo, apagado quando desabilitado.
export const IconeAgendarWhatsapp = (p: IconProps) => <GlifoWhatsapp {...p} />;
export const IconeCheckboxSelecionado = (p: IconProps) => <GlifoCheckBox {...p} color="var(--colors-brand-primary-800)" />;

/* Contatos
   Menu e rodapé usam o mesmo desenho na mesma cor, mudando só o tamanho: 20 no menu, 16 no rodapé.
   Eram seis arquivos para três desenhos. */

const CONTATO = { color: "var(--colors-neutral-950)", opacity: 0.88 } as const;

export const IconeWhatsappMenu = (p: IconProps) => <GlifoWhatsapp {...p} {...CONTATO} size={20} />;
export const IconeInstagramMenu = (p: IconProps) => <GlifoInstagram {...p} {...CONTATO} size={20} />;
export const IconeEmailMenu = (p: IconProps) => <GlifoEmail {...p} {...CONTATO} size={20} />;

export const IconeWhatsappRodape = (p: IconProps) => <GlifoWhatsapp {...p} {...CONTATO} size={16} />;
export const IconeInstagramRodape = (p: IconProps) => <GlifoInstagram {...p} {...CONTATO} size={16} />;
export const IconeEmailRodape = (p: IconProps) => <GlifoEmail {...p} {...CONTATO} size={16} />;

/* Ações de recurso
   A chave vem do banco (campo `icon` de cada ação), então a busca é por nome, não por componente. */

// A chave não mudou, porque ela vem do banco. `logo` e `avatar` seguem sendo arquivo: um é marca, o
// outro é a foto padrão do profissional.
export const ICONES_ACAO = {
  info: (p: IconProps) => <GlifoInfo {...p} {...SUAVE} />,
  phone: (p: IconProps) => <GlifoPhone {...p} {...ACAO} />,
  chat: (p: IconProps) => <GlifoQuestionAnswer {...p} {...ACAO} />,
  telegram: (p: IconProps) => <GlifoMessageFlye {...p} {...ACAO} />,
  libras: (p: IconProps) => <GlifoPanTool {...p} {...ACAO} />,
  place: (p: IconProps) => <GlifoPlace {...p} {...ACAO} />,
  link: (p: IconProps) => <GlifoLink {...p} {...ACAO} />,
  logo: icone("/icons/logo-margem.svg", "Margem"),
  avatar: icone(URL_AVATAR_PADRAO),
  email: (p: IconProps) => <GlifoEmail {...p} {...ACAO} />,
  whatsapp: (p: IconProps) => <GlifoWhatsapp {...p} {...ACAO} />,
  whatsappSchedule: (p: IconProps) => <GlifoWhatsapp {...p} color="white" />,
  menu: (p: IconProps) => <GlifoMenu {...p} color="var(--colors-neutral-950)" />,
  arrow: (p: IconProps) => <GlifoDoubleArrowDown {...p} {...ACAO} />,
  checkboxSelected: (p: IconProps) => <GlifoCheckBox {...p} {...ACAO} />,
} as const;

// A tela de resultado espera as imagens carregarem antes de aparecer. Glifo inline já vem no HTML e
// não tem o que esperar, então só sobraram estes dois.
export const URLS_DE_ICONE = ["/icons/logo-margem.svg", URL_AVATAR_PADRAO];

export type IconeAcao = keyof typeof ICONES_ACAO;

export function IconeDeAcao({ nome }: { nome: IconeAcao }) {
  const Icone = ICONES_ACAO[nome];
  return <Icone />;
}
