// Figma: Margem System, componente `loader` (241:6655). Anel cinza com um arco verde que gira.
// Os dois desenhos são SVGs do Figma em /public/icons. O arco fica dentro de um span porque é o
// span que gira, em volta do centro do anel (o arco começa no topo e termina a caminho das 8 horas).
//
// `tamanho` são os do Figma em uso: giant (32, o padrão, telas e seções), medium (20) e small (16),
// os dois do botão carregando (Button core, state=loading).

type LoaderProps = {
  tamanho?: "giant" | "medium" | "small";
};

export function Loader({ tamanho = "giant" }: LoaderProps) {
  return (
    <span className="loader" data-tamanho={tamanho} aria-hidden="true">
      <img className="loader-anel" src="/icons/loader-anel.svg" alt="" />
      <span className="loader-giro">
        <img className="loader-arco" src="/icons/loader-arco.svg" alt="" />
      </span>
    </span>
  );
}
