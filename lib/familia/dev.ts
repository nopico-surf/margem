"use client";

// SÓ DESENVOLVIMENTO: modo "sem login" do programa para familiares, enquanto o login social não está
// ligado no Supabase (pedido do fundador em 10/11/2026). Liga pelo botão "Entrar sem login" da tela
// de login, só no localhost. Em produção MODO_DEV_DISPONIVEL é false e nada daqui roda.
//
// Com o modo ligado, chamarApi (auth-cliente.ts) não vai pros route handlers com token: responde
// daqui, com o diagnóstico guardado no aparelho. Nada é gravado no banco. O resultado é montado no
// servidor pela rota de exemplo (também só dev), e o simulador vai pro servidor com o cabeçalho
// x-familia-dev, que a rota só aceita fora de produção.

import { ITENS_DA_CONVERSA, sanitizarConversa } from "./conversa";
import { aplicarPasso, aplicarPausa, CONVITE_VAZIO, ITEM_CONTAR_M5, ITEM_PREPARAR_M5, PASSOS_DO_CONVITE, sanitizarResultado, type Convite } from "./convite";
import { itensParaMarcar, sanitizarAnotacao, type Anotacao } from "./diario";
import { alternarDiaFeito, dataValida, sanitizarMeta, sanitizarNotas, segundaDaSemana, type Meta } from "./escala";
import { FRASES_PARA_CONCLUIR, ITEM_FRASES_M3, LIMITE_DE_FRASES, sanitizarFrase } from "./frases";
import { validarCompra } from "./oferta";
import { aplicarRede, ITEM_APOIO_M7, REDE_VAZIA, type Rede } from "./rede";
import { adiarCompleto, ITEM_ADIAR_M4, ITEM_GOSTA_M4, ITEM_PLANO_M4, sanitizarAdiar, sanitizarGosta, sanitizarPlano, type Adiar, type PlanoValorizar } from "./valorizar";
import { pixDaPrevia } from "@/lib/apoio/pix-cliente";

export const MODO_DEV_DISPONIVEL = process.env.NODE_ENV !== "production";

const CHAVE_MODO = "margem-familia-dev";
const CHAVE_DIAGNOSTICO = "margem-familia-dev-diagnostico";
const CHAVE_EXERCICIOS = "margem-familia-dev-exercicios";
const CHAVE_DIARIO = "margem-familia-dev-diario";
const CHAVE_CONVERSA = "margem-familia-dev-conversa";
const CHAVE_ESCALAS = "margem-familia-dev-escalas";
const CHAVE_META = "margem-familia-dev-meta";
const CHAVE_FRASES = "margem-familia-dev-frases";
const CHAVE_VALORIZAR = "margem-familia-dev-valorizar";
const CHAVE_CONVITE = "margem-familia-dev-convite";
const CHAVE_REDE = "margem-familia-dev-rede";
const CHAVE_RETORNO_TREINO ="margem-familia-dev-retorno-treino";
const CHAVE_PROGRESSO = "margem-familia-dev-progresso";
// Compra simulada: { plano, pagoEm }. O Pix "cai" sozinho alguns segundos depois de gerado.
const CHAVE_COMPRA = "margem-familia-dev-compra";
const CHAVE_PIX = "margem-familia-dev-pix";
const PIX_CAI_EM_MS = 8000;
// Venda simulada: com "1", o localhost passa a travar os módulos 1 a 8 como em produção (compra e
// liberação semanal), pra ver o banner e a página de módulo bloqueado. Sem ela, como antes, todos os
// módulos abrem no localhost pra revisão do conteúdo. Liga com
// localStorage.setItem("margem-familia-dev-venda", "1") no console.
const CHAVE_VENDA = "margem-familia-dev-venda";

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

export function vendaSimulada() {
  return MODO_DEV_DISPONIVEL && typeof window !== "undefined" && ler(CHAVE_VENDA) === "1";
}

