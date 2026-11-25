// Selo dos 14 dias para pedir o dinheiro de volta (canvas "Ofertas do Fôlego", 25/11/2026): estrela
// de 24 pontas em verde-claro, anel pontilhado e um check. Só o desenho; o texto e o tamanho
// ficam com quem usa (components/familia/SeloDevolucao.tsx).
type SeloDevolucaoIconeProps = { className?: string; size?: number };

export function SeloDevolucaoIcone({ className, size = 36 }: SeloDevolucaoIconeProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon
        points="18,0 22,3 27,2.4 29,7 33.6,9 33,14 36,18 33,22 33.6,27 29,29 27,33.6 22,33 18,36 14,33 9,33.6 7,29 2.4,27 3,22 0,18 3,14 2.4,9 7,7 9,2.4 14,3"
        fill="var(--colors-brand-primary-300)"
      />
      <circle cx="18" cy="18" r="11.5" stroke="var(--colors-brand-primary-800)" strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M13 18.5l3.2 3.2L23 15" stroke="var(--colors-brand-primary-800)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
