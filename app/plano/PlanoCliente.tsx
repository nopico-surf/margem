"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { LoaderTela } from "@/components/ui/LoaderTela";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { CardPlano } from "@/components/apoio/CardPlano";
import { ContadorPix } from "@/components/apoio/ContadorPix";
import { DadosPixModal } from "@/components/apoio/DadosPixModal";
import { IconeConfirmado, IconeEditar } from "@/components/icons";
import { formatarCentavos } from "@/lib/apoio/formatar";
import { normalizarCpfCnpj } from "@/lib/apoio/documento";
import type { PlanoBase, PlanoOpcional, Profissao } from "@/lib/apoio/planos";
import { CONTATOS } from "@/lib/contatos";

// Figma: Experiência do produto, seção "Fluxo - Serviços publicos e redes de apoio" (1534:28280).
// Quem chega pelo link pessoal passa por: plano base (1534:28281), turbinar (1537:29885), dados para o
// Pix (1537:36437), Pix (1537:36169) e código vencido (1542:40036). Os textos são os das telas mobile.
//
// Nada desta página vai para Mixpanel ou dataLayer, e nome, CPF ou CNPJ e e-mail ficam só na memória
// da aba, para o "Gerar outro Pix" reaproveitar.

const ROTA = "/plano";
const INTERVALO_STATUS = 4000;
const LINK_WHATSAPP = CONTATOS.find((contato) => contato.tipo === "whatsapp")!.href;

const NOMES_BASE: Record<PlanoBase, string> = { prata: "Prata", ouro: "Ouro", diamante: "Diamante" };
const ORDEM_BASE: PlanoBase[] = ["prata", "ouro", "diamante"];

const OPCIONAIS: Record<PlanoOpcional, { nome: string; descricao: string; complemento?: string }> = {
  destaque: {
    nome: "Destaque",
    descricao:
      "Um story fixo nos destaques do Instagram da Margem, com link para o seu perfil, e presença no carrossel mensal de quem atende pela Margem",
  },
  divulgacao: {
    nome: "Divulgação",
    descricao: "Tudo do destaque, mais:",
    complemento:
      "1 conteúdo seu por mês no Instagram da Margem, em collab, impulsionado com anúncio pago e direcionando ao seu perfil",
  },
  divulgacao_plus: {
    nome: "Divulgação Plus",
    descricao: "Tudo do divulgação, mais:",
    complemento:
      "2 conteúdos seu por mês no Instagram da Margem, em collab, impulsionado com anúncio pago e direcionando ao seu perfil",
  },
};
const ORDEM_OPCIONAL: PlanoOpcional[] = ["destaque", "divulgacao", "divulgacao_plus"];

// Mensagens por código de erro de POST /api/apoio/pix (docs/apoio-telas.md, tela 4).
const ERROS_DE_CAMPO = {
  nome_invalido: "Escreva seu nome completo, com até 100 caracteres.",
  cpf_cnpj_invalido: "Não conseguimos conferir esse CPF ou CNPJ. Confira os números e tente de novo.",
  email_invalido: "Não conseguimos reconhecer esse e-mail. Confira se ele está completo, com @.",
} as const;
type Campo = "nome" | "cpfCnpj" | "email";
const CAMPO_DO_ERRO: Record<keyof typeof ERROS_DE_CAMPO, Campo> = {
  nome_invalido: "nome",
  cpf_cnpj_invalido: "cpfCnpj",
  email_invalido: "email",
};
// As mesmas conferências da rota do Pix, para o erro aparecer ao sair do campo, sem esperar o envio.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function campoValido(campo: Campo, valor: string) {
  if (campo === "nome") return valor.trim() !== "" && valor.trim().length <= 100;
  if (campo === "cpfCnpj") return normalizarCpfCnpj(valor) !== null;
  return valor.trim().length <= 254 && EMAIL.test(valor.trim());
}
const ERRO_DO_CAMPO: Record<Campo, string> = {
  nome: ERROS_DE_CAMPO.nome_invalido,
  cpfCnpj: ERROS_DE_CAMPO.cpf_cnpj_invalido,
  email: ERROS_DE_CAMPO.email_invalido,
};

const ERRO_DADOS_RECUSADOS =
  "O sistema de pagamento não aceitou esses dados. Confira o nome e o CPF ou CNPJ e tente de novo.";
const ERRO_PAGAMENTO_INDISPONIVEL =
  "Não foi possível gerar o Pix agora, porque o sistema de pagamento está fora do ar. Tente de novo daqui a alguns minutos.";

type DadosDoLink = {
  nome: string;
  profissao: Profissao;
  planoBaseEscolhido: PlanoBase | null;
  opcionalEscolhido: PlanoOpcional | null;
  planosBase: Record<PlanoBase, { centavos: number; vagas: number | null }>;
  planosOpcionais: Record<PlanoOpcional, { centavos: number }>;
  email: string | null;
  // Só para quem já pagou: o plano de hoje e o próximo vencimento, para a troca de plano.
  planoAtual?: { planoBase: PlanoBase; opcional: PlanoOpcional | null } | null;
  proximoVencimento?: string | null;
};

