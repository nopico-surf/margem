"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { LoginSocial } from "@/components/familia/LoginSocial";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LOGIN_GATE } from "@/lib/familia/config";
import { aplicarApelido, calcularSafetyMode, perguntasVisiveis, respondida, type Problema, type Respostas } from "@/lib/familia/diagnostico";
import { lerRespostasLocais, salvarRespostasLocais, temSessao } from "@/lib/familia/fluxo-cliente";
import { CardHeader } from "@/components/conversa/CardHeader";
import { track } from "@/lib/mixpanel";

const PROBLEMAS_DA_LP: Problema[] = ["alcool", "outras_drogas", "apostas"];

// Diagnóstico grátis (briefing, seção 5): uma pergunta por tela, barra de progresso e botão voltar.
// As respostas ficam no aparelho até o login. Escolha única avança sozinha; múltipla e texto têm botão.
export function DiagnosticoCliente() {
  const router = useRouter();
  const [respostas, setRespostas] = useState<Respostas>({});
  const [indice, setIndice] = useState(0);
  // A primeira pergunta aparece já no HTML: esperar o JavaScript deixava a tela só com o loader por
  // alguns segundos no celular. Só o gate "inicio" precisa esperar a conferência da sessão.
  const [pronto, setPronto] = useState(LOGIN_GATE !== "inicio");
  const [pedirLogin, setPedirLogin] = useState(false);
  const iniciou = useRef(false);

  useEffect(() => {
    const salvas = lerRespostasLocais();
    // Chip da LP: pré-preenche a Q3.
    const problema = new URLSearchParams(window.location.search).get("problema") as Problema | null;
    if (problema && PROBLEMAS_DA_LP.includes(problema) && !salvas.problemas?.length) salvas.problemas = [problema];
    setRespostas(salvas);
    (async () => {
      if (LOGIN_GATE === "inicio" && !(await temSessao())) setPedirLogin(true);
      setPronto(true);
    })();
  }, []);

  // Só as perguntas que valem pra estas respostas: a Q3b (frequência do álcool) só entra com álcool marcado.
  const visiveis = perguntasVisiveis(respostas);
  const total = visiveis.length;
  const pergunta = visiveis[Math.min(indice, total - 1)];

  function atualizar(novas: Respostas) {
    setRespostas(novas);
    salvarRespostasLocais(novas);
    if (!iniciou.current) {
      iniciou.current = true;
      track("diagnostico_iniciado", { gate: LOGIN_GATE });
    }
  }

  function avancar(atuais: Respostas) {
    if (indice < perguntasVisiveis(atuais).length - 1) {
      setIndice(indice + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    const safetyMode = calcularSafetyMode(atuais);
    track("diagnostico_concluido", { safety_mode: safetyMode });
    // Com risco, o resultado já troca o roteiro pelos contatos de emergência. A parada na página de
    // segurança antes do login saiu em 09/11/2026, a pedido do fundador.
    if (safetyMode) track("seguranca_acionada", { origem: "diagnostico" });
    router.push("/familia/entrar");
  }

  function escolher(valor: string) {
    if (pergunta.tipo === "unica") {
      const novas = { ...respostas, [pergunta.chave]: valor };
      atualizar(novas);
      avancar(novas);
      return;
    }
    const atual = (respostas[pergunta.chave] as string[] | undefined) ?? [];
    // Na ordem em que foi marcado: o primeiro problema é o principal.
    const lista = atual.includes(valor) ? atual.filter((item) => item !== valor) : [...atual, valor];
    atualizar({ ...respostas, [pergunta.chave]: lista });
  }

  if (!pronto) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  if (pedirLogin) {
    return (
      <section className="familia-secao">
        <LoginSocial titulo="Antes de começar" />
      </section>
    );
  }

  const valorAtual = respostas[pergunta.chave];
  const selecionado = (valor: string) => (Array.isArray(valorAtual) ? valorAtual.includes(valor as never) : valorAtual === valor);

  return (
    <section className="familia-pergunta">
      <div className="familia-pergunta-topo">
        <button
          className="familia-voltar"
          type="button"
          aria-label="Voltar para a pergunta anterior"
          onClick={() => (indice > 0 ? setIndice(indice - 1) : router.push("/familia"))}
        >
          <GlifoArrowBack size={24} />
        </button>
        <ProgressBar atual={indice + 1} total={total} rotulo={`Pergunta ${indice + 1} de ${total}`} />
        <span className="label-x-small familia-texto-suave">
          {indice + 1}/{total}
        </span>
      </div>

      <CardHeader
        as="h1"
        title={aplicarApelido(pergunta.titulo, respostas.apelido)}
        description={pergunta.tipo === "multipla" ? "Você pode marcar mais de uma." : undefined}
      />

      {pergunta.tipo === "texto" ? (
        <>
          <InputText
            id={`familia-${pergunta.chave}`}
            rotulo="Apelido da pessoa (opcional)"
            descricao={pergunta.placeholder}
            value={(valorAtual as string | undefined) ?? ""}
            maxLength={pergunta.maxLength}
            autoComplete="off"
            onChange={(valor) => atualizar({ ...respostas, [pergunta.chave]: valor })}
            onKeyDown={(evento) => {
              if (evento.key === "Enter") avancar(respostas);
            }}
          />
          <Button tamanho="medium" larguraTotal onClick={() => avancar(respostas)}>
            {valorAtual ? "Ir para a próxima pergunta" : "Pular esta pergunta"}
          </Button>
        </>
      ) : (
        <>
          <div className="familia-opcoes" data-tipo={pergunta.tipo} role={pergunta.tipo === "unica" ? "radiogroup" : "group"}>
            {pergunta.opcoes?.map((opcao) => (
              <Button
                key={opcao.valor}
                variante={selecionado(opcao.valor) ? "primary" : "secondary"}
                tamanho="medium"
                // Múltipla escolha é arredondada, pra não parecer que um toque já avança.
                redondo={pergunta.tipo === "multipla"}
                larguraTotal
                aria-label={aplicarApelido(opcao.rotulo, respostas.apelido)}
                onClick={() => escolher(opcao.valor)}
              >
                {aplicarApelido(opcao.rotulo, respostas.apelido)}
              </Button>
            ))}
          </div>
          {pergunta.tipo === "multipla" && (
            <Button tamanho="medium" larguraTotal disabled={!respondida(pergunta, respostas)} onClick={() => avancar(respostas)}>
              Ir para a próxima pergunta
            </Button>
          )}
        </>
      )}
    </section>
  );
}
