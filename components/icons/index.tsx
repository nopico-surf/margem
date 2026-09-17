// Cada ícone é um asset exportado do Figma e servido por URL. Um componente por ícone: as URLs
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

export const LogoMargem = icone("https://www.figma.com/api/mcp/asset/3d60e40c-e0dd-4dce-b476-6b678a353bfd.svg", "Margem");
export const LogoMargemResultado = icone("https://www.figma.com/api/mcp/asset/789e43e1-39be-4b2b-9e0e-30064f2b0bc1.svg", "Margem");
export const LogoMargemModal = icone("https://www.figma.com/api/mcp/asset/d418cab5-cf60-433b-abec-fdfd2e6eb808.svg", "Margem");

/* Menu e fechar */

export const IconeMenu = icone("https://www.figma.com/api/mcp/asset/2b2b0245-44e5-4dbe-a618-042679b2614d.svg");
export const IconeMenuResultado = icone("https://www.figma.com/api/mcp/asset/8ad57a97-c590-4f92-aaa9-ea8a555ac520.svg");
export const IconeFecharMenu = icone("https://www.figma.com/api/mcp/asset/f020c9b3-25d1-40a6-b7fe-284f4f710035.svg");
export const IconeFecharModal = icone("https://www.figma.com/api/mcp/asset/03ba932b-a706-4f9f-b976-2a6a8b337698.svg");

/* Setas */

export const IconeSeta = icone("https://www.figma.com/api/mcp/asset/e1f68123-9587-49c9-9b52-a55d1f19db73.svg");
export const IconeSetaCard = icone("https://www.figma.com/api/mcp/asset/1a66caf4-8fb3-40b9-a268-f3224ac95eb4.svg");
export const IconeSetaResultado = icone("https://www.figma.com/api/mcp/asset/c599dd4c-61c3-42b3-865b-c827f1bdce06.svg");

/* Home */

export const IconeSeguranca = icone("https://www.figma.com/api/mcp/asset/36a4a0dd-9a1a-48b0-be2f-6f703907dcad.svg");

// Um ícone por card de caminho, na ordem em que os cards aparecem na home.
export const ICONES_CAMINHO = [
  "https://www.figma.com/api/mcp/asset/efbc6f65-16a9-41cf-a7bb-a5d0da541f2c.svg",
  "https://www.figma.com/api/mcp/asset/93f9ed1f-bc1c-405d-ab87-381c623da872.svg",
  "https://www.figma.com/api/mcp/asset/2bb6ae35-7cdf-4f33-9d30-4a4965295425.svg",
  "https://www.figma.com/api/mcp/asset/3e940b99-3a7d-47e4-b868-8f1712b2a961.svg",
  "https://www.figma.com/api/mcp/asset/aea480ed-8230-49de-9227-bd560f21b76c.svg",
  "https://www.figma.com/api/mcp/asset/835d1770-27b1-452d-a3cd-ac7edfbf1a69.svg",
];

export function IconeCaminho({ indice, className }: { indice: number; className?: string }) {
  return <img className={className} src={ICONES_CAMINHO[indice]} alt="" />;
}

/* Resultado */

export const IconeInfo = icone("https://www.figma.com/api/mcp/asset/e159a9c0-daaa-4a74-a378-8cad748d03cf.svg");
export const IconeAgendarWhatsapp = icone("https://www.figma.com/api/mcp/asset/820451d9-7e93-43b6-aec1-7d33e7e91aef.svg");
// Avatar do profissional: o cadastro pode trazer foto própria, e aí a padrão não é usada.
export const URL_AVATAR_PADRAO = "https://www.figma.com/api/mcp/asset/31aa1f5a-a153-4928-a373-3463faab43d6.png";

export function AvatarProfissional({ src, className }: { src?: string | null; className?: string }) {
  return <img className={className} src={src || URL_AVATAR_PADRAO} alt="" />;
}
export const IconeCheckboxSelecionado = icone("https://www.figma.com/api/mcp/asset/ae8f8ca3-9062-4066-abfb-8dd5bed8e56b.svg");

/* Contatos */

export const IconeWhatsappMenu = icone("https://www.figma.com/api/mcp/asset/ccb114ae-13b9-45c7-bccb-094fdb68082a.svg");
export const IconeInstagramMenu = icone("https://www.figma.com/api/mcp/asset/3d25ba20-fb17-47f0-9f61-3a917bee0be5.svg");
export const IconeEmailMenu = icone("https://www.figma.com/api/mcp/asset/30e845f2-dbb7-4389-8a98-4555acde18a5.svg");

export const IconeWhatsappRodape = icone("https://www.figma.com/api/mcp/asset/1d86dc12-b466-4be2-8e7e-8f9132b09968.svg");
export const IconeInstagramRodape = icone("https://www.figma.com/api/mcp/asset/05f074d7-e188-46b6-b6dd-cb6026e6b5e1.svg");
export const IconeEmailRodape = icone("https://www.figma.com/api/mcp/asset/8f8bc447-8191-4fff-86a5-dbffa0763774.svg");

/* Ações de recurso
   A chave vem do banco (campo `icon` de cada ação), então a busca é por nome, não por componente. */

export const ICONES_ACAO = {
  info: "https://www.figma.com/api/mcp/asset/e159a9c0-daaa-4a74-a378-8cad748d03cf.svg",
  phone: "https://www.figma.com/api/mcp/asset/dca240a9-7b65-4a90-8d8c-817f709ccd33.svg",
  chat: "https://www.figma.com/api/mcp/asset/990063e9-02bc-497a-aace-465e3993b1ef.svg",
  whatsapp: "https://www.figma.com/api/mcp/asset/1459e6c0-f362-4458-a22e-c494b157ac42.svg",
  whatsappSchedule: "https://www.figma.com/api/mcp/asset/820451d9-7e93-43b6-aec1-7d33e7e91aef.svg",
  telegram: "https://www.figma.com/api/mcp/asset/fb5cf6d4-79bf-4b5b-b48d-15f9acf37edb.svg",
  libras: "https://www.figma.com/api/mcp/asset/0c2b1cbe-022b-42b0-8699-de703c12b610.svg",
  place: "https://www.figma.com/api/mcp/asset/0249441f-bd37-44d3-963e-4f7aefb81271.svg",
  email: "https://www.figma.com/api/mcp/asset/185ced22-e534-4048-9c99-e8a00f602260.svg",
  link: "https://www.figma.com/api/mcp/asset/5b79160c-12f3-4581-be31-71085597989d.svg",
  logo: "https://www.figma.com/api/mcp/asset/789e43e1-39be-4b2b-9e0e-30064f2b0bc1.svg",
  menu: "https://www.figma.com/api/mcp/asset/8ad57a97-c590-4f92-aaa9-ea8a555ac520.svg",
  arrow: "https://www.figma.com/api/mcp/asset/c599dd4c-61c3-42b3-865b-c827f1bdce06.svg",
  avatar: "https://www.figma.com/api/mcp/asset/31aa1f5a-a153-4928-a373-3463faab43d6.png",
  checkbox: "https://www.figma.com/api/mcp/asset/dcf154ca-9f4b-4667-82ac-937f5fe9a117.svg",
  checkboxSelected: "https://www.figma.com/api/mcp/asset/ae8f8ca3-9062-4066-abfb-8dd5bed8e56b.svg",
} as const;

export type IconeAcao = keyof typeof ICONES_ACAO;

export function IconeDeAcao({ nome }: { nome: IconeAcao }) {
  return <img src={ICONES_ACAO[nome]} alt="" />;
}
