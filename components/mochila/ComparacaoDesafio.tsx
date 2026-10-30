"use client";

import { Button } from "@/components/ui/Button";
import { ITENS, spriteDe } from "@/lib/mochila/conteudo";

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
      <p className="mochila-titulo-bloco">
        {iguais.length === 0 ? "As mochilas saíram bem diferentes. Cada rolê tem seu jeito." : iguais.length === 1 ? "Vocês levaram 1 coisa igual." : `Vocês levaram ${iguais.length} coisas iguais.`}
      </p>
      {iguais.map((id) => (
        <p key={id} className="mochila-comparacao-linha">
          <span className="mochila-comparacao-tile">
            <img className="mochila-sprite mochila-sprite-pequeno" src={spriteDe(id)} alt="" data-espacos={ITENS[id].espacos} />
          </span>
          <span>{ITENS[id].curto}.</span>
        </p>
      ))}
      {soMinha.map((id) => (
        <p key={id} className="mochila-comparacao-linha">
          <span className="mochila-comparacao-tile" data-destaque="true">
            <img className="mochila-sprite mochila-sprite-pequeno" src={spriteDe(id)} alt="" data-espacos={ITENS[id].espacos} />
          </span>
          <span>Só você levou: {ITENS[id].curto.toLowerCase()}.</span>
        </p>
      ))}
      {soOutra.map((id) => (
        <p key={id} className="mochila-comparacao-linha">
          <span className="mochila-comparacao-tile">
            <img className="mochila-sprite mochila-sprite-pequeno" src={spriteDe(id)} alt="" data-espacos={ITENS[id].espacos} />
          </span>
          <span>Só a outra mochila levou: {ITENS[id].curto.toLowerCase()}.</span>
        </p>
      ))}
      <Button variante="secondary" tamanho="medium" redondo larguraTotal onClick={aoDevolver}>
        Devolver o desafio
      </Button>
    </section>
  );
}
