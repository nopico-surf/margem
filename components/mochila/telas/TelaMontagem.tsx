"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ActionRow } from "@/components/conversa/ActionRow";
import { CAPACIDADE } from "@/lib/mochila/conteudo";
import { cabe, espacosUsados } from "@/lib/mochila/encaixe";
import { MochilaGrade } from "../MochilaGrade";
import { ItemPrateleira } from "../ItemPrateleira";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaMontagem() {
  const liberada = useLiberada((p) => p.escolhido);
  const { cenario, itens, setItens, bip, ir } = usePartida();
  const [naoCabe, setNaoCabe] = useState<string | null>(null);
  if (!liberada) return <TelaCarregando />;

  function tocarItem(id: string) {
    if (itens.includes(id)) {
      setItens(itens.filter((i) => i !== id));
      setNaoCabe(null);
      bip(330);
      return;
    }
    if (!cabe(itens, id)) {
      setNaoCabe(id);
      bip(140);
      return;
    }
    setItens([...itens, id]);
    setNaoCabe(null);
    bip(660);
  }

  const cheia = espacosUsados(itens) >= CAPACIDADE;
  const mensagem = naoCabe ? "Isso não cabe mais. Tire alguma coisa pra abrir espaço." : cheia ? "Mochila cheia. Dá pra fechar ou trocar alguma coisa." : null;
  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-montagem">
        <h1 className="mochila-titulo">Mochila do Rolê</h1>
        <MochilaGrade itens={itens} contador aoTirar={tocarItem} />
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <div className="mochila-painel-topo">
          {mensagem && (
            <p role="status" className="mochila-aviso" data-tipo={naoCabe ? "nao-cabe" : "cheia"}>
              {mensagem}
            </p>
          )}
          <ActionRow className="mochila-prateleira">
            <div className="mochila-prateleira-grade">
              {cenario.itens.map((id) => (
                <ItemPrateleira key={id} id={id} naMochila={itens.includes(id)} naoCabe={naoCabe === id} aoTocar={tocarItem} />
              ))}
            </div>
          </ActionRow>
        </div>
        <div className="mochila-acoes">
          <Button variante="primary" tamanho="medium" redondo larguraTotal disabled={itens.length === 0} onClick={() => ir("revelacao")}>
            Fechar a mochila
          </Button>
          {itens.length === 0 && <p className="mochila-apoio-centro">Coloque pelo menos um item pra fechar.</p>}
        </div>
      </div>
    </>
  );
}
