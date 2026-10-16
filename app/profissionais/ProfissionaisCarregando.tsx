"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { CardProfissionalSkeleton } from "@/components/conversa/CardProfissionalSkeleton";
import { FiltroEspecialidade, OPCOES_ESPECIALIDADE, especialidadeDaUrl, type Especialidade } from "@/components/conversa/FiltroEspecialidade";
import { ValorSessaoPsicologos } from "@/components/ui/ValorSessaoPsicologos";

// Figma: Experiência do produto, frames 1369:50724 (mobile) e 1369:51516 (desktop). É o shell da
// /profissionais: tudo o que não depende do Supabase já aparece, e só os cards ficam em skeleton.

const QUANTIDADE_DE_SKELETONS = 6;

// A faixa de preço segue a especialidade, igual na tela pronta (ProfissionaisCliente).
function Filtro({ especialidade }: { especialidade: Especialidade }) {
  return (
    <>
      <FiltroEspecialidade opcoes={OPCOES_ESPECIALIDADE} selecionada={especialidade} onChange={() => {}} />
      <ValorSessaoPsicologos especialidade={especialidade} />
    </>
  );
}

function FiltroDaUrl() {
  const especialidade = especialidadeDaUrl(useSearchParams().get("especialidade"));
  return <Filtro especialidade={especialidade} />;
}

export function ProfissionaisCarregando({ especialidadeInicial }: { especialidadeInicial: Especialidade }) {
  return (
    <main className="figma-result-page profissionais-pagina" aria-busy="true">
      <Header onOpenMenu={() => {}} hrefDoLogo="/inicio" />

      <div className="profissionais-cabecalho">
        <CardHeader as="h1" title="Profissionais que podem ajudar" />
        {/* Vindo do menu (navegação no cliente), a URL já é conhecida e o filtro nasce certo, com
            Psiquiatras marcado e com a faixa de preço deles. No HTML estático, que não conhece a query, vale a aba
            da rota (o rewrite do next.config manda o link de psiquiatras pra /profissionais/aba-psiquiatras). */}
        <Suspense fallback={<Filtro especialidade={especialidadeInicial} />}>
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
