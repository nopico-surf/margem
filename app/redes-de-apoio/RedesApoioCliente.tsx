"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { CardRecurso } from "@/components/conversa/CardRecurso";
import { BannerSugestaoRede } from "@/components/conversa/BannerSugestaoRede";
import { FiltroEspecialidade } from "@/components/conversa/FiltroEspecialidade";
import type { CardResource } from "@/components/conversa/types";
import { OPCOES_REDE, tipoDeRedeDaUrl, type TipoRede } from "@/lib/redes-apoio";
import { track } from "@/lib/mixpanel";

type RedesApoioClienteProps = {
  publicas: CardResource[];
  independentes: CardResource[];
};

const ROTA = "/redes-de-apoio";

// Figma: Experiência do produto, frame "Profissionais" (1478:12507), mobile. O desktop é o da
// /conversa: o ContainerConteudo e o CardRecurso já carregam as regras dele.
export function RedesApoioCliente({ publicas, independentes }: RedesApoioClienteProps) {
  const pathname = usePathname();
  // A aba mora só na URL: o replaceState de trocarTipo atualiza o useSearchParams.
  const tipoSelecionado = tipoDeRedeDaUrl(useSearchParams().get("tipo"));
  const [menuOpen, setMenuOpen] = useState(false);

  function abrirMenu() {
    setMenuOpen(true);
    track("menu_clicado", { rota: ROTA });
  }

  function fecharMenu() {
    setMenuOpen(false);
    track("menu_fechado", { rota: ROTA });
  }

  function trocarTipo(tipo: TipoRede) {
    window.history.replaceState(null, "", `${pathname}?tipo=${tipo}`);
  }

  function selecionarTipo(tipo: TipoRede) {
    trocarTipo(tipo);
    track("filtro_rede_apoio_clicado", { filtro: tipo });
  }

  const redes = tipoSelecionado === "publicas" ? publicas : independentes;
  const tipoRecurso = tipoSelecionado === "publicas" ? "servico_publico" : "instituicao";

  return (
    <main className="figma-result-page redes-apoio-pagina">
      <Header
        onOpenMenu={abrirMenu}
        hrefDoLogo="/inicio"
        onLogoClick={() => track("logo_clicado", { rota: ROTA })}
      />
      <SideMenu open={menuOpen} onClose={fecharMenu} rota={ROTA} onSelecionarRede={trocarTipo} />

      <ContainerConteudo id="redes-de-apoio">
        <CardHeader as="h1" title="Redes de apoio" />
        <FiltroEspecialidade opcoes={OPCOES_REDE} selecionada={tipoSelecionado} onChange={selecionarTipo} />
        {redes.length > 0 && (
          <div className="figma-resource-list">
            {redes.map((rede) => (
              <CardRecurso key={rede.id} resource={rede} tipoRecurso={tipoRecurso} origem="redes_apoio" />
            ))}
          </div>
        )}
        <BannerSugestaoRede onClick={() => track("sugestao_rede_apoio_clicada", { tipo: tipoSelecionado })} />
      </ContainerConteudo>

      <Footer />
    </main>
  );
}
