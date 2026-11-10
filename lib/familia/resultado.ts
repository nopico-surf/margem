// Resultado do diagnóstico montado com blocos fixos, sem IA (briefing, seção 6). Os textos ficam em
// content/familia/resultado-blocos.md, cada um sob um [ID]. Aqui só a regra de qual bloco entra.
//
// O {{apelido}} sai daqui ainda como variável: quem mostra aplica aplicarApelido (diagnostico.ts).
// Assim o resultado pode ser guardado e o apelido corrigido depois sem remontar. O {{exemplo}} já
// sai trocado. Só `import type` daqui pra fora: os testes rodam este arquivo direto no Node.

import type { Estagio, Problema, Reacao, Respostas } from "./diagnostico";

export type Blocos = Map<string, string[]>;

export type Resultado = {
  safetyMode: boolean;
  acolhimento: string[];
  aSeuFavor: string[];
  pontoDeAtencao: string;
  // Nulo no modo segurança: no lugar entra `seguranca`.
  conversa: {
    quando: string;
    abertura: string;
    frasesUteis: string[];
    evite: string[];
    seReagirMal: { orientacao: string; frase: string | null };
  } | null;
  seguranca: string | null;
  umPasso: string;
  // psiquiatra: o aviso leva o botão "Ver psiquiatra parceiro" (álcool diário, conteúdo v2).
  avisos: Array<{ problema: Problema; texto: string; psiquiatra?: boolean }>;
};

const SUFIXO_PROBLEMA: Record<Problema, string> = { alcool: "ALCOOL", outras_drogas: "OUTRAS_DROGAS", apostas: "APOSTAS" };
const SUFIXO_TEMPO = { curto: "CURTO", medio: "MEDIO", longo: "LONGO" } as const;

// Prioridade da seção 6: a primeira reação marcada nessa ordem decide o "Se reagir mal".
export const PRIORIDADE_REACAO: Reacao[] = ["vira_briga", "nega", "se_afasta", "muda_de_assunto", "promete_parar", "ainda_nao_tentei"];

export const ESTAGIOS: Estagio[] = ["NAO_RECONHECE", "RECONHECE_AS_VEZES", "QUER_MUDAR", "EM_TRATAMENTO", "RECAIDA"];
export const PROBLEMAS: Problema[] = ["alcool", "outras_drogas", "apostas"];

// Palavras proibidas da seção 3 e da 16, mais o travessão (CLAUDE.md, seção 7).
export const PALAVRAS_PROIBIDAS = ["viciado", "viciada", "alcoólatra", "bêbado", "bêbada", "drogado", "drogada", "jogador compulsivo", "dependente", "\u2014"];

// Um bloco começa numa linha só com [ID] e vai até o próximo [ID], uma linha "---", um título "#" ou
// uma nota em itálico "*(...)*". Linhas em branco dentro dele são ignoradas.
export function lerBlocos(markdown: string): Blocos {
  const blocos: Blocos = new Map();
  let atual: string[] | null = null;
  for (const linhaCrua of markdown.split(/\r?\n/)) {
    const linha = linhaCrua.trim();
    const id = linha.match(/^\[([A-Z_]+)\]$/)?.[1];
    if (id) {
      atual = [];
      blocos.set(id, atual);
      continue;
    }
    if (linha === "---" || linha.startsWith("#") || linha.startsWith("*(") || linha.startsWith(">")) {
      atual = null;
      continue;
    }
    if (atual && linha) atual.push(linha);
  }
  return blocos;
}

function linhas(blocos: Blocos, id: string) {
  const conteudo = blocos.get(id);
  if (!conteudo || conteudo.length === 0) throw new Error(`Bloco ${id} não existe em resultado-blocos.md`);
  return conteudo;
}

function texto(blocos: Blocos, id: string) {
  return linhas(blocos, id).join(" ");
}

function itens(blocos: Blocos, id: string) {
  return linhas(blocos, id).map((linha) => linha.replace(/^-\s+/, ""));
}

