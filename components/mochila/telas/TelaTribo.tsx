"use client";

import { TRIBOS, spriteDe } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

// Tela U2-Tribo do Claude Design. Toca e já segue. Mochila nova começa sem tribo; quem volta pra cá vê
// marcada a que escolheu, e tocar nela de novo segue com a mochila como estava.
export function TelaTribo() {
  const liberada = useLiberada((p) => p.escolhido);
  const { cenarioId, tribo, setTribo, ir } = usePartida();
  if (!liberada) return <TelaCarregando />;
  return (
    <>
      <header className="mochila-cabeca">
        <div className="mochila-cabeca-linha">
          <h1 className="mochila-titulo">Que som te leva pro rolê?</h1>
          <img className="mochila-sprite mochila-sprite-cabeca" src={spriteDe("mochila-aberta")} alt="" />
        </div>
        <p className="mochila-instrucao">Toca no que mais combina com o seu rolê.</p>
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <div className="mochila-opcoes" data-colunas="3">
          {TRIBOS.map((t) => {
            const marcada = tribo === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-label={`${t.estilo}, ${t.nome}`}
                aria-pressed={marcada}
                className="mochila-opcao"
                data-marcada={marcada}
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
                {marcada && (
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
      </div>
    </>
  );
}
