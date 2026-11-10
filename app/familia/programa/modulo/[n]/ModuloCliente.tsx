"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { CHAVE_POSICAO_AUDIO } from "@/lib/familia/config";
import type { Modulo } from "@/lib/familia/conteudo";
import { aplicarApelido, ROTULO_PROBLEMA, type Problema } from "@/lib/familia/diagnostico";
import type { BlocoMarkdown, Trecho } from "@/lib/familia/markdown";
import { CardHeader } from "@/components/conversa/CardHeader";
import { track } from "@/lib/mixpanel";

type Diagnostico = { apelido: string; problemas: Problema[]; resultado: { safetyMode: boolean } };

function Trechos({ trechos, apelido }: { trechos: Trecho[]; apelido: string }) {
  return (
    <>
      {trechos.map((trecho, indice) =>
        trecho.negrito ? <strong key={indice}>{aplicarApelido(trecho.texto, apelido)}</strong> : <Fragment key={indice}>{aplicarApelido(trecho.texto, apelido)}</Fragment>,
      )}
    </>
  );
}

function Blocos({ blocos, apelido, problemas }: { blocos: BlocoMarkdown[]; apelido: string; problemas: Problema[] }) {
  return (
    <>
      {blocos.map((bloco, indice) => {
        if (bloco.tipo === "titulo") return <h2 key={indice} className="header-small">{aplicarApelido(bloco.texto, apelido)}</h2>;
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
        // Variação: só pra quem marcou aquele problema na Q3.
        if (!problemas.includes(bloco.problema as Problema)) return null;
        return (
          <div key={indice} className="familia-variacao">
            <span className="label-small-medium">{ROTULO_PROBLEMA[bloco.problema as Problema] ?? bloco.problema}</span>
            <Blocos blocos={bloco.blocos} apelido={apelido} problemas={problemas} />
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

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      setDiagnostico((await resposta.json()) as Diagnostico);
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
  const safetyMode = diagnostico.resultado.safetyMode;

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

      <Blocos blocos={modulo.blocos} apelido={apelido} problemas={problemas} />

      <div className="familia-acoes">
        {modulo.cenarioSimulador && !safetyMode && (
          <Button variante="secondary" tamanho="medium" larguraTotal href={`/familia/programa/simulador/${modulo.cenarioSimulador}`}>
            Ensaiar a conversa no simulador
          </Button>
        )}
        {concluido ? (
          <p className="label-medium-medium" role="status">
            Módulo {modulo.numero} concluído.
          </p>
        ) : (
          <Button tamanho="medium" larguraTotal carregando={concluindo} onClick={concluir}>
            Concluir o módulo {modulo.numero}
          </Button>
        )}
      </div>
    </article>
  );
}
