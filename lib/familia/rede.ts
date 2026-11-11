// Módulo 7 (briefing M7, C10): a rede de apoio. Os textos vêm do briefing. Este arquivo não importa
// nada de runtime. Os nomes que a pessoa escreve nunca vão pra IA nem pro Mixpanel.

import type { Problema } from "./diagnostico";

export const MAXIMO_NOMES = 2;
export const MAXIMO_NOME = 60;

export const MENSAGENS_DA_REDE = [
  "Oi! Lembrei de você. Quando der, me chama pra gente conversar um pouco?",
  "As coisas estão pesadas por aqui. Topa um café ou uma ligação esta semana?",
  "Tô precisando desabafar um pouco. Você tem um tempinho nos próximos dias?",
  "Bateu saudade. Vamos marcar alguma coisa? Ia me fazer bem.",
];

export type GrupoId = "al_anon" | "nar_anon" | "amor_exigente" | "caps_ad" | "cras" | "meu_sus" | "jogadores_anonimos";

// Grupos da tela 2. `href` externo abre o site oficial em nova aba ("Ver reuniões"); `servicos` leva à
// busca de serviços perto da pessoa. `problemas`: os do problema marcado aparecem primeiro.
// Links oficiais aprovados pelo fundador em 11/11/2026, junto com o plano do M7 (todos abriam nesse dia).
export const GRUPOS_DA_REDE: Array<{ id: GrupoId; nome: string; texto: string; href: string; servicos: boolean; problemas: Problema[] }> = [
  { id: "al_anon", nome: "Al-Anon", texto: "Para familiares e amigos de quem bebe. Reuniões presenciais e on-line.", href: "https://al-anon.org.br/", servicos: false, problemas: ["alcool"] },
  { id: "nar_anon", nome: "Nar-Anon", texto: "Para familiares e amigos de quem usa outras drogas.", href: "https://www.naranon.org.br/", servicos: false, problemas: ["outras_drogas"] },
  { id: "amor_exigente", nome: "Amor-Exigente", texto: "Grupos de apoio para famílias, em muitas cidades.", href: "https://amorexigente.org/", servicos: false, problemas: ["alcool", "outras_drogas"] },
  { id: "caps_ad", nome: "CAPS AD", texto: "Serviço do SUS que também acolhe familiares.", href: "/redes-de-apoio?tipo=publicas", servicos: true, problemas: ["alcool", "outras_drogas"] },
  { id: "cras", nome: "CRAS", texto: "Orienta sobre direitos e serviços na sua cidade.", href: "/redes-de-apoio?tipo=publicas", servicos: true, problemas: [] },
  {
    id: "meu_sus",
    nome: "Meu SUS Digital",
    texto: "Atendimento on-line gratuito em saúde mental para quem tem problema com apostas e para familiares.",
    href: "https://meususdigital.saude.gov.br/",
    servicos: false,
    problemas: ["apostas"],
  },
  { id: "jogadores_anonimos", nome: "Jogadores Anônimos", texto: "Para a pessoa que aposta.", href: "https://jogadoresanonimos.com.br/", servicos: false, problemas: ["apostas"] },
];

export const IDS_GRUPOS = GRUPOS_DA_REDE.map((grupo) => grupo.id);

// Os do problema marcado primeiro; dentro de cada parte, a ordem do briefing.
export function gruposEmOrdem(problemas: string[]) {
  const doProblema = (grupo: (typeof GRUPOS_DA_REDE)[number]) => grupo.problemas.some((problema) => problemas.includes(problema));
  return [...GRUPOS_DA_REDE.filter(doProblema), ...GRUPOS_DA_REDE.filter((grupo) => !doProblema(grupo))];
}

export const TEXTOS_REDE = {
  titulo: "A sua rede de apoio",
  quemTitulo: "Quem pode estar com você",
  intro: "Dividir o peso com alguém de confiança alivia e ajuda a pensar com mais clareza. Não precisa contar tudo.",
  nomeRotulo: (n: number) => `Nome ou apelido ${n} (só você vê)`,
  nomeDica: "Alguém que escuta sem julgar: da família, uma amizade antiga, alguém que já passou por algo parecido.",
  mensagensTitulo: "Uma mensagem para começar",
  copiar: "Copiar mensagem",
  contarMandei: "Contar que mandei",
  verMensagens: "Ver minhas mensagens",
  mandarOutra: "Mandar outra",
  gruposTitulo: "Um grupo para familiares",
  gruposIntro: "Existem grupos de familiares que passam pelo mesmo. Na primeira vez, você pode só ouvir e ver como é.",
  verReunioes: "Ver reuniões",
  verServicos: "Ver serviços perto de mim",
  contarFui: "Contar que fui",
  // Card 3 do módulo 7 e card do painel.
  escolher: "Escolher meu apoio",
  verApoio: "Ver meu apoio",
  outroPasso: "Dar outro passo",
  voltar: "Voltar ao módulo",
};

// O que a ferramenta conclui no programa (a primeira vez vale).
export const ITEM_APOIO_M7 = { modulo: 7, item: "apoio" };

export type RegistroMensagem = { mensagem: number | null; quando: string };
export type RegistroGrupo = { grupo: GrupoId; quando: string };
export type Rede = { nomes: string[]; mensagens: RegistroMensagem[]; grupos: RegistroGrupo[] };

export const REDE_VAZIA: Rede = { nomes: [], mensagens: [], grupos: [] };

// Data do primeiro passo contado (mensagem ou grupo), ou null.
export function primeiroPasso(rede: Rede | null) {
  if (!rede) return null;
  const datas = [...rede.mensagens, ...rede.grupos].map((registro) => registro.quando).sort();
  return datas[0] ?? null;
}

// ===== Sanitização (rota e modo dev) =====

export function sanitizarNomes(valor: unknown): string[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .filter((nome): nome is string => typeof nome === "string")
    .map((nome) => nome.trim().slice(0, MAXIMO_NOME))
    .filter(Boolean)
    .slice(0, MAXIMO_NOMES);
}

// POST { tipo: "mensagem", nomes, mensagem } | { tipo: "grupo", nomes, grupo }. Devolve a rede nova, ou
// null quando a entrada não vale. Os dois contam um passo e concluem o item do módulo 7.
export function aplicarRede(atual: Rede, entrada: unknown, agora: string): Rede | null {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const nomes = sanitizarNomes(bruto.nomes);
  if (bruto.tipo === "mensagem") {
    const mensagem = typeof bruto.mensagem === "number" && Number.isInteger(bruto.mensagem) && bruto.mensagem >= 0 && bruto.mensagem < MENSAGENS_DA_REDE.length ? bruto.mensagem : null;
    return { ...atual, nomes, mensagens: [...atual.mensagens, { mensagem, quando: agora }] };
  }
  if (bruto.tipo === "grupo") {
    const grupo = IDS_GRUPOS.find((id) => id === bruto.grupo);
    if (!grupo) return null;
    return { ...atual, nomes, grupos: [...atual.grupos, { grupo, quando: agora }] };
  }
  return null;
}
