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
import { MOSTRAR_REVISAO_CLINICA, PRAZO_ACESSO, REVISAO_DO_TREINO_DECIDIDA } from "@/lib/familia/config";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

// Landing page do programa para familiares. Texto do conteúdo v2 (10/11/2026); layout das
// referências do fundador de 09/11/2026. Onde vai imagem, por enquanto, fica o espaço vazio.

const TITULO = "Programa para familiares";
// Textos do conteúdo v2 (10/11/2026): rascunho do Gemini, revisão do Claude.
const DESCRICAO =
  "Um programa de 8 semanas para quem convive com alguém que tem problema com álcool, outras drogas ou apostas. Você aprende o que dizer, ensaia antes e conta com psicólogos e psiquiatras da Margem.";
const CTA = "Fazer o diagnóstico grátis (3 minutos)";
// Mesma cor dos ícones dos cards de caminho da home (IconeCaminho).
const COR_DO_ICONE = "var(--colors-brand-primary-700)";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/familia" },
  openGraph: { type: "website", title: TITULO, description: DESCRICAO, images: [OG_IMAGE_PADRAO], siteName: OG_SITE_NAME },
};

const PUBLICOS: Array<{ valor: string; titulo: string; texto: string; icone: ReactNode }> = [
  { valor: "alcool", titulo: "Álcool", texto: "Quando a bebida virou preocupação em casa.", icone: <GlifoLocalBar className="pathway-icon" color={COR_DO_ICONE} /> },
  { valor: "outras_drogas", titulo: "Outras drogas", texto: "Quando o uso está mudando quem você ama.", icone: <GlifoOfflineBolt className="pathway-icon" color={COR_DO_ICONE} /> },
  { valor: "apostas", titulo: "Apostas / bets", texto: "Quando as bets estão pesando na vida e no dinheiro.", icone: <GlifoCasino className="pathway-icon" color={COR_DO_ICONE} /> },
];

const PASSOS: Array<{ titulo: string; texto: string; icone: ReactNode }> = [
  {
    titulo: "Diagnóstico grátis",
    texto: "Em 3 minutos, você conta a situação e recebe na hora um mapa e um roteiro para a primeira conversa.",
    icone: <GlifoFactCheck className="pathway-icon" color={COR_DO_ICONE} />,
  },
  {
    titulo: "Um passo por semana",
    texto: "Uma leitura curta, também em áudio, com exercícios para encaixar no dia a dia.",
    icone: <GlifoCalendarToday className="pathway-icon" color={COR_DO_ICONE} />,
  },
  {
    titulo: "Treine antes de falar",
    texto: "Ensaie a conversa por texto ou voz e veja o que funcionou antes de falar de verdade.",
    icone: <GlifoForum className="pathway-icon" color={COR_DO_ICONE} />,
  },
  {
    titulo: "Profissionais por perto",
    texto: "Psicólogos e psiquiatras da Margem, para você ou para quem você ama, quando precisar.",
    icone: <GlifoPsychology className="pathway-icon familia-icone-compensado" color={COR_DO_ICONE} />,
  },
];

const APRENDIZADOS = [
  "Conversar sem brigar.",
  "Valorizar o que vai bem.",
  "Devolver o que é da pessoa.",
  "Cuidar de você no meio disso.",
  "Convidar para ajuda na hora certa.",
];

const EIXOS = [
  {
    titulo: "Conversar sem brigar",
    texto: "Trocar sermão e cobrança por frases curtas, ditas na hora certa, que falam do que você sente.",
  },
  {
    titulo: "Valorizar o que vai bem",
    texto: "Perceber os momentos em que a pessoa está bem e presente, e fazer esses momentos valerem mais do que o uso.",
  },
  {
    titulo: "Devolver o que é da pessoa",
    texto:
      "Parar de cobrir as consequências do uso, como dar desculpas no trabalho ou pagar dívidas, sem brigar, sem punir e sempre com segurança.",
  },
  {
    titulo: "Cuidar de quem cuida",
    texto: "Voltar a dormir, a ver gente e a fazer o que você gosta, com uma meta pequena por semana. Você também merece cuidado.",
  },
  {
    titulo: "Convidar na hora certa",
    texto: "Reconhecer quando a pessoa está mais aberta e ter a ajuda já pronta: um profissional, um grupo ou um serviço de saúde.",
  },
];

type Pergunta = { pergunta: string; resposta: string; link?: { rotulo: string; href: string } };

