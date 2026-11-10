// Diagnóstico grátis do programa para familiares (briefing, seção 5). Uma pergunta por tela.
//
// Este arquivo não importa nada: os testes rodam com `node --test` direto no .ts (o Node tira os
// tipos), e import sem extensão quebraria lá. Quem precisa de tipo daqui usa `import type`.

export type Problema = "alcool" | "outras_drogas" | "apostas";
export type Estagio = "NAO_RECONHECE" | "RECONHECE_AS_VEZES" | "QUER_MUDAR" | "EM_TRATAMENTO" | "RECAIDA";
export type Reacao = "vira_briga" | "nega" | "promete_parar" | "muda_de_assunto" | "se_afasta" | "ainda_nao_tentei";

export type Respostas = {
  relacao?: string;
  apelido?: string;
  // Na ordem em que a pessoa marcou: o primeiro é o problema principal (briefing, seção 6).
  problemas?: Problema[];
  // Q3b: só pra quem marcou álcool (ajuste do fundador de 10/11/2026).
  frequencia_alcool?: "diario" | "semanal" | "fim_de_semana" | "nao_sei";
  tempo?: "curto" | "medio" | "longo";
  estagio?: Estagio;
  reacoes?: Reacao[];
  mora_junto?: "sim" | "nao";
  medo?: "nao" | "passado" | "hoje";
  agressao?: "nao" | "raramente" | "frequente";
  dinheiro?: "nao" | "pouco" | "muito" | "nao_sei";
  // Q11, de 0 a 3. Guardado como texto porque a opção é um botão como as outras.
  esgotamento?: "0" | "1" | "2" | "3";
  objetivo?: string;
};

export type ChaveResposta = keyof Respostas;

export type Opcao = { valor: string; rotulo: string };

export type Pergunta = {
  chave: ChaveResposta;
  // Pode ter {{apelido}}.
  titulo: string;
  tipo: "unica" | "multipla" | "texto";
  opcoes?: Opcao[];
  placeholder?: string;
  maxLength?: number;
  opcional?: boolean;
  seguranca?: boolean;
  // Pergunta condicional: só aparece (e só conta como obrigatória) quando isto devolve true.
  condicao?: (respostas: Respostas) => boolean;
};

export const APELIDO_MAX = 20;
export const APELIDO_PADRAO = "quem você ama";

