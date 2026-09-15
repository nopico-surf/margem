"use client";

const logo = "https://www.figma.com/api/mcp/asset/d418cab5-cf60-433b-abec-fdfd2e6eb808.svg";
const closeIcon = "https://www.figma.com/api/mcp/asset/03ba932b-a706-4f9f-b976-2a6a8b337698.svg";

type DadosPrivacidadeModalProps = { onClose: () => void };

export function DadosPrivacidadeModal({ onClose }: DadosPrivacidadeModalProps) {
  return (
    <div className="dados-modal" role="dialog" aria-modal="true" aria-labelledby="dados-modal-title">
      <header className="dados-modal-header">
        <img className="dados-modal-logo" src={logo} alt="Margem" />
        <button className="dados-modal-close" type="button" aria-label="Fechar" onClick={onClose}>
          <img src={closeIcon} alt="" />
        </button>
      </header>
      <div className="dados-modal-body">
        <h2 id="dados-modal-title">Como cuidados dos seus dados</h2>

        <section className="dados-modal-section">
          <h3>Abertura</h3>
          <p>Essa página explica o que acontece com o que você escreve na Margem. A gente tentou escrever do jeito mais direto possível, sem juridiquês. Se ficar alguma dúvida, dá pra falar com a gente pelo e-mail lá no final.</p>
        </section>

        <section className="dados-modal-section">
          <h3>O que a gente guarda</h3>
          <p>O texto que você escreve nos campos livres. As opções que você escolhe nos cards. Um código aleatório que identifica sua visita, sem ligação nenhuma com você. Informações básicas de uso do site, tipo quais telas você abriu e quanto tempo ficou (medição anônima). Sua localização aproximada, só se você autorizar, e só pra mostrar CAPS, UBS e grupos de apoio perto de você. Confirmação de que você aceitou essa política de privacidade.</p>
        </section>

        <section className="dados-modal-section">
          <h3>O que a gente não guarda</h3>
          <p>Seu nome, seu e-mail, seu telefone, seu CPF ou qualquer documento. Sua localização exata ou seu endereço. Nada que permita a gente saber quem você é ou entrar em contato com você depois.</p>
          <p>Se você escrever seu nome ou algum dado desses no campo de texto, isso fica guardado junto com o resto do que você escreveu. Por isso a gente pede pra evitar.</p>
        </section>

        <section className="dados-modal-section">
          <h3>Por que a gente guarda</h3>
          <p>Pra montar a orientação que você recebe na hora. Pra melhorar as respostas, com revisão de psicóloga e da equipe clínica. Pra entender o que as pessoas mais buscam e onde faltam serviços, sempre olhando o conjunto e nunca uma pessoa específica. Pra medir como o site está funcionando e se está chegando em quem precisa.</p>
        </section>

        <section className="dados-modal-section">
          <h3>Armazenamento local e medição de uso</h3>
          <p>A gente guarda no seu navegador uma confirmação de que você aceitou essa política. Isso permite que você não tenha que aceitar de novo toda vez que entra.</p>
          <p>A gente também mede de forma anônima como você usa o site: quais telas você abriu, quanto tempo ficou, se clicou em algo. Esses dados não deixam você identificável. A gente só quer saber se o que a gente tá fazendo tá ajudando ou se precisa mudar. Essa medição começa assim que você marca o checkbox de consentimento na entrada.</p>
        </section>

        <section className="dados-modal-section">
          <h3>Quem mais tem acesso</h3>
          <p>Pra Margem funcionar, a gente usa serviços de terceiros que ajudam com armazenamento de dados, hospedagem do site e inteligência artificial pra gerar as respostas. Essas empresas tratam os dados a nosso pedido e estão sob as mesmas obrigações de confidencialidade que a Margem.</p>
          <p>Dados anonimizados (sem qualquer informação que deixe você identificável) podem ser compartilhados com órgãos públicos e pesquisadores pra entender melhor o que as pessoas mais precisam, sempre com o objetivo de melhorar serviços de saúde e redução de danos. A gente nunca compartilha dados anonimizados para venda de produtos, publicidade ou qualquer outro uso comercial.</p>
          <p>Fora isso, a gente não compartilha dados que deixem você identificável. A única exceção é ordem judicial, que a gente é obrigada a cumprir por lei.</p>
        </section>

        <section className="dados-modal-section">
          <h3>Por quanto tempo</h3>
          <p>O que você escreve fica guardado indefinidamente. Dados de uso do site ficam guardados indefinidamente.</p>
        </section>

        <section className="dados-modal-section">
          <h3>Seus direitos</h3>
          <p>A LGPD garante que você possa saber o que a gente tem, corrigir, pedir cópia, pedir exclusão e retirar o consentimento a qualquer momento.</p>
          <p>Tem um detalhe honesto aqui: como a gente não pede nenhum dado seu, a gente não tem como achar suas informações depois que você fecha a página. Se quiser pedir exclusão, guarde o código da sua sessão, que aparece no fim da conversa, e mande pra gente. Com ele a gente localiza e apaga.</p>
          <p>Se você quiser só parar, é só fechar a página. Não tem cadastro pra cancelar.</p>
        </section>

        <section className="dados-modal-section">
          <h3>Cookies e armazenamento</h3>
          <p>Quando você marca o checkbox &quot;Li e concordo&quot; na entrada, você tá autorizando a gente a:</p>
          <ul>
            <li>Guardar sua confirmação de consentimento no seu navegador, pra não perguntar de novo toda vez que você entra.</li>
            <li>Medir de forma anônima como você usa o site (quais telas, quanto tempo, cliques), isso também usa armazenamento local.</li>
          </ul>
        </section>

        <section className="dados-modal-section">
          <h3>Falar com a gente</h3>
          <p>E-mail: vitor@somosmargem</p>
          <p>Responsável pelos dados na Margem: Vitor Gaudio</p>
        </section>

        <button className="dados-modal-button" type="button" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
