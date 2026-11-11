import { SIMULADOR_MAX_CARACTERES, SIMULADOR_MAX_MENSAGENS, SIMULADOR_MODELO, SIMULADOR_MODELO_RESERVA } from "./config";

// Chamadas ao Gemini do simulador de conversa (briefing, seção 8). Única parte do programa para
// familiares que usa IA. A conversa não é gravada: o navegador manda o histórico a cada turno e o
// servidor só guarda cenário, número de turnos e o feedback.

export type Fala = { autor: "familiar" | "pessoa"; texto: string };

export type Feedback = { o_que_funcionou: string[]; o_que_tentar_diferente: string[]; frase_para_levar: string };

export type ReacaoSimulador = "nega" | "se_irrita" | "muda_de_assunto" | "promete_parar" | "se_fecha";

export const REACOES_SIMULADOR: Array<{ valor: ReacaoSimulador; rotulo: string }> = [
  { valor: "nega", rotulo: "Nega" },
  { valor: "se_irrita", rotulo: "Se irrita" },
  { valor: "muda_de_assunto", rotulo: "Muda de assunto" },
  { valor: "promete_parar", rotulo: "Promete parar" },
  { valor: "se_fecha", rotulo: "Se fecha" },
];

// Pré-preenchimento a partir da Q6 do diagnóstico.
export const REACAO_DO_DIAGNOSTICO: Record<string, ReacaoSimulador> = {
  vira_briga: "se_irrita",
  nega: "nega",
  muda_de_assunto: "muda_de_assunto",
  promete_parar: "promete_parar",
  se_afasta: "se_fecha",
};

// Botão que abre o treino: diz o que vai ser treinado (briefing 00, item 7).
export const ROTULO_TREINO: Record<string, string> = {
  "primeira-conversa": "Treinar a primeira conversa",
  "nega-o-problema": "Treinar quando {{apelido}} nega o problema",
  "elogiar-sem-ironia": "Treinar um elogio",
  "convite-para-ajuda": "Treinar o convite",
  "pedido-de-dinheiro": "Treinar como dizer não a um pedido de dinheiro",
  "pedido-de-desculpa-pro-trabalho": "Treinar como dizer não a uma desculpa",
};

// Itens do exercício ("módulo:item") que concluem quando o treino termina e o retorno aparece
// (briefing M3, card 2: "Treinar quando {{apelido}} nega o problema").
export const ITENS_QUE_CONCLUEM_NO_TREINO = new Set(["3:ensaiar"]);

// Cenário que ainda não tem rótulo próprio na tabela do briefing 00.
export const ROTULO_TREINO_PADRAO = "Treinar a conversa";

// Título da tela do simulador: "Treino: a primeira conversa".
export function tituloDoTreino(titulo: string) {
  return `Treino: ${titulo.charAt(0).toLowerCase()}${titulo.slice(1)}`;
}

export type MotivoFalhaSimulador = "sem_chave" | "tempo_esgotado" | "erro_google" | "resposta_vazia" | "formato_invalido" | "erro_inesperado";

const TIMEOUT_MS = 30000;
const TIMEOUT_PRINCIPAL_MS = 20000;
const STATUS_DE_SOBRECARGA = new Set([429, 500, 503]);

// Valida o histórico que veio do navegador: alterna familiar e pessoa, começa e termina no familiar
// (quando é pra responder), respeita o limite de mensagens e de tamanho.
export function historicoValido(entrada: unknown, terminaNoFamiliar: boolean): Fala[] | null {
  if (!Array.isArray(entrada) || entrada.length === 0 || entrada.length > SIMULADOR_MAX_MENSAGENS * 2) return null;
  const falas: Fala[] = [];
  for (const [indice, item] of entrada.entries()) {
    if (!item || typeof item !== "object") return null;
    const { autor, texto } = item as { autor?: unknown; texto?: unknown };
    const esperado = indice % 2 === 0 ? "familiar" : "pessoa";
    if (autor !== esperado || typeof texto !== "string") return null;
    const limpo = texto.trim().slice(0, SIMULADOR_MAX_CARACTERES);
    if (!limpo) return null;
    falas.push({ autor: esperado, texto: limpo });
  }
  if (terminaNoFamiliar && falas[falas.length - 1].autor !== "familiar") return null;
  return falas;
}

function semTravessao(texto: string) {
  return texto.replace(/\s*\u2014\s*/g, ", ").trim();
}

function tempoEsgotado(erro: unknown) {
  return erro instanceof Error && (erro.name === "TimeoutError" || erro.name === "AbortError");
}

function pedir(modelo: string, corpo: string, timeoutMs: number) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
    method: "POST",
    // Chave no header, nunca na URL.
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" },
    body: corpo,
    signal: AbortSignal.timeout(timeoutMs),
  });
}

