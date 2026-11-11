// Diário do programa para familiares (briefing M2, 10/11/2026): momento difícil e momento bom, com
// chips de múltipla escolha. Tudo é opcional e leva até 1 minuto. Este arquivo não importa nada de
// runtime. Texto livre do familiar nunca vai pra IA nem pro Mixpanel.

export type TipoAnotacao = "dificil" | "bom";

export type Anotacao = {
  id: string;
  tipo: TipoAnotacao;
  quando: string;
  antes: string[];
  percebeu: string[];
  buscou: string[];
  reagiu: string[];
  depois: string[];
  bom_o_que: string[];
  bom_sentiu: string[];
  // O que a pessoa escreveu no "Outro" de cada pergunta (briefing 00d). A lista guarda só "Outro".
  antes_outro: string | null;
  percebeu_outro: string | null;
  buscou_outro: string | null;
  reagiu_outro: string | null;
  depois_outro: string | null;
  bom_o_que_outro: string | null;
  bom_sentiu_outro: string | null;
  texto_livre: string | null;
};

export type CampoLista = "antes" | "percebeu" | "buscou" | "reagiu" | "depois" | "bom_o_que" | "bom_sentiu";

export const CAMPOS_DO_TIPO: Record<TipoAnotacao, CampoLista[]> = {
  dificil: ["antes", "percebeu", "buscou", "reagiu", "depois"],
  bom: ["bom_o_que", "bom_sentiu"],
};

export const CAMPOS_LISTA: CampoLista[] = ["antes", "percebeu", "buscou", "reagiu", "depois", "bom_o_que", "bom_sentiu"];

export type CampoOutro = `${CampoLista}_outro`;
export const campoOutro = (campo: CampoLista): CampoOutro => `${campo}_outro`;

export const TAMANHO_MAXIMO_CAMPO = 280;
export const TAMANHO_MAXIMO_OUTRO = 60;
const MAXIMO_ESCOLHAS = 12;

export const OUTRO = "Outro";
export const SAI_PARA_SE_PROTEGER = "Saí de perto para me proteger";

// Meta de anotações difíceis pra concluir o item do módulo 2.
export const ANOTACOES_PARA_CONCLUIR = 3;
export const DIAS_DO_RESUMO = 7;

export const TEXTOS_DIARIO = {
  introTexto: "Anotar ajuda a enxergar o padrão: quando acontece, o que vem antes e o que vem depois. Leva 1 minuto. Não é para vigiar {{apelido}}, é para você entender o que dá para mudar.",
  introBotao: "Fazer minha primeira anotação",
  tipoPergunta: "O que você quer anotar sobre {{apelido}}?",
  tipoDificil: "Um momento difícil",
  tipoBom: "Um momento bom",
  tipoApoio: "Os momentos bons valem tanto quanto os difíceis.",
  pular: "Pular",
  continuar: "Continuar",
  quandoPergunta: "Quando foi esse momento?",
  livrePergunta: "Quer acrescentar algo?",
  livreDica: "Uma frase basta. Só você vê.",
  salvarDificil: "Salvar anotação",
  salvarBom: "Salvar momento bom",
  salvoDificil: "Anotado. Cada anotação ajuda a ver quando os momentos difíceis com {{apelido}} costumam acontecer.",
  salvoBom: "Guardado. No módulo 4, você vai aprender a valorizar momentos assim.",
  segurancaTexto: "Você contou que precisou sair de perto para se proteger. A sua segurança vem primeiro.",
  segurancaBotao: "Ver meu plano de segurança",
};

export type PerguntaDoDiario = {
  campo: CampoLista;
  pergunta: string;
  ajuda?: string;
  opcoes: string[];
  // Opções extras só pra quem marcou aquele problema (Q3 do diagnóstico).
  extras?: Record<string, string[]>;
  // Opções que só valem pra um problema.
  apenasPara?: Record<string, string>;
};

