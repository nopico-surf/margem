"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { CHAVE_POSICAO_AUDIO } from "@/lib/familia/config";
import type { Modulo } from "@/lib/familia/conteudo";
import { aplicarApelido, ROTULO_PROBLEMA, type Problema } from "@/lib/familia/diagnostico";
import { carregarEstado, contextoDo, itensDoExercicio, marcarFeito, type EstadoExercicio } from "@/lib/familia/exercicio-cliente";
import { condicoesBatem, opcoesDaEscolha, type BlocoMarkdown, type Contexto, type Trecho } from "@/lib/familia/markdown";
import { ExercicioSemana } from "@/components/familia/ExercicioSemana";
import { CardHeader } from "@/components/conversa/CardHeader";
import { track } from "@/lib/mixpanel";

type Diagnostico = { apelido: string; problemas: Problema[]; reacoes: string[]; resultado: { safetyMode: boolean } };

function Trechos({ trechos, apelido }: { trechos: Trecho[]; apelido: string }) {
  return (
    <>
      {trechos.map((trecho, indice) =>
        trecho.negrito ? <strong key={indice}>{aplicarApelido(trecho.texto, apelido)}</strong> : <Fragment key={indice}>{aplicarApelido(trecho.texto, apelido)}</Fragment>,
      )}
    </>
  );
}

type BlocosProps = {
  blocos: BlocoMarkdown[];
  apelido: string;
  problemas: Problema[];
  contexto: Contexto;
  onEscolher: (id: string, valor: string) => void;
  // Itens do exercício, desenhados no lugar do primeiro ":::exercicio" do texto (só no nível de cima).
  exercicio?: ReactNode;
};

function Blocos({ blocos, apelido, problemas, contexto, onEscolher, exercicio }: BlocosProps) {
  const posicaoDoExercicio = exercicio ? blocos.findIndex((bloco) => bloco.tipo === "exercicio") : -1;
  return (
    <>
      {blocos.map((bloco, indice) => {
        if (bloco.tipo === "titulo") return <h2 key={indice} className="header-small">{aplicarApelido(bloco.texto, apelido)}</h2>;
        if (bloco.tipo === "link")
          return (
            <div key={indice} className="familia-exercicio-acoes">
              <Button variante={bloco.botao ? "secondary" : "transparent"} tamanho="small" href={bloco.href}>
                {bloco.rotulo}
              </Button>
            </div>
          );
        // Seletor (módulo 8, "Como estão as coisas agora?"): os mesmos chips do "Como {{apelido}}
        // costuma reagir?" do simulador. Sem escolha, nada das versões aparece.
        if (bloco.tipo === "escolha") {
          const { pergunta, opcoes } = opcoesDaEscolha(bloco);
          const escolhida = contexto.escolhas?.[bloco.id];
          return (
            <Fragment key={indice}>
              <h2 className="header-small">{aplicarApelido(pergunta, apelido)}</h2>
              <div className="familia-chips" role="group" aria-label={aplicarApelido(pergunta, apelido)}>
                {opcoes.map((opcao) => (
                  <Button
                    key={opcao.valor}
                    tamanho="x-small"
                    redondo
                    variante={escolhida === opcao.valor ? "primary" : "secondary"}
                    onClick={() => onEscolher(bloco.id, opcao.valor)}
                  >
                    {aplicarApelido(opcao.rotulo, apelido)}
                  </Button>
                ))}
              </div>
            </Fragment>
          );
        }
        if (bloco.tipo === "paragrafo")
          return (
            <p key={indice} className="text-medium-regular">
              <Trechos trechos={bloco.trechos} apelido={apelido} />
            </p>
          );
        if (bloco.tipo === "lista") {
          const Lista = bloco.ordenada ? "ol" : "ul";
          return (
            <Lista key={indice} className="familia-lista text-medium-regular">
              {bloco.itens.map((item, posicao) => (
                <li key={posicao}>
                  <Trechos trechos={item} apelido={apelido} />
                </li>
              ))}
            </Lista>
          );
        }
        // Itens do exercício: todos juntos, com os botões (ExercicioSemana), no lugar do primeiro.
        if (bloco.tipo === "exercicio") return indice === posicaoDoExercicio ? <Fragment key={indice}>{exercicio}</Fragment> : null;
        // Bloco condicional (ex.: só pro problema principal): o texto entra solto, sem moldura.
        if (bloco.tipo === "condicional") {
          if (!condicoesBatem(bloco.condicoes, contexto)) return null;
          return <Blocos key={indice} blocos={bloco.blocos} apelido={apelido} problemas={problemas} contexto={contexto} onEscolher={onEscolher} />;
        }
        // Variação (formato antigo): só pra quem marcou aquele problema na Q3.
        if (!problemas.includes(bloco.problema as Problema)) return null;
        return (
          <div key={indice} className="familia-variacao">
            <span className="label-small-medium">{ROTULO_PROBLEMA[bloco.problema as Problema] ?? bloco.problema}</span>
            <Blocos blocos={bloco.blocos} apelido={apelido} problemas={problemas} contexto={contexto} onEscolher={onEscolher} />
          </div>
        );
      })}
    </>
  );
}

