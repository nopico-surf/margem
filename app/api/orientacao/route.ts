import { NextResponse } from "next/server";
import { gerarOrientacao } from "@/lib/gemini";
import { normalizarTexto } from "@/lib/normalizar";
import { detectarRisco } from "@/lib/risco";
import {
  buscarInstituicoesPorCategoria,
  buscarProfissionaisPorCategoria,
  buscarRespostaPorChave,
  buscarServicosPublicosPorCategoria,
  registrarInteracao,
  salvarRespostaGerada,
  type AcaoContato,
} from "@/lib/supabase";

const CATEGORIA_PADRAO = "geral";

// kind salvo no banco -> chave de ícone que ResultPage.tsx já usa (assets em figma-results/ResultPage.tsx)
const ICONE_POR_KIND: Record<string, string | undefined> = {
  phone: "phone",
  chat: "chat",
  email: "email",
  nearby: "place",
  site: "link",
  whatsapp: "whatsapp",
  telegram: "telegram",
  libras: "libras",
};

function paraHref(acao: AcaoContato) {
  if (!acao.value) return undefined;
  if (acao.kind === "phone") return `tel:${acao.value.replace(/\D/g, "")}`;
  if (acao.kind === "whatsapp") return `https://wa.me/${acao.value.replace(/\D/g, "")}`;
  if (acao.kind === "email" && !/^https?:\/\//.test(acao.value)) return `mailto:${acao.value}`;
  return acao.value;
}

function paraCardResource(id: string, nome: string, descricao: string | null, acoes: AcaoContato[]) {
  return {
    id,
    title: nome,
    description: descricao ?? "",
    actions: acoes.map((acao) => ({ label: acao.label, icon: ICONE_POR_KIND[acao.kind], href: paraHref(acao) })),
  };
}

function prioridadeServico(nome: string, descricao: string | null) {
  const texto = normalizarTexto(`${nome} ${descricao ?? ""}`);
  if (/(drogas|substancias|alcool|caps ad|orientacao sobre drogas)/.test(texto)) return 0;
  if (/(samu|ubs|saude|sus|cvv|emergencia medica)/.test(texto)) return 1;
  if (/(cras|assistencia social|direitos humanos|disque 100)/.test(texto)) return 2;
  if (/(policia|policia militar|policia civil|190|181)/.test(texto)) return 3;
  return 4;
}

function ordenarServicosPublicos<T extends { nome: string; descricao: string | null }>(servicos: T[]) {
  return servicos
    .map((servico, indice) => ({ servico, indice, prioridade: prioridadeServico(servico.nome, servico.descricao) }))
    .sort((a, b) => a.prioridade - b.prioridade || a.indice - b.indice)
    .map(({ servico }) => servico);
}

const CARDS_CHAVES = [
  "quero mudar uso",
  "estou fisicamente mal",
  "estou emocionalmente mal",
  "quero ajudar alguem proximo",
  "fiz uso e quero ajuda",
  "estou com vontade de usar",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const texto = typeof body.texto === "string" ? body.texto.trim() : "";
    const cardIndex = typeof body.cardIndex === "number" ? body.cardIndex : undefined;
    const sessaoId = typeof body.sessaoId === "string" ? body.sessaoId : "";

    if (!texto && cardIndex === undefined) return NextResponse.json({ error: "Texto ou cardIndex obrigatório" }, { status: 400 });
    if (!sessaoId) return NextResponse.json({ error: "sessaoId obrigatório" }, { status: 400 });

    let cached = null;
    let orientation = null;
    let respostaId = null;
    let foiCache = false;
    let textoOriginal = texto;

    if (cardIndex !== undefined && cardIndex >= 0 && cardIndex < CARDS_CHAVES.length) {
      const chaveCard = CARDS_CHAVES[cardIndex];
      cached = await buscarRespostaPorChave(chaveCard);
      if (cached) {
        orientation = cached;
        respostaId = cached.id;
        foiCache = true;
        textoOriginal = chaveCard;
      }
    }

    if (!orientation) {
      const chave = normalizarTexto(texto);
      cached = await buscarRespostaPorChave(chave);
      orientation = cached ?? (await gerarOrientacao(texto));
      respostaId = cached ? cached.id : await salvarRespostaGerada(chave, orientation);
      foiCache = Boolean(cached);
    }

    const risco = detectarRisco(textoOriginal);
    if (sessaoId) await registrarInteracao({ sessaoId, texto: textoOriginal, respostaId, foiCacheHit: foiCache });

    const [profissionais, servicosPublicos, instituicoes] = await Promise.all([
      buscarProfissionaisPorCategoria(CATEGORIA_PADRAO),
      buscarServicosPublicosPorCategoria(CATEGORIA_PADRAO),
      buscarInstituicoesPorCategoria(CATEGORIA_PADRAO),
    ]);

    return NextResponse.json({
      ...orientation,
      risco,
      foi_cache_hit: foiCache,
      profissionais,
      servicos_publicos: ordenarServicosPublicos(servicosPublicos).map((servico) => paraCardResource(servico.id, servico.nome, servico.descricao, servico.acoes)),
      instituicoes: instituicoes.map((instituicao) => paraCardResource(instituicao.id, instituicao.nome, instituicao.descricao, instituicao.contatos)),
    });
  } catch {
    return NextResponse.json({ error: "Não foi possível preparar a orientação." }, { status: 500 });
  }
}
