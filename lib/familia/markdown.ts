// Leitor mínimo do markdown dos módulos e cenários do programa para familiares. Só o que os arquivos
// de content/familia usam: frontmatter simples, parágrafo, "## título", lista "-" e "1.", negrito
// "**...**", comentário HTML (ignorado), link numa linha só e blocos entre ":::" e ":::" (um bloco
// pode ficar dentro de outro, ex.: variação por problema dentro de um item do exercício):
// - ":::se chave=valor ..." só aparece quando todas as condições batem (ver condicoesBatem);
// - ":::exercicio id=... acao=marcar,diario cenario=... ..." é um item do exercício da semana, com
//   botões; cenario é o treino do botão do treino (sem ele, vale o do módulo);
// - ":::escolha id=versao" é um seletor: o parágrafo de dentro é a pergunta e cada item "- valor:
//   rótulo" uma opção. O valor escolhido vira condição (versao=aceitou) pros blocos ":::se";
// - ":::alcool" (formato antigo) aparece pra quem marcou aquele problema.
// Link: uma linha "[rótulo](/caminho)" vira link; "@botao [rótulo](/caminho)" vira botão.
// Uma linha "@resumo" marca onde entra o resumo das 8 semanas (encerramento do módulo 8).
// Sem dependência nova.

export type Frontmatter = Record<string, string | number | boolean>;

export type Trecho = { texto: string; negrito: boolean };

export type BlocoMarkdown =
  | { tipo: "paragrafo"; trechos: Trecho[] }
  | { tipo: "titulo"; texto: string }
  | { tipo: "lista"; ordenada: boolean; itens: Trecho[][] }
  | { tipo: "link"; rotulo: string; href: string; botao: boolean }
  | { tipo: "resumo" }
  | { tipo: "variacao"; problema: string; blocos: BlocoMarkdown[] }
  | { tipo: "condicional"; condicoes: Record<string, string>; blocos: BlocoMarkdown[] }
  | { tipo: "escolha"; id: string; blocos: BlocoMarkdown[] }
  | { tipo: "exercicio"; id: string; acoes: string[]; cenario: string | null; condicoes: Record<string, string>; blocos: BlocoMarkdown[] };

// Condições de bloco, lidas do diagnóstico da pessoa:
// - principal=alcool: problema principal (o primeiro marcado na Q3);
// - problema=alcool: problema marcado na Q3, qualquer posição (conteúdo v2: com mais de um marcado,
//   aparecem as variações de todos);
// - seguranca=sim|nao: safety_mode;
// - cautela=sim|nao: caution_mode. Ainda não existe regra que ligue o modo (itens 14 a 25 do
//   fundador), então vale sempre "nao": o texto de cautela já fica escrito e não aparece;
// - reacao=vira_briga: reação usada no resultado (a primeira pela prioridade); "!" nega (reacao=!ainda_nao_tentei);
// - qualquer outra chave: o valor escolhido num ":::escolha" com esse id (sem escolha, não bate).
export type Contexto = {
  principal: string;
  problemas: string[];
  seguranca: boolean;
  cautela: boolean;
  reacao: string;
  escolhas?: Record<string, string>;
};

export function condicoesBatem(condicoes: Record<string, string>, contexto: Contexto) {
  return Object.entries(condicoes).every(([chave, valor]) => {
    const negado = valor.startsWith("!");
    const esperado = negado ? valor.slice(1) : valor;
    if (chave === "problema") return negado ? !contexto.problemas.includes(esperado) : contexto.problemas.includes(esperado);
    const atual =
      chave === "principal"
        ? contexto.principal
        : chave === "seguranca"
          ? contexto.seguranca ? "sim" : "nao"
          : chave === "cautela"
            ? contexto.cautela ? "sim" : "nao"
            : chave === "reacao"
              ? contexto.reacao
              : contexto.escolhas?.[chave] ?? null;
    if (atual === null) return false;
    return negado ? atual !== esperado : atual === esperado;
  });
}

// Opções de um ":::escolha": a pergunta (primeiro parágrafo) e os itens "valor: rótulo".
export function opcoesDaEscolha(bloco: Extract<BlocoMarkdown, { tipo: "escolha" }>) {
  const pergunta = bloco.blocos.find((filho) => filho.tipo === "paragrafo");
  const lista = bloco.blocos.find((filho) => filho.tipo === "lista");
  const opcoes = (lista?.tipo === "lista" ? lista.itens : []).map((item) => {
    const texto = item.map((trecho) => trecho.texto).join("");
    const [valor, ...rotulo] = texto.split(":");
    return { valor: valor.trim(), rotulo: rotulo.join(":").trim() };
  });
  return { pergunta: pergunta?.tipo === "paragrafo" ? pergunta.trechos.map((trecho) => trecho.texto).join("") : "", opcoes };
}

function lerAtributos(texto: string) {
  const atributos: Record<string, string> = {};
  for (const par of texto.trim().split(/\s+/).filter(Boolean)) {
    const [chave, ...resto] = par.split("=");
    atributos[chave] = resto.join("=");
  }
  return atributos;
}

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
  // Pilha de destinos: o topo é onde entra o próximo bloco. ":::nome" empilha, ":::" desempilha.
  const pilha: BlocoMarkdown[][] = [raiz];
  const destino = () => pilha[pilha.length - 1];
  let paragrafo: string[] = [];
  let lista: { ordenada: boolean; itens: Trecho[][] } | null = null;

  const fecharParagrafo = () => {
    if (paragrafo.length) destino().push({ tipo: "paragrafo", trechos: lerTrechos(paragrafo.join(" ")) });
    paragrafo = [];
  };
  const fecharLista = () => {
    if (lista) destino().push({ tipo: "lista", ...lista });
    lista = null;
  };

  for (const linhaCrua of semComentario.split(/\r?\n/)) {
    const linha = linhaCrua.trim();
    const abreBloco = linha.match(/^:::([a-z_]+)(.*)$/);
    if (abreBloco) {
      fecharParagrafo();
      fecharLista();
      const [, nome, resto] = abreBloco;
      const atributos = lerAtributos(resto);
      let bloco: BlocoMarkdown;
      if (nome === "se") {
        bloco = { tipo: "condicional", condicoes: atributos, blocos: [] };
      } else if (nome === "exercicio") {
        const { id = "", acao = "", cenario = "", ...condicoes } = atributos;
        bloco = { tipo: "exercicio", id, acoes: acao.split(",").filter(Boolean), cenario: cenario || null, condicoes, blocos: [] };
      } else if (nome === "escolha") {
        bloco = { tipo: "escolha", id: atributos.id ?? "", blocos: [] };
      } else {
        bloco = { tipo: "variacao", problema: nome, blocos: [] };
      }
      destino().push(bloco);
      pilha.push(bloco.blocos);
      continue;
    }
    if (linha === ":::") {
      fecharParagrafo();
      fecharLista();
      if (pilha.length > 1) pilha.pop();
      continue;
    }
    if (!linha) {
      fecharParagrafo();
      fecharLista();
      continue;
    }
    const link = linha.match(/^(@botao\s+)?\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      fecharParagrafo();
      fecharLista();
      destino().push({ tipo: "link", rotulo: link[2], href: link[3], botao: Boolean(link[1]) });
      continue;
    }
    if (linha === "@resumo") {
      fecharParagrafo();
      fecharLista();
      destino().push({ tipo: "resumo" });
      continue;
    }
    const titulo = linha.match(/^##\s+(.*)$/);
    if (titulo) {
      fecharParagrafo();
      fecharLista();
      destino().push({ tipo: "titulo", texto: titulo[1] });
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
