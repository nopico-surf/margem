// Só servidor: lê arquivo do disco.
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { lerBlocos } from "./resultado";
import { lerBlocosMarkdown, separarFrontmatter, type BlocoMarkdown } from "./markdown";

// Conteúdo do programa para familiares, lido de content/familia. O fundador publica um módulo novo
// criando o .md, sem mexer em código (briefing, seção 7).

const PASTA = path.join(process.cwd(), "content", "familia");

export type Modulo = {
  numero: number;
  titulo: string;
  publicado: boolean;
  cenarioSimulador: string | null;
  bloqueadoEmModoSeguranca: boolean;
  audio: string | null;
  video: string | null;
  minutos: number | null;
  blocos: BlocoMarkdown[];
};

export type Cenario = {
  id: string;
  titulo: string;
  contexto: string;
  objetivoDoFamiliar: string;
  bloqueadoEmModoSeguranca: boolean;
  gratis: boolean;
  // Ajustes por cenário (briefing M4b), opcionais: a nota entra no prompt do personagem e o foco no do
  // feedback. Cenário sem eles usa os prompts como são.
  notaDoPersonagem: string;
  focoDoFeedback: string;
};

export const TOTAL_MODULOS = 8;

function texto(valor: unknown) {
  return typeof valor === "string" && valor.length > 0 ? valor : null;
}

export async function lerModulo(numero: number): Promise<Modulo | null> {
  if (!Number.isInteger(numero) || numero < 1 || numero > TOTAL_MODULOS) return null;
  let markdown: string;
  try {
    markdown = await readFile(path.join(PASTA, "modulos", `modulo-${String(numero).padStart(2, "0")}.md`), "utf8");
  } catch {
    return null;
  }
  const { dados, corpo } = separarFrontmatter(markdown);
  const cenarioSimulador = await cenarioExistente(texto(dados.cenario_simulador));
  const blocos = lerBlocosMarkdown(corpo);
  // O botão do treino ("Treinar a primeira conversa" etc.) de cada item abre o cenário do item ou, sem ele, o do módulo. Cenário que
  // ainda não tem arquivo em content/familia/cenarios fica nulo, e o botão não aparece.
  for (const bloco of blocos) {
    if (bloco.tipo === "exercicio") bloco.cenario = bloco.cenario ? await cenarioExistente(bloco.cenario) : cenarioSimulador;
  }
  return {
    numero,
    titulo: texto(dados.titulo) ?? `Módulo ${numero}`,
    publicado: dados.publicado === true,
    cenarioSimulador,
    bloqueadoEmModoSeguranca: dados.bloqueado_em_modo_seguranca === true,
    audio: texto(dados.audio),
    video: texto(dados.video),
    minutos: typeof dados.minutos === "number" ? dados.minutos : null,
    blocos,
  };
}

// Títulos dos módulos 1 a 8 publicados, na ordem: a lista trancada do banner de oferta. Desde o briefing
// 01b o módulo 1 também é pago.
export async function titulosDosModulosPagos() {
  const numeros = Array.from({ length: TOTAL_MODULOS }, (_, indice) => indice + 1);
  const lidos = await Promise.all(numeros.map((numero) => lerModulo(numero)));
  return lidos.filter((modulo): modulo is Modulo => modulo !== null && modulo.publicado).map((modulo) => modulo.titulo);
}

async function cenarioExistente(id: string | null) {
  if (!id || !/^[a-z-]+$/.test(id)) return null;
  try {
    await access(path.join(PASTA, "cenarios", `${id}.md`));
    return id;
  } catch {
    return null;
  }
}

export async function lerCenario(id: string): Promise<Cenario | null> {
  if (!/^[a-z-]+$/.test(id)) return null;
  let markdown: string;
  try {
    markdown = await readFile(path.join(PASTA, "cenarios", `${id}.md`), "utf8");
  } catch {
    return null;
  }
  const { dados } = separarFrontmatter(markdown);
  const titulo = texto(dados.titulo);
  const contexto = texto(dados.contexto);
  if (!titulo || !contexto) return null;
  return {
    id,
    titulo,
    contexto,
    objetivoDoFamiliar: texto(dados.objetivo_do_familiar) ?? "",
    bloqueadoEmModoSeguranca: dados.bloqueado_em_modo_seguranca === true,
    gratis: dados.gratis === true,
    notaDoPersonagem: texto(dados.nota_do_personagem) ?? "",
    focoDoFeedback: texto(dados.foco_do_feedback) ?? "",
  };
}

export async function lerBlocosDoResultado() {
  return lerBlocos(await readFile(path.join(PASTA, "resultado-blocos.md"), "utf8"));
}

// O prompt fica em arquivo, nunca no route handler (CLAUDE.md, seção 4). O comentário de cima e a
// linha "---" ficam de fora.
export async function lerPrompt(nome: "personagem" | "feedback") {
  const markdown = await readFile(path.join(PASTA, "prompts", `${nome}.md`), "utf8");
  return markdown.replace(/^[\s\S]*?\n---\r?\n/, "").trim();
}
