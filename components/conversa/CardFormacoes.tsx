import type { Formacao } from "@/lib/supabase";

// Figma: "card" com título e "lista" de "formacao-item" (Minhas formações, em /profissionais/[slug]).
// Sem formação cadastrada, o cartão não aparece.
export function CardFormacoes({ formacoes }: { formacoes: Formacao[] }) {
  if (formacoes.length === 0) return null;

  return (
    <section className="figma-section-heading figma-formacoes" data-variante="cartao">
      <h2>Minhas formações</h2>
      <ul>
        {formacoes.map((item) => {
          const detalhe = [item.nivel, item.conclusao != null ? `Conclusão em ${item.conclusao}` : null].filter(Boolean).join(" · ");
          return (
            <li key={`${item.curso}-${item.instituicao}`}>
              <p>{item.curso}</p>
              {(item.instituicao || detalhe) && (
                <div>
                  {item.instituicao && <span>{item.instituicao}</span>}
                  {detalhe && <span>{detalhe}</span>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
