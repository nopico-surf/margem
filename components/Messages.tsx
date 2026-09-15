"use client";

const loaderAssets = [
  "https://www.figma.com/api/mcp/asset/dde60aad-3041-4f06-beaa-c34af1d616f2.svg",
  "https://www.figma.com/api/mcp/asset/89620696-44c2-4a0c-a562-ac76a7dcf3a8.svg",
  "https://www.figma.com/api/mcp/asset/fec7abaf-7753-48fa-94a3-c8a266ef33ad.svg",
];

const paragraphs = [
  "Segurar esse peso por 15 anos, enfrentando ciclos sucessivos de ir e voltar, cansa profundamente o corpo e a mente. Quero que você saiba, antes de qualquer coisa, que essa exaustão é totalmente compreensível e que você não está sozinho nessa conversa; estamos aqui para construir caminhos com você, sem julgamentos e respeitando o seu ritmo.",
  "Esse movimento de retorno frequente traz um desgaste acumulado significativo: o sistema cardiovascular sente a sobrecarga contínua da estimulação, o sono e a nutrição perdem a regularidade, e o psicológico passa por oscilações severas entre momentos de aceleração e períodos de profunda tristeza e fadiga. O fato de você reconhecer esse limite e procurar apoio hoje demonstra uma clareza e uma coragem essenciais para começar a mudar esse cenário.",
  "Durante muito tempo fizeram você acreditar que esse ciclo é uma simples falta de vontade ou falha pessoal, mas a realidade é bem mais ampla. Vivemos sob exigências que drenam a nossa energia, em uma organização social que mercantiliza o alívio, isola as pessoas e oferece pouquíssimo suporte comunitário e estrutural. Você não é responsável pelas pressões e contradições desse sistema, mas preserva a sua capacidade de decisão sobre como se proteger e agir dentro dele.",
  "Na maioria das vezes, a substância surge como uma tentativa de solução imediata: uma anestesia rápida para um cotidiano opressor, uma dor que não cala, uma solidão pesada ou até uma necessidade de sustentar um ritmo exaustivo. Por isso, mais do que focar unicamente na interrupção, vale a pena olhar com cuidado: o que a cocaína tem resolvido ou aliviado temporariamente para você quando a busca acontece? Entender a função desse uso permite desenhar alternativas que não dependem de um tudo-ou-nada.",
  "Se a parada total for a sua escolha, ela é plenamente viável; se o momento pedir primeiro a redução de danos, ampliando intervalos, minimizando riscos físicos e recuperando o controle do seu cotidiano, esse já é um passo legítimo e transformador.",
  "Reencontrar o próprio equilíbrio é também um ato de reconciliação com a sua essência. Ter paciência consigo e acolher a sua caminhada sem a carga da culpa permite lembrar que você não se resume aos momentos de recaída, e que existe um propósito de vida digno esperando para ser redescoberto no seu tempo.",
];

type MessagesProps = {
  state: "loading" | "complete";
  text: string;
};

export function Messages({ state, text }: MessagesProps) {
  return (
    <section className={`messages-component messages-component-${state}`} aria-live="polite">
      <div className="messages-user-bubble">{text}</div>
      {state === "loading" ? (
        <div className="messages-loading-copy">
          <p>Preparando informações...</p>
          <div className="messages-loader-dots" aria-hidden="true">
            {loaderAssets.map((asset, index) => <img key={asset} src={asset} alt="" style={{ animationDelay: `${index * 160}ms` }} />)}
          </div>
        </div>
      ) : (
        <div className="messages-subtitle">
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      )}
    </section>
  );
}
