"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { temEtapaAnterior } from "@/lib/familia/useEtapaNaUrl";
import { SairRapido } from "./SairRapido";

// Pra onde a seta do header leva quando a tela não tem setinha própria. Pela rota, nunca
// router.back(): quem chegou por link direto sairia do site. Na LP e no painel não tem seta.
// Setinha da tela sozinha (.familia-voltar sem barra de progresso ao lado) fica escondida pelo CSS
// (familia.css) e a seta do header clica nela, pra manter o destino de cada tela. Setinha junto da
// barra fica, e o CSS esconde a do header, pra não aparecerem duas.
function destinoDoVoltar(rota: string): string | null {
  if (rota === "/familia" || rota === "/familia/programa") return null;
  if (rota.startsWith("/familia/programa/")) return "/familia/programa";
  if (rota.startsWith("/familia/")) return "/familia";
  return null;
}

// Cabeçalho de todas as telas do programa para familiares: o header padrão da Margem, sem os links de
// Psicólogos e Psiquiatras, com o "Sair rápido" no lugar deles, ao lado do menu.
// A conversa do treino (SimuladorCliente) marca a página com html.familia-treino-aberto enquanto está
// na tela. Lido daqui porque o cabeçalho fica no layout, fora da tela do treino.
function assinarClasseDaPagina(avisar: () => void) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observador.disconnect();
}
const naConversaDoTreino = () => document.documentElement.classList.contains("familia-treino-aberto");

export function CabecalhoFamilia() {
  const rota = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const destino = destinoDoVoltar(rota);
  // Na conversa do treino, o header é o da home com o campo aberto: logo e X, com o "Sair rápido"
  // ao lado do X (pedido de 12/11/2026). O X faz o que a seta faria.
  const conversa = useSyncExternalStore(assinarClasseDaPagina, naConversaDoTreino, () => false);

  const voltar = destino
    ? () => {
        // Etapa empilhada por uma tela de várias etapas (lib/familia/useEtapaNaUrl.ts): volta uma etapa.
        if (temEtapaAnterior()) return window.history.back();
        // O Next guarda montadas, com display: none, as páginas visitadas antes: a setinha de uma
        // delas não vale. A da tela atual pode estar escondida pelo CSS, por isso o teste é o estilo inline.
        const daTela = [...document.querySelectorAll<HTMLButtonElement>(".familia-conteudo .familia-voltar")].find(
          (setinha) => !setinha.closest('[style*="display: none"]'),
        );
        if (daTela) daTela.click();
        else router.push(destino);
      }
    : undefined;

  return (
    <div className="familia-cabecalho">
      <Header
        onOpenMenu={() => setMenuAberto(true)}
        hrefDoLogo="/familia"
        mostrarProfissionais={false}
        antesDoMenu={<SairRapido />}
        onVoltar={conversa ? undefined : voltar}
        onFechar={conversa ? voltar : undefined}
      />
      <SideMenu open={menuAberto} onClose={() => setMenuAberto(false)} rota={rota} />
    </div>
  );
}
