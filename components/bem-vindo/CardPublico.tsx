import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

// Figma: no arquivo ainda se chama "Frame 149", nome auto-gerado. Nome proposto: `card-publico`.
// Foto em cima e título com uma linha embaixo.
type CardPublicoProps = {
  // Sem foto, o espaço dela fica com o fundo neutro (textos do blog cuja imagem ainda não chegou).
  foto?: string;
  // Onde o corte da foto se ancora, no formato do object-position.
  posicaoDaFoto?: string;
  sizesDaFoto?: string;
  titulo: string;
  tituloComo?: "h2" | "h3";
  // Linha de data depois do texto (cards do /blog).
  data?: ReactNode;
  texto: string;
  // Com href, o card inteiro vira link (cards do /blog).
  href?: string;
  // Tira a foto do lazy. Só no primeiro card da lista do /blog, que é o LCP da tela: sem isso o
  // navegador baixa a imagem que já está na dobra com prioridade baixa.
  prioridade?: boolean;
};

export function CardPublico({
  foto,
  posicaoDaFoto = "center",
  sizesDaFoto = "(min-width: 48em) 34vw, 45vw",
  titulo,
  tituloComo: Titulo = "h3",
  data,
  texto,
  href,
  prioridade = false,
}: CardPublicoProps) {
  const conteudo = (
    <>
      <div className="card-publico-foto">
        {foto && (
          <Image src={foto} alt="" fill priority={prioridade} sizes={sizesDaFoto} style={{ objectPosition: posicaoDaFoto }} />
        )}
      </div>
      <div className="card-publico-texto">
        <Titulo className="card-publico-titulo">{titulo}</Titulo>
        <p className="card-publico-descricao">{texto}</p>
        {data && <p className="card-publico-data">{data}</p>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link className="card-publico card-publico-link" href={href}>
        {conteudo}
      </Link>
    );
  }

  return <div className="card-publico">{conteudo}</div>;
}
