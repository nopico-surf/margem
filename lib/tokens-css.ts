import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Leitor dos dois arquivos gerados a partir do Figma, para a galeria /ui.
//
// A galeria não pode ter a própria cópia da lista de tokens. No dia em que o Figma mudar e o
// tokens.css for gerado de novo, a cópia à mão passa a mentir, e uma galeria que mente é pior do
// que não ter galeria. Então os arquivos são lidos do disco a cada request e a página renderiza o
// que estiver neles, inclusive token que ainda não existia quando esta linha foi escrita.

export type Token = { nome: string; valor: string };
export type RampaDeCor = { grupo: string; tokens: Token[] };
export type Declaracao = { propriedade: string; token: string | null; valor: string };
export type EstiloDeTexto = { classe: string; declaracoes: Declaracao[] };

const ARQUIVO_TOKENS = "app/tokens.css";
const ARQUIVO_ESTILOS = "app/estilos-de-texto.css";

// O caminho é montado em runtime, e o build avisa que isso faz o projeto inteiro ser rastreado
// para dentro do bundle do servidor, inclusive a pasta public. Aqui não precisa: quem chama é a
// galeria /ui, que devolve 404 em produção e nunca chega a ler arquivo nenhum lá.
async function lerArquivo(relativo: string) {
  return readFile(join(/* turbopackIgnore: true */ process.cwd(), relativo), "utf8");
}

function extrairVariaveis(css: string): Token[] {
  const encontradas: Token[] = [];
  const regex = /(--[a-z0-9-]+)\s*:\s*([^;]+);/g;
  let achado: RegExpExecArray | null;
  while ((achado = regex.exec(css))) {
    encontradas.push({ nome: achado[1], valor: achado[2].trim() });
  }
  return encontradas;
}

export async function lerTokens() {
  const tokens = extrairVariaveis(await lerArquivo(ARQUIVO_TOKENS));
  const porNome = new Map(tokens.map((token) => [token.nome, token.valor]));
  return { tokens, porNome };
}

// O grupo é o nome sem o degrau final: `--colors-brand-primary-500` cai em `brand-primary`, e
// `--colors-alpha-8` cai em `alpha`. Mantém a ordem em que os tokens aparecem no arquivo.
export function rampasDeCor(tokens: Token[]): RampaDeCor[] {
  const prefixo = "--colors-";
  const rampas: RampaDeCor[] = [];
  const indicePorGrupo = new Map<string, number>();

  for (const token of tokens) {
    if (!token.nome.startsWith(prefixo)) continue;
    const grupo = token.nome.slice(prefixo.length).replace(/-\d+$/, "");
    const indice = indicePorGrupo.get(grupo);
    if (indice === undefined) {
      indicePorGrupo.set(grupo, rampas.length);
      rampas.push({ grupo, tokens: [token] });
    } else {
      rampas[indice].tokens.push(token);
    }
  }

  return rampas;
}

export function escalaDeEspaco(tokens: Token[]): Token[] {
  return tokens.filter((token) => token.nome.startsWith("--spacing-"));
}

// Cada estilo de texto compõe tokens que já estão no tokens.css. Aqui a declaração é quebrada em
// propriedade, token e valor resolvido, para a galeria mostrar de onde veio cada número.
export async function lerEstilosDeTexto(porNome: Map<string, string>): Promise<EstiloDeTexto[]> {
  const css = await lerArquivo(ARQUIVO_ESTILOS);
  const estilos: EstiloDeTexto[] = [];

  const regexRegra = /\.([a-z0-9-]+)\s*\{([^}]*)\}/g;
  let regra: RegExpExecArray | null;

  while ((regra = regexRegra.exec(css))) {
    const declaracoes: Declaracao[] = [];
    const regexDeclaracao = /([a-z-]+)\s*:\s*([^;]+);/g;
    let declaracao: RegExpExecArray | null;

    while ((declaracao = regexDeclaracao.exec(regra[2]))) {
      const valorBruto = declaracao[2].trim();
      // A fonte é a única propriedade que não aponta para o tokens.css: ela vem do next/font, em
      // app/layout.tsx. Aí não há token para mostrar, só o valor que está escrito na declaração.
      const referencia = /var\((--[a-z0-9-]+)\)/.exec(valorBruto)?.[1] ?? null;
      const token = referencia && porNome.has(referencia) ? referencia : null;
      declaracoes.push({
        propriedade: declaracao[1],
        token,
        valor: token ? (porNome.get(token) as string) : valorBruto,
      });
    }

    estilos.push({ classe: regra[1], declaracoes });
  }

  return estilos;
}
