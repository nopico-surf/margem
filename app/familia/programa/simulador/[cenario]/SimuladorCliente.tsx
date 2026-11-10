"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoSend } from "@/components/icons/glifos";
import { AvisoIA } from "@/components/familia/AvisoIA";
import { ContatosEmergencia } from "@/components/familia/ContatosEmergencia";
import { UserMessage } from "@/components/conversa/UserMessage";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { SIMULADOR_MAX_CARACTERES, SIMULADOR_MAX_MENSAGENS } from "@/lib/familia/config";
import type { Cenario } from "@/lib/familia/conteudo";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { REACAO_DO_DIAGNOSTICO, REACOES_SIMULADOR, type Fala, type Feedback, type ReacaoSimulador } from "@/lib/familia/simulador";
import { CardHeader } from "@/components/conversa/CardHeader";
import { track } from "@/lib/mixpanel";

type Etapa = "carregando" | "inicio" | "conversa" | "seguranca" | "feedback";

const MENSAGEM_BLOQUEIO: Record<string, string> = {
  limite_gratis: "Você já usou o seu treino grátis. Os outros treinos fazem parte do programa completo.",
  so_para_compradores: "Este treino faz parte do programa completo.",
  limite_diario: "Você chegou ao limite de treinos por hoje. Amanhã dá pra treinar de novo.",
  bloqueado_seguranca:
    "Como você contou que tem medo de agressão, este treino fica fechado por enquanto. Com risco de violência, o passo mais seguro é conversar primeiro com um profissional.",
};

const ERRO_IA = "Não foi possível continuar o treino agora. Tente enviar de novo.";

