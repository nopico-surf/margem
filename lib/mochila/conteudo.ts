// Conteúdo da Mochila do Rolê: cenários, itens, frases e rótulos. Só dados, nenhum componente lê
// texto de outro lugar. Cenário novo é um objeto a mais em CENARIOS; item novo, um a mais em ITENS.
// Fonte: spec do jogo (29/10/2026) e telas do Claude Design. As frases são proposta e passam pela
// revisão clínica antes de publicar.

// Nível no card: 0 = aparece sempre, 1 = só com "Básico e cuidado íntimo", 2 = só com "Tudo o que eu
// levei". O padrão do card é sempre 0.
export type Nivel = 0 | 1 | 2;

export type Item = {
  id: string;
  // Nome completo: revelação e leitor de tela.
  nome: string;
  // Nome curto: prateleira, mochila e card. Igual ao completo quando cabe.
  curto: string;
  espacos: 1 | 2;
  tipo: "cuidado" | "role";
  // Menor número = primeiro a aparecer como "ficou de fora". null nunca aparece (rolê e nível 2).
  prioridade: number | null;
  nivel: Nivel;
  revelacao: string;
  fora: string | null;
};

export type CenarioId = "festa" | "show" | "bloco" | "virada";

export type Cenario = {
  id: CenarioId;
  nome: string;
  apoio: string;
  abertura: string;
  // "Alguém montou uma mochila {pra}..." e "Montei minha mochila {pra}."
  pra: string;
  itens: string[];
  combinados: string[];
  // Índices dos combinados de ponto de encontro ou de volta (eixo Volta x Presença).
  combinadosVolta: number[];
  // Janela do cenário sazonal (ISO, inclusive). Fora dela some da escolha; link de desafio continua.
  fim?: string;
  selo?: string;
};

const COMUNS: Item[] = [
  { id: "garrafa", nome: "Garrafa d'água", curto: "Garrafa d'água", espacos: 2, tipo: "cuidado", prioridade: 1, nivel: 0, revelacao: "O álcool desidrata. Água aos goles ao longo do rolê ajuda o corpo, sem precisar forçar muito de uma vez.", fora: "Faltou água. Dá pra comprar no caminho ou pedir onde você estiver." },
  { id: "telefone", nome: "Telefone de alguém anotado no papel", curto: "Telefone anotado", espacos: 1, tipo: "cuidado", prioridade: 2, nivel: 0, revelacao: "Se o celular morrer ou sumir, você ainda tem com quem contar.", fora: "Faltou o telefone de alguém. No fim da noite, ter com quem contar muda muita coisa." },
  { id: "dinheiro", nome: "Dinheiro da volta separado", curto: "Dinheiro da volta", espacos: 1, tipo: "cuidado", prioridade: 3, nivel: 0, revelacao: "Volta garantida é menos chance de pegar carona com quem bebeu.", fora: "Faltou o dinheiro da volta. Vale deixar separado antes de sair." },
  { id: "lanche", nome: "Lanche", curto: "Lanche", espacos: 1, tipo: "cuidado", prioridade: 4, nivel: 0, revelacao: "Comer antes e durante faz o álcool agir mais devagar.", fora: "Faltou comida. Comer antes de sair já ajuda bastante." },
  { id: "carregador", nome: "Carregador portátil", curto: "Carregador portátil", espacos: 2, tipo: "cuidado", prioridade: 5, nivel: 0, revelacao: "Celular com bateria é como você chama alguém, pede um carro ou acha seu grupo.", fora: "Faltou bateria. Sair com o celular carregado já é meio caminho." },
  { id: "documento", nome: "Documento", curto: "Documento", espacos: 1, tipo: "cuidado", prioridade: 8, nivel: 0, revelacao: "Ajuda na entrada e, se precisar, no atendimento num serviço de saúde.", fora: "Faltou documento. Uma foto no celular já quebra um galho." },
  { id: "camisinha", nome: "Camisinha", curto: "Camisinha", espacos: 1, tipo: "cuidado", prioridade: 7, nivel: 1, revelacao: "Decisões mudam ao longo da noite. Ter à mão é cuidado com você e com quem está junto. Na UBS é de graça.", fora: "Faltou camisinha. Qualquer UBS distribui de graça." },
  { id: "canudo", nome: "Canudo individual", curto: "Canudo individual", espacos: 1, tipo: "cuidado", prioridade: null, nivel: 2, revelacao: "Canudo é de uma pessoa só. Dividir pode passar hepatite C e outras infecções, mesmo sem sangue aparente.", fora: null },
  { id: "fone", nome: "Fone de ouvido", curto: "Fone de ouvido", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "A trilha sonora da ida e da volta.", fora: null },
  { id: "bala", nome: "Chiclete ou bala", curto: "Chiclete ou bala", espacos: 1, tipo: "cuidado", prioridade: 9, nivel: 0, revelacao: "Boca seca e mandíbula tensa acontecem, e passam longe de ser gostoso. Chiclete ou bala ajuda nas duas coisas.", fora: "Faltou chiclete. Boca seca é das coisas mais chatas da noite." },
  { id: "seda", nome: "Seda ou piteira própria", curto: "Seda", espacos: 1, tipo: "cuidado", prioridade: null, nivel: 2, revelacao: "Seda e piteira são de uma pessoa só. Dividir passa gripe, herpes e outras infecções de boca.", fora: null },
  { id: "soro", nome: "Soro fisiológico", curto: "Soro fisiológico", espacos: 1, tipo: "cuidado", prioridade: null, nivel: 2, revelacao: "Lavar o nariz com soro depois ajuda a mucosa a se recuperar. Também serve pra lavar o olho e limpar um machucado.", fora: null },
  { id: "labial", nome: "Protetor labial", curto: "Protetor labial", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "Lábio rachado estraga qualquer foto.", fora: null },
  { id: "lenco", nome: "Lenço umedecido", curto: "Lenço umedecido", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "Serve pra tudo: mão, rosto, aquela mancha na roupa.", fora: null },
];

