import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CardsLp } from "@/components/bem-vindo/CardsLp";
import { CardHomeHeader } from "@/components/app/CardHomeHeader";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ActionRow } from "@/components/conversa/ActionRow";
import { BlocoComImagem } from "@/components/familia/BlocoComImagem";
import { Rastrear } from "@/components/familia/Rastrear";
import {
  GlifoCalendarToday,
  GlifoCasino,
  GlifoFactCheck,
  GlifoForum,
  GlifoLocalBar,
  GlifoPsychology,
  GlifoOfflineBolt,
} from "@/components/icons/glifos";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

// Landing page do programa para familiares. Texto do briefing, seção 14 [revisar tom]; layout das
// referências do fundador de 09/11/2026. Onde vai imagem, por enquanto, fica o espaço vazio.

const TITULO = "Programa para familiares";
const DESCRICAO =
  "Um programa de 8 semanas para quem convive com alguém que tem problema com álcool, outras drogas ou apostas. Com treino de conversa com IA e profissionais da Margem ao seu lado.";
const CTA = "Fazer o diagnóstico grátis (3 minutos)";
// Mesma cor dos ícones dos cards de caminho da home (IconeCaminho).
const COR_DO_ICONE = "var(--colors-brand-primary-700)";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/familia" },
  openGraph: { type: "website", title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

// A linha de cada card não estava no briefing: proposta de 09/11/2026, aplicada a pedido do fundador.
const PUBLICOS: Array<{ valor: string; titulo: string; texto: string; icone: ReactNode }> = [
  { valor: "alcool", titulo: "Álcool", texto: "Quando a bebida virou preocupação em casa.", icone: <GlifoLocalBar className="pathway-icon" color={COR_DO_ICONE} /> },
  { valor: "outras_drogas", titulo: "Outras drogas", texto: "Quando o uso está afetando quem você ama.", icone: <GlifoOfflineBolt className="pathway-icon" color={COR_DO_ICONE} /> },
  { valor: "apostas", titulo: "Apostas / bets", texto: "Quando as bets estão pesando na vida e no dinheiro.", icone: <GlifoCasino className="pathway-icon" color={COR_DO_ICONE} /> },
];

const PASSOS: Array<{ titulo: string; texto: string; icone: ReactNode }> = [
  {
    titulo: "Diagnóstico grátis",
    texto: "Você conta a situação e recebe na hora um mapa e um roteiro para a primeira conversa.",
    icone: <GlifoFactCheck className="pathway-icon" color={COR_DO_ICONE} />,
  },
  { titulo: "Um passo por semana", texto: "Conteúdos curtos, exercícios práticos e um diário para entender o padrão.", icone: <GlifoCalendarToday className="pathway-icon" color={COR_DO_ICONE} /> },
  { titulo: "Treine antes de falar", texto: "Ensaie conversas difíceis com a IA e receba dicas do que funcionou.", icone: <GlifoForum className="pathway-icon" color={COR_DO_ICONE} /> },
  {
    titulo: "Profissionais por perto",
    texto: "Quando precisar, fale com psicólogos e psiquiatras da Margem, para você ou para quem você ama.",
    icone: <GlifoPsychology className="pathway-icon familia-icone-compensado" color={COR_DO_ICONE} />,
  },
];

const APRENDIZADOS = [
  "Conversar sem brigar.",
  "Entender quando e por que o uso acontece.",
  "Parar de amortecer o problema sem abandonar a pessoa.",
  "Cuidar da sua vida no meio disso.",
  "Reconhecer a hora certa de convidar para ajuda.",
];

// Detalhe de cada aprendizado. Texto enviado pelo fundador em 09/11/2026. [REVISÃO CLÍNICA]
const EIXOS = [
  {
    titulo: "Comunicação não-confrontativa",
    texto:
      "Substituir discussões, acusações e sermões por conversas calmas, focadas nos sentimentos do familiar e em momentos estratégicos (quando a pessoa estiver sóbria e tranquila).",
  },
  {
    titulo: "Valorização de comportamentos positivos",
    texto:
      "Em vez de dar atenção apenas ao momento do uso, o familiar aprende a reconhecer, valorizar e incentivar quando a pessoa está bem, sóbria ou participando da rotina da casa.",
  },
  {
    titulo: "Consequências naturais com segurança",
    texto:
      "O familiar é orientado a parar de \"encobrir\" as consequências do uso (como dar desculpas no trabalho da pessoa ou limpar bagunças), sem precisar brigar ou punir. A ideia é deixar que os impactos reais do uso apareçam de forma segura.",
  },
  {
    titulo: "Autocuidado de quem cuida",
    texto:
      "Um dos eixos mais importantes. O familiar é incentivado a cuidar da própria saúde mental, resgatar hobbies, manter sua rotina e aliviar o esgotamento. Ninguém consegue oferecer apoio estando no limite da exaustão.",
  },
  {
    titulo: "Aproveitar o momento certo para propor ajuda",
    texto:
      "Treinar o familiar para saber como oferecer pontes para serviços de saúde, grupos ou acompanhamento profissional no exato momento em que a pessoa em uso demonstrar abertura.",
  },
];

const PERGUNTAS = [
  {
    pergunta: "Isso é tratamento?",
    resposta: "Não. É um programa de apoio e aprendizado para familiares. Para tratamento, a Margem tem profissionais parceiros.",
  },
  {
    pergunta: "Garante que a pessoa vai aceitar ajuda?",
    resposta: "Não. Ninguém pode garantir isso. O programa te ajuda a ficar melhor e a aumentar as chances de a pessoa querer mudar.",
  },
  { pergunta: "Funciona para apostas?", resposta: "Sim, com conteúdo específico, inclusive sobre proteger o dinheiro da casa." },
  { pergunta: "Posso desistir?", resposta: "Sim, em até 7 dias, com reembolso." },
];

export default function FamiliaPage() {
  return (
    <div className="familia-lp">
      <Rastrear evento="lp_visualizada" />

      <BlocoComImagem variante="topo">
        <h1 className="familia-lp-titulo-topo">Você não precisa escolher entre ajudar quem você ama e cuidar de você.</h1>
        <p className="text-medium-regular">{DESCRICAO}</p>
        <div className="familia-lp-cta-topo">
          <Button tamanho="medium" href="/familia/diagnostico">
            {CTA}
          </Button>
        </div>
      </BlocoComImagem>

      {/* Cards de caminho da home ("Você pode começar por aqui"), com a fileira que rola de lado no celular. */}
      <section className="familia-lp-secao">
        <h2 className="home-secao-titulo">O que te preocupa hoje?</h2>
        <ActionRow className="pathway-list" origem="familia_publicos">
          {PUBLICOS.map((publico) => (
            <CardHomeHeader
              key={publico.valor}
              titulo={publico.titulo}
              descricao={publico.texto}
              icone={publico.icone}
              href={`/familia/diagnostico?problema=${publico.valor}`}
              acao="Começar o diagnóstico"
            />
          ))}
        </ActionRow>
      </section>

      <section className="familia-lp-faixa-verde">
        <div className="familia-lp-secao">
          <h2 className="home-secao-titulo">Como funciona</h2>
          <ActionRow className="pathway-list" origem="familia_passos">
            {PASSOS.map((passo) => (
              <CardHomeHeader key={passo.titulo} titulo={passo.titulo} descricao={passo.texto} icone={passo.icone} acao={null} />
            ))}
          </ActionRow>
        </div>
      </section>

      <section className="familia-lp-aprender">
        <Marquee frases={APRENDIZADOS} />
        <div className="familia-lp-secao">
          <h2 className="home-secao-titulo">O que você vai aprender</h2>
          <div className="familia-lp-grade familia-lp-grade-eixos">
            {EIXOS.map((eixo) => (
              <CardsLp key={eixo.titulo} icone={null} titulo={eixo.titulo} texto={eixo.texto} />
            ))}
          </div>
        </div>
      </section>

      <section className="familia-lp-secao familia-lp-grade familia-lp-grade-2">
        <BlocoComImagem variante="bloco">
          <CardHeader title="Sem julgamento" description={'Aqui ninguém é "viciado" e ninguém é culpado. Parar ou reduzir: o caminho é de cada um.'} />
        </BlocoComImagem>
        <BlocoComImagem variante="bloco">
          <CardHeader title="Sua privacidade" description="Você não precisa dizer o nome de ninguém. Seus dados não são compartilhados sem a sua autorização." />
        </BlocoComImagem>
      </section>

      <section className="familia-lp-secao">
        <h2 className="home-secao-titulo">Perguntas frequentes</h2>
        <div className="familia-lp-faq">
          {PERGUNTAS.map((item) => (
            <Accordion key={item.pergunta} titulo={item.pergunta}>
              <p className="text-medium-regular">{item.resposta}</p>
            </Accordion>
          ))}
          <Accordion titulo="E se houver violência em casa?">
            <p className="text-medium-regular">Sua segurança vem primeiro.</p>
          </Accordion>
        </div>
      </section>

      {/* Fixo no rodapé no celular, como o "Agendar" da página do profissional; no desktop fica aqui, no fim. */}
      <div className="familia-lp-cta-barra">
        <Button tamanho="medium" larguraTotal href="/familia/diagnostico">
          {CTA}
        </Button>
      </div>
    </div>
  );
}
