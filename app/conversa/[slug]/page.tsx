import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardResultado } from "@/components/conversa/CardResultado";
import { CARDS_HOME, indiceDoCard } from "@/lib/cards-home";
import { detectarRisco } from "@/lib/risco";
import { buscarRespostaPorChave } from "@/lib/supabase";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CARDS_HOME.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const indice = indiceDoCard(slug);
  if (indice === -1) return {};
  const card = CARDS_HOME[indice];
  return {
    title: card.titulo,
    description: card.descricao,
    alternates: { canonical: `/conversa/${card.slug}` },
    openGraph: { title: card.titulo, description: card.descricao },
  };
}

export default async function ConversaCardPage({ params }: Props) {
  const { slug } = await params;
  const indice = indiceDoCard(slug);
  if (indice === -1) notFound();
  const card = CARDS_HOME[indice];

  const resposta = await buscarRespostaPorChave(card.chave);

  if (!resposta) notFound();

  const orientation = {
    acolhimento: resposta.acolhimento,
    orientacao: resposta.orientacao,
    pilula_espiritual: resposta.pilula_espiritual,
    checklist_agora: resposta.checklist_agora,
    checklist_proximo: resposta.checklist_proximo,
    perguntas_aprofundamento: resposta.perguntas_aprofundamento,
  };

  return (
    <CardResultado
      cardIndex={indice}
      slug={card.slug}
      message={card.titulo}
      orientation={orientation}
      riscoEmergency={detectarRisco(card.chave).emergency}
    />
  );
}
