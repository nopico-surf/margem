"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { GlifoVolumeOff, GlifoVolumeUp } from "@/components/icons/glifos";
import { cenarioPorId, spriteCenario, spriteDe } from "@/lib/mochila/conteudo";
import { decodificar } from "@/lib/mochila/codigo";
import { track } from "@/lib/mixpanel";
import { usePartida } from "../Partida";

// Entrada normal (/mochila) ou pelo link de desafio (/mochila/d/[codigo]). Código inválido vira
// entrada normal, sem erro na tela.
export function TelaInicio({ codigo }: { codigo?: string }) {
  const { pronto, som, alternarSom, setDesafio, escolherCenario, ir } = usePartida();
  const desafio = useMemo(() => (codigo ? decodificar(codigo) : null), [codigo]);

  useEffect(() => {
    if (pronto) setDesafio(desafio);
  }, [pronto, desafio, setDesafio]);

  useEffect(() => {
    if (!codigo) return;
    track("mochila_desafio_aberto", {
      valido: desafio !== null,
      cenario: desafio?.cenario ?? null,
      itens_da_outra: desafio?.itens ?? [],
      qtd_combinados_da_outra: desafio?.combinados.length ?? 0,
    });
  }, [codigo, desafio]);

  function comecar() {
    track("mochila_iniciada", { origem: desafio ? "desafio" : "direto" });
    if (desafio) escolherCenario(desafio.cenario);
    else ir("escolha");
  }

  return (
    <div className="mochila-inicio">
      <div className="mochila-inicio-topo">
        <button type="button" className="mochila-som" aria-label={som ? "Desligar som" : "Ligar som"} aria-pressed={som} onClick={alternarSom}>
          {som ? <GlifoVolumeUp size={22} /> : <GlifoVolumeOff size={22} />}
        </button>
      </div>
      <div className="mochila-inicio-meio">
        <img className="mochila-sprite mochila-sprite-capa" src={spriteDe("mochila-fechada")} alt="" />
        <h1 className="mochila-nome-jogo">Mochila do Rolê</h1>
        {desafio ? (
          <div className="mochila-caixa mochila-caixa-forte mochila-convite">
            <span className="mochila-convite-tile">
              <img className="mochila-sprite" src={spriteCenario(desafio.cenario)} alt="" />
            </span>
            <span className="mochila-convite-texto">
              <span className="mochila-convite-titulo">Alguém montou uma mochila {cenarioPorId(desafio.cenario)!.pra} e quer ver a sua.</span>
              <span>Você não vê a mochila dessa pessoa até terminar a sua.</span>
            </span>
          </div>
        ) : (
          <p className="mochila-inicio-convite">
            Antes de sair, uma pergunta: o que vai na sua mochila?
            <br />
            No fim, você descobre seu jeito de reduzir danos.
          </p>
        )}
        <p className="mochila-inicio-apoio">Não tem certo nem errado. Tem a sua escolha e umas ideias de cuidado no fim.</p>
      </div>
      <Button variante="primary" tamanho="medium" redondo larguraTotal onClick={comecar}>
        {desafio ? "Montar minha mochila" : "Começar a montar"}
      </Button>
    </div>
  );
}
