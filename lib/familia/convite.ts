// Módulo 5 (briefing M5, C6): preparar o convite em 5 passos e contar como foi. Os textos vêm do
// briefing. Este arquivo não importa nada de runtime. A frase escrita pela pessoa nunca vai pra IA nem
// pro Mixpanel.

export const PASSOS_DO_CONVITE = 5;
export const MAXIMO_SALVOS = 2;
export const MAXIMO_FRASE_CONVITE = 280;
// Plano B "focar nas suas metas": a data padrão pra pensar de novo.
export const SEMANAS_PADRAO_RETORNO = 4;

export const CENARIO_DO_CONVITE = "convite-para-ajuda";

// "Se não houver horário rápido" (módulo 5): serviços que podem ser salvos no lugar do profissional.
export const SERVICOS_DO_CONVITE: Array<{ id: string; nome: string; descricao: string; href: string }> = [
  {
    id: "servico:caps_ad",
    nome: "CAPS AD da sua cidade",
    descricao: "Atendimento gratuito pelo SUS para quem tem problema com álcool e outras drogas. Em muitos lugares, dá para ir direto, sem encaminhamento.",
    href: "https://www.google.com/maps/search/?api=1&query=CAPS+AD",
  },
  {
    id: "servico:ubs",
    nome: "Unidade Básica de Saúde (UBS)",
    descricao: "O primeiro atendimento pelo SUS, que pode encaminhar para outros serviços.",
    href: "https://www.google.com/maps/search/?api=1&query=UBS",
  },
  {
    id: "servico:meu_sus",
    nome: "Meu SUS Digital",
    descricao: "Atendimento on-line gratuito em saúde mental para quem tem problema com apostas, e também para familiares.",
    href: "https://meususdigital.saude.gov.br/",
  },
];

export const PARTE_ABRIR = [
  "Eu gosto muito de você.",
  "Eu gosto de quando a gente conversa assim.",
  "Eu sei que as coisas não andam fáceis.",
  "Eu tenho feito um programa para lidar melhor com tudo isso.",
];
// Em caution_mode esta opção não aparece (item 17).
export const ABRIR_COM_PROGRAMA = PARTE_ABRIR[3];

export const PARTE_SENTIR = ["E eu fico com medo de te ver assim.", "E isso tem pesado pra mim também.", "E eu sinto falta de te ver bem.", "E eu queria muito te ver mais leve."];

// O banco não guarda o gênero do profissional: "uma psicóloga" vira "alguém" (o que o briefing manda
// quando não há profissional salvo).
export const PARTE_OFERECER = [
  "Topa conversar uma vez com um psicólogo, só pra ver como é?",
  "Achei alguém que atende nesta semana. Quer que eu marque?",
  "Quem escolhe o profissional e o que conversar é você. Posso ver um horário?",
  "Se quiser, eu vou junto até lá.",
];

export const SINAIS_BOA_HORA = [
  "pergunta o que você anda fazendo de diferente",
  "mostra arrependimento depois de um episódio",
  "está de bom humor, sem pressa",
  "desabafa sobre algo que está pesando",
  "reconhece que as coisas estão difíceis",
  "puxa conversa com calma",
];

export const SINAIS_ESPERAR = ["{{apelido}} está sob efeito ou acabou de usar", "vocês estão no meio de uma discussão", "há irritação ou muito cansaço", "tem muita gente por perto"];

export type PlanoB = "convidar_de_novo" | "focar_metas";
export type ResultadoConvite = "sim" | "pensar" | "nao";

export const PLANOS_B: Array<{ id: PlanoB; titulo: string; texto: string }> = [
  { id: "convidar_de_novo", titulo: "Convidar de novo depois", texto: "Você espera a próxima janela, revê a frase e ensaia de novo." },
  { id: "focar_metas", titulo: "Focar nas suas metas por um tempo", texto: "Você dá um tempo no assunto e escolhe uma data para pensar de novo." },
];

