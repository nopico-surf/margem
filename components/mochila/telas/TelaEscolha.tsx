"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { CENARIOS, cenarioAtivo, spriteCenario, spriteDe } from "@/lib/mochila/conteudo";
import { usePartida } from "../Partida";

export function TelaEscolha() {
  const { escolherCenario } = usePartida();
  // Cenário sazonal depende da data de hoje: entra depois da montagem, pra a página não ser
  // pré-renderizada com a data do build.
  const [cenarios, setCenarios] = useState(() => CENARIOS.filter((c) => !c.fim));
  useEffect(() => setCenarios(CENARIOS.filter((c) => cenarioAtivo(c))), []);
  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-linha">
        <h1 className="mochila-titulo">Pra onde você vai?</h1>
        <img className="mochila-sprite mochila-sprite-cabeca" src={spriteDe("mochila-fechada")} alt="" />
      </header>
      <div className="mochila-painel">
        {cenarios.map((c) => (
          <button key={c.id} type="button" className="mochila-cenario" aria-label={`Escolher ${c.nome}`} onClick={() => escolherCenario(c.id)}>
            <span className="mochila-cenario-tile">
              <img className="mochila-sprite" src={spriteCenario(c.id)} alt="" />
            </span>
            <span className="mochila-cenario-texto">
              <span className="mochila-cenario-nome">{c.nome}</span>
              <span className="mochila-cenario-apoio">{c.apoio}</span>
            </span>
            {c.selo && <Badge className="mochila-selo">{c.selo}</Badge>}
          </button>
        ))}
      </div>
    </>
  );
}