export function ModuloCliente({ modulo }: { modulo: Modulo }) {
  const router = useRouter();
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [concluido, setConcluido] = useState(false);
  const [concluindo, setConcluindo] = useState(false);
  const [estado, setEstado] = useState<EstadoExercicio>({});
  // Respostas dos seletores do módulo (":::escolha"). Ficam só nesta tela: o check-in que pré-marcaria
  // o seletor ainda não existe.
  const [escolhas, setEscolhas] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      setDiagnostico((await resposta.json()) as Diagnostico);
      setEstado(await carregarEstado(modulo.numero));
      track(modulo.numero === 1 ? "modulo1_iniciado" : "modulo_iniciado", { modulo: modulo.numero });
      void chamarApi("/api/familia/progresso", { method: "POST", body: JSON.stringify({ modulo: modulo.numero, acao: "iniciar" }) });
    })();
  }, [modulo.numero, router]);

  if (!diagnostico) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const { apelido, problemas } = diagnostico;
  const contexto: Contexto = { ...contextoDo(diagnostico), escolhas };
  const escolher = (id: string, valor: string) => setEscolhas((atuais) => ({ ...atuais, [id]: valor }));
  const itens = itensDoExercicio(modulo.blocos, contexto);

  async function marcar(item: string) {
    if (estado[item]) return;
    setEstado((atual) => ({ ...atual, [item]: new Date().toISOString() }));
    await marcarFeito(modulo.numero, item);
  }

  async function concluir() {
    setConcluindo(true);
    const resposta = await chamarApi("/api/familia/progresso", { method: "POST", body: JSON.stringify({ modulo: modulo.numero, acao: "concluir" }) });
    setConcluindo(false);
    if (resposta?.ok) {
      setConcluido(true);
      track("modulo_concluido", { modulo: modulo.numero });
    }
  }

  return (
    <article className="familia-secao familia-modulo">
      <CardHeader as="h1" title={modulo.titulo} description={`Módulo ${modulo.numero}${modulo.minutos ? ` · ${modulo.minutos} min de leitura` : ""}`} />

      {modulo.video && (
        // Vídeo vertical, no formato dos reels da Margem. Sem vídeo, nada aparece.
        <video className="familia-video" src={modulo.video} controls playsInline preload="metadata" />
      )}
      {modulo.audio && (
        <AudioPlayer
          src={modulo.audio}
          rotulo={modulo.minutos ? `Prefere ouvir? ${modulo.minutos} min` : "Prefere ouvir?"}
          chave={`${CHAVE_POSICAO_AUDIO}-${modulo.numero}`}
        />
      )}

      <Blocos
        blocos={modulo.blocos}
        apelido={apelido}
        problemas={problemas}
        contexto={contexto}
        onEscolher={escolher}
        exercicio={itens.length > 0 && <ExercicioSemana modulo={modulo.numero} itens={itens} estado={estado} apelido={apelido} contexto={contexto} onMarcar={marcar} />}
      />

      <div className="familia-acoes">
        {concluido ? (
          <p className="label-medium-medium" role="status">
            Módulo {modulo.numero} concluído.
          </p>
        ) : (
          <Button tamanho="medium" larguraTotal carregando={concluindo} onClick={concluir}>
            Concluir o módulo {modulo.numero}
          </Button>
        )}
        <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
          Voltar ao painel
        </Button>
      </div>
    </article>
  );
}
