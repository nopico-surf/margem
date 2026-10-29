import type { Formato } from "@/lib/mochila/card";

// Componente novo (sem equivalente no Figma): prévia do card compartilhável, telas B-Compartilhar
// e B-Confirmacao do Claude Design. Mostra exatamente a imagem que vai ser compartilhada (o PNG
// gerado no canvas), reduzida. Sem imagem ainda, a moldura fica com o osso do skeleton.
export function PreviaCard({ src, formato, alt }: { src: string | null; formato: Formato; alt: string }) {
  return (
    <div className="mochila-previa" data-formato={formato} aria-busy={!src}>
      {src ? <img src={src} alt={alt} /> : <span className="figma-skeleton mochila-osso mochila-osso-previa" aria-hidden="true" />}
    </div>
  );
}
