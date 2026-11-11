// Módulo 4 (briefing M4): "do que a pessoa gosta" (ferramenta A), "planejar como valorizar" (B) e
// "o combinado fica para outro dia" (C5). Os textos vêm do briefing. Este arquivo não importa nada de
// runtime. Texto escrito pela pessoa nunca vai pra IA nem pro Mixpanel.

import { IDS_DIAS, type Dia, type Momento } from "./escala";

// ===== Do que {{apelido}} gosta de fazer =====

export type BuscaId = "relaxar" | "divertir" | "enturmar" | "alivio" | "emocao" | "dormir";

// A busca do diário ("O que parece ter buscado") vira o grupo de ideias. "Fugir de um problema" é o
// "Alívio de um problema" da tabela do briefing.
export const BUSCA_DO_DIARIO: Record<string, BuscaId> = {
  Relaxar: "relaxar",
  "Se divertir": "divertir",
  "Se enturmar": "enturmar",
  "Fugir de um problema": "alivio",
  "Sentir emoção": "emocao",
  "Conseguir dormir": "dormir",
};

export const GRUPOS_DE_IDEIAS: Array<{ id: BuscaId; rotulo: string; ideias: string[] }> = [
  {
    id: "relaxar",
    rotulo: "Relaxar",
    ideias: ["Ouvir uma música calma juntos", "Um banho demorado", "Sentar na varanda ou na calçada para ver o movimento", "Um chá ou café no fim da tarde", "Uma massagem nos ombros"],
  },
  {
    id: "divertir",
    rotulo: "Se divertir",
    ideias: ["Ver um filme de comédia juntos", "Uma partida de baralho ou dominó", "Ver vídeos engraçados juntos", "Olhar fotos de momentos bons", "Cozinhar uma receita nova"],
  },
  {
    id: "enturmar",
    rotulo: "Se enturmar",
    ideias: [
      "Chamar amigos ou parentes para um café em casa",
      "Um passeio na praça do bairro",
      "Ver um jogo de futebol com a família",
      "Um lanche com gente querida",
      "Uma ligação de vídeo com alguém de quem {{apelido}} gosta",
    ],
  },
  {
    id: "alivio",
    rotulo: "Alívio de um problema",
    ideias: ["Uma caminhada ao ar livre", "Ajudar a colocar o problema no papel", "Resolver juntos uma pendência pequena", "Um tempo em silêncio, sem cobrança", "Conversar sobre outra coisa"],
  },
  {
    id: "emocao",
    rotulo: "Sentir emoção",
    ideias: ["Assistir a um jogo importante do time", "Um esporte ou exercício juntos", "Um passeio a um lugar novo", "Montar ou consertar algo juntos", "Ver um filme de ação ou suspense"],
  },
  {
    id: "dormir",
    rotulo: "Conseguir dormir",
    ideias: ["Quarto escuro e silencioso", "Um som de chuva para dormir", "Um leite ou chá quente antes de deitar", "Deixar o celular longe na hora de deitar", "Uma rotina tranquila no fim da noite"],
  },
];

export const TEXTOS_GOSTA = {
  titulo: "Do que {{apelido}} gosta",
  intro: "Pense em 2 coisas que {{apelido}} gosta de fazer sem usar. Ter isso à mão ajuda a oferecer algo bom justamente nos dias mais difíceis.",
  comDiario: "Pelo seu diário, {{apelido}} parece buscar {{buscou}}, e os momentos difíceis aparecem mais {{dia}}, {{periodo}}. Pense em algo que traga isso de outro jeito, nesse horário.",
  semDiario: "Se ainda não anotou no diário, tudo bem. Pense no que {{apelido}} curtia antes.",
  maisIdeias: "Ver mais ideias",
  campoRotulo: "Do que {{apelido}} gosta",
  campoDica: "Algo concreto e fácil de fazer no dia a dia. Toque numa ideia ou escreva a sua.",
  maisUma: "Que tal mais uma?",
  salvar: "Salvar minha lista",
};

export const MAXIMO_ITEM_GOSTA = 120;

