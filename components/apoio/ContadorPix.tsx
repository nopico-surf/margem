// Figma: Experiência do produto, faixa do topo da tela do Pix (1538:39329). Sem componente no Figma.
// Faixa brand-secondary-400 com o texto e os minutos e segundos em duas caixinhas brancas.
export function ContadorPix({ segundos }: { segundos: number }) {
  const restantes = Math.max(0, segundos);
  const minutos = String(Math.floor(restantes / 60)).padStart(2, "0");
  const segundosDoMinuto = String(restantes % 60).padStart(2, "0");

  return (
    <div className="contador-pix" role="timer" aria-label={`Seu código vence em ${minutos} minutos e ${segundosDoMinuto} segundos`}>
      <p>Seu código vence em minutos!</p>
      <div className="contador-pix-tempo" aria-hidden="true">
        <span>{minutos}</span>
        <span className="contador-pix-separador">:</span>
        <span>{segundosDoMinuto}</span>
      </div>
    </div>
  );
}
