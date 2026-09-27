"use client";

import { Button } from "@/components/ui/Button";

// Figma: ainda não existe como componente (só as instâncias soltas nas telas de /bem-vindo). Nome
// proposto: `painel-inferior`, com a propriedade `variant` = cookies, continuar.
//
// Fica fixo embaixo, entra subindo e sai descendo. Quando `visivel` é false ele continua no DOM,
// mas fora da tela e inerte, senão a saída não teria animação.
//
// No `cookies` não tem X: fechar é escolher. O que cada botão faz (gravar o consentimento ou
// só fechar sem gravar) é decidido pela tela, não por este componente.
//
// Os handlers são opcionais só para a galeria /ui, que é componente de servidor e não passa função.
//
// O `continuar` só existe no mobile: no desktop o botão está dentro da própria página.
type PainelInferiorProps = { visivel: boolean } & (
  | { variante: "cookies"; onAceitar?: () => void; onRecusar?: () => void; onVerDados?: () => void }
  | { variante: "continuar"; onContinuar?: () => void; texto?: string }
);

export function PainelInferior(props: PainelInferiorProps) {
  const { visivel } = props;

  return (
    <div
      className="painel-inferior"
      data-variante={props.variante}
      data-visivel={visivel ? "true" : "false"}
      inert={!visivel}
      {...(props.variante === "cookies" ? { role: "dialog", "aria-label": "Dados e cookies" } : {})}
    >
      <div className="painel-inferior-cartao">
        {props.variante === "cookies" ? (
          <>
            <div className="painel-inferior-texto">
              <p>
                Medimos de forma anônima o uso da Margem, independentemente do seu consentimento. Para criar
                orientações personalizadas, processamos suas interações usando inteligência artificial. Como isso
                pode envolver dados sensíveis e processamento parcialmente fora do Brasil, só fazemos isso se você
                aceitar. Essas informações, sem identificação, também podem apoiar pesquisas públicas. Se não
                aceitar, você pode continuar navegando pela Margem sem receber orientações personalizadas.
              </p>
            </div>
            <div className="painel-inferior-acoes">
              <Button tamanho="medium" larguraTotal variante="transparent" onClick={props.onVerDados}>
                Ver como a gente cuida dos seus dados
              </Button>
              <div className="painel-inferior-acoes">
                <Button tamanho="medium" larguraTotal variante="secondary" onClick={props.onRecusar}>
                  Navegar sem personalização
                </Button>
                <Button tamanho="medium" larguraTotal onClick={props.onAceitar}>
                  Aceitar personalização
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Button tamanho="medium" larguraTotal onClick={props.onContinuar}>
            {props.texto ?? "Continuar"}
          </Button>
        )}
      </div>
    </div>
  );
}