// Simulador de conversa (briefing, seção 8). A IA faz o papel da pessoa; no fim sai do personagem e
// devolve um retorno. A conversa vive só nesta tela: o servidor guarda cenário, turnos e o retorno.
export function SimuladorCliente({ cenario }: { cenario: Cenario }) {
  const router = useRouter();
  const [etapa, setEtapa] = useState<Etapa>("carregando");
  const [apelido, setApelido] = useState("");
  const [reacoes, setReacoes] = useState<ReacaoSimulador[]>([]);
  const [simulacaoId, setSimulacaoId] = useState<string | null>(null);
  const [historico, setHistorico] = useState<Fala[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [esperando, setEsperando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [bloqueio, setBloqueio] = useState<string | null>(null);
  const [mensagemSeguranca, setMensagemSeguranca] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (resposta.ok) {
        const dados = (await resposta.json()) as { apelido: string; reacoes: string[]; resultado: { safetyMode: boolean } };
        setApelido(dados.apelido);
        const preenchidas = dados.reacoes.map((reacao) => REACAO_DO_DIAGNOSTICO[reacao]).filter((reacao): reacao is ReacaoSimulador => Boolean(reacao));
        setReacoes(preenchidas.length ? [...new Set(preenchidas)] : ["nega"]);
        if (dados.resultado.safetyMode && cenario.bloqueadoEmModoSeguranca) setBloqueio("bloqueado_seguranca");
      }
      setEtapa("inicio");
    })();
  }, [cenario.bloqueadoEmModoSeguranca, router]);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [historico, esperando]);

  const t = (texto: string) => aplicarApelido(texto, apelido);
  const nomeDaPessoa = apelido || "A pessoa";
  const turnos = historico.filter((fala) => fala.autor === "familiar").length;

  async function comecar() {
    setErro(null);
    setEsperando(true);
    const resposta = await chamarApi("/api/familia/simulador", { method: "POST", body: JSON.stringify({ acao: "iniciar", cenario: cenario.id }) });
    setEsperando(false);
    if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
    const dados = (await resposta.json().catch(() => ({}))) as { simulacaoId?: string; error?: string };
    if (!resposta.ok || !dados.simulacaoId) {
      if (dados.error && MENSAGEM_BLOQUEIO[dados.error]) setBloqueio(dados.error);
      else setErro("Não foi possível começar o treino agora. Tente novamente.");
      return;
    }
    setSimulacaoId(dados.simulacaoId);
    setEtapa("conversa");
    track("simulador_iniciado", { cenario: cenario.id });
  }

  async function terminar(falas: Fala[]) {
    setErro(null);
    setEsperando(true);
    const resposta = await chamarApi("/api/familia/simulador", { method: "POST", body: JSON.stringify({ acao: "terminar", simulacaoId, historico: falas }) });
    setEsperando(false);
    const dados = (await resposta?.json().catch(() => ({}))) as { feedback?: Feedback } | undefined;
    if (!resposta?.ok || !dados?.feedback) {
      setErro("Não foi possível preparar o retorno agora. Tente novamente.");
      return;
    }
    setFeedback(dados.feedback);
    setEtapa("feedback");
    track("simulador_concluido", { cenario: cenario.id, turnos: falas.filter((fala) => fala.autor === "familiar").length });
  }

  async function enviar(texto: string, base: Fala[]) {
    const limpo = texto.trim().slice(0, SIMULADOR_MAX_CARACTERES);
    if (!limpo || esperando) return;
    const falas: Fala[] = [...base, { autor: "familiar", texto: limpo }];
    setHistorico(falas);
    setMensagem("");
    setErro(null);
    setEsperando(true);
    const resposta = await chamarApi("/api/familia/simulador", { method: "POST", body: JSON.stringify({ acao: "mensagem", simulacaoId, historico: falas, reacoes }) });
    setEsperando(false);
    const dados = (await resposta?.json().catch(() => ({}))) as { tipo?: "fala" | "seguranca"; texto?: string; mensagem?: string | null; ultima?: boolean } | undefined;

    if (dados?.tipo === "seguranca") {
      setMensagemSeguranca(dados.mensagem ?? null);
      setEtapa("seguranca");
      track("seguranca_acionada", { origem: "simulador" });
      return;
    }
    if (!resposta?.ok || dados?.tipo !== "fala" || !dados.texto) {
      // A mensagem volta pro campo pra pessoa tentar de novo sem digitar tudo.
      setHistorico(base);
      setMensagem(limpo);
      setErro(ERRO_IA);
      return;
    }
    const comResposta: Fala[] = [...falas, { autor: "pessoa", texto: dados.texto }];
    setHistorico(comResposta);
    if (dados.ultima) void terminar(comResposta);
  }

  function alternarReacao(valor: ReacaoSimulador) {
    setReacoes((atuais) => (atuais.includes(valor) ? atuais.filter((item) => item !== valor) : [...atuais, valor]));
  }

  const aviso = <AvisoIA>{t("Isto é um treino com IA. A IA pode cometer erros, não é {{apelido}} e não substitui um profissional.")}</AvisoIA>;

  if (etapa === "carregando") {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  if (etapa === "seguranca") {
    return (
      <section className="familia-secao">
        <CardHeader
          as="h1"
          title="Sua segurança vem primeiro"
          description={
            mensagemSeguranca ??
            "Se você ou alguém da casa está em perigo agora, procure ajuda imediata. Nenhuma técnica de conversa é mais importante do que estar seguro."
          }
        />
        <ContatosEmergencia />
      </section>
    );
  }

  if (etapa === "feedback" && feedback) {
    return (
      <section className="familia-secao">
        <CardHeader as="h1" title="Como foi o seu treino" />
        <AvisoIA>Este retorno foi escrito por uma IA e pode ter erros. Use o que fizer sentido pra você.</AvisoIA>
        <h2 className="header-small">O que funcionou</h2>
        <ul className="familia-lista text-medium-regular">
          {feedback.o_que_funcionou.map((item) => (
            <li key={item}>{t(item)}</li>
          ))}
        </ul>
        <h2 className="header-small">O que tentar diferente</h2>
        <ul className="familia-lista text-medium-regular">
          {feedback.o_que_tentar_diferente.map((item) => (
            <li key={item}>{t(item)}</li>
          ))}
        </ul>
        <h2 className="header-small">Uma frase para levar</h2>
        <p className="familia-fala text-medium-regular">{t(feedback.frase_para_levar)}</p>
        <Button tamanho="medium" larguraTotal href="/familia/programa/modulo/1">
          Voltar para o módulo 1
        </Button>
      </section>
    );
  }

  if (etapa === "inicio") {
    return (
      <section className="familia-secao">
        <CardHeader as="h1" title={cenario.titulo} description={t(cenario.contexto)} />
        {aviso}
        <p className="text-medium-regular">
          <strong>Seu objetivo:</strong> {cenario.objetivoDoFamiliar}
        </p>

        {bloqueio ? (
          <>
            <p className="text-medium-regular" role="status">
              {MENSAGEM_BLOQUEIO[bloqueio]}
            </p>
            {bloqueio === "bloqueado_seguranca" && <ContatosEmergencia />}
          </>
        ) : (
          <>
            <h2 className="header-small">{t("Como {{apelido}} costuma reagir?")}</h2>
            <div className="familia-chips">
              {REACOES_SIMULADOR.map((reacao) => (
                <Button
                  key={reacao.valor}
                  tamanho="x-small"
                  redondo
                  variante={reacoes.includes(reacao.valor) ? "primary" : "secondary"}
                  onClick={() => alternarReacao(reacao.valor)}
                >
                  {reacao.rotulo}
                </Button>
              ))}
            </div>
            <p className="text-small-regular familia-texto-suave">
              Você escreve até {SIMULADOR_MAX_MENSAGENS} mensagens. Quando quiser, termine e veja o retorno.
            </p>
            {erro && (
              <p className="text-small-regular familia-erro" role="alert">
                {erro}
              </p>
            )}
            <Button tamanho="medium" larguraTotal disabled={reacoes.length === 0} carregando={esperando} onClick={comecar}>
              Começar o treino
            </Button>
          </>
        )}
      </section>
    );
  }

  return (
    <section className="familia-secao">
      <CardHeader as="h1" title={cenario.titulo} />
      {aviso}

      <div className="familia-conversa" aria-live="polite">
        {historico.map((fala, indice) =>
          fala.autor === "familiar" ? (
            <UserMessage key={indice} message={fala.texto} />
          ) : (
            <p key={indice} className="familia-fala-pessoa" aria-label={`${nomeDaPessoa}, no treino com IA`}>
              {fala.texto}
            </p>
          ),
        )}
        {esperando && (
          <div className="familia-fala-pessoa" aria-label="Escrevendo a resposta">
            <Loader />
          </div>
        )}
        <div ref={fim} />
      </div>

      {erro && (
        <p className="text-small-regular familia-erro" role="alert">
          {erro}
        </p>
      )}

      {turnos < SIMULADOR_MAX_MENSAGENS && (
        <>
          <span className="label-x-small familia-texto-suave">
            Mensagem {Math.min(turnos + 1, SIMULADOR_MAX_MENSAGENS)} de {SIMULADOR_MAX_MENSAGENS}
          </span>
          <div className="familia-envio">
            <InputText
              id="familia-mensagem"
              rotulo="Sua mensagem"
              value={mensagem}
              maxLength={SIMULADOR_MAX_CARACTERES}
              autoComplete="off"
              enterKeyHint="send"
              onChange={setMensagem}
              onKeyDown={(evento) => {
                if (evento.key === "Enter") void enviar(mensagem, historico);
              }}
            />
            <Button tamanho="medium" aria-label="Enviar mensagem" disabled={!mensagem.trim()} carregando={esperando} onClick={() => void enviar(mensagem, historico)}>
              <GlifoSend size={20} />
            </Button>
          </div>
        </>
      )}

      <Button
        variante="secondary"
        tamanho="medium"
        larguraTotal
        disabled={!historico.some((fala) => fala.autor === "pessoa") || esperando}
        onClick={() => void terminar(historico[historico.length - 1]?.autor === "familiar" ? historico.slice(0, -1) : historico)}
      >
        Terminar e ver o retorno
      </Button>
    </section>
  );
}
