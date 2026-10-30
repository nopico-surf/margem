"use client";

import { useLayoutEffect } from "react";
import { Button } from "@/components/ui/Button";
import { spriteDe } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { ItemRevelacao } from "../ItemRevelacao";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";
import { SpriteMochila } from "../SpriteMochila";

export function TelaRevelacao() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { itens, ir, abrindo, pararAbertura, voltar } = usePartida();
  // Saiu de cena (voltou pra montagem ou pelo navegador): a próxima chegada mostra a revelação, não a mochila abrindo.
  useLayoutEffect(() => pararAbertura, [pararAbertura]);
  if (!liberada) return <TelaCarregando />;

  // O fechar da montagem ao contrário: começa fechada e abre.
  if (abrindo) {
    return (
      <div className="mochila-fechando" data-sentido="abrir" data-fase={abrindo} aria-hidden="true">
        <img className="mochila-sprite mochila-fechando-aberta" src={spriteDe("mochila-aberta")} alt="" />
        <img className="mochila-sprite mochila-fechando-fechada" src={spriteDe("mochila-fechada")} alt="" />
      </div>
    );
  }

  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-linha">
        <h1 className="mochila-titulo">Olha o que foi na sua mochila</h1>
        <SpriteMochila className="mochila-sprite-cabeca" src={spriteDe("mochila-fechada")} />
      </header>
      <div className="mochila-painel">
        <ul className="mochila-lista">
          {itens.map((id, i) => (
            <ItemRevelacao key={id} id={id} atraso={i * 0.35} />
          ))}
        </ul>
        <div className="mochila-acoes mochila-acoes-respiro">
          <Button variante="primary" tamanho="medium" redondo larguraTotal onClick={() => ir("combinados")}>
            Continuar
          </Button>
          <Button
            variante="secondary"
            tamanho="medium"
            redondo
            larguraTotal
            onClick={() => {
              track("mochila_itens_trocados");
              voltar(false);
            }}
          >
            Trocar itens
          </Button>
        </div>
      </div>
    </>
  );
}
