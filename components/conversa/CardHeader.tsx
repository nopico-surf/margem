// Figma: "card_header". Título e descrição no topo de cada seção do resultado.
export function CardHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="figma-section-heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}
