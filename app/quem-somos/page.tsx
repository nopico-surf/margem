import type { Metadata } from "next";
import { Suspense } from "react";
import { GuiaCabecalho } from "@/app/blog/[slug]/GuiaCabecalho";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import type { EspecialidadeGuia } from "@/lib/guias";
import { OG_IMAGE_PADRAO, OG_SITE_NAME } from "@/lib/metadata";

// Quem somos (doc "Quem somos da Margem (SEO)", 19/11/2026). Existe pra o Google e as respostas de IA
// entenderem o que a Margem é. Usa o mesmo molde dos textos do blog (/blog/[slug]), sem imagem, data
// nem perguntas frequentes. Tudo renderizado no servidor; só o carrossel depende de JavaScript.

const URL_DO_SITE = "https://www.somosmargem.com.br";
const TITLE = "Margem: saúde mental e redução de danos | Quem somos";
const DESCRICAO =
  "A Margem é uma plataforma online de saúde mental e redução de danos no uso de álcool, drogas e apostas, para quem usa e para quem está por perto.";
const ESPECIALIDADES: EspecialidadeGuia[] = ["psicologo", "psiquiatra"];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRICAO,
  alternates: { canonical: "/quem-somos" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRICAO,
    images: [OG_IMAGE_PADRAO],
    siteName: OG_SITE_NAME,
  },
};

const OFERTAS = [
  {
    titulo: "Orientação gratuita, na hora e sem cadastro.",
    texto:
      "Você escolhe um card ou escreve com as suas palavras o que está sentindo. Recebe acolhimento, um checklist prático, telefones úteis e o caminho pra serviços públicos gratuitos como CAPS AD, UBS, CVV 188 e SAMU 192.",
  },
  { titulo: "Terapia online com psicólogos com valor social.", texto: "Sessões de R$ 60 a R$ 200." },
  { titulo: "Consulta online com psiquiatras com valor social.", texto: "Atendimentos de R$ 110 a R$ 290." },
  {
    titulo: "Você escolhe o valor.",
    texto: "Na psicologia e na psiquiatria, você decide quanto pagar dentro da faixa, sem precisar justificar.",
  },
  { titulo: "Atendimento online pro Brasil todo.", texto: "Sem precisar se deslocar." },
];

// Um Service por oferta, com a faixa de preço. A Organization já vem do layout.
const organizacao = { "@type": "Organization", name: "Margem", url: URL_DO_SITE };
const servico = (nome: string, descricao: string, preco: { minPrice: number; maxPrice: number }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: nome,
  description: descricao,
  provider: organizacao,
  areaServed: { "@type": "Country", name: "Brasil" },
  offers: {
    "@type": "Offer",
    priceSpecification: { "@type": "PriceSpecification", priceCurrency: "BRL", ...preco },
  },
});
const jsonLd = [
  servico("Orientação gratuita", OFERTAS[0].texto, { minPrice: 0, maxPrice: 0 }),
  servico("Terapia online com psicólogos com valor social", OFERTAS[1].texto, { minPrice: 60, maxPrice: 200 }),
  servico("Consulta online com psiquiatras com valor social", OFERTAS[2].texto, { minPrice: 110, maxPrice: 290 }),
];

async function CarrosselComProfissionais() {
  const profissionais = await buscarTodosProfissionaisAtivos();
  return (
    <CardProfissionais
      variante="guia"
      profissionais={profissionais}
      especialidades={ESPECIALIDADES}
      origem="quem-somos"
      id="quem-somos-profissionais"
    />
  );
}

export default function QuemSomosPage() {
  return (
    <main className="figma-result-page guia-pagina">
      <GuiaCabecalho />
      <article className="guia">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <div className="figma-section-inner guia-texto guia-abertura">
          <h1>Margem: saúde mental e redução de danos online</h1>
          <p>
            A Margem é uma plataforma online de saúde mental e redução de danos no uso de álcool, outras drogas e apostas
            (bets), para quem usa e para quem está por perto.
          </p>
        </div>

        <div className="figma-section-inner guia-texto">
          <section>
            <h2>Por que a Margem existe</h2>
            <p>Muitas vezes o problema não é falta de ajuda. É que a pessoa não sabe que ela existe ou não consegue chegar até ela.</p>
            <p>
              Preço, distância, burocracia e medo de julgamento afastam quem mais precisa de cuidado. A Margem nasceu pra
              diminuir essas barreiras e transformar informação em acesso.
            </p>
          </section>
          <section>
            <h2>O que oferecemos</h2>
            <ul>
              {OFERTAS.map(({ titulo, texto }) => (
                <li key={titulo}>
                  <strong>{titulo}</strong> {texto}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Para quem é</h2>
            <p>
              Pra quem usa álcool, outras drogas ou faz apostas e está em qualquer momento dessa relação: quem quer parar,
              quem quer diminuir, quem quer usar com menos risco e quem recaiu.
            </p>
            <p>
              E pra quem está por perto. Familiares, companheiros e amigos também carregam medo, dúvida e cansaço, e também
              precisam de orientação e escuta.
            </p>
            <p>
              Os psicólogos e psiquiatras da Margem têm especialidade no cuidado de pessoas em uso de álcool, outras drogas e
              apostas. Mesmo com esse foco, também atendem quem não está nessa situação e procura terapia ou psiquiatria
              online com valor social.
            </p>
          </section>
          <section>
            <h2>Como a gente pensa</h2>
            <p>
              Trabalhamos com redução de danos. Não julgamos e não impomos a abstinência como único caminho. Cada pessoa
              decide o próprio ritmo.
            </p>
            <p>
              O uso não acontece no vazio. A gente olha pro que está por baixo dele e pras condições de vida, como trabalho,
              dinheiro e acesso a direitos, e não só pra substância ou pra aposta.
            </p>
            <p>
              E não substituímos o SUS nem a rede que já existe. Somos ponte: aproximamos as pessoas desses serviços e de
              profissionais que cabem no bolso.
            </p>
          </section>
          <section>
            <h2>Um passo possível, no seu tempo</h2>
            <p>
              Lidar com o uso, ou acompanhar alguém que você ama nessa travessia, não tem resposta fácil nem atalho. Mas
              existe uma força silenciosa em quebrar o silêncio e deixar que alguém caminhe do seu lado por um trecho.
            </p>
            <p>
              Você não precisa ter tudo resolvido nem ter decidido parar pra começar. Pode ser só contar o que está sentindo
              agora. E, se quiser, logo abaixo estão os psicólogos e psiquiatras da Margem.
            </p>
            <div className="guia-botoes">
              <Button href="/inicio" tamanho="small">
                Receber orientação gratuita
              </Button>
            </div>
          </section>
        </div>

        <div className="guia-carrossel">
          <Suspense
            fallback={
              <CardProfissionais variante="guia" profissionais={[]} especialidades={ESPECIALIDADES} isLoading id="quem-somos-profissionais" />
            }
          >
            <CarrosselComProfissionais />
          </Suspense>
        </div>
      </article>
      <Footer />
    </main>
  );
}
