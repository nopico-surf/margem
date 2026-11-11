"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlifoMicNone, GlifoVolumeOff, GlifoVolumeUp } from "@/components/icons/glifos";
import { MessageInput } from "@/components/app/MessageInput";
import { AvisoIA } from "@/components/familia/AvisoIA";
import { ContatosEmergencia } from "@/components/familia/ContatosEmergencia";
import { ResponseError } from "@/components/conversa/ResponseError";
import { ResponseLoading } from "@/components/conversa/ResponseLoading";
import { UserMessage } from "@/components/conversa/UserMessage";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { SIMULADOR_MAX_CARACTERES, SIMULADOR_MAX_MENSAGENS } from "@/lib/familia/config";
import type { Cenario } from "@/lib/familia/conteudo";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { marcarFeito } from "@/lib/familia/exercicio-cliente";
import { CHAVE_FRASE_DO_TREINO } from "@/lib/familia/frases";
import { REACAO_DO_DIAGNOSTICO, REACOES_SIMULADOR, tituloDoTreino, type Fala, type Feedback, type ReacaoSimulador } from "@/lib/familia/simulador";
import { track } from "@/lib/mixpanel";

type Etapa = "carregando" | "inicio" | "conversa" | "seguranca" | "feedback";

const MENSAGEM_BLOQUEIO: Record<string, string> = {
  limite_gratis: "Você já usou o seu treino grátis. Os outros treinos fazem parte do programa completo.",
  so_para_compradores: "Este treino faz parte do programa completo.",
  limite_diario: "Você chegou ao limite de treinos por hoje. Amanhã dá pra treinar de novo.",
  bloqueado_seguranca:
    "Como você contou que tem medo de agressão, este treino fica fechado por enquanto. Com risco de violência, o passo mais seguro é conversar primeiro com um profissional.",
};

// O mesmo erro da /conversa (app/conversa/page.tsx), com o mesmo "Tentar novamente" (ResponseError).
const MENSAGEM_ERRO = "Não foi possível carregar o treino agora.";