// ===== Planejar como valorizar =====

export const FORMA_DA_LISTA = "Fazer uma das coisas da lista \"do que {{apelido}} gosta\"";
export const FORMA_ELOGIO = "Um elogio sincero";

export const FORMAS_DE_VALORIZAR = [
  "Dar atenção e ouvir sem interromper",
  "Fazer companhia numa atividade simples",
  "Fazer a comida preferida",
  "Um passeio sem pressa",
  FORMA_ELOGIO,
  "Um abraço",
  "Colocar a música preferida",
  "Agradecer uma ajuda em casa",
  FORMA_DA_LISTA,
  "Deixar descansar sem cobrança",
];

export const ELOGIOS_QUE_FUNCIONAM = [
  "Gostei muito da sua ajuda na cozinha hoje.",
  "Foi muito bom conversar com você com calma.",
  "Adorei passear com você.",
  "Ficou ótimo o que você fez.",
  "Valeu por ter avisado.",
  "Fiquei feliz de ver você em casa hoje.",
];

export const ELOGIOS_A_EVITAR: Array<{ frase: string; motivo: string }> = [
  { frase: "Até que enfim, hein.", motivo: "Traz o passado de volta e diminui o gesto de agora." },
  { frase: "Você devia ser assim todo dia.", motivo: "Vira cobrança para amanhã." },
  { frase: "Nem parece você.", motivo: "Soa como ironia e apaga o que foi bom." },
  { frase: "Olha só, até que você se esforçou.", motivo: "Mostra que você não acreditava." },
];

export const CENARIO_DO_ELOGIO = "elogiar-sem-ironia";

export const TEXTOS_VALORIZAR = {
  titulo: "Como você vai valorizar nesta semana",
  intro: "Quando {{apelido}} estiver bem e sem usar, mostre que você percebeu. Logo na hora, com algo simples e de que a pessoa goste.",
  funcionam: "Funcionam:",
  evitar: "Soam como cobrança:",
  treinarElogio: "Treinar um elogio",
  quandoRotulo: "Quando",
  quandoDica: "Se der, escolha os dias e horários em que os momentos difíceis costumam aparecer (o diário mostra). É ali que um momento bom faz mais diferença.",
  salvar: "Salvar meu plano",
  salvo: "Plano salvo. Quando você valorizar um momento bom, toque no dia, no card do painel.",
  painelTitulo: "Valorizar o que é bom",
  verEditar: "Ver e editar o plano",
};

export const FORMAS_PARA_ESCOLHER = 2;

export type PlanoValorizar = {
  formas: string[];
  dias: Dia[];
  periodos: Momento[];
  semana_inicio: string;
  feitos: string[];
};

// ===== O combinado fica para outro dia =====

export type ClimaDoAdiar = "sim" | "nao" | "nao_sei";

export type Adiar = { clima: ClimaDoAdiar; situacao: string | null; na_hora: string | null; depois: string | null };

export const SITUACOES_DO_ADIAR = ["Ver um filme juntos", "Um jantar especial", "Um passeio", "Um café da tarde juntos", "Uma visita a alguém da família", "Um jogo ou partida juntos"];

export const FRASES_NA_HORA = [
  "Hoje não vai dar. A gente vê outro dia.",
  "Tudo bem, fica pra outra hora.",
  "Vamos deixar pra amanhã.",
  "Hoje eu vou fazer outra coisa. Outro dia a gente vê.",
];

// Para álcool, "tinha usado" vira "tinha bebido"; para apostas, "porque você estava apostando".
export const FRASES_DEPOIS = [
  "Ontem eu não quis ver o filme porque você tinha usado. Eu gosto muito quando a gente fica junto sem isso.",
  "Eu adiei ontem porque queria você de verdade comigo. Bora tentar no sábado?",
  "Eu adoro quando a gente aproveita junto. Por isso eu deixei pra outro dia.",
];

export function fraseDepoisDoProblema(frase: string, problema: string) {
  if (problema === "alcool") return frase.replace("tinha usado", "tinha bebido");
  if (problema === "apostas") return frase.replace("porque você tinha usado", "porque você estava apostando");
  return frase;
}

