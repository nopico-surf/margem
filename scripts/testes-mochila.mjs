#!/usr/bin/env node
// Testes da lógica da Mochila do Rolê (lib/mochila): encaixe, código do desafio e rótulos.
// Roda com `node scripts/testes-mochila.mjs`, sem dependência nova: o Node 24 lê TypeScript direto
// e o gancho abaixo só acrescenta o ".ts" que os imports do projeto omitem.

import { register } from "node:module";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

register(
  "data:text/javascript," +
    encodeURIComponent(`
export async function resolve(spec, ctx, next) {
  if (spec.startsWith(".") && !/\\.[a-z]+$/.test(spec)) return next(spec + ".ts", ctx);
  return next(spec, ctx);
}`),
);

const { CENARIOS, ITENS, CAPACIDADE } = await import("../lib/mochila/conteudo.ts");
const { encaixar, cabe, espacosUsados } = await import("../lib/mochila/encaixe.ts");
const { codificar, decodificar } = await import("../lib/mochila/codigo.ts");
const { rotulo, ficouDeFora } = await import("../lib/mochila/rotulo.ts");
const { eixos, eixosDeValores } = await import("../lib/mochila/eixos.ts");

let falhas = 0;
function teste(nome, fn) {
  try {
    fn();
    console.log(`ok   ${nome}`);
  } catch (e) {
    falhas++;
    console.log(`FALHA ${nome}\n     ${e.message}`);
  }
}

// --- encaixe ---------------------------------------------------------------

teste("encaixe: nunca passa de 9 espaços", () => {
  for (const c of CENARIOS) {
    const levados = [];
    for (const id of c.itens) if (cabe(levados, id)) levados.push(id);
    assert.ok(espacosUsados(levados) <= CAPACIDADE);
    const pos = encaixar(levados);
    assert.ok(pos);
    const celulas = new Set();
    for (const p of pos) for (let k = 0; k < p.espacos; k++) {
      const chave = `${p.linha},${p.coluna + k}`;
      assert.ok(!celulas.has(chave), "duas peças na mesma célula");
      assert.ok(p.coluna + k < 3 && p.linha < 3, "peça fora da grade");
      celulas.add(chave);
    }
  }
});

teste("encaixe: reorganiza antes de recusar um item de 2", () => {
  // Na ordem, os itens de 1 ocupam a coluna do meio das três fileiras e não sobra par livre.
  const ids = ["telefone", "dinheiro", "lanche", "documento", "camisinha", "bala"];
  assert.equal(espacosUsados(ids), 6);
  assert.ok(cabe(ids, "garrafa"), "garrafa deveria caber depois de reorganizar");
  const comTres = ["garrafa", "carregador", "caixa-de-som", "telefone", "dinheiro", "lanche"];
  assert.ok(encaixar(comTres), "três itens de 2 + três de 1 = 9 espaços cabem");
});

teste("encaixe: recusa quando passa de 9", () => {
  const nove = ["garrafa", "carregador", "caixa-de-som", "telefone", "dinheiro", "lanche"];
  assert.equal(espacosUsados(nove), 9);
  assert.equal(cabe(nove, "documento"), false);
});

// --- código do desafio -----------------------------------------------------

teste("código: ida e volta devolve as mesmas escolhas em todos os cenários", () => {
  for (const c of CENARIOS) {
    for (let rodada = 0; rodada < 200; rodada++) {
      const itens = c.itens.filter((_, i) => (rodada * 7919 + i * 104729) % 3 === 0);
      const combinados = c.combinados.map((_, i) => i).filter((i) => (rodada >> i) & 1);
      const volta = decodificar(codificar({ cenario: c.id, itens, combinados }));
      assert.ok(volta, `não decodificou ${c.id}`);
      assert.equal(volta.cenario, c.id);
      assert.deepEqual([...volta.itens].sort(), [...itens].sort());
      assert.deepEqual(volta.combinados, combinados);
    }
  }
});

