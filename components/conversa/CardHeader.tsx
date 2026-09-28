// Figma: "card_header". Título e descrição no topo de cada seção do resultado.
export function CardHeader({ title, description, as: Titulo = "h2" }: { title: string; description?: string; as?: "h1" | "h2" }) {
  return (
    <header className="figma-section-heading">
      <Titulo>{title}</Titulo>
      {description && <p>{description}</p>}
    </header>
  );
}
