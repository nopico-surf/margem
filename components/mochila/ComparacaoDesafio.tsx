"use client";

import { Button } from "@/components/ui/Button";
import { ITENS, spriteDe } from "@/lib/mochila/conteudo";
import { SpriteMochila } from "./SpriteMochila";

function Linhas({ ids }: { ids: string[] }) {
  return ids.map((id) => (
    <p key={id} className="mochila-comparacao-linha">
      <span className="mochila-comparacao-tile">
        <SpriteMochila className="mochila-sprite-pequeno" src={spriteDe(id)} data-espacos={ITENS[id].espacos} />
      </span>
      <span>{ITENS[id].curto}</span>
    </p>
  ));
}

// Componente novo (sem equivalente no Figma): bloco de comparação do desafio, tela
// B-Resultado-Comparacao do Claude Design. Sem vencedor e sem placar. "outra" já vem filtrada pelo
// nível que a outra pessoa escolheu: item escondido nunca chega aqui.
export function ComparacaoDesafio({
  minha,
  outra,
  aoDevolver,
}: {
  minha: string[];
  outra: string[];
  aoDevolver: () => void;
}) {
  const iguais = minha.filter((id) => outra.includes(id));
  const soMinha = minha.filter((id) => !outra.includes(id));
  const soOutra = outra.filter((id) => !minha.includes(id));

  return (
    <section className="mochila-caixa mochila-comparacao" aria-label="Comparação do desafio">
      <div className="mochila-comparacao-grupo">
        <p className="mochila-titulo-bloco">
          {iguais.length === 0 ? "As mochilas saíram bem diferentes. Cada rolê tem seu jeito." : iguais.length === 1 ? "Vocês levaram 1 coisa igual." : `Vocês levaram ${iguais.length} coisas iguais.`}
        </p>
        <Linhas ids={iguais} />
      </div>
      {soMinha.length > 0 && (
        <div className="mochila-comparacao-grupo">
          <p className="mochila-abre">Só você levou:</p>
          <Linhas ids={soMinha} />
        </div>
      )}
      {soOutra.length > 0 && (
        <div className="mochila-comparacao-grupo">
          <p className="mochila-abre">Só a outra mochila levou:</p>
          <Linhas ids={soOutra} />
        </div>
      )}
      <Button variante="secondary" tamanho="medium" redondo larguraTotal onClick={aoDevolver}>
        Devolver o desafio
      </Button>
    </section>
  );
}
