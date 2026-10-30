"use client";

import { Button } from "@/components/ui/Button";
import { GlifoLink, GlifoVisibilityOff, GlifoWhatsapp } from "@/components/icons/glifos";
import { ENDERECO_CURTO, spriteDe } from "@/lib/mochila/conteudo";
import { copiar, link, sistemaAvisa } from "@/lib/mochila/acoes";
import { track } from "@/lib/mixpanel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaDesafiar() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenario, cenarioId, codigoDesafio, visiveis, nivel, setAviso } = usePartida();
  if (!liberada) return <TelaCarregando />;
  const doDesafio = { cenario: cenarioId, nivel, itens_no_desafio: visiveis };
  return (
    <>
      <header className="mochila-cabeca">
        <h1 className="mochila-titulo">Quem você quer desafiar?</h1>
        <p className="mochila-instrucao">Seu amigo monta a mochila pro mesmo rolê, sem ver a sua. No fim, vocês comparam.</p>
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <div className="mochila-painel-topo">
          <div className="mochila-caixa mochila-link-previa">
            <div className="mochila-link-capa">
              <img className="mochila-sprite" src={spriteDe("mochila-fechada")} alt="" />
            </div>
            <div className="mochila-link-texto">
              <span className="mochila-revela-nome">Monta sua mochila pro rolê</span>
              <span>Alguém já montou a dela. Vê quantas coisas vocês levam igual.</span>
              <span className="mochila-link-endereco">{ENDERECO_CURTO}</span>
            </div>
          </div>
          <p className="mochila-escondidos">
            <GlifoVisibilityOff size={18} />
            <span>O desafio usa o mesmo nível do card. Itens escondidos ficam escondidos.</span>
          </p>
        </div>
        <div className="mochila-acoes">
          <Button
            variante="primary"
            tamanho="medium"
            redondo
            larguraTotal
            href={`https://wa.me/?text=${encodeURIComponent(
              `Montei minha mochila ${cenario.pra}. Monta a sua e vê quantas coisas a gente levou igual: ${link(`/d/${codigoDesafio}`, "whatsapp", cenarioId)}`,
            )}`}
            alvoExterno
            onClick={() => track("mochila_desafio_enviado", { ...doDesafio, canal: "whatsapp" })}
          >
            <GlifoWhatsapp size={20} />
            <span>Mandar desafio no WhatsApp</span>
          </Button>
          <Button
            variante="secondary"
            tamanho="medium"
            redondo
            larguraTotal
            onClick={async () => {
              const copiou = await copiar(link(`/d/${codigoDesafio}`, "copia", cenarioId));
              track("mochila_desafio_enviado", { ...doDesafio, canal: "copia", copiou });
              if (copiou && !sistemaAvisa()) setAviso("Link copiado.");
            }}
          >
            <GlifoLink size={20} />
            <span>Copiar link do desafio</span>
          </Button>
        </div>
      </div>
    </>
  );
}
