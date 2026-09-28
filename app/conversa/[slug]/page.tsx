import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardResultado } from "@/components/conversa/CardResultado";
import { CARDS_HOME, indiceDoCard } from "@/lib/cards-home";
import { CATEGORIA_PADRAO, paraCardResource } from "@/lib/recursos";
import { detectarRisco } from "@/lib/risco";
import {
  buscarInstituicoesPorCategoria,
  buscarProfissionaisPorCategoria,
  buscarRespostaPorChave,
  buscarServicosPublicosPorCategoria,
} from "@/lib/supabase";

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

  const [resposta, profissionais, servicosPublicos, instituicoes] = await Promise.all([
    buscarRespostaPorChave(card.chave),
    buscarProfissionaisPorCategoria(CATEGORIA_PADRAO),
    buscarServicosPublicosPorCategoria(CATEGORIA_PADRAO),
    buscarInstituicoesPorCategoria(CATEGORIA_PADRAO),
  ]);

  if (!resposta) notFound();

  const orientation = {
    acolhimento: resposta.acolhimento,
    orientacao: resposta.orientacao,
    pilula_espiritual: resposta.pilula_espiritual,
    checklist_agora: resposta.checklist_agora,
    checklist_proximo: resposta.checklist_proximo,
    perguntas_aprofundamento: resposta.perguntas_aprofundamento,
  };

  const resources = {
    profissionais,
    servicos_publicos: servicosPublicos.map((servico) => paraCardResource(servico.id, servico.nome, servico.descricao, servico.acoes)),
    instituicoes: instituicoes.map((instituicao) => paraCardResource(instituicao.id, instituicao.nome, instituicao.descricao, instituicao.contatos)),
  };

  return (
    <CardResultado
      cardIndex={indice}
      slug={card.slug}
      message={card.titulo}
      orientation={orientation}
      resources={resources}
      riscoEmergency={detectarRisco(card.chave).emergency}
    />
  );
}
