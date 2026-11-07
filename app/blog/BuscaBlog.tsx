"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { InputText } from "@/components/ui/InputText";
import { Button } from "@/components/ui/Button";
import { IconeBusca, IconeLimparBusca } from "@/components/icons";
import { buscarNoBlog, termosDaBusca, type EntradaIndiceBlog } from "@/lib/busca-blog";
import { HOST_LOCAL } from "@/lib/host-local";
import { semMedicao, track } from "@/lib/mixpanel";
import { useLinhaDoTeclado } from "@/lib/use-linha-do-teclado";

// Busca da lista do blog, com o campo depois de todos os cards (pedido de 07/11/2026). Os cards
// chegam prontos do servidor (app/blog/page.tsx), na ordem de
// lib/guias.ts, e aqui só se escolhe quais aparecem e em que ordem. Sem busca, aparecem todos: é o
// que vai no HTML, pro Google chegar em cada texto.
//
// O termo não vai pra URL (o pixel da Meta leria) nem pro Mixpanel, que recebe só o tamanho e quantos
// textos apareceram. Ele vai, sem nada que identifique a pessoa, pra tabela buscas_blog (rota
// /api/blog/busca), quando a pessoa para de digitar, aperta Enter ou sai da página. Na aba ele fica
// guardado (sessionStorage), pra a busca continuar lá quando a pessoa volta de um texto.
//
// Como o campo fica embaixo, o resultado aparece acima dele. No Enter a página rola até o primeiro
// resultado (ou até o aviso de sem resultado), pra quem busca ver que a lista mudou.
//
// No celular, enquanto a pessoa está no campo, ele fica preso logo acima do teclado, como o campo
// aberto da home (a detecção do teclado é uma cópia da de lá: lib/use-linha-do-teclado.ts). O lugar
// dele na página fica reservado e ele desliza até a linha do teclado e de volta.
//
// Quando a lista muda de tamanho (letra, X, Esc), a página rola pra compensar: o campo fica parado na
// tela, e preso no teclado é o fim da lista que encosta nele. Sem isso, o X trazia os 16 textos de
// volta acima do campo e jogava a pessoa no meio da lista, com o campo fora da tela.

const CHAVE_SESSAO = "margem-busca-blog";
const ESPERA_PRA_GRAVAR_MS = 1500;
const ESPERA_PRA_ANUNCIAR_MS = 600;
const ID_CAMPO = "busca-blog";

type CardDaLista = { slug: string; card: ReactNode };