// Reconhecimento de voz do navegador (Web Speech API). Só a interface: o áudio não é gravado nem
// enviado pra Margem, vira texto no campo. Tipos mínimos, porque nem todo lib.dom traz a API.
type ResultadoVoz = { 0: { transcript: string }; isFinal: boolean };
type Reconhecimento = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((evento: { resultIndex: number; results: ArrayLike<ResultadoVoz> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type ConstrutorReconhecimento = new () => Reconhecimento;

function construtorDeVoz(): ConstrutorReconhecimento | null {
  if (typeof window === "undefined") return null;
  const janela = window as unknown as { SpeechRecognition?: ConstrutorReconhecimento; webkitSpeechRecognition?: ConstrutorReconhecimento };
  return janela.SpeechRecognition ?? janela.webkitSpeechRecognition ?? null;
}

// Simulador de conversa (briefing, seção 8). A IA faz o papel da pessoa; no fim sai do personagem e
// devolve um retorno. A conversa vive só nesta tela: o servidor guarda cenário, turnos e o retorno.
// Desde 10/11/2026 usa o campo da home (MessageInput) e as mensagens, o carregando e o erro da
// /conversa (UserMessage, figma-response-copy, ResponseLoading, ResponseError). O microfone e o
// "Ouvir as respostas" usam a voz do próprio navegador; nenhuma voz é gravada.
export function SimuladorCliente({ cenario }: { cenario: Cenario }) {
  // Módulo de onde a pessoa veio (?modulo=N, posto pelo botão do exercício); sem ele, volta ao painel.
  const moduloParam = Number(useSearchParams().get("modulo"));
  const moduloDeOrigem = Number.isInteger(moduloParam) && moduloParam >= 1 && moduloParam <= 8 ? moduloParam : null;
  // ?item=: item do exercício que conclui quando o treino termina (briefing M3, card 2). ?ver=1: só mostra o
  // retorno do último treino, sem treinar de novo ("Ver o retorno do treino").
  const buscaDaUrl = useSearchParams();
  const itemQueConclui = buscaDaUrl.get("item");
  const soVerRetorno = buscaDaUrl.get("ver") === "1";
  const router = useRouter();
  const [etapa, setEtapa] = useState<Etapa>("carregando");
  const [apelido, setApelido] = useState("");
  const [reacoes, setReacoes] = useState<ReacaoSimulador[]>([]);
  const [simulacaoId, setSimulacaoId] = useState<string | null>(null);
  const [historico, setHistorico] = useState<Fala[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [esperando, setEsperando] = useState(false);
  // O que tentar de novo quando a chamada falha: começar, responder a última mensagem ou terminar.
  const [falha, setFalha] = useState<null | (() => void)>(null);
  const [bloqueio, setBloqueio] = useState<string | null>(null);
  const [mensagemSeguranca, setMensagemSeguranca] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [ouvindo, setOuvindo] = useState(false);
  const [lerRespostas, setLerRespostas] = useState(false);
  const [vozDisponivel, setVozDisponivel] = useState({ falar: false, ouvir: false });
  const reconhecimento = useRef<Reconhecimento | null>(null);
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
      if (soVerRetorno) {
        const anterior = await chamarApi(`/api/familia/simulador?cenario=${cenario.id}`);
        const guardado = anterior?.ok ? ((await anterior.json()) as { feedback: Feedback | null }).feedback : null;
        if (guardado) {
          setFeedback(guardado);
          return setEtapa("feedback");
        }
      }
      setEtapa("inicio");
    })();
  }, [cenario.bloqueadoEmModoSeguranca, cenario.id, router, soVerRetorno]);

  // "Treinar esta frase" (briefing M3): a frase escolhida entra pronta no campo, só uma vez.
  useEffect(() => {
    try {
      const pronta = window.sessionStorage.getItem(CHAVE_FRASE_DO_TREINO);
      if (!pronta) return;
      window.sessionStorage.removeItem(CHAVE_FRASE_DO_TREINO);
      setMensagem(pronta.slice(0, SIMULADOR_MAX_CARACTERES));
    } catch {}
  }, []);

  // O que o navegador oferece só se sabe no cliente.
  useEffect(() => {
    setVozDisponivel({ falar: construtorDeVoz() !== null, ouvir: "speechSynthesis" in window });
    return () => {
      reconhecimento.current?.stop();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [historico, esperando, falha]);

  const t = (texto: string) => aplicarApelido(texto, apelido);
  const nomeDaPessoa = apelido || "A pessoa";
  const turnos = historico.filter((fala) => fala.autor === "familiar").length;

  function lerEmVoz(texto: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    window.speechSynthesis.speak(fala);
  }

  function alternarLeitura() {
    setLerRespostas((atual) => {
      if (atual) window.speechSynthesis.cancel();
      return !atual;
    });
  }

  function alternarMicrofone() {
    if (ouvindo) {
      reconhecimento.current?.stop();
      return;
    }
    const Construtor = construtorDeVoz();
    if (!Construtor) return;
    const voz = new Construtor();
    voz.lang = "pt-BR";
    voz.interimResults = true;
    voz.continuous = false;
    // O que já estava escrito fica; a fala entra depois.
    const antes = mensagem.trim();
    voz.onresult = (evento) => {
      let falado = "";
      for (let indice = 0; indice < evento.results.length; indice += 1) falado += evento.results[indice][0].transcript;
      setMensagem([antes, falado.trim()].filter(Boolean).join(" ").slice(0, SIMULADOR_MAX_CARACTERES));
    };
    voz.onend = () => setOuvindo(false);
    voz.onerror = () => setOuvindo(false);
    reconhecimento.current = voz;
    setOuvindo(true);
    track("simulador_microfone", { cenario: cenario.id });
    voz.start();
  }

  async function comecar() {
    setFalha(null);
    setEsperando(true);
    const resposta = await chamarApi("/api/familia/simulador", { method: "POST", body: JSON.stringify({ acao: "iniciar", cenario: cenario.id }) });
    setEsperando(false);
    if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
    const dados = (await resposta.json().catch(() => ({}))) as { simulacaoId?: string; error?: string };
    if (!resposta.ok || !dados.simulacaoId) {
      if (dados.error && MENSAGEM_BLOQUEIO[dados.error]) setBloqueio(dados.error);
      else setFalha(() => () => void comecar());
      return;
    }
    setSimulacaoId(dados.simulacaoId);
    setEtapa("conversa");
    track("simulador_iniciado", { cenario: cenario.id });
  }

  async function terminar(falas: Fala[]) {
    setFalha(null);
    setEsperando(true);
    const resposta = await chamarApi("/api/familia/simulador", { method: "POST", body: JSON.stringify({ acao: "terminar", simulacaoId, historico: falas }) });
    setEsperando(false);
    const dados = (await resposta?.json().catch(() => ({}))) as { feedback?: Feedback } | undefined;
    if (!resposta?.ok || !dados?.feedback) {
      setFalha(() => () => void terminar(falas));
      return;
    }
    setFeedback(dados.feedback);
    setEtapa("feedback");
    if (moduloDeOrigem && itemQueConclui) void marcarFeito(moduloDeOrigem, itemQueConclui);
    track("simulador_concluido", { cenario: cenario.id, turnos: falas.filter((fala) => fala.autor === "familiar").length });
  }

  // Pede a resposta do personagem pra conversa que já termina com a mensagem do familiar.
  async function responder(falas: Fala[]) {
    setFalha(null);
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
      // A mensagem fica na tela; "Tentar carregar o treino de novo" pede a resposta de novo, sem digitar tudo.
      setFalha(() => () => void responder(falas));
      return;
    }
    const comResposta: Fala[] = [...falas, { autor: "pessoa", texto: dados.texto }];
    setHistorico(comResposta);
    if (lerRespostas) lerEmVoz(dados.texto);
    if (dados.ultima) void terminar(comResposta);
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const limpo = mensagem.trim().slice(0, SIMULADOR_MAX_CARACTERES);
    if (!limpo || esperando || falha || turnos >= SIMULADOR_MAX_MENSAGENS) return;
    reconhecimento.current?.stop();
    const falas: Fala[] = [...historico, { autor: "familiar", texto: limpo }];
    setHistorico(falas);
    setMensagem("");
    void responder(falas);
  }

  function alternarReacao(valor: ReacaoSimulador) {
    setReacoes((atuais) => (atuais.includes(valor) ? atuais.filter((item) => item !== valor) : [...atuais, valor]));
  }

  const aviso = <AvisoIA>{t("Isto é um treino com IA. A IA pode cometer erros, não é {{apelido}} e não substitui um profissional.")}</AvisoIA>;
  const erro = falha && <ResponseError error={MENSAGEM_ERRO} onRetry={falha} rotuloTentar="Tentar carregar o treino de novo" />;

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
        <header className="familia-titulo">
          <h1 className="header-large">Sua segurança vem primeiro</h1>
          <p className="text-large">
            {mensagemSeguranca ?? "Se você ou alguém da casa está em perigo agora, peça ajuda já. Nenhuma conversa vale mais do que a sua segurança."}
          </p>
        </header>
        <ContatosEmergencia />
      </section>
    );
  }

  if (etapa === "feedback" && feedback) {
    return (
      <section className="familia-secao">
        <h1 className="header-large">Como foi o seu treino</h1>
        <AvisoIA>Este retorno foi escrito por uma IA e pode ter erros. Use o que fizer sentido pra você.</AvisoIA>
        <h2 className="header-medium">O que funcionou</h2>
        <ul className="familia-lista text-large">
          {feedback.o_que_funcionou.map((item) => (
            <li key={item}>{t(item)}</li>
          ))}
        </ul>
        <h2 className="header-medium">O que tentar diferente</h2>
        <ul className="familia-lista text-large">
          {feedback.o_que_tentar_diferente.map((item) => (
            <li key={item}>{t(item)}</li>
          ))}
        </ul>
        <h2 className="header-medium">Uma frase para levar</h2>
        <p className="familia-fala text-large">{t(feedback.frase_para_levar)}</p>
        <Button tamanho="medium" larguraTotal href={moduloDeOrigem ? `/familia/programa/modulo/${moduloDeOrigem}` : "/familia/programa"}>
          {moduloDeOrigem ? `Voltar para o módulo ${moduloDeOrigem}` : "Voltar ao painel"}
        </Button>
      </section>
    );
  }

  if (etapa === "inicio") {
    return (
      <section className="familia-secao">
        <header className="familia-titulo">
          <h1 className="header-large">{tituloDoTreino(cenario.titulo)}</h1>
          <p className="text-large">{t(cenario.contexto)}</p>
        </header>
        {aviso}
        <p className="text-large">
          <strong>Seu objetivo:</strong> {cenario.objetivoDoFamiliar}
        </p>

        {bloqueio ? (
          <>
            <p className="text-large" role="status">
              {MENSAGEM_BLOQUEIO[bloqueio]}
            </p>
            {bloqueio === "bloqueado_seguranca" && <ContatosEmergencia />}
          </>
        ) : (
          <>
            <h2 className="header-medium">{t("Como {{apelido}} costuma reagir?")}</h2>
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
            <p className="text-medium-regular familia-texto-suave">
              Você escreve ou fala até {SIMULADOR_MAX_MENSAGENS} mensagens. Quando quiser, termine e veja o retorno.
            </p>
            {erro}
            <Button tamanho="medium" larguraTotal disabled={reacoes.length === 0} carregando={esperando} onClick={comecar}>
              Começar o treino
            </Button>
          </>
        )}
      </section>
    );
  }

  const podeEscrever = turnos < SIMULADOR_MAX_MENSAGENS;

  return (
    <section className="familia-secao">
      <h1 className="header-large">{tituloDoTreino(cenario.titulo)}</h1>
      {aviso}
      {vozDisponivel.ouvir && (
        <div className="familia-exercicio-acoes">
          <Button variante="transparent" tamanho="small" onClick={alternarLeitura}>
            {lerRespostas ? <GlifoVolumeUp size={20} /> : <GlifoVolumeOff size={20} />}
            Ouvir as respostas
          </Button>
        </div>
      )}

      <div className="figma-result-messages" aria-live="polite">
        {historico.map((fala, indice) =>
          fala.autor === "familiar" ? (
            <UserMessage key={indice} message={fala.texto} />
          ) : (
            <div key={indice} className="figma-response-copy" aria-label={`${nomeDaPessoa}, no treino com IA`}>
              <p>{fala.texto}</p>
            </div>
          ),
        )}
        {esperando && <ResponseLoading />}
        {erro}
        <div ref={fim} />
      </div>

      {podeEscrever && (
        <MessageInput
          value={mensagem}
          onChange={(valor) => setMensagem(valor.slice(0, SIMULADOR_MAX_CARACTERES))}
          onSubmit={enviar}
          rotulo="Escreva ou fale o que você diria"
          dica={`Mensagem ${turnos + 1} de ${SIMULADOR_MAX_MENSAGENS}`}
          maxLength={SIMULADOR_MAX_CARACTERES}
          acessorio={
            vozDisponivel.falar && (
              <button
                type="button"
                className="message-component-acessorio"
                aria-label={ouvindo ? "Parar de ouvir" : "Falar a mensagem"}
                aria-pressed={ouvindo}
                onMouseDown={(evento) => evento.preventDefault()}
                onClick={alternarMicrofone}
              >
                <GlifoMicNone size={20} />
              </button>
            )
          }
        />
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
