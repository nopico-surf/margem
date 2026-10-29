"use client";

import { createContext, Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { ITENS, LINHAS_FIXAS, cenarioPorId, type CenarioId, type Nivel } from "@/lib/mochila/conteudo";
import { rotulo as rotuloDe } from "@/lib/mochila/rotulo";
import { codificar, type Desafio } from "@/lib/mochila/codigo";
import { bip as tocarBip } from "@/lib/mochila/acoes";
import type { Fontes } from "@/lib/mochila/card";
import { AvisoMochila } from "./AvisoMochila";

// A partida inteira vive aqui, no layout, e cada tela é uma rota. Nada sai do navegador: as escolhas
// ficam na memória e, só pra o recarregar não perder a mochila, no sessionStorage da aba (some ao
// fechar). No desafio, a mochila da outra pessoa vem no próprio link. Só a preferência de som fica
// guardada de vez.

export type Etapa = "inicio" | "escolha" | "montagem" | "revelacao" | "combinados" | "resultado" | "compartilhar" | "desafiar";

export const ROTAS: Record<Etapa, string> = {
  inicio: "/mochila",
  escolha: "/mochila/cenarios",
  montagem: "/mochila/montar",
  revelacao: "/mochila/revelacao",
  combinados: "/mochila/combinados",
  resultado: "/mochila/resultado",
  compartilhar: "/mochila/compartilhar",
  desafiar: "/mochila/desafiar",
};

const CHAVE_SOM = "mochila-som";
const CHAVE_PARTIDA = "mochila-partida";

type Guardado = {
  cenarioId: CenarioId;
  escolhido: boolean;
  itens: string[];
  combinados: number[];
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
  const [nivel, setNivel] = useState<Nivel>(0);
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [som, setSom] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    const g = lerGuardado();
    if (g) {
      if (g.cenarioId) setCenarioId(g.cenarioId);
      setEscolhido(g.escolhido ?? false);
      setItens(g.itens ?? []);
      setCombinados(g.combinados ?? []);
      setNivel(g.nivel ?? 0);
      setDesafio(g.desafio ?? null);
    }
    try {
      setSom(localStorage.getItem(CHAVE_SOM) === "1");
    } catch {}
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      const g: Guardado = { cenarioId, escolhido, itens, combinados, nivel, desafio };
      sessionStorage.setItem(CHAVE_PARTIDA, JSON.stringify(g));
    } catch {}
  }, [pronto, cenarioId, escolhido, itens, combinados, nivel, desafio]);

  const fecharAviso = useCallback(() => setAviso(null), []);

  // O aviso é da tela em que apareceu.
  const ir = useCallback(
    (proxima: Etapa) => {
      setAviso(null);
      router.push(ROTAS[proxima]);
    },
    [router],
  );

  const fontes = useCallback((): Fontes => {
    const estilo = getComputedStyle(raiz.current ?? document.body);
    return {
      pixel: estilo.getPropertyValue("--font-pixelify").trim() || "sans-serif",
      texto: estilo.getPropertyValue("--font-inter").trim() || "sans-serif",
    };
  }, []);

  const alternarSom = () => {
    const novo = !som;
    setSom(novo);
    try {
      localStorage.setItem(CHAVE_SOM, novo ? "1" : "0");
    } catch {}
    tocarBip(novo, 880);
  };

  const escolherCenario = (id: CenarioId) => {
    setCenarioId(id);
    setEscolhido(true);
    setItens([]);
    setCombinados([]);
    ir("montagem");
  };

  const recomecar = () => {
    setItens([]);
    setCombinados([]);
    setNivel(0);
    ir("escolha");
  };

  const cenario = cenarioPorId(cenarioId)!;
  const rotulo = rotuloDe(cenarioId, itens, combinados);
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
    nivel,
    setNivel,
    desafio,
    setDesafio,
    som,
    alternarSom,
    bip: (freq: number) => tocarBip(som, freq),
    aviso,
    setAviso,
    fecharAviso,
    ir,
    fontes,
    escolherCenario,
    recomecar,
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
  montagem: "escolha",
  revelacao: "montagem",
  combinados: "revelacao",
  resultado: "combinados",
  compartilhar: "resultado",
  desafiar: "resultado",
};

// Header de largura total, fora do frame do jogo. Na tela de início a seta sai do jogo.
function HeaderMochila() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  function voltar() {
    const etapa = (Object.keys(ROTAS) as Etapa[]).find((e) => ROTAS[e] === pathname);
    const anterior = etapa && ETAPA_ANTERIOR[etapa];
    router.push(anterior ? ROTAS[anterior] : "/inicio");
  }

  return (
    <>
      <Header onOpenMenu={() => setMenuAberto(true)} onVoltar={voltar} mostrarProfissionais={false} />
      <SideMenu open={menuAberto} onClose={() => setMenuAberto(false)} rota="/mochila" />
    </>
  );
}

export function PartidaProvider({ children }: { children: React.ReactNode }) {
  const partida = useEstado();
  return (
    <Contexto.Provider value={partida}>
      <div className="mochila" ref={partida.raiz}>
        <Suspense fallback={null}>
          <HeaderMochila />
        </Suspense>
        <main className="mochila-tela">
          {children}
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
  const perdida = p.pronto && !ok;
  useEffect(() => {
    if (perdida) router.replace(ROTAS.inicio);
  }, [perdida, router]);
  return ok;
}
