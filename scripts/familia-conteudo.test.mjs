// Testes do texto que aparece na tela do programa para familiares (conteúdo v2, instrução 6):
// - nenhum texto tem palavra proibida, travessão nem gênero marcado com "(a)" ou "(ã)";
// - nos módulos, o apelido vazio não sobra como variável nem cai num lugar errado ("de a pessoa").
// Vale para os .md de content/familia (menos os prompts, que são instrução pra IA, e os comentários
// HTML, que não vão pra tela) e para as telas com texto escrito no código.
// Roda com `npm test`. O Node lê os .ts direto (tira os tipos).

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PALAVRAS_PROIBIDAS } from "../lib/familia/resultado.ts";
import { aplicarApelido } from "../lib/familia/diagnostico.ts";

const raiz = (caminho) => fileURLToPath(new URL(`../${caminho}`, import.meta.url));
const ler = (caminho) => readFileSync(raiz(caminho), "utf8");

const MARKDOWN = [
  "content/familia/resultado-blocos.md",
  ...readdirSync(raiz("content/familia/modulos")).map((arquivo) => `content/familia/modulos/${arquivo}`),
  ...readdirSync(raiz("content/familia/cenarios")).map((arquivo) => `content/familia/cenarios/${arquivo}`),
];

const TELAS = [
  "app/familia/page.tsx",
  "app/familia/seguranca/page.tsx",
  "components/familia/ContatosEmergencia.tsx",
  "components/familia/ExercicioSemana.tsx",
  "app/familia/programa/modulo/[n]/ModuloCliente.tsx",
  "app/familia/programa/simulador/[cenario]/SimuladorCliente.tsx",
  "app/familia/resultado/ResultadoVisao.tsx",
];

const GENERO = [/\(a\)/i, /\(ã\)/i, /\(o\)/i, /\(as\)/i, /\(os\)/i];
// Mesma lista do teste do resultado: o fallback do apelido caindo num lugar errado.
const ERROS_SEM_APELIDO = ["de a pessoa", "por a pessoa", "que quem", "a pessoa que você ama", "{{"];

const semComentario = (texto) => texto.replace(/<!--[\s\S]*?-->/g, "");

test("nenhum texto do programa tem palavra proibida, travessão ou gênero com parênteses", () => {
  for (const arquivo of [...MARKDOWN, ...TELAS]) {
    const conteudo = semComentario(ler(arquivo)).toLowerCase();
    for (const palavra of PALAVRAS_PROIBIDAS) assert.ok(!conteudo.includes(palavra), `${arquivo} contém "${palavra}"`);
    for (const padrao of GENERO) assert.ok(!padrao.test(conteudo), `${arquivo} marca gênero com ${padrao}`);
  }
});

test("módulos sem apelido não deixam variável nem preposição errada", () => {
  for (const arquivo of MARKDOWN.filter((caminho) => caminho.includes("/modulos/"))) {
    const linhas = semComentario(ler(arquivo)).replace(/^---[\s\S]*?\n---\n/, "").split(/\r?\n/);
    for (const linha of linhas) {
      // Como o leitor do markdown mostra: sem o "- ", "1. " e "## " do começo da linha.
      const texto = linha.replace(/^(-|\d+\.|##)\s+/, "");
      for (const apelido of ["", "Lu"]) {
        const final = aplicarApelido(texto, apelido);
        for (const erro of ERROS_SEM_APELIDO) assert.ok(!final.includes(erro), `${arquivo}: "${final}" contém "${erro}"`);
      }
    }
  }
});