// FAQ do conteúdo v2, em 5 blocos. Os itens [PENDÊNCIA DO FUNDADOR] e [REVISÃO CLÍNICA] dependem de
// lib/familia/config.ts.
const GRUPOS_FAQ: Array<{ titulo: string; perguntas: Array<Pergunta | false> }> = [
  {
    titulo: "Sobre o programa",
    perguntas: [
      {
        pergunta: "Isso é terapia?",
        resposta:
          "Não. É um programa de apoio e aprendizado para familiares, com coisas práticas para fazer a cada semana. Se você ou quem você ama quiser atendimento, a Margem tem psicólogos e psiquiatras parceiros, e o programa te ajuda a chegar até eles.",
      },
      MOSTRAR_REVISAO_CLINICA && {
        pergunta: "Isso funciona mesmo?",
        resposta:
          "O programa segue uma abordagem para familiares estudada há décadas. Nos estudos, quando o familiar teve apoio de um terapeuta, cerca de 2 em cada 3 pessoas acabaram buscando tratamento. Com material sem acompanhamento, os números são menores, e por isso a gente recomenda combinar o programa com um profissional.",
      },
      {
        pergunta: "Já tentei de tudo. O que tem de diferente aqui?",
        resposta:
          "Aqui você não vai ouvir conselho genérico. Você aprende o que dizer, quando dizer e o que fazer quando a conversa esquenta, e ensaia antes num treino de conversa. E boa parte do programa é sobre você: o que muda em casa quando você muda o jeito de reagir.",
      },
      {
        pergunta: "Eu não tenho tempo. Dá para fazer?",
        resposta:
          "Dá. Cada semana tem uma leitura de 5 a 7 minutos, que você também pode ouvir, e alguns exercícios para encaixar no dia a dia. Você faz no seu ritmo, pelo celular.",
      },
      {
        pergunta: "Já existe grupo de apoio de graça. Por que fazer o programa?",
        resposta:
          "Grupos de familiares ajudam muito, e o próprio programa indica onde encontrar. A diferença é que aqui o foco é prático e personalizado para a sua situação: o que dizer, como ensaiar e o que fazer em casa. Dá para fazer os dois.",
      },
      PRAZO_ACESSO !== null && {
        pergunta: "O que acontece depois das 8 semanas?",
        resposta: `Você continua com acesso ao conteúdo por ${PRAZO_ACESSO}, para rever quando precisar. Os profissionais parceiros continuam disponíveis.`,
      },
    ],
  },
  {
    titulo: "Sobre quem você ama",
    perguntas: [
      {
        pergunta: "E se a pessoa não quiser saber de nada?",
        resposta:
          "É para essa situação que o programa existe. Ninguém consegue obrigar outra pessoa a mudar, e ninguém pode garantir que ela vai aceitar ajuda. Mas o jeito como a família reage pode deixar a mudança mais atraente, e você aprende a fazer isso.",
      },
      {
        pergunta: "Garante que a pessoa vai aceitar ajuda?",
        resposta:
          "Não, e desconfie de quem garante. O que o programa faz é aumentar as chances e te ajudar a ficar melhor, qualquer que seja a decisão da pessoa. Os melhores resultados aparecem quando o familiar tem apoio de um profissional.",
      },
      {
        pergunta: "A culpa é minha?",
        resposta:
          "Não, a culpa não é sua. Você não causou isso e não controla o que a pessoa faz. Mas você tem mais influência do que imagina, e é isso que o programa trabalha.",
      },
      {
        pergunta: "A pessoa precisa saber que eu estou fazendo?",
        resposta:
          "Não. Você faz no seu tempo, de forma discreta. Mais para a frente, se fizer sentido, contar que você está fazendo um programa pode até despertar curiosidade, mas quem decide é você.",
      },
      {
        pergunta: "Não moramos juntos. Serve para mim?",
        resposta:
          "Serve. O programa é para quem convive ou se preocupa com alguém: mãe, pai, parceiro ou parceira, filho ou filha, irmão, amigo. As conversas e o cuidado com você funcionam mesmo à distância.",
      },
      {
        pergunta: "A pessoa já está em tratamento, ou voltou a usar depois de parar. Faz sentido?",
        resposta: "Faz. Você aprende a apoiar sem vigiar, a valorizar o que vai bem e a lidar com uma volta ao uso sem culpa e sem briga.",
      },
      {
        pergunta: "O objetivo é a pessoa parar de vez?",
        resposta: "Não necessariamente. Parar de vez e diminuir os riscos do uso são caminhos válidos. Quem escolhe é a própria pessoa, de preferência com um profissional.",
      },
      {
        pergunta: "Funciona para apostas?",
        resposta:
          "O programa tem conteúdo específico para apostas, inclusive sobre proteger o dinheiro da casa. Sendo transparente: para apostas, os estudos com programas para familiares ainda são poucos, e o apoio de um profissional faz mais diferença. Por isso, recomendamos combinar o programa com conversas com alguém da nossa rede.",
      },
    ],
  },
  {
    titulo: "Treino de conversa e profissionais",
    perguntas: [
      {
        pergunta: "Como funciona o treino de conversa?",
        resposta:
          "Você conversa, por texto ou por voz, com um personagem que reage como alguém que ainda não quer mudar. No fim, recebe um retorno sobre o que funcionou e o que tentar da próxima vez. É um treino: não é a pessoa real e não é um profissional.",
      },
      {
        pergunta: "A inteligência artificial fala com quem eu amo?",
        resposta: "Não. A IA só aparece no treino de conversa, com você. Ela segue regras para não sair do método, sem dar diagnóstico nem orientação médica.",
      },
      REVISAO_DO_TREINO_DECIDIDA && {
        pergunta: "Alguém lê o que eu escrevo no treino?",
        resposta:
          "Para cuidar da qualidade e da segurança, uma pequena parte das conversas pode ser revisada pela equipe, sem o seu nome e sem o apelido da pessoa. Esse aviso aparece antes do primeiro treino, e você pode apagar seus dados quando quiser.",
      },
      {
        pergunta: "Como falo com um profissional?",
        resposta:
          "Pelo próprio programa, você vê os psicólogos e psiquiatras parceiros e os horários disponíveis. Pode agendar para você ou indicar para quem você ama quando a pessoa topar. As sessões são pagas à parte, a não ser no plano com acompanhamento.",
      },
    ],
  },
  {
    titulo: "Preço e pagamento",
    perguntas: [
      {
        pergunta: "Quanto custa?",
        resposta: "Você escolhe quanto pagar, entre R$ 47 e R$ 147. O valor sugerido é R$ 97, em pagamento único por Pix. O diagnóstico e o módulo 1 são grátis.",
      },
      { pergunta: "E se eu não puder pagar agora?", resposta: "Você pode pedir acesso gratuito. Ninguém precisa ficar de fora por causa de dinheiro." },
      {
        pergunta: "O que é o plano com acompanhamento?",
        resposta: "É o programa completo com a primeira sessão com um profissional parceiro já incluída. É o jeito que mais ajuda, segundo os estudos.",
      },
      { pergunta: "E se eu me arrepender?", resposta: "Você pode desistir em até 7 dias depois da compra e recebe o dinheiro de volta." },
    ],
  },
  {
    titulo: "Privacidade e segurança",
    perguntas: [
      {
        pergunta: "Alguém vai ver isso no meu celular?",
        resposta:
          'Você pode usar o modo discreto, que deixa a tela sem nada que denuncie o assunto, e o botão "Sair rápido", que fecha a página na hora. Também pode apagar tudo quando quiser.',
      },
      {
        pergunta: "O que vocês fazem com os meus dados?",
        resposta:
          "Seus dados não são compartilhados sem a sua autorização. O login é pelo Google, Apple ou Facebook, e a Margem não guarda senha. Você não precisa dizer o nome de ninguém: escolhe um apelido para a pessoa.",
      },
      {
        pergunta: "E se eu tiver medo dentro de casa?",
        resposta:
          "A sua segurança vem antes de tudo. Se houver violência ou medo, o programa muda: o foco vira um plano de segurança e os contatos de emergência, e algumas partes ficam guardadas até você conversar com um profissional. Se estiver em perigo agora, ligue 190.",
        link: { rotulo: "Ver o que fazer em caso de risco", href: "/familia/seguranca" },
      },
    ],
  },
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
              acao="Começar o diagnóstico grátis"
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
          <CardHeader
            title="Sem julgamento"
            description="Aqui não tem rótulo nem culpa. Parar de vez ou diminuir os riscos: quem escolhe o caminho é a própria pessoa."
          />
        </BlocoComImagem>
        <BlocoComImagem variante="bloco">
          <CardHeader
            title="Sua privacidade"
            description="Você não precisa dizer o nome de ninguém, e ninguém precisa saber que você está aqui. Seus dados não são compartilhados sem a sua autorização."
          />
        </BlocoComImagem>
      </section>

      <section className="familia-lp-secao">
        <h2 className="home-secao-titulo">Perguntas frequentes</h2>
        {GRUPOS_FAQ.map((grupo) => (
          <div key={grupo.titulo} className="familia-lp-faq">
            <h3 className="header-small familia-lp-faq-subtitulo">{grupo.titulo}</h3>
            {grupo.perguntas.map(
              (item) =>
                item && (
                  <Accordion key={item.pergunta} titulo={item.pergunta}>
                    <p className="text-medium-regular">{item.resposta}</p>
                    {item.link && (
                      <div className="familia-exercicio-acoes">
                        <Button variante="transparent" tamanho="small" href={item.link.href}>
                          {item.link.rotulo}
                        </Button>
                      </div>
                    )}
                  </Accordion>
                ),
            )}
          </div>
        ))}
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
