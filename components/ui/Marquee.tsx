// Faixa de frases grandes que andam na horizontal, com espaço de imagem entre elas. Não existe no
// Figma: criada em 09/11/2026 pro "O que você vai aprender" da LP do programa para familiares, a
// partir de referência do fundador. Cada linha anda num sentido. A animação é só CSS; com
// prefers-reduced-motion a faixa some e fica a lista simples, que é também o que o leitor de tela lê.
type MarqueeProps = {
  frases: string[];
  linhas?: number;
  // Fotos entre as frases. Sem elas fica o espaço vazio, até as imagens chegarem.
  imagens?: string[];
};

export function Marquee({ frases, linhas = 3, imagens = [] }: MarqueeProps) {
  return (
    <div className="marquee">
      <ul className="marquee-lista-acessivel">
        {frases.map((frase) => (
          <li key={frase}>{frase}</li>
        ))}
      </ul>
      <div className="marquee-faixas" aria-hidden="true">
        {Array.from({ length: linhas }, (_, linha) => {
          // Cada linha começa numa frase diferente, pra não ficarem alinhadas.
          const ordem = frases.map((_, indice) => frases[(indice + linha) % frases.length]);
          const conteudo = ordem.map((frase, indice) => {
            const imagem = imagens.length ? imagens[(indice + linha) % imagens.length] : null;
            return (
              <span key={indice} className="marquee-item">
                <span className="marquee-frase">{frase}</span>
                {imagem ? (
                  // Decorativa: a frase já diz tudo.
                  <img className="marquee-imagem" src={imagem} alt="" />
                ) : (
                  <span className="marquee-imagem marquee-imagem-vazia" />
                )}
              </span>
            );
          });
          return (
            <div key={linha} className="marquee-linha" data-sentido={linha % 2 === 0 ? "esquerda" : "direita"}>
              {/* Duas cópias seguidas: quando a primeira sai, a segunda está no lugar dela. */}
              <div className="marquee-trilho">
                {conteudo}
                {conteudo}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
