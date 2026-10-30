"use client";

import { Button } from "@/components/ui/Button";
import { JEITOS, QTD_JEITOS, spriteDe } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

// Tela U2-Jeitos do Claude Design. Exatamente dois jeitos: tocar de novo desmarca, e com dois
// marcados um terceiro toque não faz nada até desmarcar um.
export function TelaJeitos() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenarioId, jeitos, setJeitos, ir } = usePartida();
  if (!liberada) return <TelaCarregando />;

  function alternar(id: string) {
    setJeitos((atual) => (atual.includes(id) ? atual.filter((j) => j !== id) : atual.length < QTD_JEITOS ? [...atual, id] : atual));
  }

  return (
    <>
      <header className="mochila-cabeca">
        <h1 className="mochila-titulo">E tem coisa que não cabe em mochila nenhuma</h1>
        <p className="mochila-instrucao">Escolhe dois jeitos que combinam com você.</p>
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <div className="mochila-painel-topo">
          <p role="status" className="mochila-contador mochila-contador-selo">
            {jeitos.length} de {QTD_JEITOS} escolhidos
          </p>
          <div role="group" aria-label="Escolhe dois jeitos" className="mochila-opcoes" data-colunas="2">
            {JEITOS.map((j) => {
              const marcado = jeitos.includes(j.id);
              return (
                <button key={j.id} type="button" aria-pressed={marcado} className="mochila-opcao" data-marcada={marcado} onClick={() => alternar(j.id)}>
                  <span className="mochila-opcao-tile">
                    <img className="mochila-sprite" src={spriteDe(`jeito-${j.id}`)} alt="" />
                  </span>
                  <span className="mochila-opcao-nome">{j.nome}</span>
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
        </div>
        <div className="mochila-acoes">
          <Button
            variante="primary"
            tamanho="medium"
            redondo
            larguraTotal
            disabled={jeitos.length < QTD_JEITOS}
            onClick={() => {
              track("mochila_jeitos", { cenario: cenarioId, jeitos: JEITOS.filter((j) => jeitos.includes(j.id)).map((j) => j.nome) });
              ir("resultado");
            }}
          >
            Ver minha mochila
          </Button>
        </div>
      </div>
    </>
  );
}
