// Escala "Como está a sua vida" e meta da semana (componentes-parte1, C1). Textos de tela exatamente
// como vieram na especificação. Este arquivo não importa nada de runtime: serve à tela e ao servidor.

export type AreaId = "SONO" | "FAMILIA" | "AMIZADES" | "LAZER" | "TRABALHO" | "DINHEIRO" | "EMOCIONAL" | "SENTIDO";
export type Notas = Partial<Record<AreaId, number | null>>;
export type OrigemEscala = "modulo1" | "modulo7" | "painel";
export type Dia = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
export type Momento = "manha" | "tarde" | "noite";

// Ordem original das telas 2 a 9 e da lista do resultado.
export const AREAS: Array<{ id: AreaId; nome: string; dica: string }> = [
  { id: "SONO", nome: "Sono e saúde", dica: "Pense em como você tem dormido, comido e cuidado do corpo." },
  { id: "FAMILIA", nome: "Família", dica: "Pense nos momentos com a família que não giram em torno do problema." },
  { id: "AMIZADES", nome: "Amizades e vida social", dica: "Pense em quanto você tem visto e conversado com pessoas de quem gosta." },
  { id: "LAZER", nome: "Lazer", dica: "Pense no tempo para coisas que te dão prazer ou descanso." },
  { id: "TRABALHO", nome: "Trabalho ou estudo", dica: "Pense em como você tem se sentido no trabalho, no estudo ou na rotina da casa." },
  { id: "DINHEIRO", nome: "Dinheiro", dica: "Pense na sua tranquilidade com as contas e com o seu próprio dinheiro." },
  { id: "EMOCIONAL", nome: "Vida emocional", dica: "Pense em como você tem lidado com medo, tristeza, raiva e cansaço." },
  { id: "SENTIDO", nome: "Sentido, do seu jeito", dica: "Pense no que te dá paz, propósito ou fé, do jeito que fizer sentido para você." },
];
export const IDS_AREAS = AREAS.map((area) => area.id);

// Desempate da sugestão: as primeiras costumam ter metas mais fáceis de começar.
const ORDEM_EMPATE: AreaId[] = ["SONO", "EMOCIONAL", "LAZER", "AMIZADES", "FAMILIA", "SENTIDO", "DINHEIRO", "TRABALHO"];

// Só TRABALHO tem "Não se aplica agora" (aposentadoria, desemprego, cuidado da casa).
export const AREA_OPCIONAL: AreaId = "TRABALHO";

export const TEXTOS_ESCALA = {
  introTitulo: "Um tempo para olhar para você",
  introTituloModulo7: "Como está a sua vida agora",
  introTexto:
    "Quem cuida de alguém costuma deixar a própria vida para depois. Em uns 2 minutos, você dá uma nota para 8 áreas da sua vida e escolhe por onde começar a se cuidar. Não tem resposta certa, e só você vê as notas.",
  pergunta: "De 1 a 10, como está esta área da sua vida hoje?",
  legendaMin: "1 · muito difícil",
  legendaMax: "10 · muito bem",
  naoSeAplica: "Não se aplica agora",
  resultadoTitulo: "Como está a sua vida hoje",
  resultadoTexto: "Não dá para cuidar de tudo de uma vez, e nem precisa. A área com a nota mais baixa costuma ser um bom começo, mas quem escolhe é você.",
  resultadoTextoModulo7: "Algumas notas sobem, outras descem, e tudo bem. O que importa é ver onde você precisa de cuidado agora.",
  tudoAlto: "Que bom ver a sua vida com notas altas, mesmo com tudo o que está acontecendo. Escolha uma área para manter esse cuidado nesta semana.",
  muitoBaixo: "Você deu uma nota bem baixa para {{area_nome}}. Carregar isso sem ajuda pesa muito. Uma conversa com um profissional, só para você, pode ajudar.",
  outraArea: "Ou toque em outra área para começar por ela.",
};

