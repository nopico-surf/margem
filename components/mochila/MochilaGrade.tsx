"use client";

import { CAPACIDADE, ITENS, spriteDe } from "@/lib/mochila/conteudo";
import { encaixar, espacosUsados, fileiras as emFileiras } from "@/lib/mochila/encaixe";
import { SpriteMochila } from "./SpriteMochila";

// Componente novo (sem equivalente no Figma): a grade 3x3 da mochila, telas B-Montagem e
// B-Resultado do Claude Design. Na montagem tem o contador e cada item sai com um toque. Com
// `fileiras`, sai igual à mochila do card: fileiras que fecham, com o nome embaixo, sem vazio.
export function MochilaGrade({
  itens,
  contador = false,
  aoTirar,
  fileiras = false,
}: {
  itens: string[];
  contador?: boolean;
  aoTirar?: (id: string) => void;
  fileiras?: boolean;
}) {
  if (fileiras) {
    return (
      <div className="mochila-moldura">
        <div className="mochila-miolo">
          <div className="mochila-fileiras">
            {emFileiras(itens).map((row) => (
              <div key={row[0].id} className="mochila-fileira">
                {row.map((b) => (
                  <div key={b.id} className="mochila-celula mochila-celula-nome" style={{ flexGrow: b.espacos }} role="img" aria-label={ITENS[b.id].nome}>
                    <SpriteMochila src={spriteDe(b.id)} data-espacos={b.espacos} />
                    <span aria-hidden="true">{ITENS[b.id].curto}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const posicoes = encaixar(itens) ?? [];
  const usados = espacosUsados(itens);
  const vazias = Array.from({ length: CAPACIDADE }, (_, i) => i).filter(
    (i) => !posicoes.some((p) => p.linha === Math.floor(i / 3) && (p.coluna === i % 3 || (p.espacos === 2 && p.coluna + 1 === i % 3))),
  );

  return (
    <div className="mochila-moldura">
      <div className="mochila-miolo">
        {contador && (
          <div className="mochila-contador">
            <span aria-hidden="true">{usados} de {CAPACIDADE} espaços</span>
            <span className="mochila-so-leitor" role="status">
              {usados} de {CAPACIDADE} espaços ocupados.
            </span>
          </div>
        )}
        <div className="mochila-grade">
          {posicoes.map((p) => {
            const item = ITENS[p.id];
            const estilo = { gridRow: p.linha + 1, gridColumn: `${p.coluna + 1} / span ${p.espacos}` };
            const imagem = <SpriteMochila src={spriteDe(p.id)} data-espacos={p.espacos} />;
            return aoTirar ? (
              <button
                key={p.id}
                type="button"
                className="mochila-celula"
                style={estilo}
                aria-label={`${item.nome}, na mochila. Toque pra tirar.`}
                onClick={() => aoTirar(p.id)}
              >
                {imagem}
              </button>
            ) : (
              <div key={p.id} className="mochila-celula" style={estilo} role="img" aria-label={item.nome}>
                {imagem}
              </div>
            );
          })}
          {vazias.map((i) => (
            <div key={`v${i}`} className="mochila-celula-vazia" style={{ gridRow: Math.floor(i / 3) + 1, gridColumn: (i % 3) + 1 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
