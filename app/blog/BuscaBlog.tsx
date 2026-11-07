"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { InputText } from "@/components/ui/InputText";
import { Button } from "@/components/ui/Button";
import { IconeBusca, IconeLimparBusca } from "@/components/icons";
import { buscarNoBlog, termosDaBusca, type EntradaIndiceBlog } from "@/lib/busca-blog";
import { HOST_LOCAL } from "@/lib/host-local";
import { semMedicao, track } from "@/lib/mixpanel";

// Busca da lista do blog, com o campo depois de todos os cards (pedido de 07/11/2026). Os cards
// chegam prontos do servidor (app/blog/page.tsx), na ordem de
// lib/guias.ts, e aqui só se escolhe quais aparecem e em que ordem. Sem busca, aparecem todos: é o
// que vai no HTML, pro Google chegar em cada texto.
//
// O termo não vai pra URL (o pixel da Meta leria) nem pro Mixpanel, que recebe só o tamanho e quantos
// textos apareceram. Ele vai, sem nada que identifique a pessoa, pra tabela buscas_blog (rota
// /api/blog/busca), quando a pessoa para de digitar, aperta Enter ou sai da página. Na aba ele fica
// guardado (sessionStorage), pra a busca continuar lá quando a pessoa volta de um texto.

const CHAVE_SESSAO = "margem-busca-blog";
const ESPERA_PRA_GRAVAR_MS = 1500;
const ESPERA_PRA_ANUNCIAR_MS = 600;
const ID_CAMPO = "busca-blog";

type CardDaLista = { slug: string; card: ReactNode };

function anuncio(quantidade: number) {
  if (quantidade === 0) return "Nenhum texto encontrado";
  return quantidade === 1 ? "1 texto encontrado" : `${quantidade} textos encontrados`;
}

function gravar(termo: string, resultados: number) {
  track("blog_busca", { tamanho: termo.trim().length, resultados });
  if (HOST_LOCAL.test(window.location.hostname) || semMedicao()) return;
  const corpo = JSON.stringify({ termo, resultados });
  try {
    if (navigator.sendBeacon?.("/api/blog/busca", new Blob([corpo], { type: "application/json" }))) return;
  } catch {}
  fetch("/api/blog/busca", { method: "POST", headers: { "Content-Type": "application/json" }, body: corpo, keepalive: true }).catch(() => {});
}

export function BuscaBlog({ indice, cards }: { indice: EntradaIndiceBlog[]; cards: CardDaLista[] }) {
  const [busca, setBusca] = useState("");
  const [anunciado, setAnunciado] = useState("");

  const encontrados = useMemo(() => buscarNoBlog(indice, busca), [indice, busca]);
  const lista = useMemo(() => {
    if (!encontrados) return cards;
    const porSlug = new Map(cards.map((item) => [item.slug, item]));
    return encontrados.flatMap((slug) => porSlug.get(slug) ?? []);
  }, [cards, encontrados]);

  // A busca de agora e a última gravada, pra gravar uma vez só e na saída da página.
  const pendente = useRef<{ termo: string; resultados: number } | null>(null);
  const ultimaGravada = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function gravarPendente() {
    clearTimeout(timer.current);
    const atual = pendente.current;
    pendente.current = null;
    if (!atual) return;
    const chave = termosDaBusca(atual.termo).join(" ");
    if (!chave || chave === ultimaGravada.current) return;
    ultimaGravada.current = chave;
    gravar(atual.termo, atual.resultados);
  }

  // Volta a busca guardada na aba. Depois da hidratação, pra o HTML do servidor ter a lista inteira.
  useEffect(() => {
    try {
      const guardada = window.sessionStorage.getItem(CHAVE_SESSAO);
      if (guardada) setBusca(guardada);
      // A busca que voltou já foi gravada quando foi feita.
      if (guardada) ultimaGravada.current = termosDaBusca(guardada).join(" ");
    } catch {}
  }, []);

  // Grava o que ficou pendente quando a pessoa sai: clicando num texto (o componente desmonta) ou
  // fechando a aba.
  useEffect(() => {
    window.addEventListener("pagehide", gravarPendente);
    return () => {
      window.removeEventListener("pagehide", gravarPendente);
      gravarPendente();
    };
    // gravarPendente só lê refs.
  }, []);

  useEffect(() => {
    try {
      if (busca) window.sessionStorage.setItem(CHAVE_SESSAO, busca);
      else window.sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {}

    const resultados = encontrados?.length ?? null;
    const espera = setTimeout(() => setAnunciado(resultados === null ? "" : anuncio(resultados)), ESPERA_PRA_ANUNCIAR_MS);

    clearTimeout(timer.current);
    if (resultados === null) {
      pendente.current = null;
    } else {
      pendente.current = { termo: busca, resultados };
      timer.current = setTimeout(gravarPendente, ESPERA_PRA_GRAVAR_MS);
    }
    return () => clearTimeout(espera);
    // gravarPendente só lê refs.
  }, [busca, encontrados]);

  function aoTeclar(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "Enter") {
      evento.preventDefault();
      // Fecha o teclado do celular e grava na hora.
      evento.currentTarget.blur();
      gravarPendente();
    }
    if (evento.key === "Escape" && busca) {
      evento.preventDefault();
      setBusca("");
    }
  }

  function limpar() {
    setBusca("");
    document.getElementById(ID_CAMPO)?.focus();
  }

  return (
    <>
      {lista.length > 0 ? (
        <div className="blog-lista">
          {lista.map((item) => (
            <Fragment key={item.slug}>{item.card}</Fragment>
          ))}
        </div>
      ) : (
        <div className="blog-busca-vazia">
          <p className="text-medium-regular">Ainda não tem texto sobre isso. Faça outra busca ou vá para o início.</p>
          <Button variante="secondary" href="/inicio">
            Ir para o início
          </Button>
        </div>
      )}
      <div role="search" className="blog-busca">
        <InputText
          id={ID_CAMPO}
          rotulo="Buscar no blog"
          value={busca}
          onChange={setBusca}
          onKeyDown={aoTeclar}
          tipo="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={100}
          iconeInicio={<IconeBusca />}
          iconeFim={
            busca ? (
              <button type="button" className="blog-busca-limpar" onClick={limpar} aria-label="Limpar busca">
                <IconeLimparBusca />
              </button>
            ) : undefined
          }
        />
        <p className="blog-busca-anuncio" aria-live="polite">
          {anunciado}
        </p>
      </div>
    </>
  );
}
