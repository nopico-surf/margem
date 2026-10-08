"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { CardProfissionalSkeleton } from "@/components/conversa/CardProfissionalSkeleton";
import { FiltroEspecialidade, type Especialidade } from "@/components/conversa/FiltroEspecialidade";
import { ValorSessaoPsicologos } from "@/components/ui/ValorSessaoPsicologos";

// Figma: Experiência do produto, frames 1369:50724 (mobile) e 1369:51516 (desktop). É o shell da
// /profissionais: tudo o que não depende do Supabase já aparece, e só os cards ficam em skeleton.

const QUANTIDADE_DE_SKELETONS = 6;

// O preço é só de psicólogo, igual na tela pronta (ProfissionaisCliente).
function Filtro({ especialidade }: { especialidade: Especialidade }) {
  return (
    <>
      <FiltroEspecialidade selecionada={especialidade} onChange={() => {}} />
      {especialidade === "psicologo" && (
        <ValorSessaoPsicologos />
      )}
    </>
  );
}

function FiltroDaUrl() {
  const especialidade = useSearchParams().get("especialidade") === "psiquiatra" ? "psiquiatra" : "psicologo";
  return <Filtro especialidade={especialidade} />;
}

export function ProfissionaisCarregando() {
  return (
    <main className="figma-result-page profissionais-pagina" aria-busy="true">
      <Header onOpenMenu={() => {}} hrefDoLogo="/inicio" />

      <div className="profissionais-cabecalho">
        <CardHeader as="h1" title="Profissionais que podem ajudar" />
        {/* Vindo do menu (navegação no cliente), a URL já é conhecida e o filtro nasce certo, com
            Psiquiatras marcado e sem preço. Só no HTML estático, que não conhece a query, vale o
            fallback em Psicologos até a resposta chegar. */}
        <Suspense fallback={<Filtro especialidade="psicologo" />}>
          <FiltroDaUrl />
        </Suspense>
      </div>

      <div className="profissionais-grid">
        {Array.from({ length: QUANTIDADE_DE_SKELETONS }, (_, i) => (
          <CardProfissionalSkeleton key={i} />
        ))}
      </div>

      <Footer />
    </main>
  );
}