const DOS_CENARIOS: Item[] = [
  { id: "remedio", nome: "Remédio de uso diário", curto: "Remédio de uso diário", espacos: 1, tipo: "cuidado", prioridade: 6, nivel: 1, revelacao: "Se você toma algum remédio todo dia, ele vai junto. Vale checar com quem receitou se dá pra misturar com álcool.", fora: "Se você toma remédio todo dia, lembra de levar." },
  { id: "caixa-de-som", nome: "Caixa de som", curto: "Caixa de som", espacos: 2, tipo: "role", prioridade: null, nivel: 0, revelacao: "A festa agradece.", fora: null },
  { id: "maquiagem", nome: "Maquiagem", curto: "Maquiagem", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "Pro retoque no banheiro, claro.", fora: null },
  { id: "protetor-auricular", nome: "Protetor auricular", curto: "Protetor auricular", espacos: 1, tipo: "cuidado", prioridade: 6, nivel: 0, revelacao: "Horas de som alto cansam o ouvido. Aquele zumbido no dia seguinte é o aviso.", fora: "Faltou protetor de ouvido. Seu ouvido agradece amanhã." },
  { id: "pochete", nome: "Pochete", curto: "Pochete", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "Mãos livres e suas coisas perto do corpo.", fora: null },
  { id: "leque", nome: "Leque", curto: "Leque", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "Calor e multidão juntos. E ainda dá pra dançar com ele.", fora: null },
  { id: "protetor-solar", nome: "Protetor solar", curto: "Protetor solar", espacos: 1, tipo: "cuidado", prioridade: 6, nivel: 0, revelacao: "Sol forte por horas, junto com álcool, cansa e desidrata ainda mais.", fora: "Faltou protetor solar. Sombra e água ajudam a compensar." },
  { id: "bone", nome: "Boné", curto: "Boné", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "Estilo e sombra no mesmo item.", fora: null },
  { id: "glitter", nome: "Glitter", curto: "Glitter", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "Bloco sem glitter nem conta.", fora: null },
  { id: "calcado", nome: "Calçado confortável de reserva", curto: "Calçado confortável de reserva", espacos: 1, tipo: "cuidado", prioridade: 6, nivel: 0, revelacao: "Horas em pé e chão de festa cansam. Um calçado confortável de reserva ajuda a voltar com calma.", fora: "Faltou um calçado confortável. Depois de horas em pé, ele faz diferença na volta." },
  { id: "casaquinho", nome: "Casaquinho", curto: "Casaquinho", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "A madrugada esfria. Um agasalho na mochila e você segue firme até o amanhecer.", fora: null },
  { id: "uvas", nome: "Uvas da virada", curto: "Uvas da virada", espacos: 1, tipo: "role", prioridade: null, nivel: 0, revelacao: "Cada uva é um desejo pro ano novo. Dá pra pedir saúde também.", fora: null },
];

