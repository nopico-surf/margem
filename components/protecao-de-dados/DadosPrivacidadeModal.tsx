"use client";

import { ModalHeader } from "./ModalHeader";
import { ModalSection } from "./ModalSection";
import { ModalFooter } from "./ModalFooter";

type DadosPrivacidadeModalProps = { onClose: () => void };

export function DadosPrivacidadeModal({ onClose }: DadosPrivacidadeModalProps) {
  return (
    <div className="dados-modal" role="dialog" aria-modal="true" aria-labelledby="dados-modal-title">
      <ModalHeader onClose={onClose} />
      <div className="dados-modal-body">
        <h2 id="dados-modal-title">Como cuidados dos seus dados</h2>

        <ModalSection titulo="Abertura">
          <p>Essa página explica o que acontece com o que você escreve na Margem. A gente tentou escrever do jeito mais direto possível, sem juridiquês. Se ficar alguma dúvida, dá pra falar com a gente pelo e-mail lá no final.</p>
        </ModalSection>

        <ModalSection titulo="O que a gente guarda">
          <p>O texto que você escreve nos campos livres. As opções que você escolhe nos cards. Um código aleatório que identifica sua visita, sem ligação nenhuma com você. Informações básicas de uso do site, tipo quais telas você abriu e quanto tempo ficou (medição anônima). Sua localização aproximada, só se você autorizar, e só pra mostrar CAPS, UBS e grupos de apoio perto de você. Confirmação de que você aceitou essa política de privacidade.</p>
        </ModalSection>

        <ModalSection titulo="O que a gente não guarda">
          <p>Seu nome, seu e-mail, seu telefone, seu CPF ou qualquer documento. Sua localização exata ou seu endereço. Nada que permita a gente saber quem você é ou entrar em contato com você depois.</p>
          <p>Se você escrever seu nome ou algum dado desses no campo de texto, isso fica guardado junto com o resto do que você escreveu. Por isso a gente pede pra evitar.</p>
        </ModalSection>

        <ModalSection titulo="Por que a gente guarda">
          <p>Pra montar a orientação que você recebe na hora. Pra melhorar as respostas, com revisão de psicóloga e da equipe clínica. Pra entender o que as pessoas mais buscam e onde faltam serviços, sempre olhando o conjunto e nunca uma pessoa específica. Pra medir como o site está funcionando e se está chegando em quem precisa.</p>
        </ModalSection>

        <ModalSection titulo="Armazenamento local e medição de uso">
          <p>A gente guarda no seu navegador uma confirmação de que você aceitou essa política. Isso permite que você não tenha que aceitar de novo toda vez que entra.</p>
          <p>A gente também mede de forma anônima como você usa o site: quais telas você abriu, quanto tempo ficou, se clicou em algo. Esses dados não deixam você identificável. A gente só quer saber se o que a gente tá fazendo tá ajudando ou se precisa mudar. Essa medição começa assim que você marca o checkbox de consentimento na entrada.</p>
        </ModalSection>

        <ModalSection titulo="Quem mais tem acesso">
          <p>Pra Margem funcionar, a gente usa serviços de terceiros que ajudam com armazenamento de dados, hospedagem do site e inteligência artificial pra gerar as respostas. Essas empresas tratam os dados a nosso pedido e estão sob as mesmas obrigações de confidencialidade que a Margem.</p>
          <p>Dados anonimizados (sem qualquer informação que deixe você identificável) podem ser compartilhados com órgãos públicos e pesquisadores pra entender melhor o que as pessoas mais precisam, sempre com o objetivo de melhorar serviços de saúde e redução de danos. A gente nunca compartilha dados anonimizados para venda de produtos, publicidade ou qualquer outro uso comercial.</p>
          <p>Fora isso, a gente não compartilha dados que deixem você identificável. A única exceção é ordem judicial, que a gente é obrigada a cumprir por lei.</p>
        </ModalSection>

        <ModalSection titulo="Por quanto tempo">
          <p>O que você escreve fica guardado indefinidamente. Dados de uso do site ficam guardados indefinidamente.</p>
        </ModalSection>

        <ModalSection titulo="Seus direitos">
          <p>A LGPD garante que você possa saber o que a gente tem, corrigir, pedir cópia, pedir exclusão e retirar o consentimento a qualquer momento.</p>
          <p>Tem um detalhe honesto aqui: como a gente não pede nenhum dado seu, a gente não tem como achar suas informações depois que você fecha a página. Se quiser pedir exclusão, guarde o código da sua sessão, que aparece no fim da conversa, e mande pra gente. Com ele a gente localiza e apaga.</p>
          <p>Se você quiser só parar, é só fechar a página. Não tem cadastro pra cancelar.</p>
        </ModalSection>

        <ModalSection titulo="Cookies e armazenamento">
          <p>Quando você marca o checkbox &quot;Li e concordo&quot; na entrada, você tá autorizando a gente a:</p>
          <ul>
            <li>Guardar sua confirmação de consentimento no seu navegador, pra não perguntar de novo toda vez que você entra.</li>
            <li>Medir de forma anônima como você usa o site (quais telas, quanto tempo, cliques), isso também usa armazenamento local.</li>
          </ul>
        </ModalSection>

        <ModalSection titulo="Falar com a gente">
          <p>E-mail: vitor@somosmargem.com.br</p>
          <p>Responsável pelos dados na Margem: Vitor Gaudio</p>
        </ModalSection>

        <ModalFooter onClose={onClose} />
      </div>
    </div>
  );
}
