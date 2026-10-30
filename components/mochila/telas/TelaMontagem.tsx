"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ActionRow } from "@/components/conversa/ActionRow";
import { CAPACIDADE, spriteDe } from "@/lib/mochila/conteudo";
import { cabe, espacosUsados } from "@/lib/mochila/encaixe";
import { MochilaGrade } from "../MochilaGrade";
import { ItemPrateleira } from "../ItemPrateleira";
import { ROTAS, useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaMontagem() {
  const liberada = useLiberada((p) => p.escolhido);
  const { cenario, itens, setItens, bip, ir } = usePartida();
  const router = useRouter();
  const [naoCabe, setNaoCabe] = useState<string | null>(null);
  const [fechando, setFechando] = useState<"aberta" | "fechada" | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  if (!liberada) return <TelaCarregando />;

  function fechar() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ir("revelacao");
      return;
    }
    router.prefetch(ROTAS.revelacao);
    setFechando("aberta");
    timers.current.push(
      window.setTimeout(() => {
        setFechando("fechada");
        bip(220);
      }, 550),
      window.setTimeout(() => ir("revelacao"), 1100),
    );
  }

  if (fechando) {
    return (
      <div className="mochila-fechando" data-fase={fechando} aria-hidden="true">
        <img className="mochila-sprite mochila-fechando-aberta" src={spriteDe("mochila-aberta")} alt="" />
        <img className="mochila-sprite mochila-fechando-fechada" src={spriteDe("mochila-fechada")} alt="" />
      </div>
    );
  }

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
          <Button variante="primary" tamanho="medium" redondo larguraTotal disabled={itens.length === 0} onClick={fechar}>
            Fechar a mochila
          </Button>
        </div>
      </div>
    </>
  );
}
