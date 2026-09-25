import Image from "next/image";

// Figma: no arquivo ainda se chama "Frame 149", nome auto-gerado. Nome proposto: `card-publico`.
// Foto em cima e título com uma linha embaixo.
type CardPublicoProps = {
  foto: string;
  // Onde o corte da foto se ancora, no formato do object-position.
  posicaoDaFoto?: string;
  titulo: string;
  texto: string;
};

export function CardPublico({ foto, posicaoDaFoto = "center", titulo, texto }: CardPublicoProps) {
  return (
    <div className="card-publico">
      <div className="card-publico-foto">
        <Image src={foto} alt="" fill sizes="(min-width: 48em) 34vw, 45vw" style={{ objectPosition: posicaoDaFoto }} />
      </div>
      <div className="card-publico-texto">
        <h3 className="card-publico-titulo">{titulo}</h3>
        <p className="card-publico-descricao">{texto}</p>
      </div>
    </div>
  );
}