export const PERGUNTAS: Pergunta[] = [
  {
    chave: "relacao",
    titulo: "Quem é essa pessoa pra você?",
    tipo: "unica",
    opcoes: [
      { valor: "filho", rotulo: "Filho(a)" },
      { valor: "companheiro", rotulo: "Companheiro(a) / marido / esposa" },
      { valor: "pai_mae", rotulo: "Pai / mãe" },
      { valor: "irmao", rotulo: "Irmão(ã)" },
      { valor: "amigo", rotulo: "Amigo(a)" },
      { valor: "outro", rotulo: "Outro" },
    ],
  },
  {
    chave: "apelido",
    titulo: "Como você quer chamar essa pessoa aqui?",
    tipo: "texto",
    placeholder: "Pode ser um apelido. Não precisa ser o nome real.",
    maxLength: APELIDO_MAX,
    opcional: true,
  },
  {
    chave: "problemas",
    titulo: "O que mais te preocupa hoje?",
    tipo: "multipla",
    opcoes: [
      { valor: "alcool", rotulo: "Álcool" },
      { valor: "outras_drogas", rotulo: "Outras drogas" },
      { valor: "apostas", rotulo: "Apostas / bets" },
    ],
  },
  {
    // Q3b. Não muda a numeração das outras perguntas: no código ela é a "3b".
    chave: "frequencia_alcool",
    titulo: "Com que frequência {{apelido}} costuma beber?",
    tipo: "unica",
    condicao: (respostas) => Boolean(respostas.problemas?.includes("alcool")),
    opcoes: [
      { valor: "diario", rotulo: "Todos ou quase todos os dias" },
      { valor: "semanal", rotulo: "Alguns dias por semana" },
      { valor: "fim_de_semana", rotulo: "Mais nos fins de semana" },
      { valor: "nao_sei", rotulo: "Não sei" },
    ],
  },
  {
    chave: "tempo",
    titulo: "Há quanto tempo você percebe isso?",
    tipo: "unica",
    opcoes: [
      { valor: "curto", rotulo: "Menos de 6 meses" },
      { valor: "medio", rotulo: "6 meses a 2 anos" },
      { valor: "longo", rotulo: "Mais de 2 anos" },
    ],
  },
  {
    chave: "estagio",
    titulo: "Hoje, {{apelido}}…",
    tipo: "unica",
    opcoes: [
      { valor: "NAO_RECONHECE", rotulo: "Não acha que tem um problema" },
      { valor: "RECONHECE_AS_VEZES", rotulo: "Às vezes reconhece, mas não quer ajuda" },
      { valor: "QUER_MUDAR", rotulo: "Quer mudar, mas não sabe como" },
      { valor: "EM_TRATAMENTO", rotulo: "Já está em tratamento" },
      { valor: "RECAIDA", rotulo: "Tinha parado e voltou" },
    ],
  },
  {
    chave: "reacoes",
    titulo: "Quando você tenta conversar sobre isso, normalmente…",
    tipo: "multipla",
    opcoes: [
      { valor: "vira_briga", rotulo: "Vira briga" },
      { valor: "nega", rotulo: "A pessoa nega" },
      { valor: "promete_parar", rotulo: "Promete que vai parar" },
      { valor: "muda_de_assunto", rotulo: "Muda de assunto" },
      { valor: "se_afasta", rotulo: "Se afasta / some" },
      { valor: "ainda_nao_tentei", rotulo: "Ainda não tentei" },
    ],
  },
  {
    chave: "mora_junto",
    titulo: "Vocês moram juntos?",
    tipo: "unica",
    opcoes: [
      { valor: "sim", rotulo: "Sim" },
      { valor: "nao", rotulo: "Não" },
    ],
  },
  {
    chave: "medo",
    titulo: "Em algum momento você teve medo de que {{apelido}} machucasse você, alguém da casa ou a si mesmo(a)?",
    tipo: "unica",
    seguranca: true,
    opcoes: [
      { valor: "nao", rotulo: "Não" },
      { valor: "passado", rotulo: "Sim, já aconteceu no passado" },
      { valor: "hoje", rotulo: "Sim, tenho esse medo hoje" },
    ],
  },
  {
    chave: "agressao",
    titulo: "Já houve agressão física, ameaça ou objetos quebrados durante brigas?",
    tipo: "unica",
    seguranca: true,
    opcoes: [
      { valor: "nao", rotulo: "Não" },
      { valor: "raramente", rotulo: "Sim, raramente" },
      { valor: "frequente", rotulo: "Sim, com frequência" },
    ],
  },
  {
    chave: "dinheiro",
    titulo: "Isso já afetou o dinheiro da casa?",
    tipo: "unica",
    opcoes: [
      { valor: "nao", rotulo: "Não" },
      { valor: "pouco", rotulo: "Um pouco" },
      { valor: "muito", rotulo: "Muito" },
      { valor: "nao_sei", rotulo: "Não sei" },
    ],
  },
  {
    chave: "esgotamento",
    titulo: "Nas últimas duas semanas, com que frequência você se sentiu esgotado(a), ansioso(a) ou sem dormir direito por causa disso?",
    tipo: "unica",
    opcoes: [
      { valor: "0", rotulo: "Quase nunca" },
      { valor: "1", rotulo: "Alguns dias" },
      { valor: "2", rotulo: "Mais da metade dos dias" },
      { valor: "3", rotulo: "Quase todos os dias" },
    ],
  },
  {
    chave: "objetivo",
    titulo: "O que você mais quer agora?",
    tipo: "unica",
    opcoes: [
      { valor: "aceite_ajuda", rotulo: "Que {{apelido}} aceite ajuda" },
      { valor: "parar_de_brigar", rotulo: "Parar de brigar" },
      { valor: "proteger", rotulo: "Proteger a família e o dinheiro" },
      { valor: "cuidar_de_mim", rotulo: "Cuidar de mim" },
      { valor: "entender", rotulo: "Entender o que está acontecendo" },
    ],
  },
];

