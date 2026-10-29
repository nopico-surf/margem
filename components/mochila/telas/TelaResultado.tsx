"use client";

import { Button } from "@/components/ui/Button";
import { GlifoContentCopy, GlifoSaveAlt } from "@/components/icons/glifos";
import { ITENS, spriteDe } from "@/lib/mochila/conteudo";
import { ficouDeFora } from "@/lib/mochila/rotulo";
import { baixar, copiar } from "@/lib/mochila/acoes";
import { checklistTexto, desenharChecklist, paraBlob } from "@/lib/mochila/card";
import { MochilaGrade } from "../MochilaGrade";
import { ComparacaoDesafio } from "../ComparacaoDesafio";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaResultado() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenarioId, itens, rotulo, desafio, linhasChecklist, fontes, setAviso, ir, recomecar } = usePartida();
  if (!liberada) return <TelaCarregando />;

  async function salvarChecklist() {
    setAviso(null);
    try {
      const canvas = await desenharChecklist(linhasChecklist, fontes());
      baixar(await paraBlob(canvas), "checklist-do-role.png");
      setAviso("Checklist baixado.");
    } catch {
      setAviso("Não deu pra gerar a imagem agora.");
    }
  }

  async function copiarChecklist() {
    setAviso(null);
    if (await copiar(checklistTexto(linhasChecklist))) setAviso("Checklist copiado. É só colar no grupo.");
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
        {desafio && <ComparacaoDesafio minha={itens} outra={desafio.itens} aoDevolver={() => ir("desafiar")} />}

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
          <Button variante="primary" tamanho="medium" redondo larguraTotal onClick={() => ir("compartilhar")}>
            Compartilhar minha mochila
          </Button>
          <Button variante="secondary" tamanho="medium" redondo larguraTotal onClick={() => ir("desafiar")}>
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