export const TEXTOS_META = {
  titulo: "Sua meta para esta semana",
  campoAcaoRotulo: "O que você vai fazer",
  campoAcaoDica: "Toque num exemplo ou escreva do seu jeito.",
  campoQuandoRotulo: "Em quais dias da semana",
  momentoRotulo: "Em que momento do dia?",
  confiancaPergunta: "De 0 a 10, quanta certeza você tem de que consegue cumprir isso nesta semana?",
  confiancaBaixa:
    "Que tal deixar um pouco mais fácil? Uma meta que você tem certeza de que cumpre é o melhor começo. Dá para:",
  confiancaBaixaOpcoes: [
    "fazer menos vezes (2 dias em vez de 4);",
    "fazer por menos tempo (10 minutos em vez de 30);",
    "começar por um passo antes (separar o tênis, em vez de já caminhar).",
  ],
  obstaculoRotulo: "O que pode atrapalhar? E o que você faz se acontecer?",
  obstaculoDica: "Exemplo: Se o dia ficar corrido, então eu faço só 5 minutos antes de dormir.",
  porQueTitulo: "Por que \"caminhar 15 minutos na terça e na quinta\" funciona, e \"me cuidar mais\" não?",
  porQueTexto: [
    "Porque no fim da semana você consegue responder com um sim ou um não: fiz ou não fiz. A meta já diz o que, quanto e quando fazer, então você não precisa decidir de novo todo dia. E cada vez que você cumpre, conta como uma conquista.",
    "\"Me cuidar mais\" não tem fim: sempre dá para achar que foi pouco, e isso cansa.",
  ],
  conferencia: [
    "No fim da semana, dá para responder se você fez ou não?",
    "Cabe na sua semana de verdade, mesmo num dia puxado?",
    "Depende só de você, e não de {{apelido}}?",
  ],
  conferenciaAjuste: "Quer ajustar? Uma meta menor e mais clara costuma funcionar melhor.",
  salva: "Meta salva. Ela fica no seu painel. A cada dia que você cumprir, toque no dia para marcar.",
  feitoRetorno: "Boa. Isso é você se cuidando.",
};

export const MAXIMO_ACAO = 120;
export const MAXIMO_OBSTACULO = 280;
export const CONFIANCA_MINIMA = 7;

export const DIAS: Array<{ id: Dia; rotulo: string }> = [
  { id: "seg", rotulo: "seg" },
  { id: "ter", rotulo: "ter" },
  { id: "qua", rotulo: "qua" },
  { id: "qui", rotulo: "qui" },
  { id: "sex", rotulo: "sex" },
  { id: "sab", rotulo: "sáb" },
  { id: "dom", rotulo: "dom" },
];
export const IDS_DIAS = DIAS.map((dia) => dia.id);

export const MOMENTOS: Array<{ id: Momento; rotulo: string }> = [
  { id: "manha", rotulo: "manhã" },
  { id: "tarde", rotulo: "tarde" },
  { id: "noite", rotulo: "noite" },
];

