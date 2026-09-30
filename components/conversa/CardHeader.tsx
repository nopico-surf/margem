// Figma: "card_header". Título e descrição no topo de cada seção do resultado.
// `variante="cartao"` é o `card-header` com fundo branco (Sobre, em /profissionais/[slug]).
export function CardHeader({
  title,
  description,
  as: Titulo = "h2",
  variante = "padrao",
}: {
  title: string;
  description?: string;
  as?: "h1" | "h2";
  variante?: "padrao" | "cartao";
}) {
  return (
    <header className="figma-section-heading" data-variante={variante}>
      <Titulo>{title}</Titulo>
      {description && <p>{description}</p>}
    </header>
  );
}
