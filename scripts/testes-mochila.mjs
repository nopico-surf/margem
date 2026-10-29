#!/usr/bin/env node
// Testes da lógica da Mochila do Rolê (lib/mochila): encaixe, código do desafio e rótulos.
// Roda com `node scripts/testes-mochila.mjs`, sem dependência nova: o Node 24 lê TypeScript direto
// e o gancho abaixo só acrescenta o ".ts" que os imports do projeto omitem.

import { register } from "node:module";
import assert from "node:assert/strict";

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
const { rotulo, ficouDeFora, ROTULOS } = await import("../lib/mochila/rotulo.ts");

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

teste("rótulo 1: quem pensa na volta", () => {
  assert.equal(rotulo("festa", ["dinheiro", "telefone", "carregador"], []).nome, "Mochila de quem pensa na volta");
});
teste("rótulo 2: quem cuida do corpo", () => {
  assert.equal(rotulo("festa", ["garrafa", "lanche"], []).nome, "Mochila de quem cuida do corpo");
});
teste("rótulo 3: quem cuida do grupo", () => {
  assert.equal(rotulo("festa", ["telefone"], [0, 2]).nome, "Mochila de quem cuida do grupo");
});
teste("rótulo 4: quem veio pra festa", () => {
  assert.equal(rotulo("festa", ["fone", "maquiagem"], []).nome, "Mochila de quem veio pra festa");
});
teste("rótulo 5: leve", () => {
  assert.equal(rotulo("festa", ["documento", "bala"], []).nome, "Mochila leve");
});
teste("rótulo 6: pronta pro rolê", () => {
  assert.equal(rotulo("festa", ["documento", "bala", "lanche", "telefone", "dinheiro"], []).nome, "Mochila pronta pro rolê");
});
teste("rótulo sazonal: vira o ano bem", () => {
  assert.equal(rotulo("virada", ["calcado", "dinheiro", "telefone", "carregador"], [1]).nome, "Mochila de quem vira o ano bem");
});
teste("rótulo nunca depende de item de nível 1 ou 2", () => {
  const sensiveis = Object.values(ITENS).filter((it) => it.nivel > 0).map((it) => it.id);
  for (const c of CENARIOS) {
    const base = ["documento", "bala", "lanche", "telefone"];
    assert.equal(rotulo(c.id, [...base, ...sensiveis.filter((id) => c.itens.includes(id))], []), rotulo(c.id, base, []));
  }
});

teste("toda frase de rótulo começa igual", () => {
  for (const r of ROTULOS) assert.ok(r.frase.startsWith("Você é o redutor de danos que "), r.nome);
});

teste("ficou de fora: menor prioridade e nunca item de nível 2", () => {
  assert.equal(ficouDeFora("festa", []), "garrafa");
  assert.equal(ficouDeFora("festa", ["garrafa", "telefone"]), "dinheiro");
  const todos = CENARIOS[0].itens.filter((id) => ITENS[id].prioridade !== null);
  assert.equal(ficouDeFora("festa", todos), null);
});

teste("cada cenário oferece 17 itens e mais de 9 espaços", () => {
  for (const c of CENARIOS) {
    assert.equal(c.itens.length, 17, c.id);
    assert.ok(espacosUsados(c.itens) > CAPACIDADE);
  }
});

teste("nenhum texto com travessão", () => {
  const textos = [
    ...Object.values(ITENS).flatMap((it) => [it.nome, it.curto, it.revelacao, it.fora ?? ""]),
    ...CENARIOS.flatMap((c) => [c.nome, c.apoio, c.abertura, ...c.combinados]),
    ...ROTULOS.flatMap((r) => [r.nome, r.frase]),
  ];
  for (const t of textos) assert.ok(!t.includes("—"), t);
});

if (falhas) {
  console.log(`\n${falhas} teste(s) falharam`);
  process.exit(1);
}
console.log("\ntodos os testes passaram");
