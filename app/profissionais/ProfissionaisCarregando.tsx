"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CardHeader } from "@/components/conversa/CardHeader";
import { CardProfissionalSkeleton } from "@/components/conversa/CardProfissionalSkeleton";
import { FiltroEspecialidade } from "@/components/conversa/FiltroEspecialidade";
import { Badge } from "@/components/ui/Badge";

// Figma: Experiência do produto, frames 1369:50724 (mobile) e 1369:51516 (desktop). É o shell da
// /profissionais: tudo o que não depende do Supabase já aparece, e só os cards ficam em skeleton.
// Não lê ?especialidade= (só existe depois da resposta), então o filtro começa em Psicologos.

const QUANTIDADE_DE_SKELETONS = 6;

export function ProfissionaisCarregando() {
  return (
    <main className="figma-result-page profissionais-pagina" aria-busy="true">
      <Header onOpenMenu={() => {}} hrefDoLogo="/inicio" />

      <div className="profissionais-cabecalho">
        <CardHeader as="h1" title="Profissionais que podem ajudar" />
        <FiltroEspecialidade selecionada="psicologo" onChange={() => {}} />
        <div className="figma-session-price">
          <Badge color="secondary">Sessões de <strong>R$ 60</strong> a <strong>R$ 200</strong></Badge>
          <p className="figma-session-price-text">Você escolhe o valor dentro dessa faixa, sem precisar justificar</p>
        </div>
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