export const ITENS: Record<string, Item> = Object.fromEntries([...COMUNS, ...DOS_CENARIOS].map((it) => [it.id, it]));

// Ordem fixa: o bitmask do link de desafio depende dela. Item novo entra sempre no fim.
export const ORDEM_ITENS: string[] = [...COMUNS, ...DOS_CENARIOS].map((it) => it.id);

const COMUNS_IDS = COMUNS.map((it) => it.id);
const COPO = "Não deixar o copo sozinho nem aceitar copo aberto de quem você não conhece.";

// Ordem fixa também: o índice do cenário vai no link.
export const CENARIOS: Cenario[] = [
  {
    id: "festa",
    nome: "Festa na casa de alguém",
    apoio: "A volta é de madrugada",
    abertura: "Sexta à noite, festa na casa de um amigo. A volta é de madrugada.",
    pra: "pra uma festa",
    itens: [...COMUNS_IDS, "remedio", "caixa-de-som", "maquiagem"],
    combinados: ["Combinar com quem você volta.", "Avisar alguém que horas pretende chegar.", "Saber o endereço exato da festa.", COPO],
    combinadosVolta: [0],
  },
  {
    id: "show",
    nome: "Show ou festival",
    apoio: "Muita gente e horas em pé",
    abertura: "Show grande, muita gente, horas em pé. O palco fica longe da saída.",
    pra: "pra um show",
    itens: [...COMUNS_IDS, "protetor-auricular", "pochete", "leque"],
    combinados: ["Combinar um ponto de encontro se o grupo se perder.", "Saber onde fica o posto médico.", "Combinar um horário de checar se tá todo mundo bem.", COPO],
    combinadosVolta: [0],
  },
  {
    id: "bloco",
    nome: "Bloco de rua",
    apoio: "Sol, rua cheia e volta sem hora",
    abertura: "Dia de sol, rua cheia, você vai a pé e não sabe que horas volta.",
    pra: "pra um bloco",
    itens: [...COMUNS_IDS, "protetor-solar", "bone", "glitter"],
    combinados: ["Combinar um ponto de encontro.", "Deixar o celular no bolso da frente.", "Saber onde tem banheiro e sombra no caminho."],
    combinadosVolta: [0],
  },
  {
    id: "virada",
    nome: "Virada de ano",
    apoio: "Meia-noite, multidão e volta difícil",
    abertura: "Virada de ano. Multidão na rua ou festa cheia, o sinal cai à meia-noite e a volta é difícil.",
    pra: "pra virar o ano",
    itens: [...COMUNS_IDS, "calcado", "casaquinho", "uvas"],
    combinados: [
      "Combinar um ponto de encontro, porque o sinal costuma cair na hora da virada.",
      "Combinar a volta antes da meia-noite, quando o transporte lota e encarece.",
      "Combinar de ficar de olho um no outro durante a festa.",
    ],
    combinadosVolta: [0, 1],
    fim: "2027-01-05",
    selo: "Só até 5 de jan",
  },
];

export const CAPACIDADE = 9;

export function cenarioPorId(id: string): Cenario | undefined {
  return CENARIOS.find((c) => c.id === id);
}

