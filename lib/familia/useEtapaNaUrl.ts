"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Etapa de uma tela de várias etapas na URL (?tela=...), pra cada etapa ter endereço próprio e o
// voltar (setinha da tela, seta do header e voltar do navegador) levar à etapa anterior.
// - irPara: etapa nova, empilhada no histórico.
// - trocar: troca a etapa atual sem empilhar (etapa inicial depois de carregar, erro que devolve pra
//   mesma etapa).
// - concluir: desfaz as etapas empilhadas e põe esta no lugar da primeira (confirmação de algo já
//   salvo, Pix gerado): voltar sai da tela em vez de reabrir um formulário já enviado.
// - voltar: volta uma etapa pelo histórico. podeVoltar diz se existe etapa anterior empilhada; sem
//   ela, a tela usa o destino de sempre (módulo, painel).
// Recarregar no meio perde as respostas das etapas anteriores: a tela recomeça da etapa inicial, e
// entradas do histórico de antes do recarregamento voltam pra ela.
// O objeto vai no history.state sem o __NA do Next: o pushState do Next copia o estado interno
// dele e atualiza usePathname e useSearchParams só quando o objeto não traz o __NA.

const CHAVE = "familiaEtapa";

type Marca<E> = { de: string; etapa: E; profundidade: number };

function marcaAtual<E>(): Marca<E> | undefined {
  return (window.history.state as Record<string, unknown> | null)?.[CHAVE] as Marca<E> | undefined;
}

// Pra seta do header: a entrada atual do histórico é uma etapa empilhada por uma tela de várias etapas.
export function temEtapaAnterior() {
  return (marcaAtual()?.profundidade ?? 0) > 0;
}

export function useEtapaNaUrl<E>(inicial: E, codificar: (etapa: E) => string | null) {
  const [etapa, setEtapa] = useState<E>(inicial);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const id = useRef("");
  const rota = useRef("");
  const base = useRef<E>(inicial);
  // Etapa que entra no lugar da primeira quando o history.go de concluir terminar.
  const concluindo = useRef<{ etapa: E } | null>(null);
  const codificarRef = useRef(codificar);

  useEffect(() => {
    codificarRef.current = codificar;
  });

  const gravar = useCallback((nova: E, profundidade: number, empilhar: boolean) => {
    const url = new URL(window.location.href);
    const codigo = codificarRef.current(nova);
    if (codigo) url.searchParams.set("tela", codigo);
    else url.searchParams.delete("tela");
    const estado = { [CHAVE]: { de: id.current, etapa: nova, profundidade } satisfies Marca<E> };
    const endereco = url.pathname + url.search + url.hash;
    if (empilhar) window.history.pushState(estado, "", endereco);
    else window.history.replaceState(estado, "", endereco);
    if (profundidade === 0) base.current = nova;
    setEtapa(nova);
    setPodeVoltar(profundidade > 0);
  }, []);

  useEffect(() => {
    id.current = Math.random().toString(36).slice(2);
    rota.current = window.location.pathname;
    gravar(base.current, 0, false);

    function aoNavegar() {
      // Voltar pra outra página: quem cuida é o Next.
      if (window.location.pathname !== rota.current) return;
      const marca = marcaAtual<E>();
      if (concluindo.current) {
        const { etapa: final } = concluindo.current;
        concluindo.current = null;
        gravar(final, 0, false);
        window.scrollTo({ top: 0 });
        return;
      }
      if (marca?.de === id.current) {
        setEtapa(marca.etapa);
        setPodeVoltar(marca.profundidade > 0);
        return;
      }
      gravar(base.current, 0, false);
    }
    window.addEventListener("popstate", aoNavegar);
    return () => window.removeEventListener("popstate", aoNavegar);
  }, [gravar]);

  const irPara = useCallback(
    (nova: E) => {
      gravar(nova, (marcaAtual<E>()?.profundidade ?? 0) + 1, true);
      window.scrollTo({ top: 0 });
    },
    [gravar],
  );

  const trocar = useCallback((nova: E) => gravar(nova, marcaAtual<E>()?.profundidade ?? 0, false), [gravar]);

  const concluir = useCallback(
    (nova: E) => {
      const profundidade = marcaAtual<E>()?.profundidade ?? 0;
      if (profundidade === 0) {
        gravar(nova, 0, false);
        window.scrollTo({ top: 0 });
        return;
      }
      concluindo.current = { etapa: nova };
      window.history.go(-profundidade);
    },
    [gravar],
  );

  const voltar = useCallback(() => window.history.back(), []);

  return { etapa, irPara, trocar, concluir, voltar, podeVoltar };
}
