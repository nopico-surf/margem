"use client";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { spriteDe } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaCombinados() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenario, combinados, setCombinados, ir } = usePartida();
  if (!liberada) return <TelaCarregando />;

  function concluir(marcados: number[]) {
    track("mochila_combinados_concluidos", {
      cenario: cenario.id,
      combinados: marcados.map((i) => cenario.combinados[i]),
      qtd_combinados: marcados.length,
      pulou: marcados.length === 0,
    });
    ir("resultado");
  }
  return (
    <>
      <header className="mochila-cabeca">
        <div className="mochila-cabeca-linha">
          <h1 className="mochila-titulo">Tem coisa que não ocupa espaço</h1>
          <img className="mochila-sprite mochila-sprite-cabeca" src={spriteDe("mochila-fechada")} alt="" />
        </div>
        <p className="mochila-instrucao">Uns combinados antes de sair também vão junto. Marque os que você vai fazer.</p>
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <fieldset className="mochila-combinados">
          <legend className="mochila-so-leitor">Tem coisa que não ocupa espaço</legend>
          {cenario.combinados.map((texto, i) => (
            <label key={texto} className="mochila-combinado" data-marcado={combinados.includes(i)}>
              <Checkbox
                selected={combinados.includes(i)}
                onChange={(marcado) => {
                  track("mochila_combinado_alternado", { cenario: cenario.id, combinado: texto, marcado });
                  setCombinados((atual) => (marcado ? [...atual, i].sort() : atual.filter((c) => c !== i)));
                }}
              />
              <span>{texto}</span>
            </label>
          ))}
        </fieldset>
        <div className="mochila-acoes">
          <Button variante="primary" tamanho="medium" redondo larguraTotal disabled={combinados.length === 0} onClick={() => concluir(combinados)}>
            Ver minha mochila
          </Button>
          <Button
            variante="secondary"
            tamanho="medium"
            redondo
            larguraTotal
            onClick={() => {
              setCombinados([]);
              concluir([]);
            }}
          >
            Seguir sem marcar
          </Button>
        </div>
      </div>
    </>
  );
}