export const PERGUNTAS_DIFICIL: PerguntaDoDiario[] = [
  {
    campo: "antes",
    pergunta: "O que aconteceu logo antes desse momento difícil?",
    opcoes: [
      "Estresse ou cansaço",
      "Discussão ou clima pesado em casa",
      "Notícia ruim ou preocupação",
      "Tédio ou tempo livre",
      "Encontro, festa ou comemoração",
      "Dinheiro recebido",
      "Dia ou horário em que costuma acontecer",
      "Não sei",
    ],
    extras: {
      alcool: ["Fim do expediente", "Fim de semana ou véspera de feriado", "Jogo de futebol ou encontro com quem bebe"],
      outras_drogas: ["Muito tempo no quarto, longe de todo mundo", "Mensagem ou ligação de alguém específico", "Saída à noite com certas companhias"],
      apostas: ["Celular na mão sem nada para fazer", "Vontade de recuperar uma perda", "Notificação ou propaganda de aposta"],
    },
  },
  {
    campo: "percebeu",
    pergunta: "O que você percebeu em {{apelido}}?",
    ajuda: "Só o que você viu. Não precisa confirmar nada.",
    opcoes: [
      "Fala ou tom de voz diferente",
      "Humor mudou de repente",
      "Irritação ou agitação",
      "Muito silêncio ou isolamento",
      "Sono ou cansaço fora do normal",
      "Desequilíbrio ou desatenção",
      "Celular o tempo todo",
      "Cheiro de bebida",
    ],
    apenasPara: { "Cheiro de bebida": "alcool" },
  },
  {
    campo: "buscou",
    pergunta: "O que você acha que {{apelido}} buscou com isso?",
    ajuda: "É um palpite seu. Ajuda a pensar no que poderia trazer isso de outro jeito.",
    opcoes: ["Relaxar", "Se divertir", "Se enturmar", "Fugir de um problema", "Sentir emoção", "Conseguir dormir", "Não sei"],
  },
  {
    campo: "reagiu",
    pergunta: "E você, como reagiu nesse momento?",
    ajuda: "Sem julgamento. Toda reação faz sentido na hora.",
    opcoes: [
      "Briguei ou discuti",
      "Tentei convencer a parar",
      "Fiquei em silêncio",
      "Fingi que não vi",
      "Resolvi por {{apelido}}",
      "Conversei com calma",
      SAI_PARA_SE_PROTEGER,
    ],
  },
  {
    campo: "depois",
    pergunta: "Como ficaram as coisas em casa depois?",
    opcoes: [
      "Clima pesado em casa",
      "{{apelido}} foi dormir ou se fechou",
      "Pediu desculpas ou mostrou arrependimento",
      "Ninguém tocou no assunto",
      "Conversamos com calma depois",
      "Eu fiquei com raiva, medo ou sem energia",
    ],
  },
];

export const PERGUNTAS_BOM: PerguntaDoDiario[] = [
  {
    campo: "bom_o_que",
    pergunta: "O que aconteceu de bom com {{apelido}}?",
    opcoes: [
      "Conversamos sobre algo leve",
      "Comemos juntos sem pressa",
      "Saímos de casa juntos",
      "Vimos algo juntos",
      "Rimos juntos",
      "{{apelido}} ajudou em casa",
      "{{apelido}} cumpriu um combinado",
      "Um momento de paz, sem nada demais",
    ],
  },
  {
    campo: "bom_sentiu",
    pergunta: "Como você se sentiu nesse momento?",
    opcoes: ["Alívio", "Esperança", "Alegria", "Calma", "Saudade de dias assim"],
  },
];

// Opções de uma pergunta pra quem marcou aqueles problemas: as gerais, as extras e as de um problema só.
export function opcoesDaPergunta(pergunta: PerguntaDoDiario, problemas: string[]) {
  const gerais = pergunta.opcoes.filter((opcao) => {
    const exigido = pergunta.apenasPara?.[opcao];
    return !exigido || problemas.includes(exigido);
  });
  const extras = problemas.flatMap((problema) => pergunta.extras?.[problema] ?? []);
  // "Não sei" é sempre a última das gerais; as extras entram logo antes dele.
  const ultima = gerais[gerais.length - 1] === "Não sei" ? gerais.pop() : null;
  return [...gerais, ...extras, ...(ultima ? [ultima] : [])];
}

// Atalhos de "Quando foi esse momento?".
export const ATALHOS_QUANDO = ["Agora", "Hoje mais cedo", "Ontem à noite", "Escolher dia e hora"] as const;
export type AtalhoQuando = (typeof ATALHOS_QUANDO)[number];