// Passo 5 e "Contar como foi": o que fazer e a frase pronta de cada resposta.
export const RESPOSTAS_DO_CONVITE: Array<{ id: ResultadoConvite; titulo: string; opcao: string; texto: string; frase: string | null }> = [
  {
    id: "sim",
    titulo: "Sim",
    opcao: "Aceitou",
    texto: "Aja no mesmo dia, enquanto a vontade está viva. Mande a mensagem para o profissional salvo e combine o horário com {{apelido}}.",
    frase: null,
  },
  {
    id: "pensar",
    titulo: "\"Vou pensar\"",
    opcao: "Disse que vai pensar",
    texto: "Respeitar o tempo da pessoa tira a pressão. Deixe a porta aberta, sem cobrar.",
    frase: "Tudo bem, pensa com calma. Tô aqui se quiser ajuda.",
  },
  {
    id: "nao",
    titulo: "Não",
    opcao: "Disse não",
    texto: "Um não hoje não é um não para sempre. Agradeça por ter ouvido e não insista agora.",
    frase: "Tudo bem. Valeu por me ouvir. A gente fala disso outra hora.",
  },
];

// Opções do "Contar como foi" no painel (o módulo mostra só as três primeiras).
export const OPCOES_DO_PAINEL: Array<{ id: ResultadoConvite | "ainda_nao"; rotulo: string }> = [
  { id: "sim", rotulo: "Sim" },
  { id: "pensar", rotulo: "Vou pensar" },
  { id: "nao", rotulo: "Não" },
  { id: "ainda_nao", rotulo: "Ainda não convidei" },
];

// Versão do módulo 8 que o resultado escolhe. "Vou pensar" não aponta pra nenhuma: o seletor continua.
export const VERSAO_DO_MODULO8: Partial<Record<ResultadoConvite, string>> = { sim: "aceitou", nao: "recusou" };

export const TEXTOS_CONVITE = {
  titulo: "Preparar o convite",
  intro: "Convidar fica mais leve quando você já chega com tudo pronto. Vamos montar isso juntos, passo a passo, no seu tempo.",
  passo: (n: number) => `Passo ${n} de ${PASSOS_DO_CONVITE}`,
  continuar: "Continuar",

  passo1Titulo: "Deixe a ajuda pronta antes de convidar",
  passo1Texto: "Quando {{apelido}} diz 'tá bom, eu vou', essa vontade pode durar pouco. Por isso, escolha agora um profissional e veja um horário possível nos próximos dias.",
  salvarProfissional: "Deixar salvo para o convite",
  salvoProfissional: "Salvo para o convite",
  passo1Apoio: "{{apelido}} também pode escolher outro profissional depois. O importante é ter uma opção pronta.",
  semHorarioTitulo: "Se não houver horário rápido",
  semHorarioTexto: "Se nenhum profissional parceiro tiver horário em até 3 dias, existem outras portas:",
  servicosPerto: "Ver serviços perto de mim",

  passo2Titulo: "A hora certa",
  boaHora: "Pode ser uma boa hora quando {{apelido}}:",
  esperar: "Melhor esperar quando:",
  janelaDoDiario: "Se o diário mostrou um dia ou horário mais calmo, ele pode ser uma boa janela: {{momento}}.",
  entendi: "Entendi",

  passo3Titulo: "A sua frase de convite",
  passo3Texto: "Escolha uma opção de cada parte. A frase vai se formando embaixo, e você pode editar do seu jeito.",
  parteAbrir: "Parte 1, para abrir",
  parteSentir: "Parte 2, o que você sente",
  parteOferecer: "Parte 3, a oferta",
  respiracao: "Tente que caiba numa respiração.",
  salvarFrase: "Salvar minha frase",

  passo4Titulo: "Ensaie antes",
  passo4Texto: "Falar em voz alta uma vez muda muito. No treino, {{apelido}} pode aceitar, pedir um tempo ou dizer não, e você pratica as três.",
  treinar: "Treinar o convite",
  pular: "Pular por agora",

  passo5Titulo: "E se a resposta for...",
  agendarCom: "Agendar com {{profissional}}",
  planoBPergunta: "Se a resposta for não, qual vai ser o seu plano?",
  salvarPlano: "Salvar meu plano",

  verEditar: "Ver e editar meu convite",

  contarTitulo: "Contar como foi o convite",
  contarInstrucao: "Quando você fizer o convite, conte aqui qual foi a resposta de {{apelido}}. Isso define os próximos passos do programa.",
  contarBotao: "Contar como foi o convite",

  painelTitulo: "Meu convite",
  painelContar: "Aconteceu? Contar como foi",
};