// Q8 = "tenho esse medo hoje" ou Q9 = "com frequência" (briefing, seção 5).
export function calcularSafetyMode(respostas: Respostas) {
  return respostas.medo === "hoje" || respostas.agressao === "frequente";
}

export function perguntaVisivel(pergunta: Pergunta, respostas: Respostas) {
  return !pergunta.condicao || pergunta.condicao(respostas);
}

export function perguntasVisiveis(respostas: Respostas) {
  return PERGUNTAS.filter((pergunta) => perguntaVisivel(pergunta, respostas));
}

export function respondida(pergunta: Pergunta, respostas: Respostas) {
  if (pergunta.opcional || !perguntaVisivel(pergunta, respostas)) return true;
  const valor = respostas[pergunta.chave];
  if (Array.isArray(valor)) return valor.length > 0;
  return typeof valor === "string" && valor.length > 0;
}

export function diagnosticoCompleto(respostas: Respostas) {
  return PERGUNTAS.every((pergunta) => respondida(pergunta, respostas));
}

export function limparApelido(apelido: string | undefined) {
  return (apelido ?? "").replace(/[{}<>]/g, "").replace(/\s+/g, " ").trim().slice(0, APELIDO_MAX);
}

// Troca {{apelido}} pelo apelido, ou pelo padrão "quem você ama" (era "a pessoa que você ama", que
// gerava "de a pessoa", "por a pessoa"; troca do fundador em 10/11/2026). Com o padrão:
// - no vocativo ("{{apelido}}, posso...", no começo do bloco ou da fala entre aspas) o chamamento sai;
// - no começo de frase vira "Quem você ama";
// - depois de "que" vira "a pessoa" ("Você contou que a pessoa costuma negar"), porque "que quem você
//   ama" não se lê bem.
export function aplicarApelido(texto: string, apelido: string | undefined) {
  const nome = limparApelido(apelido);
  if (nome) return texto.replaceAll("{{apelido}}", nome);
  return texto
    .replace(/(^|["“])\{\{apelido\}\}, (\p{L})/gu, (_, antes: string, letra: string) => antes + letra.toUpperCase())
    .replace(/\b([Qq]ue) \{\{apelido\}\}/g, "$1 a pessoa")
    .replace(/(^|[.!?…]\s+|["“])\{\{apelido\}\}/gu, (_, antes: string) => antes + "Quem você ama")
    .replaceAll("{{apelido}}", APELIDO_PADRAO);
}

// Valida o que chega do navegador antes de gravar: só chaves e valores conhecidos.
export function sanitizarRespostas(entrada: unknown): Respostas {
  if (!entrada || typeof entrada !== "object") return {};
  const bruto = entrada as Record<string, unknown>;
  const limpo: Record<string, unknown> = {};
  for (const pergunta of PERGUNTAS) {
    const valor = bruto[pergunta.chave];
    if (pergunta.tipo === "texto") {
      if (typeof valor === "string") limpo[pergunta.chave] = limparApelido(valor);
      continue;
    }
    const validos = new Set((pergunta.opcoes ?? []).map((opcao) => opcao.valor));
    if (pergunta.tipo === "multipla") {
      if (Array.isArray(valor)) {
        const lista = valor.filter((item): item is string => typeof item === "string" && validos.has(item));
        limpo[pergunta.chave] = [...new Set(lista)];
      }
      continue;
    }
    if (typeof valor === "string" && validos.has(valor)) limpo[pergunta.chave] = valor;
  }
  const resultado = limpo as Respostas;
  if (!resultado.problemas?.includes("alcool")) delete resultado.frequencia_alcool;
  return resultado;
}

export const ROTULO_PROBLEMA: Record<Problema, string> = {
  alcool: "Álcool",
  outras_drogas: "Outras drogas",
  apostas: "Apostas",
};

export function rotuloDaOpcao(chave: ChaveResposta, valor: string) {
  return PERGUNTAS.find((pergunta) => pergunta.chave === chave)?.opcoes?.find((opcao) => opcao.valor === valor)?.rotulo ?? valor;
}
