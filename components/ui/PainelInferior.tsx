"use client";

import { Button } from "@/components/ui/Button";

// Figma: ainda não existe como componente (só as instâncias soltas nas telas de /bem-vindo). Nome
// proposto: `painel-inferior`, com a propriedade `variant` = cookies, continuar.
//
// Fica fixo embaixo, entra subindo e sai descendo. Quando `visivel` é false ele continua no DOM,
// mas fora da tela e inerte, senão a saída não teria animação.
//
// Os handlers são opcionais só para a galeria /ui, que é componente de servidor e não passa função.
//
// O `continuar` só existe no mobile: no desktop o botão está dentro da própria página.
type PainelInferiorProps = { visivel: boolean } & (
  | { variante: "cookies"; onAceitar?: () => void; onRecusar?: () => void; onVerDados?: () => void }
  | { variante: "continuar"; onContinuar?: () => void }
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
      {props.variante === "cookies" ? (
        <>
          <h2 className="painel-inferior-titulo">Dados e cookies</h2>
          <div className="painel-inferior-texto">
            <p>
              O que você compartilhar fica guardado sem estar ligado a você, nós armazenamos tudo de forma anônima,
              segura e sigilosa, pra te devolver uma orientação melhor e pra entender o que as pessoas mais precisam.
            </p>
            <p>Usamos cookies essenciais para o site funcionar e também para medirmos como a Margem é usada.</p>
          </div>
          <div className="painel-inferior-acoes">
            <Button tamanho="medium" larguraTotal onClick={props.onAceitar}>
              Li e estou de acordo
            </Button>
            <Button tamanho="medium" larguraTotal variante="secondary" onClick={props.onRecusar}>
              Recusar
            </Button>
            <Button tamanho="medium" larguraTotal variante="transparent" onClick={props.onVerDados}>
              Ver como a gente cuida dos seus dados
            </Button>
          </div>
        </>
      ) : (
        <Button tamanho="medium" larguraTotal onClick={props.onContinuar}>
          Continuar
        </Button>
      )}
    </div>
  );
}