type Pix = { apoioId: string; payload: string; imagemBase64: string; expiraEm: number };

type Etapa =
  | "carregando"
  | "link_invalido"
  | "plano_ja_ativo"
  | "base"
  | "opcional"
  | "resumo"
  | "dados"
  | "pix"
  | "expirado"
  | "recusado"
  | "pago_sem_autorizacao"
  | "tudo_feito"
  // Troca de plano, para quem já pagou (regra do Vitor: upgrade paga só a diferença na hora, downgrade
  // começa no próximo vencimento, sem devolução).
  | "meu_plano"
  | "resumo_troca"
  | "troca_confirmada";

const ETAPAS_DA_TROCA: Etapa[] = ["meu_plano", "resumo_troca", "troca_confirmada"];

const ETAPAS_DA_PREVIA: Etapa[] = [
  ...ETAPAS_DA_TROCA,
  "link_invalido",
  "plano_ja_ativo",
  "base",
  "opcional",
  "resumo",
  "dados",
  "pix",
  "expirado",
  "recusado",
  "pago_sem_autorizacao",
  "tudo_feito",
];

// Só em desenvolvimento: /plano#previa-{etapa} abre a tela com dados de exemplo, sem link e sem
// pagamento, para conferir o desenho. Em produção o endereço é tratado como um código qualquer.
const LINK_DA_PREVIA: DadosDoLink = {
  nome: "Profissional de exemplo",
  profissao: "psicologo",
  planoBaseEscolhido: "ouro",
  opcionalEscolhido: "destaque",
  planosBase: {
    prata: { centavos: 1999, vagas: 3 },
    ouro: { centavos: 3999, vagas: 8 },
    diamante: { centavos: 8999, vagas: null },
  },
  planosOpcionais: { destaque: { centavos: 15999 }, divulgacao: { centavos: 36999 }, divulgacao_plus: { centavos: 55999 } },
  email: "profissional@exemplo.com.br",
};
const QR_DA_PREVIA =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function etapaDaPrevia(endereco: string): Etapa | null {
  if (process.env.NODE_ENV === "production" || !endereco.startsWith("previa-")) return null;
  const etapa = endereco.slice("previa-".length) as Etapa;
  return ETAPAS_DA_PREVIA.includes(etapa) ? etapa : null;
}

// Na prévia da troca, quem já paga o Prata e escolhe o Ouro.
const PLANO_ATUAL_DA_PREVIA = { planoBase: "prata" as PlanoBase, opcional: null };

function textoDasVagas(vagas: number | null) {
  return vagas === null ? "Vagas ilimitadas" : `${vagas} vagas abertas`;
}

// "Prata", "Ouro + Destaque": o nome do plano com o opcional, para o resumo e a confirmação da troca.
function nomeDoPlano(planoBase: PlanoBase, opcional: PlanoOpcional | null) {
  return opcional ? `${NOMES_BASE[planoBase]} + ${OPCIONAIS[opcional].nome}` : NOMES_BASE[planoBase];
}

// Data do próximo vencimento em dd/mm, no fuso de Brasília.
function diaEMes(iso: string | null | undefined) {
  if (!iso) return "";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" }).format(data);
}

// O Asaas devolve a validade como data sem fuso ("2026-10-22 16:30:00", horário de Brasília). Sem data
// legível, ou com uma fora do razoável, vale a regra dos 10 minutos a partir de agora.
const VALIDADE_PADRAO = 10 * 60 * 1000;

function momentoDeExpirar(expiraEm: unknown) {
  const padrao = Date.now() + VALIDADE_PADRAO;
  if (typeof expiraEm !== "string") return padrao;
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(expiraEm) ? expiraEm : `${expiraEm.replace(" ", "T")}-03:00`;
  const momento = Date.parse(iso);
  if (!Number.isFinite(momento) || momento <= Date.now() || momento > Date.now() + 4 * VALIDADE_PADRAO) return padrao;
  return momento;
}

