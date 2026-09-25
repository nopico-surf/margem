// Figma: ainda não existe como componente. Nome proposto: `stepper`, com a propriedade
// `orientation` = vertical, horizontal. No código a orientação vem da largura da tela (vertical no
// mobile, horizontal a partir de 768 pixels), então é uma propriedade só de CSS.
//
// O último passo não tem linha própria: a linha dele sai do número e segue para os cards, e quem
// desenha o ramo de cada card é o `.passos-ramo` em bem-vindo.css.
type StepperProps = {
  numero: number;
  titulo: string;
  texto: string;
  ultimo?: boolean;
};

export function Stepper({ numero, titulo, texto, ultimo = false }: StepperProps) {
  return (
    <div className="stepper" data-ultimo={ultimo ? "true" : undefined}>
      <div className="stepper-marcador">
        <span className="stepper-numero">{numero}</span>
        <span className="stepper-linha" aria-hidden="true" />
      </div>
      <div className="stepper-texto">
        <h3 className="stepper-titulo">{titulo}</h3>
        <p className="stepper-descricao">{texto}</p>
      </div>
    </div>
  );
}
