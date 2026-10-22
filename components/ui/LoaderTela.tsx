import { Loader } from "./Loader";

// Figma: Margem System, componente `screen-loading` (440:4106). Tela branca inteira com o loader no
// centro. Fica fixa sobre a viewport toda (celular e desktop), então não depende do container da rota.
//
// `texto` é a linha embaixo do loader (Figma: "Fazendo a validação dos dados", 1546:40761), em
// Header/Medium; sem ele, só o loader.
export function LoaderTela({ texto }: { texto?: string }) {
  return (
    <div className="loader-tela" aria-busy="true" {...(texto ? { role: "status" } : {})}>
      <Loader />
      {texto && <p className="loader-tela-texto">{texto}</p>}
    </div>
  );
}