// Cenário sazonal fora da janela some da escolha. Data em horário de Brasília.
export function cenarioAtivo(c: Cenario, agora = new Date()): boolean {
  if (!c.fim) return true;
  return agora.getTime() <= new Date(`${c.fim}T23:59:59-03:00`).getTime();
}

export function spriteDe(id: string): string {
  return `/mochila/${id}.svg`;
}

export function spriteCenario(id: CenarioId): string {
  return `/mochila/cenario-${id}.svg`;
}

export const LINHAS_FIXAS = [
  "Misturar álcool com outras substâncias, inclusive remédios, aumenta os riscos.",
  "Se alguém não acorda, respira com dificuldade ou fica muito confuso, ligue 192, deite a pessoa de lado e fique junto.",
];

// Endereço que aparece no card e no rodapé. Provisório até o nome e a URL curta serem confirmados.
export const ENDERECO_CURTO = "somosmargem.com.br/mochila";
export const URL_DO_JOGO = "https://www.somosmargem.com.br/mochila";

// Tribo: só selo no card e no resultado. Não muda a prateleira nem os eixos.
export type Tribo = { id: string; nome: string; estilo: string; frase: string };

export const TRIBOS: Tribo[] = [
  { id: "pista", nome: "Da pista", estilo: "Eletrônica", frase: "Horas de som alto e pouca vontade de sentar." },
  { id: "baile", nome: "Do baile", estilo: "Funk", frase: "O grave que dá pra sentir no peito." },
  { id: "rima", nome: "Da rima", estilo: "Rap", frase: "Vai pela letra, presta atenção no que tá sendo dito." },
  { id: "paz", nome: "Paz e amor", estilo: "Reggae", frase: "Sem pressa, com todo mundo junto." },
  { id: "roda", nome: "Da roda", estilo: "Samba e pagode", frase: "Começa cedo, acaba tarde, todo mundo cantando junto." },
  { id: "mosh", nome: "Do mosh", estilo: "Rock", frase: "Sai de lá suado e feliz." },
  { id: "modao", nome: "Do modão", estilo: "Sertanejo", frase: "A música que todo mundo sabe de cor." },
  { id: "arrasta", nome: "Do arrasta-pé", estilo: "Forró", frase: "Dançar colado até o pé reclamar." },
  { id: "fluxo", nome: "Do fluxo", estilo: "De tudo um pouco", frase: "A playlist muda conforme a noite." },
];

export function triboPorId(id: string | null): Tribo | undefined {
  return TRIBOS.find((t) => t.id === id);
}

// Polos dos quatro eixos. Cada jeito soma bônus em até dois polos.
export type Polo = "corpo" | "festa" | "grupo" | "autonomia" | "volta" | "presenca" | "planejamento" | "leveza";

export type Jeito = { id: string; nome: string; bonus: Partial<Record<Polo, number>> };

export const JEITOS: Jeito[] = [
  { id: "olho", nome: "Fico de olho em todo mundo", bonus: { grupo: 3, corpo: 1 } },
  { id: "hora", nome: "Sei a hora de ir embora", bonus: { volta: 3, planejamento: 2 } },
  { id: "carro", nome: "Sou quem chama o carro", bonus: { volta: 2, grupo: 2 } },
  { id: "proxima", nome: "Sou quem puxa a próxima", bonus: { presenca: 3, festa: 2 } },
  { id: "lembrou", nome: "Sou quem leva o que ninguém lembrou", bonus: { grupo: 2, planejamento: 2 } },
  { id: "fluxo", nome: "Vou no fluxo, resolvo no caminho", bonus: { leveza: 3, presenca: 1 } },
];

export const QTD_JEITOS = 2;

export const NIVEIS:{ nivel: Nivel; nome: string; apoio: string }[] = [
  { nivel: 0, nome: "Só o básico", apoio: "Itens íntimos ficam fora da imagem." },
  { nivel: 1, nome: "Básico e cuidado íntimo", apoio: "Inclui camisinha e remédio." },
  { nivel: 2, nome: "Tudo o que eu levei", apoio: "Inclui canudo, seda e soro." },
];
