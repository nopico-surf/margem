import { Button } from "@/components/ui/Button";

// Figma: "Frame 217" na home (Experiência do produto, 1595:10754 no mobile, 1595:10862 no desktop).
// Mesmo bloco da cannabis (classes de .bloco-cannabis em home.css), com o quadriculado no lugar da
// foto e a mochila no lugar do selo. A partir do tablet a foto vem antes do texto.
export function BlocoMochila() {
  return (
    <section className="bloco-cannabis bloco-mochila" aria-labelledby="bloco-mochila-titulo">
      <div className="bloco-cannabis-texto">
        <div className="bloco-cannabis-copy">
          <div className="bloco-cannabis-cabecalho">
            <h2 id="bloco-mochila-titulo">Mochila do rolê</h2>
            <p>
              Antes de sair, uma pergunta: o que vai na sua mochila? No fim,{" "}
              <strong>você descobre seu jeito de reduzir danos</strong>
            </p>
          </div>
          <Button tamanho="small" href="/mochila/cenarios">
            Começar a montar
          </Button>
        </div>
      </div>
      <div className="bloco-cannabis-foto bloco-mochila-fundo">
        <img className="bloco-mochila-sprite" src="/mochila/mochila-fechada.svg" alt="" />
      </div>
    </section>
  );
}
