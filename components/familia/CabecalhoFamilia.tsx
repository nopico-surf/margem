"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { SairRapido } from "./SairRapido";

// Cabeçalho de todas as telas do programa para familiares: o header padrão da Margem, sem os links de
// Psicólogos e Psiquiatras, com o "Sair rápido" no lugar deles, ao lado do menu.
export function CabecalhoFamilia() {
  const rota = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="familia-cabecalho">
      <Header onOpenMenu={() => setMenuAberto(true)} hrefDoLogo="/familia" mostrarProfissionais={false} antesDoMenu={<SairRapido />} />
      <SideMenu open={menuAberto} onClose={() => setMenuAberto(false)} rota={rota} />
    </div>
  );
}
