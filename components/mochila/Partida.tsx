"use client";

import { createContext, Suspense, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { CENARIOS, ITENS, JEITOS, LINHAS_FIXAS, QTD_JEITOS, TRIBOS, cenarioPorId, spriteCenario, spriteDe, triboPorId, type CenarioId, type Nivel } from "@/lib/mochila/conteudo";
import { eixos as eixosDe } from "@/lib/mochila/eixos";
import { rotulo as rotuloDe } from "@/lib/mochila/rotulo";
import { codificar, type Desafio } from "@/lib/mochila/codigo";
import { bip as tocarBip, pararMusica, tocarMusica } from "@/lib/mochila/som";
import { GlifoVolumeOff, GlifoVolumeUp } from "@/components/icons/glifos";
import { track } from "@/lib/mixpanel";
import type { Fontes } from "@/lib/mochila/card";
import { AvisoMochila } from "./AvisoMochila";
import { TelaCarregando } from "./TelaCarregando";

// A partida inteira vive aqui, no layout, e cada tela é uma rota. As escolhas ficam na memória e, só
// pra o recarregar não perder a mochila, no sessionStorage da aba (some ao fechar). No desafio, a
// mochila da outra pessoa vem no próprio link. Só a preferência de som fica guardada de vez: o som
// começa ligado, e quem desliga não ouve mais nem o bip dos toques nem a música da tribo.
// Cada passo do jogo vai pro Mixpanel com os eventos `mochila_*`, itens incluídos (decidido em
// 30/10/2026), sem depender do painel de dados, que o jogo não tem.

export type Etapa = "inicio" | "escolha" | "tribo" | "montagem" | "revelacao" | "combinados" | "jeitos" | "resultado" | "compartilhar" | "desafiar";

export const ROTAS: Record<Etapa, string> = {
  inicio: "/mochila",
  escolha: "/mochila/cenarios",
  tribo: "/mochila/tribo",
  montagem: "/mochila/montar",
  revelacao: "/mochila/revelacao",
  combinados: "/mochila/combinados",
  jeitos: "/mochila/jeitos",
  resultado: "/mochila/resultado",
  compartilhar: "/mochila/compartilhar",
  desafiar: "/mochila/desafiar",
};

const CHAVE_SOM = "mochila-som";
// Frequência do bip de um toque qualquer.
const TOQUE = 520;
const CHAVE_PARTIDA = "mochila-partida";

type Guardado = {
  cenarioId: CenarioId;
  escolhido: boolean;
  itens: string[];
  combinados: number[];
  semCombinados: boolean;
  tribo: string | null;
  jeitos: string[];
  nivel: Nivel;
  desafio: Desafio | null;
};

function lerGuardado(): Partial<Guardado> | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE_PARTIDA);
    if (!bruto) return null;
    const g = JSON.parse(bruto) as Guardado;
    const cenario = cenarioPorId(g.cenarioId);
    if (!cenario || !Array.isArray(g.itens) || !g.itens.every((id) => id in ITENS)) return null;
    return {
      cenarioId: g.cenarioId,
      escolhido: g.escolhido === true,
      itens: g.itens,
      combinados: Array.isArray(g.combinados) ? g.combinados.filter((i) => Number.isInteger(i) && i >= 0 && i < cenario.combinados.length) : [],
      semCombinados: g.semCombinados === true,
      tribo: triboPorId(g.tribo) ? g.tribo : null,
      jeitos: Array.isArray(g.jeitos) ? g.jeitos.filter((id) => JEITOS.some((j) => j.id === id)).slice(0, QTD_JEITOS) : [],
      nivel: g.nivel === 1 || g.nivel === 2 ? g.nivel : 0,
      desafio: g.desafio && cenarioPorId(g.desafio.cenario) ? g.desafio : null,
    };
  } catch {
    return null;
  }
}

