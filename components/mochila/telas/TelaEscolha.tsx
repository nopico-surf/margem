"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { CENARIOS, cenarioAtivo, spriteCenario, spriteDe } from "@/lib/mochila/conteudo";
import { usePartida } from "../Partida";
import { SpriteMochila } from "../SpriteMochila";

export function TelaEscolha() {
  const { escolhido, cenarioId, escolherCenario } = usePartida();
  // Cenário sazonal depende da data de hoje: entra depois da montagem, pra a página não ser
  // pré-renderizada com a data do build.
  const [cenarios, setCenarios] = useState(() => CENARIOS.filter((c) => !c.fim));
  useEffect(() => setCenarios(CENARIOS.filter((c) => cenarioAtivo(c))), []);
  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-linha">
        <h1 className="mochila-titulo">Pra onde você vai?</h1>
        <SpriteMochila className="mochila-sprite-cabeca" src={spriteDe("mochila-aberta")} />
      </header>
      <div className="mochila-painel">
        {/* Quem volta pra cá vê marcado o cenário em que estava; tocar nele de novo não apaga a mochila. */}
        {cenarios.map((c) => {
          const marcado = escolhido && c.id === cenarioId;
          return (
            <button
              key={c.id}
              type="button"
              className="mochila-cenario"
              aria-label={`Escolher ${c.nome}`}
              aria-pressed={marcado}
              data-marcada={marcado}
              onClick={() => escolherCenario(c.id)}
            >
              <span className="mochila-cenario-tile">
                <SpriteMochila src={spriteCenario(c.id)} />
              </span>
              <span className="mochila-cenario-texto">
                <span className="mochila-cenario-nome">{c.nome}</span>
                <span className="mochila-cenario-apoio">{c.apoio}</span>
              </span>
              {c.selo && <Badge className="mochila-selo">{c.selo}</Badge>}
              {marcado && (
                <span className="mochila-item-check" aria-hidden="true">
                  <svg viewBox="0 0 10 10">
                    <path d="M1 5l3 3 5-6" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