export function dataDoAtalho(atalho: Exclude<AtalhoQuando, "Escolher dia e hora">, agora = new Date()) {
  const data = new Date(agora);
  if (atalho === "Hoje mais cedo") data.setHours(Math.max(0, agora.getHours() - 3));
  if (atalho === "Ontem à noite") {
    data.setDate(agora.getDate() - 1);
    data.setHours(21, 0, 0, 0);
  }
  return data;
}

// Valor de <input type="datetime-local"> (hora do aparelho) e o caminho de volta.
export function paraCampoDataHora(data: Date) {
  const dois = (n: number) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}T${dois(data.getHours())}:${dois(data.getMinutes())}`;
}

// Os itens do programa que a anotação conclui (a primeira vez vale, e apagar não desmarca).
export const ITEM_ANOTAR_M1 = { modulo: 1, item: "observe" };
export const ITEM_ANOTAR_M2 = { modulo: 2, item: "anotar" };
export const ITEM_BONS_M2 = { modulo: 2, item: "momentos_bons" };
export const ITEM_RESUMO_M2 = { modulo: 2, item: "resumo" };

export function dentroDosUltimosDias(quando: string, agora = new Date(), dias = DIAS_DO_RESUMO) {
  const tempo = Date.parse(quando);
  return !Number.isNaN(tempo) && tempo >= agora.getTime() - dias * 86400000 && tempo <= agora.getTime() + 86400000;
}

export function contagens(anotacoes: Array<Pick<Anotacao, "tipo" | "quando">>, agora = new Date()) {
  const recentes = anotacoes.filter((anotacao) => dentroDosUltimosDias(anotacao.quando, agora));
  return { dificeis: recentes.filter((a) => a.tipo === "dificil").length, bons: recentes.filter((a) => a.tipo === "bom").length };
}

export function itensParaMarcar(anotacoes: Array<Pick<Anotacao, "tipo" | "quando">>, agora = new Date()) {
  const { dificeis, bons } = contagens(anotacoes, agora);
  return [
    ...(dificeis >= 1 ? [ITEM_ANOTAR_M1] : []),
    ...(dificeis >= ANOTACOES_PARA_CONCLUIR ? [ITEM_ANOTAR_M2] : []),
    ...(bons >= 1 ? [ITEM_BONS_M2] : []),
  ];
}

const DIA_NO_RESUMO = ["aos domingos", "nas segundas", "nas terças", "nas quartas", "nas quintas", "nas sextas", "aos sábados"];

function periodoDoDia(hora: number) {
  if (hora < 6) return "de madrugada";
  if (hora < 12) return "de manhã";
  if (hora < 18) return "à tarde";
  return "à noite";
}

// Usado só pelo convite do M5 (momentoBomMaisComum). O resumo da semana usa pistaMaisComum.
function maisComum(valores: string[]) {
  const contagem = new Map<string, number>();
  for (const valor of valores) contagem.set(valor, (contagem.get(valor) ?? 0) + 1);
  let melhor: string | null = null;
  for (const [valor, total] of contagem) if (!melhor || total > (contagem.get(melhor) ?? 0)) melhor = valor;
  return melhor;
}

export type Pista = { valores: string[]; total: number };

// Regra única de pista do resumo (briefing M2b): o valor mais frequente só vira pista com `minimo`
// ocorrências ou mais; até 2 empatados no topo aparecem juntos; 3 ou mais empatados não são padrão.
export function pistaMaisComum(valores: string[], minimo = 2): Pista | null {
  const contagem = new Map<string, number>();
  for (const valor of valores) contagem.set(valor, (contagem.get(valor) ?? 0) + 1);
  const total = Math.max(0, ...contagem.values());
  if (total < minimo) return null;
  const topo = [...contagem].filter(([, n]) => n === total).map(([valor]) => valor);
  return topo.length <= 2 ? { valores: topo, total } : null;
}

// O valor foi escrito pela pessoa no "Outro": não está entre as opções daquela pergunta (gerais e
// extras de qualquer problema) e não é "Outro" nem "Não sei".
export function escritoPelaPessoa(campo: CampoLista, valor: string) {
  if (valor === OUTRO || valor === "Não sei") return false;
  const pergunta = [...PERGUNTAS_DIFICIL, ...PERGUNTAS_BOM].find((p) => p.campo === campo);
  if (!pergunta) return false;
  return !pergunta.opcoes.includes(valor) && !Object.values(pergunta.extras ?? {}).some((extras) => extras.includes(valor));
}

// Pra coluna usou_outro_escrito (briefing M2b, item 5): algum campo "Outro" tem texto.
export function usouOutroEscrito(anotacao: Partial<Record<CampoOutro, string | null>>) {
  return CAMPOS_LISTA.some((campo) => Boolean(anotacao[campoOutro(campo)]));
}

// Leitura de linha antiga (briefing 00d): valor fora da lista da pergunta vira "Outro" e o texto vai
// pro campo ao lado. Linha nova passa sem mudança. Sem script de migração.
export function lerOutro<T extends Record<CampoLista, string[]> & Partial<Record<CampoOutro, string | null>>>(linha: T): T {
  const resultado = { ...linha } as Record<string, unknown>;
  for (const campo of CAMPOS_LISTA) {
    const valores = linha[campo];
    const escrito = valores.find((valor) => escritoPelaPessoa(campo, valor));
    if (!escrito) continue;
    resultado[campo] = [...new Set(valores.map((valor) => (escritoPelaPessoa(campo, valor) ? OUTRO : valor)))];
    const destino = campoOutro(campo);
    if (!linha[destino]) resultado[destino] = escrito;
  }
  return resultado as T;
}

// "a e b", pra frase com dois valores empatados.
export function juntar(valores: string[]) {
  return valores.join(" e ");
}

function minuscula(texto: string) {
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}

// Pistas por reação (briefing M2, [RESUMO_REACAO]). Reação fora do mapa ("Outro") fica sem frase.
export const FRASE_DA_REACAO: Record<string, { frase: string; seguranca?: boolean }> = {
  "Briguei ou discuti": { frase: "No módulo 3, você aprende a conversar sem que vire briga." },
  "Tentei convencer a parar": { frase: "No módulo 3, você aprende a conversar sem que vire briga." },
  "Resolvi por {{apelido}}": { frase: "No módulo 6, você vê o que dá para devolver para a pessoa." },
  "Fiquei em silêncio": { frase: "No módulo 4, você vê como agir na hora sem brigar e sem fingir." },
  "Fingi que não vi": { frase: "No módulo 4, você vê como agir na hora sem brigar e sem fingir." },
  "Conversei com calma": { frase: "Isso é exatamente o que o programa trabalha. Continue." },
  // O "Veja o seu plano de segurança." da frase é o link, desenhado na tela.
  [SAI_PARA_SE_PROTEGER]: { frase: "Sair de perto foi uma escolha segura.", seguranca: true },
};

export type ResumoDaSemana = {
  total: number;
  dificeis: number;
  bons: number;
  // Cada pista só existe quando passa na regra do pistaMaisComum. Dia e período contam em separado.
  dia: Pista | null;
  periodo: Pista | null;
  antes: Pista | null;
  buscou: Pista | null;
  // No empate, a frase de apoio é a da reação com segurança; o botão aparece se qualquer uma tiver.
  reacao: { textos: string[]; frase: string | null; seguranca: boolean } | null;
  // O que a pessoa escreveu no "Outro" de antes, buscou e reagiu: até 3, da anotação mais recente pra mais antiga.
  escritos: string[];
};

const MAXIMO_ESCRITOS = 3;
const CAMPOS_ESCRITOS: CampoLista[] = ["antes", "buscou", "reagiu"];

// Agregação semanal simples (contagem), sem IA, sobre os últimos 7 dias. Dia e período usam a hora do
// aparelho, por isso isto roda no cliente.
export function resumirSemana(entrada: Anotacao[], agora = new Date()): ResumoDaSemana {
  const anotacoes = entrada.map(lerOutro);
  const recentes = anotacoes.filter((anotacao) => dentroDosUltimosDias(anotacao.quando, agora));
  const dificeis = recentes.filter((anotacao) => anotacao.tipo === "dificil");
  const horarios = dificeis.map((anotacao) => new Date(anotacao.quando));
  // "Não sei" e "Outro" sem texto não viram pista.
  const util = (valores: string[]) => valores.filter((valor) => valor !== "Não sei" && valor !== OUTRO);
  const reacao = pistaMaisComum(util(dificeis.flatMap((anotacao) => anotacao.reagiu)));
  const mapas = (reacao?.valores ?? []).map((valor) => FRASE_DA_REACAO[valor]);
  const comSeguranca = mapas.find((mapa) => mapa?.seguranca);
  const escritos = [...dificeis]
    .sort((a, b) => Date.parse(b.quando) - Date.parse(a.quando))
    .flatMap((anotacao) => CAMPOS_ESCRITOS.map((campo) => anotacao[campoOutro(campo)]?.trim()).filter((texto): texto is string => Boolean(texto)))
    .slice(0, MAXIMO_ESCRITOS);
  return {
    total: recentes.length,
    dificeis: dificeis.length,
    bons: recentes.length - dificeis.length,
    dia: pistaMaisComum(horarios.map((data) => DIA_NO_RESUMO[data.getDay()])),
    periodo: pistaMaisComum(horarios.map((data) => periodoDoDia(data.getHours()))),
    antes: pistaMaisComum(util(dificeis.flatMap((anotacao) => anotacao.antes))),
    buscou: pistaMaisComum(util(dificeis.flatMap((anotacao) => anotacao.buscou))),
    reacao: reacao
      ? {
          textos: reacao.valores.map(minuscula),
          frase: reacao.valores.length === 1 ? (mapas[0]?.frase ?? null) : (comSeguranca?.frase ?? null),
          seguranca: Boolean(comSeguranca),
        }
      : null,
    escritos,
  };
}

// Valor único de uma pista (sem empate), pra telas que só sabem lidar com um.
export function valorUnico(pista: Pista | null) {
  return pista && pista.valores.length === 1 ? pista.valores[0] : null;
}

export { minuscula };

// Dia e período mais comuns dos momentos bons (briefing M5, passo 2: "nas sextas, à noite"), ou null
// sem anotação de momento bom. Usa todas as anotações, não só a última semana. Roda no cliente.
export function momentoBomMaisComum(anotacoes: Array<Pick<Anotacao, "tipo" | "quando">>) {
  const horarios = anotacoes.filter((anotacao) => anotacao.tipo === "bom").map((anotacao) => new Date(anotacao.quando));
  const dia = maisComum(horarios.map((data) => DIA_NO_RESUMO[data.getDay()]));
  const periodo = maisComum(horarios.map((data) => periodoDoDia(data.getHours())));
  return dia && periodo ? `${dia}, ${periodo}` : null;
}

function lista(valor: unknown) {
  if (!Array.isArray(valor)) return [];
  return valor
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim().slice(0, TAMANHO_MAXIMO_OUTRO * 2))
    .slice(0, MAXIMO_ESCOLHAS);
}

export function sanitizarAnotacao(entrada: unknown) {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const tipo: TipoAnotacao = bruto.tipo === "bom" ? "bom" : "dificil";
  const quando = typeof bruto.quando === "string" && !Number.isNaN(Date.parse(bruto.quando)) ? new Date(bruto.quando).toISOString() : new Date().toISOString();
  const livre = typeof bruto.texto_livre === "string" && bruto.texto_livre.trim() ? bruto.texto_livre.trim().slice(0, TAMANHO_MAXIMO_CAMPO) : null;
  // Cada tipo guarda só os campos dele.
  const campos = Object.fromEntries(CAMPOS_LISTA.map((campo) => [campo, CAMPOS_DO_TIPO[tipo].includes(campo) ? lista(bruto[campo]) : []])) as Record<CampoLista, string[]>;
  // O texto do "Outro" só vale se a lista tem "Outro".
  const outros = Object.fromEntries(
    CAMPOS_LISTA.map((campo) => {
      const texto = bruto[campoOutro(campo)];
      const valido = campos[campo].includes(OUTRO) && typeof texto === "string" && texto.trim();
      return [campoOutro(campo), valido ? (texto as string).trim().slice(0, TAMANHO_MAXIMO_OUTRO) : null];
    }),
  ) as Record<CampoOutro, string | null>;
  return { tipo, quando, ...campos, ...outros, texto_livre: livre };
}
