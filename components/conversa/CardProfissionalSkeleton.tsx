// Figma: "_card-profissional", state=loading. Mesma altura, auto-layout e gap do card real; o
// bone vem do componente skeleton-bone, nunca shimmer solto.

export function CardProfissionalSkeleton() {
  return (
    <article className="figma-professional-card figma-skeleton-professional" aria-hidden="true">
      <div className="figma-professional-head">
        <span className="figma-skeleton figma-skeleton-avatar" />
        <div>
          <span className="figma-skeleton figma-skeleton-name" />
          <span className="figma-skeleton figma-skeleton-specialty" />
          <span className="figma-skeleton figma-skeleton-detail" />
          <span className="figma-skeleton figma-skeleton-detail" />
        </div>
      </div>
      <div className="figma-skeleton-tags">
        <span className="figma-skeleton" />
        <span className="figma-skeleton" />
        <span className="figma-skeleton" />
      </div>
      <div className="figma-skeleton-description">
        <span className="figma-skeleton" />
        <span className="figma-skeleton" />
        <span className="figma-skeleton" />
      </div>
      <span className="figma-skeleton figma-skeleton-button" />
    </article>
  );
}
