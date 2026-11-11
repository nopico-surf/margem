"use client";

import { useEffect, useRef, useState } from "react";
import { normalizarCpfCnpj } from "./documento";

// O que as telas de pagamento por Pix têm em comum: o /plano (profissionais) e o checkout do programa
// para familiares. Conferência dos dados, mensagens de erro da rota do Pix, validade do QR, contador,
// consulta do status e o "Copiar código pix". Saiu do app/plano/PlanoCliente.tsx sem mudar o comportamento.

// Mensagens por código de erro das rotas do Pix (docs/apoio-telas.md, tela 4).
export const ERROS_DE_CAMPO = {
  nome_invalido: "Escreva seu nome completo, com até 100 caracteres.",
  cpf_cnpj_invalido: "Não conseguimos conferir esse CPF ou CNPJ. Confira os números e tente de novo.",
  email_invalido: "Não conseguimos reconhecer esse e-mail. Confira se ele está completo, com @.",
} as const;
export type Campo = "nome" | "cpfCnpj" | "email";
export const CAMPO_DO_ERRO: Record<keyof typeof ERROS_DE_CAMPO, Campo> = {
  nome_invalido: "nome",
  cpf_cnpj_invalido: "cpfCnpj",
  email_invalido: "email",
};
// As mesmas conferências da rota do Pix, para o erro aparecer ao sair do campo, sem esperar o envio.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function campoValido(campo: Campo, valor: string) {
  if (campo === "nome") return valor.trim() !== "" && valor.trim().length <= 100;
  if (campo === "cpfCnpj") return normalizarCpfCnpj(valor) !== null;
  return valor.trim().length <= 254 && EMAIL.test(valor.trim());
}
export const ERRO_DO_CAMPO: Record<Campo, string> = {
  nome: ERROS_DE_CAMPO.nome_invalido,
  cpfCnpj: ERROS_DE_CAMPO.cpf_cnpj_invalido,
  email: ERROS_DE_CAMPO.email_invalido,
};

export const ERRO_DADOS_RECUSADOS =
  "O sistema de pagamento não aceitou esses dados. Confira o nome e o CPF ou CNPJ e tente de novo.";
export const ERRO_PAGAMENTO_INDISPONIVEL =
  "Não foi possível gerar o Pix agora, porque o sistema de pagamento está fora do ar. Tente de novo daqui a alguns minutos.";

export type Pix = { apoioId: string; payload: string; imagemBase64: string; expiraEm: number };
export type QrCodeDaRota = { payload: string; imagemBase64: string; expiraEm: unknown };
export type StatusDoPix = { status?: string; pago?: boolean };

// O Asaas devolve a validade como data sem fuso ("2026-10-22 16:30:00", horário de Brasília). Sem data
// legível, ou com uma fora do razoável, vale a regra dos 10 minutos a partir de agora.
export const VALIDADE_PADRAO = 10 * 60 * 1000;

export function momentoDeExpirar(expiraEm: unknown) {
  const padrao = Date.now() + VALIDADE_PADRAO;
  if (typeof expiraEm !== "string") return padrao;
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(expiraEm) ? expiraEm : `${expiraEm.replace(" ", "T")}-03:00`;
  const momento = Date.parse(iso);
  if (!Number.isFinite(momento) || momento <= Date.now() || momento > Date.now() + 4 * VALIDADE_PADRAO) return padrao;
  return momento;
}

// Prévia (só desenvolvimento): um QR de 1 pixel e um código de exemplo, sem pagamento.
export const QR_DA_PREVIA =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
export function pixDaPrevia(apoioId = "previa"): Pix {
  return {
    apoioId,
    payload: "00020101021226810014br.gov.bcb.pix2559pix-h.asaas.com/qr/cobv/exemplo-da-previa6304ABCD",
    imagemBase64: QR_DA_PREVIA,
    expiraEm: Date.now() + VALIDADE_PADRAO,
  };
}

const INTERVALO_STATUS = 4000;

type Opcoes = {
  // A tela do QR está aberta: o contador anda e, quando zera, chama onExpirou.
  naTela: boolean;
  // Consulta o status a cada poucos segundos (o id "previa" nunca é consultado).
  consultando: boolean;
  onStatus: (status: StatusDoPix) => void;
  onExpirou: () => void;
  // Onde consultar. Padrão: a rota de status dos apoios.
  consultar?: (apoioId: string) => Promise<StatusDoPix | null>;
};

async function consultarApoio(apoioId: string): Promise<StatusDoPix | null> {
  const resposta = await fetch(`/api/apoio/${apoioId}/status`, { cache: "no-store" });
  return resposta.ok ? ((await resposta.json()) as StatusDoPix) : null;
}

export function usePix({ naTela, consultando, onStatus, onExpirou, consultar = consultarApoio }: Opcoes) {
  const [pix, setPix] = useState<Pix | null>(null);
  // Começa em 0 e só ganha o relógio quando o Pix é gerado: Date.now() no render quebra o prerender.
  const [agora, setAgora] = useState(0);
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const retornos = useRef({ onStatus, onExpirou, consultar });
  useEffect(() => {
    retornos.current = { onStatus, onExpirou, consultar };
  });

  // Relógio do contador, só enquanto o Pix está na tela.
  useEffect(() => {
    if (!naTela) return;
    const intervalo = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, [naTela]);

  const segundosRestantes = pix ? Math.ceil((pix.expiraEm - agora) / 1000) : 0;

  useEffect(() => {
    if (naTela && pix && segundosRestantes <= 0) retornos.current.onExpirou();
  }, [naTela, pix, segundosRestantes]);

  const deveConsultar = consultando && pix !== null && pix.apoioId !== "previa";
  const apoioId = pix?.apoioId;
  useEffect(() => {
    if (!deveConsultar || !apoioId) return;
    let ativo = true;
    const consultarAgora = async () => {
      try {
        const status = await retornos.current.consultar(apoioId);
        if (ativo && status) retornos.current.onStatus(status);
      } catch {
        // Falha de rede: tenta de novo na próxima volta.
      }
    };
    const intervalo = setInterval(consultarAgora, INTERVALO_STATUS);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [deveConsultar, apoioId]);

  // Pix novo vindo da rota: o contador recomeça e o "Código copiado" volta a "Copiar código pix".
  function mostrarPix(apoio: string, qrCode: QrCodeDaRota) {
    setPix({ apoioId: apoio, payload: qrCode.payload, imagemBase64: qrCode.imagemBase64, expiraEm: momentoDeExpirar(qrCode.expiraEm) });
    setAgora(Date.now());
    setCodigoCopiado(false);
  }

  function mostrarPrevia(apoio?: string) {
    setPix(pixDaPrevia(apoio));
    setAgora(Date.now());
  }

  async function copiarCodigo() {
    if (!pix) return false;
    try {
      await navigator.clipboard.writeText(pix.payload);
      setCodigoCopiado(true);
      return true;
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
    return copiou;
  }

  return { pix, segundosRestantes, codigoCopiado, mostrarPix, mostrarPrevia, copiarCodigo };
}
