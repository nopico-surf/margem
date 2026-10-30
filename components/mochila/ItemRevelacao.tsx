import { ITENS, spriteDe } from "@/lib/mochila/conteudo";
import { SpriteMochila } from "./SpriteMochila";

// Componente novo (sem equivalente no Figma): item da revelação, tela B-Revelacao do Claude Design.
// "atraso" escalona a entrada; com prefers-reduced-motion aparece direto (no CSS).
export function ItemRevelacao({ id, atraso = 0 }: { id: string; atraso?: number }) {
  const item = ITENS[id];
  return (
    <li className="mochila-revela" data-espacos={item.espacos} style={{ animationDelay: `${atraso}s` }}>
      <span className="mochila-revela-tile">
        <SpriteMochila src={spriteDe(id)} data-espacos={item.espacos} />
      </span>
      <span className="mochila-revela-texto">
        <span className="mochila-revela-nome">{item.nome}</span>
        <span>{item.revelacao}</span>
      </span>
    </li>
  );
}
