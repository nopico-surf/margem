"use client";

import { Button } from "@/components/ui/Button";
import { TRIBOS, spriteDe } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

// Tela U2-Tribo do Claude Design. Escolhe uma tribo; a escolha fica pra próxima mochila, mas dá pra trocar.
export function TelaTribo() {
  const liberada = useLiberada((p) => p.escolhido);
  const { cenarioId, tribo, setTribo, ir } = usePartida();
  if (!liberada) return <TelaCarregando />;
  return (
    <>
      <header className="mochila-cabeca">
        <h1 className="mochila-titulo">Que som te leva pro rolê?</h1>
        <p className="mochila-instrucao">Escolhe um. Na próxima mochila dá pra mudar.</p>
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <div role="radiogroup" aria-label="Que som te leva pro rolê?" className="mochila-opcoes" data-colunas="3">
          {TRIBOS.map((t) => {
            const marcada = tribo === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={marcada}
                aria-label={`${t.estilo}, ${t.nome}`}
                className="mochila-opcao"
                data-marcada={marcada}
                onClick={() => setTribo(t.id)}
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
        <div className="mochila-acoes">
          <Button
            variante="primary"
            tamanho="medium"
            redondo
            larguraTotal
            disabled={!tribo}
            onClick={() => {
              track("mochila_tribo", { cenario: cenarioId, tribo });
              ir("montagem");
            }}
          >
            Continuar
          </Button>
        </div>
      </div>
    </>
  );
}
