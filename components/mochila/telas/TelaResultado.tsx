"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { GlifoContentCopy, GlifoSaveAlt } from "@/components/icons/glifos";
import { ITENS, spriteDe } from "@/lib/mochila/conteudo";
import { ficouDeFora } from "@/lib/mochila/rotulo";
import { baixar, copiar } from "@/lib/mochila/acoes";
import { checklistTexto, desenharChecklist, paraBlob } from "@/lib/mochila/card";
import { track } from "@/lib/mixpanel";
import { MochilaGrade } from "../MochilaGrade";
import { ComparacaoDesafio } from "../ComparacaoDesafio";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaResultado() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenarioId, itens, combinados, rotulo, desafio, linhasChecklist, fontes, setAviso, ir, recomecar } = usePartida();

  // Uma vez por chegada na tela (voltar do compartilhar conta de novo).
  useEffect(() => {
    if (!liberada) return;
    track("mochila_resultado_visto", {
      cenario: cenarioId,
      rotulo: rotulo.nome,
      itens,
      qtd_itens: itens.length,
      qtd_combinados: combinados.length,
      ficou_de_fora: ficouDeFora(cenarioId, itens),
      com_desafio: desafio !== null,
      iguais_ao_desafio: desafio ? itens.filter((id) => desafio.itens.includes(id)).length : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liberada]);

  if (!liberada) return <TelaCarregando />;

  async function salvarChecklist() {
    setAviso(null);
    try {
      const canvas = await desenharChecklist(linhasChecklist, fontes());
      baixar(await paraBlob(canvas), "checklist-do-role.png");
      track("mochila_checklist_baixado", { cenario: cenarioId });
      setAviso("Checklist baixado.");
    } catch {
      track("mochila_checklist_falhou", { cenario: cenarioId });
      setAviso("Não deu pra gerar a imagem agora.");
    }
  }

  async function copiarChecklist() {
    setAviso(null);
    const copiou = await copiar(checklistTexto(linhasChecklist));
    track("mochila_checklist_copiado", { cenario: cenarioId, copiou });
    if (copiou) setAviso("Checklist copiado. É só colar no grupo.");
  }

  function irPara(destino: "compartilhar" | "desafiar", evento: string) {
    track(evento, { cenario: cenarioId });
    ir(destino);
  }

  const fora = ficouDeFora(cenarioId, itens);
  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-resultado">
        <h1 className="mochila-titulo">Sua mochila saiu assim:</h1>
        <MochilaGrade itens={itens} />
        <div className="mochila-rotulo">
          <p>{rotulo.nome}</p>
        </div>
        <p className="mochila-rotulo-frase">{rotulo.frase}</p>
      </header>
      <div className="mochila-painel mochila-painel-resultado">
        {desafio && <ComparacaoDesafio minha={itens} outra={desafio.itens} aoDevolver={() => irPara("desafiar", "mochila_desafio_devolvido")} />}

        {fora && (
          <section className="mochila-caixa">
            <h2 className="mochila-abre">Uma coisa que ficou de fora:</h2>
            <div className="mochila-fora">
              <span className="mochila-fora-tile">
                <img className="mochila-sprite" src={spriteDe(fora)} alt="" data-espacos={ITENS[fora].espacos} />
              </span>
              <span className="mochila-revela-texto">
                <span className="mochila-revela-nome">{ITENS[fora].curto}</span>
                <span>{ITENS[fora].fora}</span>
              </span>
            </div>
          </section>
        )}

        <section className="mochila-secao">
          <h2 className="mochila-titulo-bloco">Pra levar no bolso do rolê:</h2>
          <ul className="mochila-checklist">
            {linhasChecklist.map((l) => (
              <li key={l}>
                <span className="mochila-check" aria-hidden="true">
                  <svg viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-6" />
                  </svg>
                </span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <div className="mochila-acoes mochila-checklist-acoes">
            <p className="label-small-medium mochila-checklist-rotulo">Checklist:</p>
            <div className="mochila-acoes-lado">
              <Button variante="transparent" tamanho="small" redondo onClick={salvarChecklist}>
                <GlifoSaveAlt size={18} />
                <span aria-hidden="true">Baixar</span>
                <span className="mochila-so-leitor">Baixar checklist como imagem</span>
              </Button>
              <Button variante="transparent" tamanho="small" redondo onClick={copiarChecklist}>
                <GlifoContentCopy size={18} />
                <span aria-hidden="true">Copiar</span>
                <span className="mochila-so-leitor">Copiar checklist pro grupo</span>
              </Button>
            </div>
          </div>
        </section>

        <div className="mochila-acoes">
          <Button variante="primary" tamanho="medium" redondo larguraTotal onClick={() => irPara("compartilhar", "mochila_compartilhar_clicado")}>
            Compartilhar minha mochila
          </Button>
          <Button variante="secondary" tamanho="medium" redondo larguraTotal onClick={() => irPara("desafiar", "mochila_desafiar_clicado")}>
            Desafiar um amigo
          </Button>
          <Button variante="transparent" tamanho="medium" redondo larguraTotal onClick={recomecar}>
            Montar outra mochila
          </Button>
        </div>
      </div>
    </>
  );
}