// Os tokens de movimento (tokens.css), lidos na hora: a Web Animations API não aceita var(). Mesma
// leitura do HomeHero: o build reescreve "420ms" como ".42s".
function tokenDeMovimento() {
  const estilo = getComputedStyle(document.documentElement);
  const duracao = estilo.getPropertyValue("--duration-420").trim();
  const numero = parseFloat(duracao) || 0;
  return {
    duration: duracao.endsWith("ms") ? numero : duracao.endsWith("s") ? numero * 1000 : numero,
    easing: estilo.getPropertyValue("--easing-out-expo").trim() || "ease-out",
  };
}

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
  const listaRef = useRef<HTMLDivElement>(null);
  const vaziaRef = useRef<HTMLDivElement>(null);
  const lugarRef = useRef<HTMLDivElement>(null);
  const buscaRef = useRef<HTMLDivElement>(null);
  const [fixo, setFixo] = useState(false);
  // Onde a caixa do campo estava antes de prender ou soltar, pro deslize.
  const caixaAntes = useRef<DOMRect | null>(null);
  // Onde o lugar do campo estava antes da lista mudar, pra a página compensar.
  const lugarAntes = useRef<number | null>(null);

  useLinhaDoTeclado();

  function medirCaixa() {
    return buscaRef.current?.querySelector(".input-text-caixa")?.getBoundingClientRect() ?? null;
  }

  function mudarBusca(valor: string) {
    lugarAntes.current = lugarRef.current?.getBoundingClientRect().top ?? null;
    setBusca(valor);
  }

  function prender() {
    if (fixo || !window.matchMedia("(pointer: coarse)").matches) return;
    caixaAntes.current = medirCaixa();
    // O lugar fica com a altura do campo pra a página de cima não descer.
    if (lugarRef.current && buscaRef.current) lugarRef.current.style.height = `${buscaRef.current.offsetHeight}px`;
    setFixo(true);
  }

  function soltar() {
    if (!fixo) return;
    caixaAntes.current = medirCaixa();
    setFixo(false);
  }

  // O deslize: o campo vai do lugar onde estava até o novo (FLIP), com o movimento do campo da home.
  useLayoutEffect(() => {
    const antes = caixaAntes.current;
    caixaAntes.current = null;
    if (!fixo && lugarRef.current) lugarRef.current.style.height = "";
    const busca = buscaRef.current;
    const depois = medirCaixa();
    if (!busca || !antes || !depois) return;
    busca.getAnimations().forEach((animacao) => animacao.cancel());
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busca.animate(
      [{ transform: `translate(${antes.left - depois.left}px, ${antes.top - depois.top}px)` }, { transform: "none" }],
      tokenDeMovimento(),
    );
  }, [fixo]);

  // A lista mudou de tamanho: a página rola pra o campo ficar onde estava. Preso no teclado, o lugar
  // dele (o fim da lista) vai pra junto do campo.
  useLayoutEffect(() => {
    const antes = lugarAntes.current;
    lugarAntes.current = null;
    const lugar = lugarRef.current;
    if (antes === null || !lugar) return;
    const alvo = fixo && buscaRef.current ? buscaRef.current.getBoundingClientRect().top : antes;
    window.scrollBy(0, lugar.getBoundingClientRect().top - alvo);
  }, [lista]);

  function rolarAteOResultado() {
    const alvo = listaRef.current?.firstElementChild ?? vaziaRef.current;
    if (!alvo) return;
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    alvo.scrollIntoView({ block: "start", behavior: semMovimento ? "auto" : "smooth" });
  }

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
      // Fecha o teclado do celular, grava na hora e mostra o resultado.
      evento.currentTarget.blur();
      gravarPendente();
      if (encontrados) rolarAteOResultado();
    }
    if (evento.key === "Escape") {
      evento.preventDefault();
      if (busca) mudarBusca("");
      evento.currentTarget.blur();
    }
  }

  function limpar() {
    mudarBusca("");
    document.getElementById(ID_CAMPO)?.focus();
  }

  return (
    <>
      {lista.length > 0 ? (
        <div className="blog-lista" ref={listaRef}>
          {lista.map((item) => (
            <Fragment key={item.slug}>{item.card}</Fragment>
          ))}
        </div>
      ) : (
        <div className="blog-busca-vazia" ref={vaziaRef}>
          <p className="text-medium-regular">Ainda não tem texto sobre isso. Faça outra busca ou vá para o início.</p>
          <Button variante="secondary" href="/inicio">
            Ir para o início
          </Button>
        </div>
      )}
      <div className="blog-busca-lugar" ref={lugarRef}>
        <div
          role="search"
          className="blog-busca"
          ref={buscaRef}
          data-fixo={fixo ? "true" : "false"}
          onFocus={(evento) => {
            if (evento.target instanceof HTMLInputElement) prender();
          }}
          onBlur={(evento) => {
            if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) soltar();
          }}
        >
          <InputText
            id={ID_CAMPO}
            rotulo="Buscar no blog"
            value={busca}
            onChange={mudarBusca}
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
                // Sem o preventDefault, tocar no X tira o foco do campo, ele solta do teclado no meio do
                // toque e o clique cai fora do botão (mesma regra do MessageInput da home).
                <button
                  type="button"
                  className="blog-busca-limpar"
                  onMouseDown={(evento) => evento.preventDefault()}
                  onClick={limpar}
                  aria-label="Limpar busca"
                >
                  <IconeLimparBusca />
                </button>
              ) : undefined
            }
          />
          <p className="blog-busca-anuncio" aria-live="polite">
            {anunciado}
          </p>
        </div>
      </div>
    </>
  );
}