// Status do Pix simulado, consultado pela tela do QR no lugar de /api/apoio/[id]/status.
export function statusDoPixDev(apoioId: string): { status: string; pago: boolean } {
  const pix = JSON.parse(ler(CHAVE_PIX) ?? "null") as { id: string; plano: string; criadoEm: number } | null;
  if (!pix || pix.id !== apoioId) return { status: "cancelado", pago: false };
  if (Date.now() - pix.criadoEm < PIX_CAI_EM_MS) return { status: "aguardando", pago: false };
  if (!ler(CHAVE_COMPRA)) gravar(CHAVE_COMPRA, JSON.stringify({ plano: pix.plano, pagoEm: new Date().toISOString() }));
  return { status: "pago", pago: true };
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
    const compra = JSON.parse(ler(CHAVE_COMPRA) ?? "null") as { plano: string; pagoEm: string } | null;
    return json({ temPerfil: true, precisaEmail: false, safetyMode: false, acessoLiberado: Boolean(compra), temDiagnostico: Boolean(ler(CHAVE_DIAGNOSTICO)), compra });
  }

  // Pix simulado: um QR de exemplo, sem Asaas. Confere o valor como a rota.
  if (caminho === "/api/familia/pix") {
    const compra = validarCompra(corpo);
    if (!compra) return json({ error: "valor_invalido" }, 400);
    if (ler(CHAVE_COMPRA)) return json({ error: "acesso_ja_liberado" }, 409);
    const id = `dev-${crypto.randomUUID()}`;
    gravar(CHAVE_PIX, JSON.stringify({ id, plano: compra.plano, criadoEm: Date.now() }));
    const { payload, imagemBase64 } = pixDaPrevia(id);
    return json({ apoioId: id, qrCode: { payload, imagemBase64, expiraEm: null } });
  }

  if (caminho === "/api/familia/gratuidade") return json({ ok: true });
  // Pedido de devolução (briefing 01b): como a gratuidade, nada é gravado.
  if (caminho === "/api/familia/devolucao") return json({ ok: true });

  if (caminho === "/api/familia/diagnostico") {
    if (metodo === "POST") {
      gravar(CHAVE_DIAGNOSTICO, JSON.stringify(corpo.respostas ?? {}));
      return montar(corpo.respostas);
    }
    const guardadas = respostasGuardadas();
    return guardadas ? montar(guardadas) : json({ error: "sem_diagnostico" }, 404);
  }

  // Início e conclusão de módulo, guardados no aparelho (a primeira vez de cada um vale, como no banco).
  if (caminho === "/api/familia/progresso") {
    const modulos = JSON.parse(ler(CHAVE_PROGRESSO) ?? "{}") as Record<string, { iniciado_em: string; concluido_em: string | null }>;
    if (metodo !== "POST") return json({ modulos });
    const numero = String(corpo.modulo);
    const agora = new Date().toISOString();
    modulos[numero] ??= { iniciado_em: agora, concluido_em: null };
    if (corpo.acao === "concluir") modulos[numero].concluido_em = agora;
    gravar(CHAVE_PROGRESSO, JSON.stringify(modulos));
    return json({ ok: true });
  }

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

  // Diário: as mesmas regras da rota (sanitizar, concluir itens, editar e apagar).
  if (caminho.startsWith("/api/familia/diario")) {
    const anotacoes = JSON.parse(ler(CHAVE_DIARIO) ?? "[]") as Anotacao[];
    const concluir = (lista: Anotacao[]) => itensParaMarcar(lista).forEach((item) => marcarItem(item.modulo, item.item));
    if (metodo === "POST") {
      const anotacao = sanitizarAnotacao(corpo.anotacao);
      if (!anotacao) return json({ error: "anotacao_invalida" }, 400);
      const nova = [{ id: crypto.randomUUID(), ...anotacao }, ...anotacoes].sort((a, b) => b.quando.localeCompare(a.quando));
      gravar(CHAVE_DIARIO, JSON.stringify(nova));
      concluir(nova);
      return json({ ok: true });
    }
    if (metodo === "PATCH") {
      const anotacao = sanitizarAnotacao(corpo.anotacao);
      if (!anotacao) return json({ error: "anotacao_invalida" }, 400);
      const nova = anotacoes.map((atual) => (atual.id === corpo.id ? { id: atual.id, ...anotacao } : atual));
      gravar(CHAVE_DIARIO, JSON.stringify(nova));
      concluir(nova);
      return json({ ok: true });
    }
    if (metodo === "DELETE") {
      const id = new URLSearchParams(caminho.split("?")[1] ?? "").get("id");
      gravar(CHAVE_DIARIO, JSON.stringify(anotacoes.filter((atual) => atual.id !== id)));
      return json({ ok: true });
    }
    return json({ anotacoes });
  }

  if (caminho === "/api/familia/conversa") {
    const registros = JSON.parse(ler(CHAVE_CONVERSA) ?? "[]") as unknown[];
    if (metodo === "POST") {
      const registro = sanitizarConversa(corpo.registro);
      if (!registro) return json({ error: "registro_invalido" }, 400);
      gravar(CHAVE_CONVERSA, JSON.stringify([{ id: crypto.randomUUID(), ...registro, criado_em: new Date().toISOString() }, ...registros]));
      const itemDaConversa = ITENS_DA_CONVERSA[registro.modulo];
      if (itemDaConversa) marcarItem(itemDaConversa.modulo, itemDaConversa.item);
      return json({ ok: true });
    }
    return json({ registros });
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
      if (corpo.modulo === 8) marcarItem(8, "meta");
      return json({ meta: nova });
    }
    if (metodo === "PATCH") {
      if (!atual) return json({ error: "sem_meta" }, 404);
      if (!dataValida(hoje) || !dataValida(corpo.data)) return json({ error: "data_invalida" }, 400);
      const diasFeitos = alternarDiaFeito(atual, corpo.data as string, hoje);
      if (!diasFeitos) return json({ error: "dia_fora_da_semana" }, 400);
      atual.dias_feitos = diasFeitos;
      gravar(CHAVE_META, JSON.stringify(atual));
      return json({ meta: atual });
    }
    return json({ meta: atual });
  }

  // Frases reescritas do módulo 3 (briefing M3), guardadas no aparelho.
  if (caminho === "/api/familia/frases") {
    const frases = JSON.parse(ler(CHAVE_FRASES) ?? "[]") as unknown[];
    if (metodo === "POST") {
      const frase = sanitizarFrase(corpo.frase);
      if (!frase) return json({ error: "frase_invalida" }, 400);
      if (frases.length >= LIMITE_DE_FRASES) return json({ error: "limite_de_frases" }, 409);
      gravar(CHAVE_FRASES, JSON.stringify([{ id: crypto.randomUUID(), ...frase, criada_em: new Date().toISOString() }, ...frases]));
      if (frases.length + 1 >= FRASES_PARA_CONCLUIR) marcarItem(ITEM_FRASES_M3.modulo, ITEM_FRASES_M3.item);
      return json({ ok: true });
    }
    return json({ frases });
  }

  // Módulo 4 (briefing M4): lista, plano e "adiar", com as mesmas regras da rota.
  if (caminho === "/api/familia/valorizar") {
    const guardado = JSON.parse(ler(CHAVE_VALORIZAR) ?? "{}") as { gosta?: unknown; plano?: PlanoValorizar; adiar?: Adiar };
    const salvar = () => gravar(CHAVE_VALORIZAR, JSON.stringify(guardado));
    if (metodo === "POST") {
      if (corpo.tipo === "gosta") {
        const gosta = sanitizarGosta(corpo.dados);
        if (!gosta) return json({ error: "lista_invalida" }, 400);
        guardado.gosta = gosta;
        marcarItem(ITEM_GOSTA_M4.modulo, ITEM_GOSTA_M4.item);
      } else if (corpo.tipo === "plano") {
        const plano = sanitizarPlano(corpo.dados);
        if (!plano || !dataValida(corpo.hoje)) return json({ error: "plano_invalido" }, 400);
        const semana = segundaDaSemana(corpo.hoje as string);
        guardado.plano = { ...plano, semana_inicio: semana, feitos: guardado.plano?.semana_inicio === semana ? guardado.plano.feitos : [] };
        marcarItem(ITEM_PLANO_M4.modulo, ITEM_PLANO_M4.item);
      } else if (corpo.tipo === "adiar") {
        const adiar = sanitizarAdiar(corpo.dados);
        if (!adiar) return json({ error: "adiar_invalido" }, 400);
        guardado.adiar = adiar;
        if (adiarCompleto(adiar)) marcarItem(ITEM_ADIAR_M4.modulo, ITEM_ADIAR_M4.item);
      } else return json({ error: "tipo_invalido" }, 400);
      salvar();
      return json({ ok: true });
    }
    if (metodo === "PATCH") {
      if (!guardado.plano) return json({ error: "sem_plano" }, 404);
      if (!dataValida(corpo.data) || !dataValida(corpo.hoje)) return json({ error: "data_invalida" }, 400);
      const feitos = alternarDiaFeito({ semana_inicio: guardado.plano.semana_inicio, dias_feitos: guardado.plano.feitos }, corpo.data as string, corpo.hoje as string);
      if (!feitos) return json({ error: "dia_fora_da_semana" }, 400);
      guardado.plano.feitos = feitos;
      salvar();
      return json({ plano: guardado.plano });
    }
    return json({ gosta: guardado.gosta ?? null, plano: guardado.plano ?? null, adiar: guardado.adiar ?? null });
  }

  // Módulo 5 (briefing M5): o convite, com as mesmas regras da rota.
  if (caminho === "/api/familia/convite") {
    const atual = (JSON.parse(ler(CHAVE_CONVITE) ?? "null") as Convite | null) ?? CONVITE_VAZIO;
    if (metodo === "POST") {
      let novo: Convite | null = null;
      if (corpo.tipo === "passo") {
        novo = aplicarPasso(atual, corpo.dados);
        if (!novo) return json({ error: "passo_invalido" }, 400);
        if (novo.passo >= PASSOS_DO_CONVITE) marcarItem(ITEM_PREPARAR_M5.modulo, ITEM_PREPARAR_M5.item);
      } else if (corpo.tipo === "resultado") {
        const resultado = sanitizarResultado(corpo.resultado);
        if (corpo.resultado !== null && !resultado) return json({ error: "resultado_invalido" }, 400);
        novo = { ...atual, resultado, data_resultado: resultado ? new Date().toISOString() : null };
        if (resultado) marcarItem(ITEM_CONTAR_M5.modulo, ITEM_CONTAR_M5.item);
      } else if (corpo.tipo === "pausa") {
        novo = aplicarPausa(atual, corpo.data_retorno);
        if (!novo) return json({ error: "data_invalida" }, 400);
      } else return json({ error: "tipo_invalido" }, 400);
      gravar(CHAVE_CONVITE, JSON.stringify(novo));
      return json({ convite: novo });
    }
    return json({ convite: ler(CHAVE_CONVITE) ? atual : null });
  }

  // Módulo 7 (briefing M7): a rede de apoio, com as mesmas regras da rota.
  if (caminho === "/api/familia/rede") {
    const atual = JSON.parse(ler(CHAVE_REDE) ?? "null") as Rede | null;
    if (metodo === "POST") {
      const nova = aplicarRede(atual ?? REDE_VAZIA, corpo, new Date().toISOString());
      if (!nova) return json({ error: "passo_invalido" }, 400);
      gravar(CHAVE_REDE, JSON.stringify(nova));
      marcarItem(ITEM_APOIO_M7.modulo, ITEM_APOIO_M7.item);
      return json({ rede: nova });
    }
    return json({ rede: atual });
  }

  // "Ver o retorno do treino" (briefing M3): o último retorno do cenário, guardado no aparelho.
  if (caminho.startsWith("/api/familia/simulador?")) {
    const cenario = new URLSearchParams(caminho.split("?")[1]).get("cenario") ?? "";
    return json({ feedback: JSON.parse(ler(`${CHAVE_RETORNO_TREINO}-${cenario}`) ?? "null") });
  }

  if (caminho === "/api/familia/simulador") {
    const resposta = await fetch(caminho, {
      ...init,
      headers: { "Content-Type": "application/json", "x-familia-dev": "1" },
      body: JSON.stringify({ ...corpo, respostasDev: respostasGuardadas() }),
    });
    if (corpo.acao === "terminar" && resposta.ok && typeof corpo.simulacaoId === "string") {
      const dados = (await resposta.clone().json().catch(() => null)) as { feedback?: unknown } | null;
      if (dados?.feedback) gravar(`${CHAVE_RETORNO_TREINO}-${corpo.simulacaoId.split("~")[0]}`, JSON.stringify(dados.feedback));
    }
    return resposta;
  }

  return json({ error: "nao_encontrado" }, 404);
}