const EXEMPLOS: Record<AreaId, string[]> = {
  SONO: ["Beber um copo de água ao acordar, em 3 dias", "Deitar 30 minutos mais cedo, em 2 noites", "Fazer uma refeição sem celular, em 3 dias", "Caminhar 15 minutos, em 2 dias"],
  FAMILIA: [
    "Mandar uma mensagem carinhosa para um parente, 1 vez",
    "Conversar 10 minutos sobre um assunto leve com alguém da casa, em 2 dias",
    "Fazer uma refeição em família sem falar do problema, 1 vez",
    "Ver um filme com alguém da família no fim de semana",
  ],
  AMIZADES: ["Mandar um \"oi, sumi\" para alguém de quem sinto falta, 1 vez", "Ligar 10 minutos para uma pessoa amiga, 1 vez", "Tomar um café com alguém, 1 vez", "Marcar um encontro no fim de semana"],
  LAZER: ["Ouvir 3 músicas de que eu gosto, 1 dia", "Ver um episódio de uma série só por prazer, 1 vez", "Ler 5 páginas de um livro, em 2 dias", "Reservar 1 hora no fim de semana para algo de que eu gosto"],
  TRABALHO: [
    "Fazer uma pausa de 5 minutos para respirar no trabalho, em 2 dias",
    "Organizar meu espaço no começo de 1 dia",
    "Parar de trabalhar no horário, em 2 dias",
    "Listar as 3 prioridades da semana na segunda",
  ],
  DINHEIRO: ["Anotar o que eu gastei em 1 dia", "Conferir meu saldo antes de uma compra, 1 vez", "Listar as contas essenciais do mês, 1 vez", "Separar um valor pequeno só meu, 1 vez"],
  EMOCIONAL: [
    "Fazer 3 respirações lentas quando a ansiedade subir, em 2 dias",
    "Escrever 3 coisas boas do dia, 1 vez",
    "Ficar 10 minutos em silêncio, só para mim, em 2 dias",
    "Contar para alguém de confiança como eu estou, 1 vez",
  ],
  SENTIDO: [
    "Olhar o céu ou uma planta por 5 minutos, em 2 dias",
    "Um momento de reflexão ou oração ao acordar, em 3 dias",
    "Escrever uma frase que me faz bem, 1 vez",
    "15 minutos de leitura ou silêncio no fim de semana",
  ],
};
const EXEMPLO_APOSTAS_DINHEIRO = "Separar o meu dinheiro do dinheiro de {{apelido}}, 1 vez";

// Exemplos com {{apelido}} ainda por aplicar (a tela aplica).
export function exemplosDaArea(area: AreaId, problemas: string[]) {
  const exemplos = EXEMPLOS[area];
  return area === "DINHEIRO" && problemas.includes("apostas") ? [...exemplos, EXEMPLO_APOSTAS_DINHEIRO] : exemplos;
}

export function nomeDaArea(area: AreaId) {
  return AREAS.find((item) => item.id === area)?.nome ?? area;
}

// Menor nota; empate pela ORDEM_EMPATE. Áreas sem nota ("Não se aplica agora") ficam de fora.
export function areaSugerida(notas: Notas): AreaId | null {
  let escolhida: AreaId | null = null;
  for (const area of ORDEM_EMPATE) {
    const nota = notas[area];
    if (typeof nota !== "number") continue;
    if (escolhida === null || nota < (notas[escolhida] as number)) escolhida = area;
  }
  return escolhida;
}

export function tudoAlto(notas: Notas) {
  const valores = Object.values(notas).filter((nota): nota is number => typeof nota === "number");
  return valores.length > 0 && valores.every((nota) => nota >= 8);
}

// EMOCIONAL ou SONO com nota 1 ou 2. EMOCIONAL vem primeiro quando as duas batem.
export function areaMuitoBaixa(notas: Notas): AreaId | null {
  return (["EMOCIONAL", "SONO"] as AreaId[]).find((area) => typeof notas[area] === "number" && (notas[area] as number) <= 2) ?? null;
}

// Datas locais no formato AAAA-MM-DD (o dia da pessoa, não o do servidor).
export function dataLocal(data = new Date()) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

// "2026-11-10" ou ISO completo -> "10/11" (o "Concluído em DD/MM" do programa).
export function diaMes(valor: string) {
  const data = valor.length === 10 ? valor : dataLocal(new Date(valor));
  return `${data.slice(8, 10)}/${data.slice(5, 7)}`;
}

// "2 de 3 dias concluídos" e, se fez em dia que não estava planejado, ", 1 a mais".
export function resumoDosDias(dias: Dia[], diasFeitos: string[], semanaInicio: string) {
  const planejadas = dias.map((dia) => dataDoDia(semanaInicio, dia));
  const feitosNoPlano = diasFeitos.filter((data) => planejadas.includes(data)).length;
  const aMais = diasFeitos.length - feitosNoPlano;
  const base = `${feitosNoPlano} de ${planejadas.length} ${planejadas.length === 1 ? "dia concluído" : "dias concluídos"}`;
  return aMais > 0 ? `${base}, ${aMais} a mais` : base;
}

