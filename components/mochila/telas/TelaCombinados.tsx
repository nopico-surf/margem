"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { spriteDe } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";
import { SpriteMochila } from "../SpriteMochila";

export function TelaCombinados() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenario, combinados, setCombinados, semCombinados: nenhum, setSemCombinados: setNenhum, ir } = usePartida();
  // O Checkbox só lê `selected` ao montar. Quando um lado limpa o outro, a key nova recria os
  // checkboxes limpos pra o check sumir junto com o estado.
  const [limpouCombinados, setLimpouCombinados] = useState(0);
  const [limpouNenhum, setLimpouNenhum] = useState(0);
  if (!liberada) return <TelaCarregando />;

  function concluir(marcados: number[]) {
    track("mochila_combinados_concluidos", {
      cenario: cenario.id,
      combinados: marcados.map((i) => cenario.combinados[i]),
      qtd_combinados: marcados.length,
      pulou: marcados.length === 0,
    });
    ir("jeitos");
  }
  return (
    <>
      <header className="mochila-cabeca">
        <div className="mochila-cabeca-linha">
          <h1 className="mochila-titulo">Tem coisa que não ocupa espaço</h1>
          <SpriteMochila className="mochila-sprite-cabeca" src={spriteDe("mochila-fechada")} />
        </div>
        <p className="mochila-instrucao">Uns combinados antes de sair também vão junto. Marca os que você vai fazer.</p>
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <fieldset className="mochila-combinados">
          <legend className="mochila-so-leitor">Tem coisa que não ocupa espaço</legend>
          {cenario.combinados.map((texto, i) => (
            <label key={texto} className="mochila-combinado" data-marcado={combinados.includes(i)} data-inativo={nenhum}>
              <Checkbox
                key={limpouCombinados}
                selected={combinados.includes(i)}
                onChange={(marcado) => {
                  track("mochila_combinado_alternado", { cenario: cenario.id, combinado: texto, marcado });
                  if (marcado && nenhum) {
                    setNenhum(false);
                    setLimpouNenhum((n) => n + 1);
                  }
                  setCombinados((atual) => (marcado ? [...atual, i].sort() : atual.filter((c) => c !== i)));
                }}
              />
              <span>{texto}</span>
            </label>
          ))}
          <label className="mochila-combinado" data-marcado={nenhum}>
            <Checkbox
              key={limpouNenhum}
              selected={nenhum}
              onChange={(marcado) => {
                track("mochila_combinado_alternado", { cenario: cenario.id, combinado: "nenhum", marcado });
                setNenhum(marcado);
                if (marcado && combinados.length > 0) {
                  setCombinados([]);
                  setLimpouCombinados((n) => n + 1);
                }
              }}
            />
            <span>Não vou fazer combinados.</span>
          </label>
        </fieldset>
        <div className="mochila-acoes">
          <Button variante="primary" tamanho="medium" redondo larguraTotal disabled={!nenhum && combinados.length === 0} onClick={() => concluir(combinados)}>
            Continuar
          </Button>
        </div>
      </div>
    </>
  );
}
