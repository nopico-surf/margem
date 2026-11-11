"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
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
export function CabecalhoFamilia() {
  const rota = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const destino = destinoDoVoltar(rota);

  return (
    <div className="familia-cabecalho">
      <Header
        onOpenMenu={() => setMenuAberto(true)}
        hrefDoLogo="/familia"
        mostrarProfissionais={false}
        antesDoMenu={<SairRapido />}
        onVoltar={
          destino
            ? () => {
                const daTela = document.querySelector<HTMLButtonElement>(".familia-conteudo .familia-voltar");
                if (daTela) daTela.click();
                else router.push(destino);
              }
            : undefined
        }
      />
      <SideMenu open={menuAberto} onClose={() => setMenuAberto(false)} rota={rota} />
    </div>
  );
}
