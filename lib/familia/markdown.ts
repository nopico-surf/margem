// Leitor mínimo do markdown dos módulos e cenários do programa para familiares. Só o que os arquivos
// de content/familia usam: frontmatter simples, parágrafo, "## título", lista "-" e "1.", negrito
// "**...**", comentário HTML (ignorado) e o bloco de variação ":::alcool ... :::", que só aparece pra
// quem marcou aquele problema no diagnóstico. Sem dependência nova.

export type Frontmatter = Record<string, string | number | boolean>;

export type Trecho = { texto: string; negrito: boolean };

export type BlocoMarkdown =
  | { tipo: "paragrafo"; trechos: Trecho[] }
  | { tipo: "titulo"; texto: string }
  | { tipo: "lista"; ordenada: boolean; itens: Trecho[][] }
  | { tipo: "variacao"; problema: string; blocos: BlocoMarkdown[] };

export function separarFrontmatter(markdown: string): { dados: Frontmatter; corpo: string } {
  const achado = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!achado) return { dados: {}, corpo: markdown };
  const dados: Frontmatter = {};
  for (const linha of achado[1].split(/\r?\n/)) {
    const par = linha.match(/^([a-z_]+):\s*(.*?)\s*(#.*)?$/);
    if (!par) continue;
    const bruto = par[2];
    if (bruto === "true" || bruto === "false") dados[par[1]] = bruto === "true";
    else if (/^-?\d+$/.test(bruto)) dados[par[1]] = Number(bruto);
    else dados[par[1]] = bruto.replace(/^"(.*)"$/, "$1");
  }
  return { dados, corpo: markdown.slice(achado[0].length) };
}

export function lerTrechos(texto: string): Trecho[] {
  return texto
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((parte) => (parte.startsWith("**") && parte.endsWith("**") ? { texto: parte.slice(2, -2), negrito: true } : { texto: parte, negrito: false }));
}

export function lerBlocosMarkdown(corpo: string): BlocoMarkdown[] {
  const semComentario = corpo.replace(/<!--[\s\S]*?-->/g, "");
  const raiz: BlocoMarkdown[] = [];
  let destino = raiz;
  let paragrafo: string[] = [];
  let lista: { ordenada: boolean; itens: Trecho[][] } | null = null;

  const fecharParagrafo = () => {
    if (paragrafo.length) destino.push({ tipo: "paragrafo", trechos: lerTrechos(paragrafo.join(" ")) });
    paragrafo = [];
  };
  const fecharLista = () => {
    if (lista) destino.push({ tipo: "lista", ...lista });
    lista = null;
  };

  for (const linhaCrua of semComentario.split(/\r?\n/)) {
    const linha = linhaCrua.trim();
    const abreVariacao = linha.match(/^:::([a-z_]+)$/);
    if (abreVariacao) {
      fecharParagrafo();
      fecharLista();
      const variacao: BlocoMarkdown = { tipo: "variacao", problema: abreVariacao[1], blocos: [] };
      raiz.push(variacao);
      destino = variacao.blocos;
      continue;
    }
    if (linha === ":::") {
      fecharParagrafo();
      fecharLista();
      destino = raiz;
      continue;
    }
    if (!linha) {
      fecharParagrafo();
      fecharLista();
      continue;
    }
    const titulo = linha.match(/^##\s+(.*)$/);
    if (titulo) {
      fecharParagrafo();
      fecharLista();
      destino.push({ tipo: "titulo", texto: titulo[1] });
      continue;
    }
    const item = linha.match(/^(-|\d+\.)\s+(.*)$/);
    if (item) {
      fecharParagrafo();
      const ordenada = item[1] !== "-";
      if (lista && lista.ordenada !== ordenada) fecharLista();
      lista ??= { ordenada, itens: [] };
      lista.itens.push(lerTrechos(item[2]));
      continue;
    }
    fecharLista();
    paragrafo.push(linha);
  }
  fecharParagrafo();
  fecharLista();
  return raiz;
}
