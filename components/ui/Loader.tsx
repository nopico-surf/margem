// Figma: Margem System, componente `loader` (687:33). Anel cinza com um arco verde que gira.
// Os dois desenhos são SVGs do Figma em /public/icons. O arco fica dentro de um span porque é o
// span que gira, em volta do centro do anel (o arco começa no topo e termina a caminho das 8 horas).

export function Loader() {
  return (
    <span className="loader" aria-hidden="true">
      <img className="loader-anel" src="/icons/loader-anel.svg" alt="" />
      <span className="loader-giro">
        <img className="loader-arco" src="/icons/loader-arco.svg" alt="" />
      </span>
    </span>
  );
}
