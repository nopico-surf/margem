"use client";

import { Button } from "@/components/ui/Button";
import { spriteDe } from "@/lib/mochila/conteudo";
import { ItemRevelacao } from "../ItemRevelacao";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaRevelacao() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { itens, ir } = usePartida();
  if (!liberada) return <TelaCarregando />;
  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-linha">
        <h1 className="mochila-titulo">Olha o que foi na sua mochila</h1>
        <img className="mochila-sprite mochila-sprite-cabeca" src={spriteDe("mochila-aberta")} alt="" />
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
        </div>
      </div>
    </>
  );
}