teste("código: inválido ou de versão antiga vira null", () => {
  for (const ruim of ["", "x", "0a12", "1z00", "1", "ABC", "1/../2"]) assert.equal(decodificar(ruim), null, ruim);
});

// --- rótulo ----------------------------------------------------------------

// Como a Partida faz: eixos a partir das escolhas, rótulo a partir dos eixos.
function montar(cenario, itens, combinados = [], { semCombinados = false, jeitos = [] } = {}) {
  return rotulo(cenario, itens, combinados, eixos(cenario, itens, combinados, semCombinados, jeitos));
}

// Um eixo no extremo do polo pedido e os outros três no meio: o rótulo sai desse polo.
function rotuloDoPolo(polo) {
  const valores = eixosDeValores([50, 50, 50, 50]).map((e) => (e.a === polo ? 100 : e.b === polo ? 0 : 50));
  return rotulo("festa", [], [], eixosDeValores(valores));
}
const POLOS = eixosDeValores([50, 50, 50, 50]).flatMap((e) => [e.a, e.b]);

// Uma mochila montada de verdade para cada polo, com a primeira linha e o "e também" esperados.
const POR_MONTAGEM = [
  ["corpo", ["festa", ["garrafa", "lanche"]], "Mochila de quem cuida do corpo", "e também leva o essencial"],
  ["festa", ["festa", ["fone", "maquiagem"]], "Mochila de quem veio pra festa", "e também veio pra ficar"],
  ["grupo", ["festa", ["telefone", "fone"], [0, 2]], "Mochila de quem cuida do grupo", "e também leva o essencial"],
  ["autonomia", ["show", ["documento", "pochete", "dinheiro", "carregador"], [], { semCombinados: true }], "Mochila de quem se resolve sozinho", "e também pensa na volta"],
  ["volta", ["festa", ["telefone", "dinheiro", "carregador", "fone", "labial", "lenco"]], "Mochila de quem pensa na volta", "e também leva o essencial"],
  ["presença", ["bloco", ["bone", "glitter", "protetor-solar"]], "Mochila de quem veio pra ficar", "e também leva o essencial"],
  [
    "planejamento",
    ["festa", ["garrafa", "telefone", "dinheiro", "lanche", "carregador", "documento", "fone"], [0, 1, 2, 3], { jeitos: ["hora", "lembrou"] }],
    "Mochila de quem pensou em tudo",
    "e também pensa na volta",
  ],
  ["leveza", ["festa", []], "Mochila leve de propósito", "e também cuida do corpo"],
];

for (const [polo, args, nome, tambem] of POR_MONTAGEM) {
  teste(`rótulo: ${polo}`, () => {
    const r = montar(...args);
    assert.equal(r.nome, nome);
    assert.equal(r.tambem, tambem);
  });
}

teste("rótulo: o \"e também\" vem do segundo eixo mais extremo", () => {
  const r = rotulo("festa", [], [], eixosDeValores([100, 10, 50, 50]));
  assert.equal(r.nome, "Mochila de quem cuida do corpo");
  assert.equal(r.tambem, "e também se resolve sozinho");
});

teste("rótulo: empate fica na ordem dos eixos", () => {
  const r = rotulo("festa", [], [], eixosDeValores([0, 50, 100, 50]));
  assert.equal(r.nome, "Mochila de quem veio pra festa");
  assert.equal(r.tambem, "e também pensa na volta");
});

teste("rótulo: cada polo tem rótulo e \"e também\" próprios", () => {
  assert.equal(POLOS.length, 8);
  assert.equal(new Set(POLOS.map((p) => rotuloDoPolo(p).nome)).size, 8);
  // Cada polo como segundo eixo mais extremo, atrás de um primeiro que não é dele.
  const tambens = POLOS.map((p) => {
    const valores = eixosDeValores([50, 50, 50, 50]).map((e) => (e.a === p ? 90 : e.b === p ? 10 : 50));
    const primeiro = valores[0] === 50 ? 0 : 1;
    valores[primeiro] = 100;
    return rotulo("festa", [], [], eixosDeValores(valores)).tambem;
  });
  assert.equal(new Set(tambens).size, 8);
});

