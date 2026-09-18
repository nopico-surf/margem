#!/usr/bin/env node
// Lint das regras verificáveis do CLAUDE.md seção 7 e do docs/instrucoes-design.md.
//
// Roda com baseline: cada regra guarda a contagem atual por arquivo em
// scripts/lint-regras.baseline.json. O lint só reprova quando a contagem de um arquivo SOBE acima
// do baseline. Isso deixa o estado atual (cheio de px e hex crus) passar, e só bloqueia regressão
// nova. `--update-baseline` reescreve o arquivo com as contagens atuais (usar depois de limpar algo
// de propósito, nunca para silenciar um lint que reprovou).
//
// O que este lint NÃO tenta verificar: CTA no infinitivo, "pessoa antes da situação", copy sem
// título de seção. São julgamento de linguagem, não checagem mecânica, e viram falso positivo.

import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASELINE_PATH = join(ROOT, "scripts", "lint-regras.baseline.json");
const UPDATE_BASELINE = process.argv.includes("--update-baseline");

const SCAN_DIRS = ["app", "components", "lib"];
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".css"]);
const TOKENS_FILE = "app/tokens.css";

function listarArquivos(dir) {
  const resultado = [];
  const entradas = readdirSync(dir);
  for (const entrada of entradas) {
    const caminho = join(dir, entrada);
    const info = statSync(caminho);
    if (info.isDirectory()) {
      resultado.push(...listarArquivos(caminho));
    } else if (SCAN_EXTENSIONS.has(extname(caminho))) {
      resultado.push(caminho);
    }
  }
  return resultado;
}

function caminhoRelativo(caminho) {
  return relative(ROOT, caminho).split("\\").join("/");
}

function contarOcorrencias(regex, texto) {
  const matches = texto.match(regex);
  return matches ? matches.length : 0;
}

// --- Regras -----------------------------------------------------------------

const REGRA_TRAVESSAO = {
  id: "travessao",
  descricao: "Travessão (—) em texto de interface. Sinaliza texto gerado por IA (CLAUDE.md seção 7).",
  aplicaA: () => true,
  contar: (texto) => contarOcorrencias(/\u2014/g, texto),
};

const REGRA_PX_CRU = {
  id: "px-cru",
  descricao: "Valor em px cru fora de app/tokens.css. Deveria referenciar um token.",
  aplicaA: (caminho) => caminhoRelativo(caminho) !== TOKENS_FILE,
  contar: (texto) => contarOcorrencias(/(?<![\w-])\d+(?:\.\d+)?px\b/g, texto),
};

const REGRA_HEX_CRU = {
  id: "hex-cru",
  descricao: "Cor hex crua fora de app/tokens.css. Deveria referenciar um token.",
  aplicaA: (caminho) => caminhoRelativo(caminho) !== TOKENS_FILE,
  contar: (texto) => contarOcorrencias(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g, texto),
};

const REGRA_FIGMA_ASSET_URL = {
  id: "figma-asset-url",
  descricao: "URL de asset do Figma (figma.com/api/mcp/asset). Expira em 7 dias, nunca vai pro código.",
  aplicaA: () => true,
  contar: (texto) => contarOcorrencias(/figma\.com\/api\/mcp\/asset/g, texto),
};

const REGRA_NUMBERS_DIRETO = {
  id: "numbers-direto",
  descricao: "--numbers-* usado direto numa tela. Primitivo não vai pra tela, só outros tokens apontam pra ele.",
  aplicaA: (caminho) => caminhoRelativo(caminho) !== TOKENS_FILE,
  contar: (texto) => contarOcorrencias(/--numbers-[\w-]+/g, texto),
};

const REGRAS_POR_CONTAGEM = [
  REGRA_TRAVESSAO,
  REGRA_PX_CRU,
  REGRA_HEX_CRU,
  REGRA_FIGMA_ASSET_URL,
  REGRA_NUMBERS_DIRETO,
];

// Ícone referenciando arquivo que não existe em /public. Regra à parte: não é contagem por
// arquivo, é existência de arquivo, então reporta direto como erro, sem baseline.
function checarIconesQuebrados(caminho, texto, erros) {
  const regex = /["'`](\/(?:icons|assets)\/[\w.\-\/]+\.(?:svg|png|jpg|jpeg))["'`]/g;
  let match;
  while ((match = regex.exec(texto))) {
    const caminhoPublico = join(ROOT, "public", match[1]);
    if (!existsSync(caminhoPublico)) {
      const linha = texto.slice(0, match.index).split("\n").length;
      erros.push(`${caminhoRelativo(caminho)}:${linha} referencia "${match[1]}", que não existe em /public`);
    }
  }
}

// --- Execução -----------------------------------------------------------------

function carregarBaseline() {
  if (!existsSync(BASELINE_PATH)) return {};
  return JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
}

function main() {
  const arquivos = SCAN_DIRS.filter((dir) => existsSync(join(ROOT, dir))).flatMap((dir) =>
    listarArquivos(join(ROOT, dir))
  );

  const baseline = carregarBaseline();
  const contagensAtuais = {};
  const regressoes = [];
  const errosIcone = [];

  for (const caminho of arquivos) {
    const rel = caminhoRelativo(caminho);
    const texto = readFileSync(caminho, "utf8");

    checarIconesQuebrados(caminho, texto, errosIcone);

    for (const regra of REGRAS_POR_CONTAGEM) {
      if (!regra.aplicaA(caminho)) continue;
      const contagem = regra.contar(texto);
      if (contagem === 0) continue;

      contagensAtuais[regra.id] ??= {};
      contagensAtuais[regra.id][rel] = contagem;

      const contagemBaseline = baseline[regra.id]?.[rel] ?? 0;
      if (contagem > contagemBaseline) {
        regressoes.push(
          `${rel}: ${regra.id} subiu de ${contagemBaseline} para ${contagem} (${regra.descricao})`
        );
      }
    }
  }

  if (UPDATE_BASELINE) {
    writeFileSync(BASELINE_PATH, JSON.stringify(contagensAtuais, null, 2) + "\n");
    console.log(`Baseline atualizado em ${caminhoRelativo(BASELINE_PATH)}.`);
    return;
  }

  if (errosIcone.length > 0) {
    console.error("Ícones referenciando arquivo inexistente:\n");
    for (const erro of errosIcone) console.error(`  ${erro}`);
    console.error("");
  }

  if (regressoes.length > 0) {
    console.error("Regras do CLAUDE.md seção 7 regrediram:\n");
    for (const regressao of regressoes) console.error(`  ${regressao}`);
    console.error("\nSe a subida foi de propósito (ex: limpando px cru), rode com --update-baseline.");
  }

  if (errosIcone.length > 0 || regressoes.length > 0) {
    process.exitCode = 1;
  } else {
    console.log("lint-regras: nenhuma regressão nas regras verificáveis.");
  }
}

main();
