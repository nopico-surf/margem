"use client";

// SÓ DESENVOLVIMENTO: modo "sem login" do programa para familiares, enquanto o login social não está
// ligado no Supabase (pedido do fundador em 10/11/2026). Liga pelo botão "Entrar sem login" da tela
// de login, só no localhost. Em produção MODO_DEV_DISPONIVEL é false e nada daqui roda.
//
// Com o modo ligado, chamarApi (auth-cliente.ts) não vai pros route handlers com token: responde
// daqui, com o diagnóstico guardado no aparelho. Nada é gravado no banco. O resultado é montado no
// servidor pela rota de exemplo (também só dev), e o simulador vai pro servidor com o cabeçalho
// x-familia-dev, que a rota só aceita fora de produção.

import { ITEM_DO_DIARIO } from "./diario";
import { dataDoDia, dataValida, diaDaSemana, sanitizarMeta, sanitizarNotas, segundaDaSemana, type Meta } from "./escala";

export const MODO_DEV_DISPONIVEL = process.env.NODE_ENV !== "production";

const CHAVE_MODO = "margem-familia-dev";
const CHAVE_DIAGNOSTICO = "margem-familia-dev-diagnostico";
const CHAVE_EXERCICIOS = "margem-familia-dev-exercicios";
const CHAVE_DIARIO = "margem-familia-dev-diario";
const CHAVE_ESCALAS = "margem-familia-dev-escalas";
const CHAVE_META = "margem-familia-dev-meta";

// A primeira vez vale, como no banco.
function marcarItem(modulo: number, item: string) {
  const exercicios = JSON.parse(ler(CHAVE_EXERCICIOS) ?? "{}") as Record<string, string>;
  const chave = `${modulo}:${item}`;
  if (!exercicios[chave]) exercicios[chave] = new Date().toISOString();
  gravar(CHAVE_EXERCICIOS, JSON.stringify(exercicios));
}

function ler(chave: string) {
  try {
    return window.localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: string | null) {
  try {
    if (valor === null) window.localStorage.removeItem(chave);
    else window.localStorage.setItem(chave, valor);
  } catch {}
}

export function devAtivo() {
  return MODO_DEV_DISPONIVEL && typeof window !== "undefined" && ler(CHAVE_MODO) === "1";
}

export function ativarDev() {
  if (MODO_DEV_DISPONIVEL) gravar(CHAVE_MODO, "1");
}

function json(dados: unknown, status = 200) {
  return new Response(JSON.stringify(dados), { status, headers: { "Content-Type": "application/json" } });
}

function respostasGuardadas(): unknown {
  const bruto = ler(CHAVE_DIAGNOSTICO);
  return bruto ? JSON.parse(bruto) : null;
}

async function montar(respostas: unknown) {
  const resposta = await fetch("/api/familia/exemplo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ respostas }),
  });
  return json(await resposta.json(), resposta.status);
}

export async function respostaDev(caminho: string, init?: RequestInit): Promise<Response> {
  const metodo = init?.method ?? "GET";
  const corpo = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {};

  if (caminho === "/api/familia/perfil") {
    if (metodo === "POST") return json({ ok: true });
    return json({ temPerfil: true, precisaEmail: false, safetyMode: false, acessoLiberado: false, temDiagnostico: Boolean(ler(CHAVE_DIAGNOSTICO)) });
  }

  if (caminho === "/api/familia/diagnostico") {
    if (metodo === "POST") {
      gravar(CHAVE_DIAGNOSTICO, JSON.stringify(corpo.respostas ?? {}));
      return montar(corpo.respostas);
    }
    const guardadas = respostasGuardadas();
    return guardadas ? montar(guardadas) : json({ error: "sem_diagnostico" }, 404);
  }

  if (caminho === "/api/familia/progresso") return json({ ok: true });

  // Exercício da semana e diário, guardados no aparelho.
  if (caminho.startsWith("/api/familia/exercicio")) {
    const exercicios = JSON.parse(ler(CHAVE_EXERCICIOS) ?? "{}") as Record<string, string>;
    if (metodo === "POST") {
      marcarItem(Number(corpo.modulo), String(corpo.item));
      return json({ ok: true });
    }
    const modulo = new URLSearchParams(caminho.split("?")[1] ?? "").get("modulo");
    const prefixo = `${modulo}:`;
    return json({ itens: Object.fromEntries(Object.entries(exercicios).filter(([chave]) => chave.startsWith(prefixo)).map(([chave, data]) => [chave.slice(prefixo.length), data])) });
  }

  if (caminho === "/api/familia/diario") {
    const anotacoes = JSON.parse(ler(CHAVE_DIARIO) ?? "[]") as unknown[];
    if (metodo === "POST") {
      gravar(CHAVE_DIARIO, JSON.stringify([{ id: crypto.randomUUID(), ...(corpo.anotacao as object) }, ...anotacoes]));
      marcarItem(ITEM_DO_DIARIO.modulo, ITEM_DO_DIARIO.item);
      return json({ ok: true });
    }
    return json({ anotacoes });
  }

  // Escala e meta da semana, guardadas no aparelho, com as mesmas regras das rotas.
  if (caminho === "/api/familia/escala") {
    const escalas = JSON.parse(ler(CHAVE_ESCALAS) ?? "[]") as Array<Record<string, unknown>>;
    if (metodo === "POST") {
      const notas = sanitizarNotas(corpo.notas);
      if (!notas) return json({ error: "escala_invalida" }, 400);
      gravar(CHAVE_ESCALAS, JSON.stringify([{ id: crypto.randomUUID(), origem: corpo.origem, notas, criado_em: new Date().toISOString() }, ...escalas].slice(0, 2)));
      if (corpo.origem === "modulo7") marcarItem(7, "escala");
      return json({ ok: true });
    }
    return json({ escalas });
  }

  if (caminho === "/api/familia/meta") {
    const atual = JSON.parse(ler(CHAVE_META) ?? "null") as Meta | null;
    const hoje = corpo.hoje as string;
    if (metodo === "POST") {
      const meta = sanitizarMeta(corpo.meta);
      if (!meta || !dataValida(hoje)) return json({ error: "meta_invalida" }, 400);
      const nova: Meta = atual
        ? { ...atual, ...meta }
        : { id: crypto.randomUUID(), ...meta, semana_inicio: segundaDaSemana(hoje), status: "ativa", dias_feitos: [] };
      gravar(CHAVE_META, JSON.stringify(nova));
      if (corpo.modulo === 1) marcarItem(1, "escala");
      if (corpo.modulo === 7) marcarItem(7, "meta");
      return json({ meta: nova });
    }
    if (metodo === "PATCH") {
      if (!atual) return json({ error: "sem_meta" }, 404);
      const dia = diaDaSemana(hoje);
      if (!atual.dias.includes(dia) || dataDoDia(atual.semana_inicio, dia) !== hoje) return json({ error: "dia_nao_marcado" }, 400);
      if (!atual.dias_feitos.includes(hoje)) atual.dias_feitos.push(hoje);
      gravar(CHAVE_META, JSON.stringify(atual));
      return json({ meta: atual });
    }
    return json({ meta: atual });
  }

  if (caminho === "/api/familia/simulador") {
    return fetch(caminho, {
      ...init,
      headers: { "Content-Type": "application/json", "x-familia-dev": "1" },
      body: JSON.stringify({ ...corpo, respostasDev: respostasGuardadas() }),
    });
  }

  return json({ error: "nao_encontrado" }, 404);
}