async function chamarGemini(sistema: string, contents: unknown[], json: boolean) {
  const corpo = JSON.stringify({
    systemInstruction: { parts: [{ text: sistema }] },
    contents,
    generationConfig: { maxOutputTokens: 1024, ...(json ? { responseMimeType: "application/json" } : {}) },
  });
  let resposta: Response | null = null;
  if (SIMULADOR_MODELO !== SIMULADOR_MODELO_RESERVA) {
    // Principal com prazo curto: sobrecarregado, ele demora ou devolve 429/500/503, e aí vai o reserva.
    try {
      resposta = await pedir(SIMULADOR_MODELO, corpo, TIMEOUT_PRINCIPAL_MS);
      if (STATUS_DE_SOBRECARGA.has(resposta.status)) {
        console.warn("[familia] simulador usou o modelo reserva:", `http ${resposta.status}`);
        resposta = null;
      }
    } catch (erro) {
      if (!tempoEsgotado(erro)) throw erro;
      console.warn("[familia] simulador usou o modelo reserva:", "tempo_esgotado");
    }
  }
  resposta ??= await pedir(SIMULADOR_MODELO_RESERVA, corpo, TIMEOUT_MS);
  if (!resposta.ok) return { ok: false as const, motivo: "erro_google" as const, detalhe: `http ${resposta.status}` };
  const dados = await resposta.json();
  const texto = dados?.candidates?.[0]?.content?.parts?.map((parte: { text?: string }) => parte.text ?? "").join("").trim();
  if (!texto) return { ok: false as const, motivo: "resposta_vazia" as const, detalhe: dados?.candidates?.[0]?.finishReason };
  return { ok: true as const, texto: texto as string };
}

function falha(erro: unknown) {
  if (tempoEsgotado(erro)) return { ok: false as const, motivo: "tempo_esgotado" as const };
  return { ok: false as const, motivo: "erro_inesperado" as const, detalhe: erro instanceof Error ? erro.message : undefined };
}

export async function responderComoPersonagem(sistema: string, historico: Fala[]) {
  if (!process.env.GEMINI_API_KEY) return { ok: false as const, motivo: "sem_chave" as const };
  try {
    const contents = historico.map((fala) => ({ role: fala.autor === "familiar" ? "user" : "model", parts: [{ text: fala.texto }] }));
    const resultado = await chamarGemini(sistema, contents, false);
    if (!resultado.ok) return resultado;
    // Segunda camada de segurança: a IA saiu do personagem.
    const json = resultado.texto.match(/\{[\s\S]*"tipo"\s*:\s*"seguranca"[\s\S]*\}/)?.[0];
    if (json) {
      let mensagem: string | null = null;
      try {
        const lido = JSON.parse(json) as { mensagem?: unknown };
        mensagem = typeof lido.mensagem === "string" ? semTravessao(lido.mensagem) : null;
      } catch {}
      return { ok: true as const, tipo: "seguranca" as const, mensagem };
    }
    return { ok: true as const, tipo: "fala" as const, texto: semTravessao(resultado.texto.replace(/^["“]|["”]$/g, "")) };
  } catch (erro) {
    return falha(erro);
  }
}

export async function gerarFeedback(sistema: string, historico: Fala[]) {
  if (!process.env.GEMINI_API_KEY) return { ok: false as const, motivo: "sem_chave" as const };
  try {
    const transcricao = historico.map((fala) => `${fala.autor === "familiar" ? "Familiar" : "Pessoa"}: ${fala.texto}`).join("\n");
    const resultado = await chamarGemini(sistema, [{ role: "user", parts: [{ text: transcricao }] }], true);
    if (!resultado.ok) return resultado;
    let lido: Record<string, unknown>;
    try {
      lido = JSON.parse(resultado.texto.replace(/^```json\s*|\s*```$/g, ""));
    } catch {
      return { ok: false as const, motivo: "formato_invalido" as const, detalhe: "json" };
    }
    const lista = (valor: unknown) => (Array.isArray(valor) ? valor.filter((item): item is string => typeof item === "string").map(semTravessao) : null);
    const funcionou = lista(lido.o_que_funcionou);
    const diferente = lista(lido.o_que_tentar_diferente);
    if (!funcionou || !diferente || typeof lido.frase_para_levar !== "string") return { ok: false as const, motivo: "formato_invalido" as const, detalhe: "campos" };
    const feedback: Feedback = { o_que_funcionou: funcionou, o_que_tentar_diferente: diferente, frase_para_levar: semTravessao(lido.frase_para_levar) };
    return { ok: true as const, feedback };
  } catch (erro) {
    return falha(erro);
  }
}
