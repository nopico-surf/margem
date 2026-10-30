"use client";

import { TRIBOS, spriteDe } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

// Tela U2-Tribo do Claude Design. Escolhe uma tribo; a escolha fica pra próxima mochila, mas dá pra trocar.
export function TelaTribo() {
  const liberada = useLiberada((p) => p.escolhido);
  const { cenarioId, setTribo, ir } = usePartida();
  if (!liberada) return <TelaCarregando />;
  return (
    <>
      <header className="mochila-cabeca">
        <h1 className="mochila-titulo">Que som te leva pro rolê?</h1>
        <p className="mochila-instrucao">Toca no que mais combina com o seu rolê.</p>
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <div className="mochila-opcoes" data-colunas="3">
          {TRIBOS.map((t) => {
            return (
              <button
                key={t.id}
                type="button"
                aria-label={`${t.estilo}, ${t.nome}`}
                className="mochila-opcao"
                onClick={() => {
                  setTribo(t.id);
                  track("mochila_tribo", { cenario: cenarioId, tribo: t.id });
                  ir("montagem");
                }}
              >
                <span className="mochila-opcao-tile">
                  <img className="mochila-sprite" src={spriteDe(`tribo-${t.id}`)} alt="" />
                </span>
                <span className="mochila-opcao-nome">{t.estilo}</span>
                <span className="mochila-opcao-apoio">{t.nome}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
