// Testes do resultado do programa para familiares (briefing, seção 13, Fase 1):
// - toda combinação de problema principal, Q5, Q6 e safety_mode monta sem bloco faltando;
// - nenhum bloco tem palavra proibida nem travessão;
// - nenhuma variável sobra depois de aplicar o apelido (com e sem apelido).
// Roda com `npm test`. O Node lê os .ts direto (tira os tipos).

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { lerBlocos, montarResultado, ESTAGIOS, PROBLEMAS, PRIORIDADE_REACAO, PALAVRAS_PROIBIDAS } from "../lib/familia/resultado.ts";
import { aplicarApelido, calcularSafetyMode, perguntasVisiveis, sanitizarRespostas } from "../lib/familia/diagnostico.ts";

const markdown = readFileSync(fileURLToPath(new URL("../content/familia/resultado-blocos.md", import.meta.url)), "utf8");
const blocos = lerBlocos(markdown);

function textosDo(resultado) {
  const { conversa } = resultado;
  return [
    ...resultado.acolhimento,
    ...resultado.aSeuFavor,
    resultado.pontoDeAtencao,
    resultado.seguranca,
    resultado.umPasso,
    ...resultado.avisos.map((aviso) => aviso.texto),
    ...(conversa
      ? [conversa.quando, conversa.abertura, ...conversa.frasesUteis, ...conversa.evite, conversa.seReagirMal.orientacao, conversa.seReagirMal.frase]
      : []),
  ].filter(Boolean);
}

test("nenhum bloco tem palavra proibida nem travessão", () => {
  for (const [id, linhas] of blocos) {
    const conteudo = linhas.join(" ").toLowerCase();
    for (const palavra of PALAVRAS_PROIBIDAS) assert.ok(!conteudo.includes(palavra), `${id} contém "${palavra}"`);
  }
});

const FREQUENCIAS = ["diario", "semanal", "fim_de_semana", "nao_sei"];
const DINHEIRO = ["nao", "pouco", "muito", "nao_sei"];
const ESGOTAMENTO = ["0", "1", "2", "3"];
// Trechos que aparecem quando o fallback do apelido cai num lugar errado (ajuste de 10/11/2026).
const ERROS_SEM_APELIDO = ["de a pessoa", "por a pessoa", "que quem", "a pessoa que você ama"];

test("toda combinação (problema principal, Q3b, Q5, Q6, Q10, Q11, safety_mode) monta sem bloco faltando", () => {
  let combinacoes = 0;
  for (const principal of PROBLEMAS) {
    // Os três marcados, com o principal primeiro: assim álcool está sempre presente e a Q3b vale.
    const problemas = [principal, ...PROBLEMAS.filter((outro) => outro !== principal)];
    for (const frequencia_alcool of FREQUENCIAS) {
      for (const estagio of ESTAGIOS) {
        for (const reacao of PRIORIDADE_REACAO) {
          for (const dinheiro of DINHEIRO) {
            for (const esgotamento of ESGOTAMENTO) {
              for (const safetyMode of [false, true]) {
                const respostas = {
                  problemas,
                  frequencia_alcool,
                  estagio,
                  reacoes: [reacao],
                  tempo: "medio",
                  esgotamento,
                  mora_junto: "sim",
                  medo: safetyMode ? "hoje" : "nao",
                  agressao: "nao",
                  dinheiro,
                };
                const resultado = montarResultado(respostas, blocos, safetyMode);
                assert.equal(resultado.conversa === null, safetyMode);
                assert.equal(resultado.seguranca !== null, safetyMode);
                if (resultado.conversa) {
                  assert.equal(resultado.conversa.evite.length, 2);
                  for (const item of resultado.conversa.evite) assert.ok(!item.startsWith("-"), `item com hífen: ${item}`);
                }
                assert.ok(resultado.aSeuFavor.length >= 1 && resultado.aSeuFavor.length <= 3);
                if (safetyMode) assert.ok(!resultado.aSeuFavor.includes(blocos.get("FAVOR_SEM_VIOLENCIA").join(" ")));
                for (const apelido of ["Lu", ""]) {
                  for (const trecho of textosDo(resultado)) {
                    const final = aplicarApelido(trecho, apelido);
                    assert.ok(!final.includes("{{"), `variável sobrando: ${final}`);
                    if (!apelido) for (const erro of ERROS_SEM_APELIDO) assert.ok(!final.includes(erro), `"${erro}" em: ${final}`);
                  }
                }
                combinacoes++;
              }
            }
          }
        }
      }
    }
  }
  assert.equal(combinacoes, 3 * 4 * 5 * 6 * 4 * 4 * 2);
});

