"use client";

import { Button } from "@/components/ui/Button";
import { GlifoClose } from "@/components/icons/glifos";

// Figma: ainda não existe como componente (só as instâncias soltas nas telas de /bem-vindo). Nome
// proposto: `painel-inferior`, com a propriedade `variant` = cookies, continuar.
//
// Fica fixo embaixo, entra subindo e sai descendo. Quando `visivel` é false ele continua no DOM,
// mas fora da tela e inerte, senão a saída não teria animação.
//
// No `cookies`, o X acima do cartão faz o mesmo que "Entendi": o consentimento já é gravado direto,
// então é só um aviso e fechar não muda nada.
//
// Os handlers são opcionais só para a galeria /ui, que é componente de servidor e não passa função.
//
// O `continuar` só existe no mobile: no desktop o botão está dentro da própria página.
type PainelInferiorProps = { visivel: boolean } & (
  | { variante: "cookies"; onEntendi?: (origem: "botao" | "x") => void; onVerDados?: () => void }
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
      {props.variante === "cookies" && (
        <div className="painel-inferior-fechar">
          <button className="painel-inferior-x" type="button" aria-label="Fechar" onClick={() => props.onEntendi?.("x")}>
            <GlifoClose color="var(--colors-status-error-600)" />
          </button>
        </div>
      )}
      <div className="painel-inferior-cartao">
        {props.variante === "cookies" ? (
          <>
            <div className="painel-inferior-texto">
              <p>
                Pra te orientar, a Margem guarda o que você escreve sem ligar isso a você, e usa inteligência
                artificial pra montar a sua resposta. Dados anônimos também podem ajudar pesquisas a entender o que
                as pessoas mais precisam. Usamos cookies essenciais pra tudo isso funcionar e também cookies que
                medem como a Margem é usada, sem saber quem você é.
              </p>
            </div>
            <div className="painel-inferior-acoes">
              <Button tamanho="medium" larguraTotal onClick={() => props.onEntendi?.("botao")}>
                Entendi
              </Button>
              <Button tamanho="medium" larguraTotal variante="transparent" onClick={props.onVerDados}>
                Ver como a gente cuida dos seus dados
              </Button>
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
