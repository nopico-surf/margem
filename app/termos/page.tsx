"use client";

import { useRouter } from "next/navigation";
import { ModalHeader } from "@/components/protecao-de-dados/ModalHeader";
import { ModalSection } from "@/components/protecao-de-dados/ModalSection";
import { ModalFooter } from "@/components/protecao-de-dados/ModalFooter";

// Termos de uso (23/11/2026), pedidos pela Meta pro login com Facebook. Mesmo molde da /privacidade.
export default function TermosPage() {
  const router = useRouter();

  return (
    <main className="dados-page">
      <div className="dados-modal" role="dialog" aria-modal="true" aria-labelledby="termos-titulo">
        <ModalHeader onClose={() => router.back()} />
        <div className="dados-modal-body">
          <h1 id="termos-titulo">Termos de uso da Margem</h1>

          <ModalSection titulo="Abertura">
            <p>Esses termos explicam como a Margem funciona e o que você pode esperar da gente. Ao usar a Margem, você concorda com eles. Se ficar alguma dúvida, o e-mail está no final.</p>
          </ModalSection>

          <ModalSection titulo="O que é a Margem">
            <p>A Margem é uma plataforma online de saúde mental e redução de danos no uso de álcool, outras drogas e apostas (bets), para quem usa e para quem está por perto. Trabalhamos com redução de danos: não julgamos e não impomos a abstinência como único caminho. Cada pessoa decide o próprio ritmo.</p>
          </ModalSection>

          <ModalSection titulo="O que oferecemos">
            <p>Orientação gratuita, na hora e sem cadastro: você escolhe um card ou escreve com as suas palavras e recebe acolhimento, um checklist prático, telefones úteis e o caminho pra serviços públicos gratuitos. Terapia online com psicólogos e consulta online com psiquiatras, com valor social, pro Brasil todo. Na psicologia e na psiquiatria, você escolhe quanto pagar dentro da faixa, sem precisar justificar. E o programa para familiares, explicado mais abaixo.</p>
          </ModalSection>

          <ModalSection titulo="O que a Margem não faz">
            <p>A orientação gratuita não é consulta nem diagnóstico. Ela é montada com ajuda de inteligência artificial pra você saber por onde começar. A Margem não atende emergência e não substitui o SUS nem a rede que já existe. A gente é ponte: aproxima você desses serviços e de profissionais que cabem no bolso. Se você ou alguém perto de você estiver em perigo agora, ligue 188 (CVV), 192 (SAMU) ou 190 (Polícia).</p>
          </ModalSection>

          <ModalSection titulo="Sessões com psicólogos e psiquiatras">
            <p>O agendamento é feito pelo WhatsApp. Horário, valor e forma de pagamento são combinados antes da sessão.</p>
          </ModalSection>

          <ModalSection titulo="Programa para familiares">
            <p>O programa é para quem convive com alguém que tem problema com álcool, outras drogas ou apostas. São 8 semanas, com um módulo novo a cada semana, exercícios e um treino de conversa com inteligência artificial. O diagnóstico do começo é grátis. Pra entrar, você faz login com sua conta do Google, da Apple ou do Facebook. A conta é sua e é pessoal. O programa ajuda você a cuidar de si e a agir de outro jeito com a pessoa de quem você cuida. Ele não garante que essa pessoa vá aceitar ajuda ou parar de usar.</p>
          </ModalSection>

          <ModalSection titulo="Pagamento">
            <p>O valor aparece na tela antes do pagamento, que é único e por Pix. O acesso é liberado quando o Pix é confirmado. No plano com acompanhamento, a primeira sessão com um profissional da Margem já está incluída, e essa pessoa entra em contato com você pelo WhatsApp pra combinar o horário. Depois das 8 semanas, o acesso continua por mais 8 semanas.</p>
          </ModalSection>

          <ModalSection titulo="Se você se arrepender">
            <p>Você pode pedir o dinheiro de volta em até 14 dias depois que o acesso foi liberado, sem precisar explicar o motivo. O pedido é feito no próprio programa, e a devolução é feita por Pix em até 7 dias.</p>
          </ModalSection>

          <ModalSection titulo="Uso da Margem">
            <p>Os textos, guias, módulos e materiais da Margem podem ser lidos e compartilhados pra ajudar alguém, mas não podem ser copiados pra uso comercial sem autorização. Não use a Margem pra prejudicar outra pessoa, tentar entrar na conta de outra pessoa ou atrapalhar o funcionamento do site.</p>
          </ModalSection>

          <ModalSection titulo="Seus dados">
            <p>Como a Margem cuida dos seus dados está explicado na página &quot;Como cuidamos dos seus dados&quot;, em /privacidade.</p>
          </ModalSection>

          <ModalSection titulo="Se esses termos mudarem">
            <p>A versão nova aparece aqui, com a data da atualização. Se a mudança afetar o programa que você já pagou, a gente avisa antes.</p>
          </ModalSection>

          <ModalSection titulo="Falar com a gente">
            <p>E-mail: vitor@somosmargem.com.br</p>
            <p>Responsável: Vitor Gaudio</p>
            <p>Última atualização: 23 de novembro de 2026.</p>
          </ModalSection>
        </div>
        <div className="dados-modal-rodape painel-inferior-cartao">
          <ModalFooter onClose={() => router.back()} />
        </div>
      </div>
    </main>
  );
}