teste("rótulo sazonal: vira o ano bem, com o \"e também\" do eixo mais extremo", () => {
  const r = montar("virada", ["calcado", "dinheiro", "telefone", "carregador"], [1]);
  assert.equal(r.nome, "Mochila de quem vira o ano bem");
  assert.equal(r.tambem, "e também cuida do corpo");
});

teste("rótulo sazonal: sem o calçado ou sem combinar a volta, o rótulo sai dos eixos", () => {
  assert.equal(montar("virada", ["calcado", "dinheiro", "telefone", "carregador"], [0]).nome, "Mochila de quem cuida do corpo");
  assert.equal(montar("virada", ["dinheiro", "telefone", "carregador"], [1]).nome, "Mochila de quem cuida do corpo");
});

// Item de nível 1 ou 2 entra na conta dos eixos (ver eixosDeValores), mas o rótulo em si não olha
// para ele: com os mesmos eixos, o resultado é o mesmo.
teste("rótulo: com os mesmos eixos, item de nível 1 ou 2 não muda nada", () => {
  const sensiveis = Object.values(ITENS).filter((it) => it.nivel > 0).map((it) => it.id);
  for (const c of CENARIOS) {
    const base = ["documento", "bala", "lanche", "telefone"];
    const e = eixos(c.id, base, [], false, []);
    const comSensiveis = [...base, ...sensiveis.filter((id) => c.itens.includes(id))];
    assert.deepEqual(rotulo(c.id, comSensiveis, [], e), rotulo(c.id, base, [], e), c.id);
  }
});

teste("toda frase de rótulo começa igual", () => {
  const frases = [
    ...POLOS.map((p) => rotuloDoPolo(p)),
    montar("virada", ["calcado", "dinheiro", "telefone", "carregador"], [1]),
  ];
  for (const r of frases) assert.ok(r.frase.startsWith("Você é o redutor de danos que "), r.nome);
});

teste("ficou de fora: menor prioridade e nunca item de nível 2", () => {
  assert.equal(ficouDeFora("show", []), "garrafa");
  assert.equal(ficouDeFora("festa", ["garrafa", "telefone"]), "dinheiro");
  const todos = CENARIOS[0].itens.filter((id) => ITENS[id].prioridade !== null);
  assert.equal(ficouDeFora("festa", todos), null);
});

teste("ficou de fora: festa na casa de alguém não cobra a água", () => {
  assert.equal(ficouDeFora("festa", []), "telefone");
  const semAgua = CENARIOS[0].itens.filter((id) => id !== "garrafa" && ITENS[id].prioridade !== null);
  assert.equal(ficouDeFora("festa", semAgua), null);
});

teste("cada cenário oferece 17 itens e mais de 9 espaços", () => {
  for (const c of CENARIOS) {
    assert.equal(c.itens.length, 17, c.id);
    assert.ok(espacosUsados(c.itens) > CAPACIDADE);
  }
});

// Varre o código do jogo inteiro: dados, rótulos, eixos e o texto escrito direto nas telas.
const PASTAS_DO_JOGO = ["../lib/mochila/", "../components/mochila/", "../app/mochila/"];

teste("nenhum texto com travessão", () => {
  let arquivos = 0;
  for (const pasta of PASTAS_DO_JOGO) {
    const dir = new URL(pasta, import.meta.url);
    for (const nome of readdirSync(dir, { recursive: true })) {
      if (!/\.tsx?$/.test(nome)) continue;
      arquivos++;
      const texto = readFileSync(new URL(nome.replaceAll("\\", "/"), dir), "utf8");
      for (const [n, linha] of texto.split("\n").entries()) {
        assert.ok(!/—|\\u2014|&mdash;/.test(linha), `${pasta}${nome}:${n + 1}`);
      }
    }
  }
  assert.ok(arquivos > 0, "nenhum arquivo encontrado");
});

if (falhas) {
  console.log(`\n${falhas} teste(s) falharam`);
  process.exit(1);
}
console.log("\ntodos os testes passaram");