// O que cada ferramenta conclui no programa (a primeira vez vale).
export const ITEM_PREPARAR_M5 = { modulo: 5, item: "preparar" };
export const ITEM_CONTAR_M5 = { modulo: 5, item: "contar" };

export type Convite = {
  passo: number;
  profissionais_salvos: string[];
  frase: string | null;
  plano_b: PlanoB | null;
  data_retorno: string | null;
  resultado: ResultadoConvite | null;
  data_resultado: string | null;
};

export const CONVITE_VAZIO: Convite = { passo: 0, profissionais_salvos: [], frase: null, plano_b: null, data_retorno: null, resultado: null, data_resultado: null };

// Psicólogo parceiro na lista do passo 1 (só o que a tela usa).
export type ProfissionalDoConvite = { id: string; nome: string; abordagem: string | null; foto_url: string | null; whatsapp_link: string | null };

// O primeiro salvo vira o "Agendar com {{profissional_salvo}}": o WhatsApp do profissional, com a mesma
// mensagem do card, ou o link do serviço salvo no lugar. Sem nada salvo (ou sem WhatsApp), não há botão.
export function alvoDoAgendar(salvos: string[], profissionais: ProfissionalDoConvite[]) {
  for (const id of salvos) {
    const servico = SERVICOS_DO_CONVITE.find((opcao) => opcao.id === id);
    if (servico) return { id, nome: servico.nome, href: servico.href, profissional: false };
    const profissional = profissionais.find((opcao) => opcao.id === id);
    const digitos = profissional?.whatsapp_link?.replace(/\D/g, "");
    if (profissional && digitos) {
      const texto = encodeURIComponent(`Olá! Achei o(a) ${profissional.nome} na Margem e gostaria de agendar uma sessão`);
      return { id, nome: profissional.nome, href: `https://wa.me/${digitos}?text=${texto}`, profissional: true };
    }
  }
  return null;
}

export function nomeDoSalvo(id: string, profissionais: ProfissionalDoConvite[]) {
  return SERVICOS_DO_CONVITE.find((opcao) => opcao.id === id)?.nome ?? profissionais.find((opcao) => opcao.id === id)?.nome ?? null;
}

// ===== Sanitização (rota e modo dev) =====

const ID_SALVO = /^([0-9a-f-]{36}|servico:(caps_ad|ubs|meu_sus))$/;

function dataISO(valor: unknown) {
  return typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor) ? valor : null;
}

// Grava o passo da tela (POST { tipo: "passo" }). Cada passo traz só o que ele salva; o resto do
// convite fica como estava. O passo guardado nunca volta atrás.
export function aplicarPasso(atual: Convite, entrada: unknown): Convite | null {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const passo = typeof bruto.passo === "number" && Number.isInteger(bruto.passo) && bruto.passo >= 1 && bruto.passo <= PASSOS_DO_CONVITE ? bruto.passo : null;
  if (!passo) return null;
  const novo: Convite = { ...atual, passo: Math.max(atual.passo, passo) };
  if (passo === 1) {
    const salvos = Array.isArray(bruto.profissionais_salvos) ? bruto.profissionais_salvos.filter((id): id is string => typeof id === "string" && ID_SALVO.test(id)) : [];
    novo.profissionais_salvos = [...new Set(salvos)].slice(0, MAXIMO_SALVOS);
  }
  if (passo === 3) {
    const frase = typeof bruto.frase === "string" ? bruto.frase.trim().slice(0, MAXIMO_FRASE_CONVITE) : "";
    if (!frase) return null;
    novo.frase = frase;
  }
  if (passo === 5) {
    const plano = PLANOS_B.find((opcao) => opcao.id === bruto.plano_b)?.id;
    if (!plano) return null;
    novo.plano_b = plano;
    novo.data_retorno = plano === "focar_metas" ? dataISO(bruto.data_retorno) : null;
    if (plano === "focar_metas" && !novo.data_retorno) return null;
  }
  return novo;
}

export function sanitizarResultado(valor: unknown): ResultadoConvite | null {
  return RESPOSTAS_DO_CONVITE.find((resposta) => resposta.id === valor)?.id ?? null;
}