function useEstado() {
  const router = useRouter();
  const raiz = useRef<HTMLDivElement>(null);
  const [pronto, setPronto] = useState(false);
  const [cenarioId, setCenarioId] = useState<CenarioId>("festa");
  const [escolhido, setEscolhido] = useState(false);
  const [itens, setItens] = useState<string[]>([]);
  const [combinados, setCombinados] = useState<number[]>([]);
  const [semCombinados, setSemCombinados] = useState(false);
  const [tribo, setTribo] = useState<string | null>(null);
  const [jeitos, setJeitos] = useState<string[]>([]);
  const [nivel, setNivel] = useState<Nivel>(0);
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [som, setSom] = useState(true);
  // O bip e a música leem daqui: o toque que desliga o som não pode tocar com o valor velho.
  const somRef = useRef(true);
  // Mesmo motivo: o toque que escolhe a tribo sobe até o `aoTocar`, que não pode religar a música da anterior.
  const triboRef = useRef<string | null>(null);
  const ultimoBip = useRef(0);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    const g = lerGuardado();
    if (g) {
      if (g.cenarioId) setCenarioId(g.cenarioId);
      setEscolhido(g.escolhido ?? false);
      setItens(g.itens ?? []);
      setCombinados(g.combinados ?? []);
      setSemCombinados(g.semCombinados ?? false);
      setTribo(g.tribo ?? null);
      triboRef.current = g.tribo ?? null;
      setJeitos(g.jeitos ?? []);
      setNivel(g.nivel ?? 0);
      setDesafio(g.desafio ?? null);
    }
    try {
      const ligado = localStorage.getItem(CHAVE_SOM) !== "0";
      somRef.current = ligado;
      setSom(ligado);
    } catch {}
    setPronto(true);
  }, []);

  // Música só com tribo escolhida. Sai da Mochila ou a aba vai pro fundo, ela para; volta no próximo toque.
  useEffect(() => {
    if (!tribo) pararMusica();
  }, [tribo]);
  useEffect(() => {
    const aoEsconder = () => {
      if (document.hidden) pararMusica();
    };
    document.addEventListener("visibilitychange", aoEsconder);
    return () => {
      document.removeEventListener("visibilitychange", aoEsconder);
      pararMusica();
    };
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      const g: Guardado = { cenarioId, escolhido, itens, combinados, semCombinados, tribo, jeitos, nivel, desafio };
      sessionStorage.setItem(CHAVE_PARTIDA, JSON.stringify(g));
    } catch {}
  }, [pronto, cenarioId, escolhido, itens, combinados, semCombinados, tribo, jeitos, nivel, desafio]);

  // Os botões navegam com router.push, que não faz prefetch sozinho: sem isto, cada toque esperava a
  // próxima tela chegar da rede. São todas estáticas e pequenas.
  useEffect(() => {
    Object.values(ROTAS).forEach((r) => router.prefetch(r));
    router.prefetch("/inicio");
  }, [router]);

  // Sprites de todas as telas baixam antes de a pessoa chegar nelas, pra nenhuma abrir com a imagem
  // chegando aos poucos. Cenários e tribos são as duas telas logo depois do início, então vão já; o
  // resto espera a primeira tela assentar.
  useEffect(() => {
    if (!pronto) return;
    const baixar = (srcs: string[]) =>
      srcs.forEach((src) => {
        new Image().src = src;
      });
    baixar(["mochila-aberta", "mochila-fechada", ...TRIBOS.map((t) => `tribo-${t.id}`)].map(spriteDe).concat(CENARIOS.map((c) => spriteCenario(c.id))));
    const resto = () => baixar([...Object.keys(ITENS), ...JEITOS.map((j) => `jeito-${j.id}`)].map(spriteDe));
    // Safari não tem requestIdleCallback.
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(resto);
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(resto, 500);
    return () => clearTimeout(id);
  }, [pronto]);

  // Rota pra onde a partida está indo: enquanto a tela nova não chega, o skeleton toma o lugar da
  // atual no mesmo toque. O HeaderMochila limpa quando o endereço muda.
  const [indo, setIndo] = useState<string | null>(null);
  const navegar = useCallback((rota: string, como: "push" | "replace" | "back" = "push") => {
    if (como !== "back" && rota === window.location.pathname) return;
    setIndo(rota);
    if (como === "push") router.push(rota);
    else if (como === "replace") router.replace(rota);
    else router.back();
  }, [router]);
  const chegou = useCallback(() => setIndo(null), []);

  const fecharAviso = useCallback(() => setAviso(null), []);

  // O aviso é da tela em que apareceu.
  const ir = useCallback(
    (proxima: Etapa) => {
      setAviso(null);
      navegar(ROTAS[proxima]);
    },
    [navegar],
  );

  const fontes = useCallback((): Fontes => {
    const estilo = getComputedStyle(raiz.current ?? document.body);
    return {
      pixel: estilo.getPropertyValue("--font-pixelify").trim() || "sans-serif",
      texto: estilo.getPropertyValue("--font-inter").trim() || "sans-serif",
    };
  }, []);

  const bip = useCallback((freq: number) => {
    if (!somRef.current) return;
    ultimoBip.current = performance.now();
    tocarBip(freq);
  }, []);

  const alternarSom = () => {
    const novo = !somRef.current;
    somRef.current = novo;
    setSom(novo);
    try {
      localStorage.setItem(CHAVE_SOM, novo ? "1" : "0");
    } catch {}
    if (novo) {
      bip(880);
      if (triboRef.current) tocarMusica(triboRef.current);
    } else pararMusica();
    track("mochila_som_alternado", { ligado: novo });
  };

  // A música começa dentro do toque na tribo: fora dele o iPhone não deixa tocar.
  const escolherTribo = (id: string) => {
    setTribo(id);
    triboRef.current = id;
    if (somRef.current) tocarMusica(id);
  };

  // Todo toque em botão ou link do jogo faz bip. Quem já tocou um bip próprio no mesmo toque (colocar,
  // tirar, não coube) fica só com ele. O toque também retoma a música que parou com a aba no fundo.
  const aoTocar = (evento: React.MouseEvent) => {
    if (!somRef.current) return;
    if (!(evento.target as HTMLElement).closest("button, a, label, [role='button']")) return;
    if (performance.now() - ultimoBip.current > 50) bip(TOQUE);
    if (triboRef.current) tocarMusica(triboRef.current);
  };

  // Tocar de novo no cenário em que já estava (voltou pra conferir) segue com a mochila como estava.
  const escolherCenario = (id: CenarioId) => {
    track("mochila_cenario_escolhido", { cenario: id, com_desafio: desafio !== null });
    if (!escolhido || id !== cenarioId) {
      setCenarioId(id);
      setEscolhido(true);
      setItens([]);
      setCombinados([]);
      setSemCombinados(false);
      setJeitos([]);
      setTribo(null);
      triboRef.current = null;
    }
    ir("tribo");
  };

  // Voltar da revelação faz o fechar ao contrário: a mochila fechada aparece, abre e aí volta pra
  // montagem. A TelaRevelacao desenha a animação e chama `pararAbertura` quando sai de cena.
  const [abrindo, setAbrindo] = useState<"fechada" | "aberta" | null>(null);
  const timersAbertura = useRef<number[]>([]);
  const pararAbertura = useCallback(() => {
    timersAbertura.current.forEach(clearTimeout);
    timersAbertura.current = [];
    setAbrindo(null);
  }, []);

  function abrirMochila(depois: () => void) {
    if (abrindo) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      depois();
      return;
    }
    setAbrindo("fechada");
    timersAbertura.current.push(
      window.setTimeout(() => {
        setAbrindo("aberta");
        bip(440);
      }, 550),
      window.setTimeout(depois, 1100),
    );
  }

  // Rotas do jogo por onde a aba passou, mantidas pelo HeaderMochila. Se a tela de trás no histórico é
  // a etapa anterior, voltar é o voltar do navegador; senão (link direto, recarregou) troca a tela
  // atual pela anterior. Assim a seta do header e o gesto do celular levam pro mesmo lugar.
  const historico = useRef<string[]>([]);
  const registrarRota = useCallback((rota: string) => {
    const h = historico.current;
    if (h.at(-2) === rota) h.pop();
    else if (h.at(-1) !== rota) h.push(rota);
  }, []);

  function voltar(medir = true) {
    const atual = window.location.pathname;
    const etapa = (Object.keys(ROTAS) as Etapa[]).find((e) => ROTAS[e] === atual);
    const anterior = etapa && ETAPA_ANTERIOR[etapa];
    if (medir) track("mochila_voltou", { de: etapa ?? atual, para: anterior ?? "inicio_margem" });
    setAviso(null);
    const seguir = () => {
      if (!anterior) {
        navegar("/inicio");
        return;
      }
      const h = historico.current;
      if (h.at(-2) === ROTAS[anterior]) {
        navegar(ROTAS[anterior], "back");
        return;
      }
      h.pop();
      navegar(ROTAS[anterior], "replace");
    };
    if (etapa === "revelacao") abrirMochila(seguir);
    else seguir();
  }

  const recomecar = () => {
    track("mochila_recomecada", { cenario: cenarioId });
    setEscolhido(false);
    setItens([]);
    setCombinados([]);
    setSemCombinados(false);
    setJeitos([]);
    setNivel(0);
    ir("escolha");
  };

  const cenario = cenarioPorId(cenarioId)!;
  // Memo: a prévia do card redesenha quando eixos ou rótulo mudam de referência.
  const eixos = useMemo(() => eixosDe(cenarioId, itens, combinados, semCombinados, jeitos), [cenarioId, itens, combinados, semCombinados, jeitos]);
  const rotulo = useMemo(() => rotuloDe(cenarioId, itens, combinados, eixos), [cenarioId, itens, combinados, eixos]);
  const visiveis = itens.filter((id) => ITENS[id].nivel <= nivel);
  const escondidos = itens.length - visiveis.length;
  const linhasChecklist = [...combinados.map((i) => cenario.combinados[i]), ...LINHAS_FIXAS];
  const codigoDesafio = codificar({ cenario: cenarioId, itens: visiveis, combinados });

  return {
    raiz,
    pronto,
    cenarioId,
    cenario,
    escolhido,
    itens,
    setItens,
    combinados,
    setCombinados,
    semCombinados,
    setSemCombinados,
    tribo,
    escolherTribo,
    jeitos,
    setJeitos,
    nivel,
    setNivel,
    desafio,
    setDesafio,
    som,
    alternarSom,
    bip,
    aoTocar,
    aviso,
    setAviso,
    fecharAviso,
    ir,
    fontes,
    escolherCenario,
    recomecar,
    abrindo,
    pararAbertura,
    registrarRota,
    voltar,
    indo,
    chegou,
    eixos,
    rotulo,
    visiveis,
    escondidos,
    linhasChecklist,
    codigoDesafio,
  };
}

