"use client";

import { ITENS, spriteDe } from "@/lib/mochila/conteudo";

// Componente novo (sem equivalente no Figma): item pixel da prateleira, tela B-Montagem do Claude
// Design. Escolhido ganha o fundo de destaque e o check (a cor nunca vai sozinha). "naoCabe" treme
// e fica tracejado por um instante.
export function ItemPrateleira({
  id,
  naMochila,
  naoCabe = false,
  aoTocar,
}: {
  id: string;
  naMochila: boolean;
  naoCabe?: boolean;
  aoTocar: (id: string) => void;
}) {
  const item = ITENS[id];
  const rotulo = naMochila
    ? `${item.nome}, na mochila. Toque pra tirar.`
    : `${item.nome}, ocupa ${item.espacos} ${item.espacos === 1 ? "espaço" : "espaços"}. Toque pra colocar na mochila.`;
  return (
    <button
      type="button"
      className="mochila-item"
      data-espacos={item.espacos}
      data-na-mochila={naMochila}
      data-nao-cabe={naoCabe}
      aria-pressed={naMochila}
      aria-label={rotulo}
      onClick={() => aoTocar(id)}
    >
      <img className="mochila-sprite" src={spriteDe(id)} alt="" data-espacos={item.espacos} />
      <span>{item.curto}</span>
      {naMochila && (
        <span className="mochila-item-check" aria-hidden="true">
          <svg viewBox="0 0 10 10">
            <path d="M1 5l3 3 5-6" />
          </svg>
        </span>
      )}
    </button>
  );
}