export function PlanoCliente() {
  const [token, setToken] = useState("");
  const [etapa, setEtapa] = useState<Etapa>("carregando");
  const [link, setLink] = useState<DadosDoLink | null>(null);
  const [planoBase, setPlanoBase] = useState<PlanoBase | null>(null);
  const [opcional, setOpcional] = useState<PlanoOpcional | null>(null);
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [errosDeCampo, setErrosDeCampo] = useState<Partial<Record<Campo, string>>>({});
  const [erroGeral, setErroGeral] = useState("");
  const [gerando, setGerando] = useState(false);
  const [pix, setPix] = useState<Pix | null>(null);
  // Começa em 0 e só ganha o relógio quando o Pix é gerado: Date.now() no render quebra o prerender.
  const [agora, setAgora] = useState(0);
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [dadosAbertos, setDadosAbertos] = useState(false);
  const [painelVisivel, setPainelVisivel] = useState(false);
  // Voltou pelo lápis do "Planos selecionados": a escolha leva de volta ao resumo, sem passar pela outra tela.
  const [editando, setEditando] = useState(false);
  // Quem já pagou tocou em "Trocar de plano": as telas de escolha levam ao resumo da troca.
  const [trocando, setTrocando] = useState(false);
  const gerandoRef = useRef(false);

  // Trocar só o que vem depois do "#" não recarrega a página: recarrega aqui, para o código novo valer.
  useEffect(() => {
    const recarregar = () => window.location.reload();
    window.addEventListener("hashchange", recarregar);
    return () => window.removeEventListener("hashchange", recarregar);
  }, []);

  // O token vem depois do "#". Lido uma vez, na abertura.
  useEffect(() => {
    const doEndereco = decodeURIComponent(window.location.hash.slice(1)).trim();
    setToken(doEndereco);

    const previa = etapaDaPrevia(doEndereco);
    if (previa) {
      const daTroca = ETAPAS_DA_TROCA.includes(previa);
      setLink(
        daTroca
          ? { ...LINK_DA_PREVIA, planoAtual: PLANO_ATUAL_DA_PREVIA, proximoVencimento: new Date(Date.now() + 15 * 864e5).toISOString() }
          : LINK_DA_PREVIA,
      );
      setTrocando(daTroca && previa !== "meu_plano");
      setPlanoBase(daTroca ? (previa === "meu_plano" ? "prata" : "ouro") : LINK_DA_PREVIA.planoBaseEscolhido);
      setOpcional(daTroca ? null : LINK_DA_PREVIA.opcionalEscolhido);
      setEmail(LINK_DA_PREVIA.email ?? "");
      setPix({
        apoioId: "previa",
        payload: "00020101021226810014br.gov.bcb.pix2559pix-h.asaas.com/qr/cobv/exemplo-da-previa6304ABCD",
        imagemBase64: QR_DA_PREVIA,
        expiraEm: Date.now() + VALIDADE_PADRAO,
      });
      setAgora(Date.now());
      setEtapa(previa);
      return;
    }

    fetch("/api/apoio/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: doEndereco }),
    })
      .then(async (resposta) => {
        const corpo = await resposta.json().catch(() => null);
        if (resposta.status === 409) return setEtapa("plano_ja_ativo");
        if (!resposta.ok || !corpo) return setEtapa("link_invalido");
        const dados = corpo as DadosDoLink;
        setLink(dados);
        setEmail(dados.email ?? "");
        // Quem já pagou abre no "Seu plano"; quem ainda não pagou, na escolha do plano.
        if (dados.planoAtual) {
          setPlanoBase(dados.planoAtual.planoBase);
          setOpcional(dados.planoAtual.opcional);
          setEtapa("meu_plano");
          return;
        }
        setPlanoBase(dados.planoBaseEscolhido);
        setOpcional(dados.opcionalEscolhido);
        setEtapa("base");
      })
      .catch(() => setEtapa("link_invalido"));
  }, []);

  // Cada troca de tela começa do topo.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [etapa]);

  // A barra do Continuar e a do Gerar Pix entram subindo quando o resumo e a tela de dados abrem
  // (anotações do Figma, 1537:35224 e 1537:36746).
  useEffect(() => {
    if (etapa !== "resumo" && etapa !== "resumo_troca" && etapa !== "meu_plano" && etapa !== "dados") {
      setPainelVisivel(false);
      return;
    }
    const quadro = requestAnimationFrame(() => setPainelVisivel(true));
    return () => cancelAnimationFrame(quadro);
  }, [etapa]);

  // Relógio do contador, só enquanto o Pix está na tela.
  useEffect(() => {
    if (etapa !== "pix") return;
    const intervalo = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, [etapa]);

  const segundosRestantes = pix ? Math.ceil((pix.expiraEm - agora) / 1000) : 0;

  useEffect(() => {
    if (etapa === "pix" && pix && segundosRestantes <= 0) setEtapa("expirado");
  }, [etapa, pix, segundosRestantes]);

  // Consulta o status a cada poucos segundos enquanto a tela do Pix está aberta, e continua depois do
  // pagamento sem autorização: se a pessoa autorizar o Pix Automático no banco, a tela vira "tudo feito".
  const consultandoStatus = (etapa === "pix" || etapa === "pago_sem_autorizacao") && pix && pix.apoioId !== "previa";
  useEffect(() => {
    if (!consultandoStatus || !pix) return;
    let ativo = true;
    const consultar = async () => {
      try {
        const resposta = await fetch(`/api/apoio/${pix.apoioId}/status`, { cache: "no-store" });
        if (!resposta.ok || !ativo) return;
        const { status, pago } = (await resposta.json()) as { status?: string; pago?: boolean };
        if (!ativo) return;
        if (status === "ativo") setEtapa(trocando ? "troca_confirmada" : "tudo_feito");
        else if (pago) setEtapa("pago_sem_autorizacao");
        else if (status === "expirado") setEtapa("expirado");
        else if (status === "recusado") setEtapa("recusado");
      } catch {
        // Falha de rede: tenta de novo na próxima volta.
      }
    };
    const intervalo = setInterval(consultar, INTERVALO_STATUS);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [consultandoStatus, pix, trocando]);

  // `downgrade` só vale quando chamado como gerarPix(true): no onClick o primeiro argumento é o evento.
  const gerarPix = useCallback(async (downgrade?: unknown) => {
    if (gerandoRef.current || !planoBase) return;
    // Downgrade não cobra nada hoje, então o servidor não pede nome, CPF nem e-mail.
    const semDados = downgrade === true;

    // O botão nunca fica desabilitado: com algum campo vazio ou inválido, o toque mostra os erros na hora,
    // sem ir ao servidor.
    const invalidos = semDados
      ? []
      : (["nome", "cpfCnpj", "email"] as const).filter(
          (campo) => !campoValido(campo, campo === "nome" ? nome : campo === "cpfCnpj" ? cpfCnpj : email),
        );
    if (invalidos.length > 0) {
      setErrosDeCampo(Object.fromEntries(invalidos.map((campo) => [campo, ERRO_DO_CAMPO[campo]])));
      setEtapa("dados");
      return;
    }

    gerandoRef.current = true;
    setGerando(true);
    setErrosDeCampo({});
    setErroGeral("");

    try {
      const resposta = await fetch("/api/apoio/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          semDados
            ? { token, planoBase, opcional, troca: true }
            : { token, planoBase, opcional, nome, cpfCnpj, email, ...(trocando ? { troca: true } : {}) },
        ),
      });
      const corpo = (await resposta.json().catch(() => null)) as
        | { apoioId: string | null; qrCode: { payload: string; imagemBase64: string; expiraEm: unknown } | null }
        | { error?: string }
        | null;

      // Downgrade sem nada a pagar nem autorizar hoje: a troca já fica marcada para o próximo vencimento.
      if (resposta.ok && corpo && "apoioId" in corpo && !corpo.qrCode) {
        setEtapa("troca_confirmada");
        return;
      }

      if (resposta.ok && corpo && "apoioId" in corpo && corpo.apoioId && corpo.qrCode) {
        setPix({
          apoioId: corpo.apoioId,
          payload: corpo.qrCode.payload,
          imagemBase64: corpo.qrCode.imagemBase64,
          expiraEm: momentoDeExpirar(corpo.qrCode.expiraEm),
        });
        setAgora(Date.now());
        setCodigoCopiado(false);
        setEtapa("pix");
        return;
      }

      const codigo = corpo && "error" in corpo ? corpo.error : undefined;
      if (codigo && codigo in ERROS_DE_CAMPO) {
        const chave = codigo as keyof typeof ERROS_DE_CAMPO;
        setErrosDeCampo({ [CAMPO_DO_ERRO[chave]]: ERROS_DE_CAMPO[chave] });
        setEtapa("dados");
      } else if (codigo === "link_invalido") {
        setEtapa("link_invalido");
      } else if (codigo === "plano_ja_ativo") {
        setEtapa("plano_ja_ativo");
      } else if (codigo === "troca_indisponivel") {
        // Sem mês pago valendo: não há o que trocar, a pessoa paga pelo fluxo normal.
        setTrocando(false);
        setEtapa("base");
      } else if (codigo === "plano_invalido" || codigo === "mesmo_plano") {
        setEtapa("base");
      } else {
        setErroGeral(codigo === "dados_recusados" ? ERRO_DADOS_RECUSADOS : ERRO_PAGAMENTO_INDISPONIVEL);
        setEtapa("dados");
      }
    } catch {
      setErroGeral(ERRO_PAGAMENTO_INDISPONIVEL);
      setEtapa("dados");
    } finally {
      gerandoRef.current = false;
      setGerando(false);
    }
  }, [token, planoBase, opcional, nome, cpfCnpj, email, trocando]);

  async function copiarCodigo() {
    if (!pix) return;
    try {
      await navigator.clipboard.writeText(pix.payload);
      setCodigoCopiado(true);
      return;
    } catch {
      // Navegador sem a API de área de transferência (ou sem permissão): cai no jeito antigo.
    }
    const campo = document.createElement("textarea");
    campo.value = pix.payload;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    const copiou = document.execCommand("copy");
    campo.remove();
    if (copiou) setCodigoCopiado(true);
  }

  function selecionarBase(plano: PlanoBase) {
    setPlanoBase(plano);
    setEtapa(editando ? "resumo" : "opcional");
    setEditando(false);
  }

  function selecionarOpcional(plano: PlanoOpcional | null) {
    setOpcional(plano);
    setEtapa(trocando ? "resumo_troca" : "resumo");
    setEditando(false);
  }

  function trocarDePlano() {
    setTrocando(true);
    setEtapa("base");
  }

  function editar(tela: "base" | "opcional") {
    setEditando(true);
    setEtapa(tela);
  }

  function mudarCampo(campo: Campo, valor: string) {
    if (campo === "nome") setNome(valor);
    // Só números (Figma: "Digite apenas números", 1545:40686). O CNPJ novo com letras fica de fora.
    if (campo === "cpfCnpj") setCpfCnpj(valor.replace(/\D/g, "").slice(0, 14));
    if (campo === "email") setEmail(valor);
    if (errosDeCampo[campo]) setErrosDeCampo((erros) => ({ ...erros, [campo]: undefined }));
    if (erroGeral) setErroGeral("");
  }

  // Ao sair do campo: vazio não acusa nada (a pessoa pode só estar passando), preenchido e inválido mostra o erro.
  function conferirCampo(campo: Campo) {
    const valor = campo === "nome" ? nome : campo === "cpfCnpj" ? cpfCnpj : email;
    if (valor.trim() === "" || campoValido(campo, valor)) return;
    setErrosDeCampo((erros) => ({ ...erros, [campo]: ERRO_DO_CAMPO[campo] }));
  }

  if (etapa === "carregando") return <LoaderTela />;
  // Enquanto o Pix é gerado, a tela inteira vira o loader (Figma: 1546:40761).
  if (gerando) return <LoaderTela texto="Fazendo a validação dos dados" />;

  const totalCentavos =
    link && planoBase
      ? link.planosBase[planoBase].centavos + (opcional ? link.planosOpcionais[opcional].centavos : 0)
      : 0;
  const total = formatarCentavos(totalCentavos);

  // Troca de plano: quanto o plano novo custa por mês contra o atual, e quanto se paga hoje (só a
  // diferença, quando o novo é maior; o servidor recalcula, aqui é só o que a tela mostra).
  const planoAtual = link?.planoAtual ?? null;
  const centavosAtual =
    link && planoAtual
      ? link.planosBase[planoAtual.planoBase].centavos + (planoAtual.opcional ? link.planosOpcionais[planoAtual.opcional].centavos : 0)
      : 0;
  const centavosHoje = Math.max(0, totalCentavos - centavosAtual);
  const ehUpgrade = totalCentavos > centavosAtual;
  const mesmoPlano = !!planoAtual && planoAtual.planoBase === planoBase && planoAtual.opcional === opcional;
  const vencimento = diaEMes(link?.proximoVencimento);
  const nomeNovo = planoBase ? nomeDoPlano(planoBase, opcional).toLowerCase() : "";
  const textoDoBotaoDaTroca = mesmoPlano
    ? "Escolher outro plano"
    : ehUpgrade
      ? "Continuar para o pagamento"
      : "Confirmar a troca de plano";
  // Upgrade vai para os dados do Pix; downgrade confirma direto, sem dado pessoal (nada é cobrado hoje).
  const continuarDaTroca = () => {
    if (mesmoPlano) setEtapa("base");
    else if (ehUpgrade) setEtapa("dados");
    else if (etapaDaPrevia(token)) setEtapa("troca_confirmada");
    else gerarPix(true);
  };
  // O link volta a cobrar 7 dias antes do vencimento: é quando o plano menor é pago, pelo mesmo link.
  const reabreEm = diaEMes(link?.proximoVencimento ? new Date(new Date(link.proximoVencimento).getTime() - 7 * 864e5).toISOString() : null);
  const textoDoValor = trocando ? `Hoje você paga R$ ${formatarCentavos(centavosHoje)}` : `Valor total: R$ ${total} por mês`;
  const tituloDoPix = !trocando
    ? `Pague o seu plano de R$ ${total} para ativar seu perfil na Margem`
    : ehUpgrade
      ? `Pague R$ ${formatarCentavos(centavosHoje)} para ativar o plano ${nomeNovo}`
      : `Autorize o plano ${nomeNovo} no seu banco`;

  const VOLTA: Partial<Record<Etapa, Etapa>> = {
    base: trocando ? "meu_plano" : undefined,
    opcional: "base",
    resumo: "opcional",
    resumo_troca: "opcional",
    dados: trocando ? "resumo_troca" : "resumo",
  };
  const destinoDoVoltar = editando && (etapa === "base" || etapa === "opcional") ? "resumo" : VOLTA[etapa];
  const voltar = destinoDoVoltar
    ? () => {
        setEditando(false);
        if (destinoDoVoltar === "meu_plano") {
          setTrocando(false);
          if (planoAtual) {
            setPlanoBase(planoAtual.planoBase);
            setOpcional(planoAtual.opcional);
          }
        }
        setEtapa(destinoDoVoltar);
      }
    : undefined;
  const telaDoPix = etapa === "pix" || etapa === "expirado" || etapa === "recusado";
  const confirmado = etapa === "pago_sem_autorizacao" || etapa === "tudo_feito" || etapa === "troca_confirmada";

  return (
    <main className="figma-result-page plano-pagina" data-etapa={etapa}>
      <Header onOpenMenu={() => setMenuAberto(true)} onVoltar={voltar} mostrarProfissionais={false} semMenu={telaDoPix || confirmado} />
      <SideMenu open={menuAberto} onClose={() => setMenuAberto(false)} rota={ROTA} soContatos />

      {etapa === "link_invalido" && (
        <ContainerConteudo id="plano-aviso">
          <CardHeader as="h1" title="Esse link de pagamento não está mais valendo. Fale com a gente pelo WhatsApp para receber um novo." />
          <Button tamanho="medium" larguraTotal href={LINK_WHATSAPP} alvoExterno>
            Falar com a Margem no WhatsApp
          </Button>
        </ContainerConteudo>
      )}

      {etapa === "plano_ja_ativo" && (
        <ContainerConteudo id="plano-aviso">
          <CardHeader as="h1" title="Seu plano já está ativo." />
          <Button tamanho="medium" larguraTotal href="/inicio">
            Voltar para o início
          </Button>
        </ContainerConteudo>
      )}

      {/* Troca de plano: entrada de quem já pagou. Mesmo cartão do "Planos selecionados". */}
      {etapa === "meu_plano" && link && planoAtual && (
        <ContainerConteudo id="plano-meu">
          <CardHeader
            as="h1"
            title="Seu plano"
            description={vencimento ? `Próximo pagamento em ${vencimento}, pelo Pix Automático.` : undefined}
          />
          <section className="plano-resumo">
            <div className="plano-resumo-itens">
              <div className="plano-resumo-linha">
                <span>Plano {NOMES_BASE[planoAtual.planoBase].toLowerCase()}</span>
                <span className="plano-resumo-valor">
                  R$ {formatarCentavos(link.planosBase[planoAtual.planoBase].centavos)} <small>por mês</small>
                </span>
              </div>
              {planoAtual.opcional && (
                <div className="plano-resumo-linha">
                  <span>{OPCIONAIS[planoAtual.opcional].nome}</span>
                  <span className="plano-resumo-valor">
                    R$ {formatarCentavos(link.planosOpcionais[planoAtual.opcional].centavos)} <small>por mês</small>
                  </span>
                </div>
              )}
              <p className="plano-resumo-detalhe">{textoDasVagas(link.planosBase[planoAtual.planoBase].vagas)}</p>
            </div>
          </section>
          <div className="plano-resumo-acoes">
            <Button tamanho="medium" onClick={trocarDePlano}>
              Trocar de plano
            </Button>
          </div>
        </ContainerConteudo>
      )}

      {etapa === "base" && link && (
        <ContainerConteudo id="plano-base">
          <CardHeader as="h1" title="Escolha seu plano" />
          <div className="plano-cards">
            {ORDEM_BASE.map((plano) => (
              <CardPlano
                key={plano}
                arranjo="base"
                nome={NOMES_BASE[plano]}
                descricao={textoDasVagas(link.planosBase[plano].vagas)}
                centavos={link.planosBase[plano].centavos}
                destaque={!editando && !trocando && plano === "ouro"}
                selecionado={editando && plano === planoBase}
                atual={trocando && plano === planoAtual?.planoBase}
                onSelecionar={() => selecionarBase(plano)}
              />
            ))}
          </div>
          <p className="plano-nota">
            As vagas indicam o limite de pessoas em acompanhamento simultâneo que você pode manter no perfil
          </p>
          <p className="plano-nota">Se a experiência não for boa, você pode pedir reembolso em até 7 dias</p>
        </ContainerConteudo>
      )}

      {etapa === "opcional" && link && (
        <ContainerConteudo id="plano-opcional">
          <CardHeader as="h1" title="Turbine sua presença" description="Serviços opcionais para alavancar sua visibilidade e trazer mais clientes" />
          <div className="plano-cards">
            {ORDEM_OPCIONAL.map((plano) => (
              <CardPlano
                key={plano}
                arranjo="opcional"
                nome={OPCIONAIS[plano].nome}
                descricao={OPCIONAIS[plano].descricao}
                complemento={OPCIONAIS[plano].complemento}
                centavos={link.planosOpcionais[plano].centavos}
                destaque={!editando && !trocando && plano === "divulgacao"}
                selecionado={editando && plano === opcional}
                atual={trocando && plano === planoAtual?.opcional}
                onSelecionar={() => selecionarOpcional(plano)}
              />
            ))}
          </div>
          <p className="plano-nota">Como há aplicação direta de verba em mídia, não há reembolso do valor</p>
          <Button variante="transparent" tamanho="medium" larguraTotal onClick={() => selecionarOpcional(null)}>
            Continuar sem turbinar
          </Button>
        </ContainerConteudo>
      )}

      {/* Figma: "Planos selecionados" (1537:30190). O aviso "Você receberá um link…" é só do cadastro: quem
          chega pelo link já está pagando. */}
      {etapa === "resumo" && link && planoBase && (
        <ContainerConteudo id="plano-resumo">
          <CardHeader as="h1" title="Planos selecionados" description="Valor total dos planos selecionados no mês" />
          <section className="plano-resumo">
            <div className="plano-resumo-itens">
              <div className="plano-resumo-linha">
                <span>Plano {NOMES_BASE[planoBase].toLowerCase()}</span>
                <span className="plano-resumo-valor">
                  R$ {formatarCentavos(link.planosBase[planoBase].centavos)} <small>por mês</small>
                  <button type="button" aria-label="Trocar o plano" onClick={() => editar("base")}>
                    <IconeEditar />
                  </button>
                </span>
              </div>
              {opcional && (
                <div className="plano-resumo-linha">
                  <span>{OPCIONAIS[opcional].nome}</span>
                  <span className="plano-resumo-valor">
                    R$ {formatarCentavos(link.planosOpcionais[opcional].centavos)} <small>por mês</small>
                    <button type="button" aria-label="Trocar o serviço opcional" onClick={() => editar("opcional")}>
                      <IconeEditar />
                    </button>
                  </span>
                </div>
              )}
            </div>
            <div className="plano-resumo-total">
              <span>Valor total</span>
              <span>
                <strong>R$ {total}</strong> <small>por mês</small>
              </span>
            </div>
          </section>
          <div className="plano-resumo-acoes">
            <Button tamanho="medium" onClick={() => setEtapa("dados")}>
              Continuar para o pagamento
            </Button>
          </div>
        </ContainerConteudo>
      )}

      {/* Resumo da troca: o mesmo cartão do "Planos selecionados", com o que se paga hoje. */}
      {etapa === "resumo_troca" && link && planoBase && planoAtual && (
        <ContainerConteudo id="plano-resumo-troca">
          <CardHeader as="h1" title="Troca de plano" />
          <section className="plano-resumo">
            <div className="plano-resumo-itens">
              <div className="plano-resumo-linha">
                <span>Plano atual: {nomeDoPlano(planoAtual.planoBase, planoAtual.opcional).toLowerCase()}</span>
                <span className="plano-resumo-valor">
                  R$ {formatarCentavos(centavosAtual)} <small>por mês</small>
                </span>
              </div>
              <div className="plano-resumo-linha">
                <span>Novo plano: {nomeNovo}</span>
                <span className="plano-resumo-valor">
                  R$ {total} <small>por mês</small>
                  <button type="button" aria-label="Escolher outro plano" onClick={() => setEtapa("base")}>
                    <IconeEditar />
                  </button>
                </span>
              </div>
            </div>
            <div className="plano-resumo-total">
              <span>Hoje você paga</span>
              <span>
                <strong>R$ {formatarCentavos(centavosHoje)}</strong>
              </span>
            </div>
          </section>
          <div className="plano-resumo-acoes">
            <p className="plano-nota">
              {mesmoPlano
                ? "Esse já é o seu plano."
                : ehUpgrade
                  ? `O plano novo vale assim que o pagamento for confirmado.${vencimento ? ` A partir de ${vencimento}, o Pix Automático cobra R$ ${total} por mês.` : ""}`
                  : `Você continua com o plano atual${vencimento ? ` até ${vencimento}` : ""}, e o Pix Automático dele é encerrado agora. O plano ${nomeNovo} custa R$ ${total} por mês e é pago por este mesmo link${reabreEm ? `, a partir de ${reabreEm}` : ""}.`}
            </p>
            <Button tamanho="medium" onClick={continuarDaTroca}>
              {textoDoBotaoDaTroca}
            </Button>
          </div>
        </ContainerConteudo>
      )}

      {etapa === "dados" && (
        <ContainerConteudo id="plano-dados">
          <CardHeader as="h1" title="Seus dados para o Pix" />
          <InputText
            id="plano-nome"
            rotulo="Nome completo"
            value={nome}
            onChange={(valor) => mudarCampo("nome", valor)}
            onBlur={() => conferirCampo("nome")}
            erro={errosDeCampo.nome}
            autoComplete="name"
            maxLength={100}
          />
          <InputText
            id="plano-cpf-cnpj"
            rotulo="CPF ou CNPJ"
            value={cpfCnpj}
            onChange={(valor) => mudarCampo("cpfCnpj", valor)}
            onBlur={() => conferirCampo("cpfCnpj")}
            erro={errosDeCampo.cpfCnpj}
            descricao="Digite apenas números"
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
          />
          <InputText
            id="plano-email"
            rotulo="E-mail"
            value={email}
            onChange={(valor) => mudarCampo("email", valor)}
            onBlur={() => conferirCampo("email")}
            erro={errosDeCampo.email}
            tipo="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
          />
          {erroGeral && (
            <p className="plano-erro" role="alert">
              {erroGeral}
            </p>
          )}
          {/* No mobile só o link aparece aqui (valor e botão ficam na barra fixa); no desktop a linha
              leva o link à esquerda e o valor com o Gerar Pix à direita (1545:40734). */}
          <div className="plano-dados-acoes">
            <Button variante="transparent" tamanho="medium" onClick={() => setDadosAbertos(true)}>
              Por que pedimos esses dados?
            </Button>
            <div className="plano-dados-gerar">
              <p>{textoDoValor}</p>
              <Button tamanho="medium" larguraTotal onClick={gerarPix}>
                Gerar Pix
              </Button>
            </div>
          </div>
        </ContainerConteudo>
      )}

      {telaDoPix && pix && (
        <ContainerConteudo id="plano-pix">
          {etapa !== "recusado" && <ContadorPix segundos={etapa === "expirado" ? 0 : segundosRestantes} />}
          <CardHeader as="h1" title={tituloDoPix} />

          {/* Recusado reaproveita o card do código vencido (decidido com o Vitor), com o título e o texto
              da tela 7 do docs/apoio-telas.md. Sem o contador: o código não venceu, o banco recusou. */}
          {etapa === "expirado" || etapa === "recusado" ? (
            <section className="cartao-pix">
              <h2>{etapa === "expirado" ? "O código Pix venceu" : "O banco não confirmou o Pix Automático"}</h2>
              <p className="cartao-pix-texto">
                {etapa === "expirado"
                  ? "O tempo do Pix acabou. Toque no botão “Gerar outro Pix” para gerar uma nova chave de pagamento"
                  : "Isso pode acontecer quando a autorização não é concluída no app do banco. Se o primeiro mês já saiu da sua conta, fale com a gente antes de gerar outro Pix, para não pagar duas vezes."}
              </p>
              <Button tamanho="small" larguraTotal onClick={gerarPix} carregando={gerando}>
                Gerar outro Pix
              </Button>
            </section>
          ) : (
            <>
              <section className="cartao-pix cartao-pix-copiar">
                <h2>Copie este código para pagar</h2>
                <div className="cartao-pix-codigo">
                  <p>{pix.payload}</p>
                  <Button tamanho="small" larguraTotal onClick={copiarCodigo}>
                    {codigoCopiado ? "Código copiado" : "Copiar código pix"}
                  </Button>
                </div>
                <p className="cartao-pix-texto">
                  Escolha pagar via Pix pelo seu aplicativo bancário ou de pagamentos. Depois, cole o código copiado
                </p>
              </section>

              <section className="cartao-pix cartao-pix-qr">
                <div className="cartao-pix-qr-texto">
                  <h2>Escaneie o QR code para pagar</h2>
                  <ol>
                    <li>Acesse seu app de pagamentos.</li>
                    <li>Escolha pagar via Pix.</li>
                    <li>Escaneie o seguinte código:</li>
                  </ol>
                </div>
                <div className="cartao-pix-qr-imagem">
                  {/* eslint-disable-next-line @next/next/no-img-element -- imagem em base64 que vem do Asaas */}
                  <img src={`data:image/png;base64,${pix.imagemBase64}`} alt="QR code do Pix" />
                </div>
              </section>

              {/* Figma: 1543:40400. */}
              <section className="cartao-pix">
                <CardHeader
                  title="Autorize o Pix Automático no seu banco"
                  description="Para que os pagamentos dos próximos meses aconteçam de forma simples e sem você precisar gerar um novo código a cada mês, lembre-se de confirmar a autorização do Pix Automático no aplicativo do seu banco"
                />
              </section>

              <section className="cartao-pix">
                <CardHeader
                  title="Nome no banco"
                  description="No app do banco, o Pix aparece no nome de VITOR GAUDIO DESENVOLVIMENTO DE SOFTWARE LTDA, a empresa responsável pela Margem."
                />
              </section>
            </>
          )}
        </ContainerConteudo>
      )}

      {/* Figma: "Pix pago - sem autorizar automatico" (1543:40495) e "Tudo feito" (1543:40505). */}
      {/* Troca confirmada: o mesmo desenho do "Tudo feito", com o texto da troca. */}
      {etapa === "troca_confirmada" && (
        <ContainerConteudo id="plano-troca-confirmada">
          <div className="plano-confirmacao">
            <IconeConfirmado />
            <h1>{ehUpgrade ? `Plano ${nomeNovo} ativado` : "Troca de plano confirmada"}</h1>
          </div>
          <p className="plano-nota">
            {ehUpgrade
              ? `O plano novo já vale.${vencimento ? ` A partir de ${vencimento}, o Pix Automático cobra R$ ${total} por mês.` : ""}`
              : `O plano ${nomeNovo} começa${vencimento ? ` em ${vencimento}` : " no próximo vencimento"}. Para pagar os R$ ${total} por mês, abra este mesmo link${reabreEm ? ` a partir de ${reabreEm}` : " perto dessa data"}.`}
          </p>
        </ContainerConteudo>
      )}

      {confirmado && etapa !== "troca_confirmada" && (
        <ContainerConteudo id="plano-confirmado">
          <div className="plano-confirmacao">
            <IconeConfirmado />
            <h1>Pix pago com sucesso</h1>
          </div>
          {etapa === "tudo_feito" ? (
            <div className="plano-confirmacao">
              <IconeConfirmado />
              <h2>Pix automático autorizado</h2>
            </div>
          ) : (
            <section className="plano-autorizar">
              <CardHeader
                title="Autorize o Pix Automático no seu banco"
                description="Para que os pagamentos dos próximos meses aconteçam de forma simples e sem você precisar gerar um novo código a cada mês, lembre-se de confirmar a autorização do Pix Automático no aplicativo do seu banco"
              />
            </section>
          )}
        </ContainerConteudo>
      )}

      <Footer compacto />

      {(etapa === "resumo" || etapa === "resumo_troca" || etapa === "meu_plano") && (
        <PainelInferior
          variante="continuar"
          visivel={painelVisivel}
          onContinuar={etapa === "resumo_troca" ? continuarDaTroca : etapa === "meu_plano" ? trocarDePlano : () => setEtapa("dados")}
          texto={etapa === "resumo_troca" ? textoDoBotaoDaTroca : etapa === "meu_plano" ? "Trocar de plano" : "Continuar para o pagamento"}
        />
      )}

      {etapa === "dados" && (
        <PainelInferior
          variante="pix"
          visivel={painelVisivel && !dadosAbertos}
          texto={textoDoValor}
          onGerar={gerarPix}
        />
      )}

      {dadosAbertos && <DadosPixModal onClose={() => setDadosAbertos(false)} />}
    </main>
  );
}