type Partida = ReturnType<typeof useEstado>;

const Contexto = createContext<Partida | null>(null);

// Seta do header: uma etapa pra trás. Compartilhar e desafiar saem do resultado, então voltam pra ele.
const ETAPA_ANTERIOR: Partial<Record<Etapa, Etapa>> = {
  escolha: "inicio",
  tribo: "escolha",
  montagem: "tribo",
  revelacao: "montagem",
  combinados: "revelacao",
  jeitos: "combinados",
  resultado: "jeitos",
  compartilhar: "resultado",
  desafiar: "resultado",
};

// Header de largura total, fora do frame do jogo. Na tela de início a seta sai do jogo. Fica dentro
// de Suspense por causa do usePathname, que também alimenta o histórico do voltar.
function HeaderMochila() {
  const { voltar, registrarRota, chegou, som, alternarSom } = usePartida();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  useEffect(() => registrarRota(pathname), [pathname, registrarRota]);
  // Antes da pintura: a tela nova aparece direto, sem um quadro de skeleton por cima dela.
  useLayoutEffect(chegou, [pathname, chegou]);
  // Na tela de início (normal ou do desafio) o botão de som fica no corpo da tela; nas outras, aqui.
  const inicio = pathname === ROTAS.inicio || pathname.startsWith("/mochila/d/");

  return (
    <>
      <Header
        onOpenMenu={() => setMenuAberto(true)}
        onVoltar={() => voltar()}
        mostrarProfissionais={false}
        antesDoMenu={
          inicio ? undefined : (
            <button type="button" className="menu-button" aria-label={som ? "Desligar som" : "Ligar som"} aria-pressed={som} onClick={alternarSom}>
              {som ? <GlifoVolumeUp size={24} /> : <GlifoVolumeOff size={24} />}
            </button>
          )
        }
      />
      <SideMenu open={menuAberto} onClose={() => setMenuAberto(false)} rota="/mochila" />
    </>
  );
}