test("todos os blocos sem apelido não têm erro de concordância", () => {
  for (const [id, linhasDoBloco] of blocos) {
    for (const linha of linhasDoBloco) {
      const final = aplicarApelido(linha.replace(/^-\s+/, ""), "");
      for (const erro of ERROS_SEM_APELIDO) assert.ok(!final.includes(erro), `${id}: "${erro}" em: ${final}`);
    }
  }
});

test("avisos: álcool pela Q3b, apostas pela Q10, outras drogas sem card", () => {
  const base = { estagio: "NAO_RECONHECE", reacoes: ["nega"], tempo: "curto", esgotamento: "0", mora_junto: "sim", medo: "nao", agressao: "nao" };
  const ids = (respostas) => montarResultado({ ...base, ...respostas }, blocos, false).avisos.map((aviso) => aviso.texto);
  const bloco = (id) => blocos.get(id).join(" ");
  assert.deepEqual(ids({ problemas: ["alcool"], frequencia_alcool: "diario", dinheiro: "nao" }), [bloco("AVISO_ALCOOL_DIARIO")]);
  assert.deepEqual(ids({ problemas: ["alcool"], frequencia_alcool: "nao_sei", dinheiro: "nao" }), [bloco("AVISO_ALCOOL_NAO_SEI")]);
  assert.deepEqual(ids({ problemas: ["alcool"], frequencia_alcool: "semanal", dinheiro: "nao" }), []);
  assert.deepEqual(ids({ problemas: ["alcool"], frequencia_alcool: "fim_de_semana", dinheiro: "nao" }), []);
  assert.deepEqual(ids({ problemas: ["outras_drogas"], dinheiro: "nao" }), []);
  assert.deepEqual(ids({ problemas: ["apostas"], dinheiro: "muito" }), [bloco("AVISO_APOSTAS_MUITO")]);
  for (const dinheiro of ["nao", "pouco", "nao_sei"]) assert.deepEqual(ids({ problemas: ["apostas"], dinheiro }), [bloco("AVISO_APOSTAS_PREVENIR")]);
});

test("evite: um item pela reação e um pelo problema principal", () => {
  const resultado = montarResultado(
    { problemas: ["apostas", "alcool"], frequencia_alcool: "semanal", estagio: "NAO_RECONHECE", reacoes: ["muda_de_assunto", "se_afasta"], tempo: "curto", esgotamento: "0", mora_junto: "sim", medo: "nao", agressao: "nao", dinheiro: "nao" },
    blocos,
    false,
  );
  // Prioridade: se afasta vem antes de muda de assunto.
  assert.deepEqual(resultado.conversa.evite, [blocos.get("EVITE_REACAO_SE_AFASTA").join(" "), blocos.get("EVITE_PROBLEMA_APOSTAS")[0].replace(/^-\s+/, "")]);
});

test("pergunta 3b só vale com álcool marcado", () => {
  assert.equal(perguntasVisiveis({ problemas: ["apostas"] }).some((pergunta) => pergunta.chave === "frequencia_alcool"), false);
  assert.equal(perguntasVisiveis({ problemas: ["apostas", "alcool"] }).some((pergunta) => pergunta.chave === "frequencia_alcool"), true);
  assert.deepEqual(sanitizarRespostas({ problemas: ["apostas"], frequencia_alcool: "diario" }), { problemas: ["apostas"] });
});

test("safety_mode liga com medo hoje ou agressão frequente", () => {
  assert.equal(calcularSafetyMode({ medo: "hoje", agressao: "nao" }), true);
  assert.equal(calcularSafetyMode({ medo: "nao", agressao: "frequente" }), true);
  assert.equal(calcularSafetyMode({ medo: "passado", agressao: "raramente" }), false);
});

test("apelido vazio vira 'quem você ama' e o vocativo some", () => {
  assert.equal(aplicarApelido('"{{apelido}}, posso te falar?"', ""), '"Posso te falar?"');
  assert.equal(aplicarApelido("{{apelido}} quer mudar.", ""), "Quem você ama quer mudar.");
  assert.equal(aplicarApelido("tempo com {{apelido}}.", ""), "tempo com quem você ama.");
  assert.equal(aplicarApelido('"{{apelido}}, posso?"', "Lu"), '"Lu, posso?"');
  assert.equal(aplicarApelido("Você contou que {{apelido}} costuma negar.", ""), "Você contou que a pessoa costuma negar.");
  assert.equal(aplicarApelido("Que {{apelido}} aceite ajuda", ""), "Que a pessoa aceite ajuda");
});

test("sanitizar descarta chave e valor desconhecidos", () => {
  const limpo = sanitizarRespostas({ problemas: ["apostas", "x", "apostas"], estagio: "QUALQUER", email: "a@b.c", apelido: "  {Lu}  " });
  assert.deepEqual(limpo, { problemas: ["apostas"], apelido: "Lu" });
});