export const TEXTOS_ADIAR = {
  titulo: "Quando o combinado fica para outro dia",
  climaPergunta: "Se você adiar um programa porque {{apelido}} usou, isso pode deixar o clima tenso ou perigoso em casa?",
  sim: "Sim",
  nao: "Não",
  naoSei: "Não sei",
  climaSim: "Então deixe esta parte para depois. Nesta semana, foque em valorizar os momentos bons, e converse com um profissional antes de dar este passo.",
  profissional: "Ver psicólogo parceiro",
  voltarAoModulo: "Voltar ao módulo",
  intro: "Se vocês combinaram algo bom e {{apelido}} chegar depois de usar, o programa fica para outro dia. Com calma, sem bronca e sem discussão.",
  doPlano: "Uma das coisas que você planejou para valorizar pode ser a escolhida aqui.",
  outro: "Outro",
  naHora: "Na hora",
  naHoraDica: "Diga uma vez, com voz calma, e vá fazer outra coisa. Sem sermão e sem cara feia.",
  depois: "No dia seguinte, num momento sem efeito",
  salvar: "Salvar",
  salvo: "Combinado. Se acontecer, você já sabe o que dizer.",
  deixadoParaDepois: "Deixado para depois",
};

export const MAXIMO_SITUACAO = 120;
export const MAXIMO_FRASE_ADIAR = 280;

// O que cada ferramenta conclui no programa (a primeira vez vale).
export const ITEM_GOSTA_M4 = { modulo: 4, item: "lista" };
export const ITEM_PLANO_M4 = { modulo: 4, item: "planejar" };
export const ITEM_ADIAR_M4 = { modulo: 4, item: "situacao" };

// ===== Sanitização (rota e modo dev) =====

function textoCurto(valor: unknown, maximo: number) {
  return typeof valor === "string" && valor.trim() ? valor.trim().slice(0, maximo) : null;
}

export function sanitizarGosta(entrada: unknown) {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const itens = (Array.isArray(bruto.itens) ? bruto.itens : []).map((item) => textoCurto(item, MAXIMO_ITEM_GOSTA)).filter((item): item is string => Boolean(item)).slice(0, 2);
  if (itens.length === 0) return null;
  const busca = GRUPOS_DE_IDEIAS.find((grupo) => grupo.id === bruto.busca_relacionada)?.id ?? null;
  return { itens, busca_relacionada: busca };
}

export function sanitizarPlano(entrada: unknown) {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const formas = (Array.isArray(bruto.formas) ? bruto.formas : []).filter((forma): forma is string => typeof forma === "string" && FORMAS_DE_VALORIZAR.includes(forma));
  if (new Set(formas).size !== FORMAS_PARA_ESCOLHER) return null;
  const dias = Array.isArray(bruto.dias) ? IDS_DIAS.filter((dia) => (bruto.dias as unknown[]).includes(dia)) : [];
  const periodos = (["manha", "tarde", "noite"] as Momento[]).filter((periodo) => Array.isArray(bruto.periodos) && (bruto.periodos as unknown[]).includes(periodo));
  return { formas: [...new Set(formas)], dias, periodos };
}

export function sanitizarAdiar(entrada: unknown) {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const clima = (["sim", "nao", "nao_sei"] as ClimaDoAdiar[]).find((valor) => valor === bruto.clima);
  if (!clima) return null;
  // Com "sim" ou "não sei" nada além da resposta fica guardado.
  if (clima !== "nao") return { clima, situacao: null, na_hora: null, depois: null };
  const situacao = textoCurto(bruto.situacao, MAXIMO_SITUACAO);
  const naHora = textoCurto(bruto.na_hora, MAXIMO_FRASE_ADIAR);
  const depois = textoCurto(bruto.depois, MAXIMO_FRASE_ADIAR);
  return { clima, situacao, na_hora: naHora, depois };
}

export function adiarCompleto(adiar: Adiar) {
  return adiar.clima === "nao" && Boolean(adiar.situacao && adiar.na_hora && adiar.depois);
}