export function PartidaProvider({ children }: { children: React.ReactNode }) {
  const partida = useEstado();
  return (
    <Contexto.Provider value={partida}>
      <div className="mochila" ref={partida.raiz} onClick={partida.aoTocar}>
        <Suspense fallback={null}>
          <HeaderMochila />
        </Suspense>
        <main className="mochila-tela">
          {/* A tela atual fica montada e só some de vista, pra voltar a ela como estava. */}
          {partida.indo && <TelaCarregando />}
          <div className="mochila-conteudo" hidden={partida.indo !== null}>
            {children}
          </div>
        </main>
        <AvisoMochila texto={partida.aviso} aoFechar={partida.fecharAviso} />
      </div>
    </Contexto.Provider>
  );
}

export function usePartida(): Partida {
  const p = useContext(Contexto);
  if (!p) throw new Error("usePartida fora do PartidaProvider");
  return p;
}

// Tela aberta sem a partida que ela precisa (link direto, outra aba): volta pro início. Só decide
// depois de ler o sessionStorage, senão o recarregar sempre cairia aqui. Devolve se a tela pode aparecer.
export function useLiberada(liberada: (p: Partida) => boolean): boolean {
  const p = usePartida();
  const router = useRouter();
  const ok = p.pronto && liberada(p);
  // Navegação em curso (ex: "Montar outra mochila" zera a partida e já vai pra outra tela): a tela que
  // está saindo não manda de volta pro início.
  const perdida = p.pronto && !ok && p.indo === null;
  useEffect(() => {
    if (perdida) router.replace(ROTAS.inicio);
  }, [perdida, router]);
  return ok;
}
