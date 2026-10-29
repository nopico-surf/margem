// Componente novo (sem equivalente no Figma nem no Claude Design): a tela da mochila enquanto a
// partida ainda não foi lida do sessionStorage (recarregar, link direto) e no link de desafio. Mesma
// cabeça e mesmo painel com degrau das telas prontas, com os ossos de `.figma-skeleton` no lugar do
// título, do sprite, das linhas e do botão.
export function TelaCarregando() {
  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-linha" aria-hidden="true">
        <span className="mochila-osso-titulo">
          <span className="figma-skeleton mochila-osso" />
          <span className="figma-skeleton mochila-osso" />
        </span>
        <span className="figma-skeleton mochila-osso mochila-osso-sprite" />
      </header>
      <div className="mochila-painel" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="figma-skeleton mochila-osso mochila-osso-linha" />
        ))}
        <span className="figma-skeleton mochila-osso mochila-osso-botao" />
      </div>
    </>
  );
}