// Dia da meta que dá pra marcar (briefing 00, item 6): hoje e os dias que já passaram na semana da
// meta. Dia futuro não marca ("Esse dia ainda não chegou."). `hoje` vem do aparelho.
export function diaMarcavel(data: string, semanaInicio: string, hoje: string) {
  return segundaDaSemana(data) === semanaInicio && data <= hoje;
}

// Toque num dia da meta: marca ou desmarca. Fora da semana da meta ou num dia futuro, devolve null.
// Dia futuro já salvo (marcado quando a regra deixava, em 10/11/2026) sai da lista no próximo toque.
export function alternarDiaFeito(meta: { semana_inicio: string; dias_feitos: string[] }, data: string, hoje: string) {
  if (!diaMarcavel(data, meta.semana_inicio, hoje)) return null;
  const feitos = meta.dias_feitos.filter((feito) => feito <= hoje);
  return feitos.includes(data) ? feitos.filter((feito) => feito !== data) : [...feitos, data].sort();
}

export function dataValida(valor: unknown): valor is string {
  return typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(`${valor}T12:00:00Z`));
}

// seg..dom de uma data AAAA-MM-DD.
export function diaDaSemana(data: string): Dia {
  const indice = new Date(`${data}T12:00:00Z`).getUTCDay();
  return (["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as Dia[])[indice];
}

// Segunda-feira da semana de uma data AAAA-MM-DD.
export function segundaDaSemana(data: string) {
  const dia = new Date(`${data}T12:00:00Z`);
  const recuo = (dia.getUTCDay() + 6) % 7;
  dia.setUTCDate(dia.getUTCDate() - recuo);
  return dia.toISOString().slice(0, 10);
}

// Data AAAA-MM-DD de um dia (seg..dom) na semana que começa em `segunda`.
export function dataDoDia(segunda: string, dia: Dia) {
  const data = new Date(`${segunda}T12:00:00Z`);
  data.setUTCDate(data.getUTCDate() + IDS_DIAS.indexOf(dia));
  return data.toISOString().slice(0, 10);
}

export function sanitizarNotas(entrada: unknown): Notas | null {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const notas: Notas = {};
  for (const area of IDS_AREAS) {
    const nota = bruto[area];
    if (nota === null && area === AREA_OPCIONAL) notas[area] = null;
    else if (Number.isInteger(nota) && (nota as number) >= 1 && (nota as number) <= 10) notas[area] = nota as number;
    else return null;
  }
  return notas;
}

export type MetaEntrada = {
  area: AreaId;
  texto: string;
  dias: Dia[];
  momento: Momento | null;
  confianca: number | null;
  obstaculo_plano: string | null;
};

export function sanitizarMeta(entrada: unknown): MetaEntrada | null {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const area = IDS_AREAS.find((id) => id === bruto.area);
  const texto = typeof bruto.texto === "string" ? bruto.texto.trim().slice(0, MAXIMO_ACAO) : "";
  const dias = Array.isArray(bruto.dias) ? IDS_DIAS.filter((dia) => (bruto.dias as unknown[]).includes(dia)) : [];
  if (!area || !texto || dias.length === 0) return null;
  const momento = MOMENTOS.find((item) => item.id === bruto.momento)?.id ?? null;
  const confianca = Number.isInteger(bruto.confianca) && (bruto.confianca as number) >= 0 && (bruto.confianca as number) <= 10 ? (bruto.confianca as number) : null;
  const obstaculo = typeof bruto.obstaculo_plano === "string" && bruto.obstaculo_plano.trim() ? bruto.obstaculo_plano.trim().slice(0, MAXIMO_OBSTACULO) : null;
  return { area, texto, dias, momento, confianca, obstaculo_plano: obstaculo };
}

export type Meta = MetaEntrada & {
  id: string;
  semana_inicio: string;
  status: "ativa" | "concluida" | "parcial" | "nao_deu";
  dias_feitos: string[];
};

export type Escala = { id: string; origem: OrigemEscala; notas: Notas; criado_em: string };
