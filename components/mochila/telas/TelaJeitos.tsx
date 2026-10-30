"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { JEITOS, QTD_JEITOS, spriteDe } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

// Tela U2-Jeitos do Claude Design. Exatamente dois jeitos: tocar de novo desmarca, e com dois
// marcados um terceiro toque não faz nada até desmarcar um.
export function TelaJeitos() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenarioId, jeitos, setJeitos, bip, ir } = usePartida();
  const [naoCabe, setNaoCabe] = useState<string | null>(null);
  if (!liberada) return <TelaCarregando />;

  function alternar(id: string) {
    if (!jeitos.includes(id) && jeitos.length >= QTD_JEITOS) {
      track("mochila_jeito_nao_coube", { cenario: cenarioId, jeito: id });
      setNaoCabe(id);
      bip(140);
      return;
    }
    setNaoCabe(null);
    setJeitos((atual) => (atual.includes(id) ? atual.filter((j) => j !== id) : [...atual, id]));
  }

  return (
    <>
      <header className="mochila-cabeca">
        <div className="mochila-cabeca-linha">
          <h1 className="mochila-titulo">E qual é o seu jeito no rolê?</h1>
          <img className="mochila-sprite mochila-sprite-cabeca" src={spriteDe("mochila-fechada")} alt="" />
        </div>
        <p className="mochila-instrucao">Escolhe dois jeitos que combinam com você.</p>
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <div className="mochila-painel-topo">
          <p role="status" className="mochila-contador mochila-contador-selo">
            {jeitos.length} de {QTD_JEITOS} escolhidos
          </p>
          {jeitos.length >= QTD_JEITOS && (
            <p role="status" className="mochila-aviso" data-tipo={naoCabe ? "nao-cabe" : "cheia"}>
              {naoCabe ? "Já são dois jeitos. Desmarque um pra escolher outro." : "Dois jeitos escolhidos. Dá pra seguir ou trocar algum."}
            </p>
          )}
          <div role="group" aria-label="Escolhe dois jeitos" className="mochila-opcoes" data-colunas="2">
            {JEITOS.map((j) => {
              const marcado = jeitos.includes(j.id);
              return (
                <button key={j.id} type="button" aria-pressed={marcado} className="mochila-opcao" data-marcada={marcado} data-nao-cabe={naoCabe === j.id} onClick={() => alternar(j.id)}>
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
