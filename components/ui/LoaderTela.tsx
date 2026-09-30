import { Loader } from "./Loader";

// Figma: Margem System, componente `screen-loading` (440:4106). Tela branca inteira com o loader no
// centro. Fica fixa sobre a viewport toda (celular e desktop), então não depende do container da rota.

export function LoaderTela() {
  return (
    <div className="loader-tela" aria-busy="true">
      <Loader />
    </div>
  );
}