function favores(respostas: Respostas, safetyMode: boolean) {
  const regras: Array<[string, boolean]> = [
    ["FAVOR_QUER_MUDAR", respostas.estagio === "QUER_MUDAR"],
    ["FAVOR_EM_TRATAMENTO", respostas.estagio === "EM_TRATAMENTO"],
    ["FAVOR_JA_PAROU_ANTES", respostas.estagio === "RECAIDA"],
    ["FAVOR_RECONHECE_AS_VEZES", respostas.estagio === "RECONHECE_AS_VEZES"],
    ["FAVOR_PERCEBEU_CEDO", respostas.tempo === "curto"],
    ["FAVOR_MORA_JUNTO", respostas.mora_junto === "sim"],
    // Nunca aparece no modo segurança.
    ["FAVOR_SEM_VIOLENCIA", !safetyMode && respostas.medo === "nao" && respostas.agressao === "nao"],
    ["FAVOR_DINHEIRO_POUCO_AFETADO", respostas.dinheiro === "nao" || respostas.dinheiro === "pouco"],
  ];
  const escolhidos = regras.filter(([, aplica]) => aplica).map(([id]) => id).slice(0, 3);
  // O 9º da lista sempre se aplica. O briefing diz que ele "garante 3", mas é um bloco só: quando
  // menos de 2 dos outros se aplicam (ex.: não reconhece, mais de 2 anos, não mora junto, violência,
  // dinheiro muito afetado), a seção sai com 1 ou 2 itens. Pendência registrada no resumo da fase.
  if (escolhidos.length < 3) escolhidos.push("FAVOR_ESTA_BUSCANDO");
  return escolhidos;
}

export function montarResultado(respostas: Respostas, blocos: Blocos, safetyMode: boolean): Resultado {
  const problemas = respostas.problemas?.length ? respostas.problemas : (["alcool"] as Problema[]);
  const principal = problemas[0];
  const estagio = respostas.estagio ?? "NAO_RECONHECE";
  const esgotado = Number(respostas.esgotamento ?? "0") >= 2;

  const acolhimento = [texto(blocos, `ACOLHIMENTO_TEMPO_${SUFIXO_TEMPO[respostas.tempo ?? "curto"]}`)];
  if (esgotado) acolhimento.push(texto(blocos, "ACOLHIMENTO_EXTRA_CANSACO"));

  const exemplo = texto(blocos, `EXEMPLO_${SUFIXO_PROBLEMA[principal]}`);
  const reacao = PRIORIDADE_REACAO.find((item) => respostas.reacoes?.includes(item)) ?? "ainda_nao_tentei";
  const [orientacaoReacao, ...falaReacao] = linhas(blocos, `REAGIR_${reacao.toUpperCase()}`);

  return {
    safetyMode,
    acolhimento,
    aSeuFavor: favores(respostas, safetyMode).map((id) => texto(blocos, id)),
    pontoDeAtencao: texto(blocos, `ATENCAO_${estagio}`),
    conversa: safetyMode
      ? null
      : {
          quando: texto(blocos, `QUANDO_${SUFIXO_PROBLEMA[principal]}`),
          abertura: texto(blocos, `ABERTURA_${estagio}`),
          frasesUteis: itens(blocos, `FRASES_${estagio}`).map((frase) => frase.replaceAll("{{exemplo}}", exemplo)),
          // Exatamente 2 (ajuste de 10/11/2026): um pela mesma reação do "Se reagir mal" e um pelo
          // problema principal.
          evite: [
            // itens() e não texto(): os EVITE_PROBLEMA_* estão no arquivo como item de lista ("- ...").
            ...itens(blocos, `EVITE_REACAO_${reacao.toUpperCase()}`),
            ...itens(blocos, `EVITE_PROBLEMA_${SUFIXO_PROBLEMA[principal]}`),
          ],
          seReagirMal: { orientacao: orientacaoReacao, frase: falaReacao.length ? falaReacao.join(" ") : null },
        },
    seguranca: safetyMode ? texto(blocos, "SEGURANCA_PRIMEIRO") : null,
    umPasso: texto(blocos, esgotado ? "PASSO_ESGOTADO" : "PASSO_MODERADO"),
    avisos: avisos(respostas, problemas, blocos),
  };
}

// Avisos do fim da página (ajuste de 10/11/2026), um por problema marcado que tenha aviso:
// - álcool: só com a Q3b "todos os dias" ou "não sei"; semanal e fim de semana não têm card;
// - outras drogas: sem card (os sinais de emergência ficam na página de segurança, no SAMU);
// - apostas: sempre, com o texto conforme o dinheiro da casa (Q10).
function avisos(respostas: Respostas, problemas: Problema[], blocos: Blocos): Resultado["avisos"] {
  const lista: Resultado["avisos"] = [];
  for (const problema of problemas) {
    if (problema === "alcool") {
      if (respostas.frequencia_alcool === "diario") lista.push({ problema, texto: texto(blocos, "AVISO_ALCOOL_DIARIO"), psiquiatra: true });
      if (respostas.frequencia_alcool === "nao_sei") lista.push({ problema, texto: texto(blocos, "AVISO_ALCOOL_NAO_SEI") });
    }
    if (problema === "apostas") {
      lista.push({ problema, texto: texto(blocos, respostas.dinheiro === "muito" ? "AVISO_APOSTAS_MUITO" : "AVISO_APOSTAS_PREVENIR") });
    }
  }
  return lista;
}
