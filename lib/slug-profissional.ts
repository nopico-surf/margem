// O endereço da página do profissional vem do nome que está no banco. Se o nome mudar, o endereço
// muda junto e o antigo deixa de existir (decisão de 30/09/2026, sem coluna de slug).
export function slugDoNome(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Dois nomes que gerem o mesmo slug: o segundo em diante ganha sufixo numérico, na ordem recebida.
// A lista vem ordenada por nome (buscarTodosProfissionaisAtivos), então a atribuição é estável.
export function slugsDosProfissionais<T extends { nome: string }>(profissionais: T[]) {
  const usados = new Map<string, number>();
  return profissionais.map((profissional) => {
    const base = slugDoNome(profissional.nome);
    const repeticoes = usados.get(base) ?? 0;
    usados.set(base, repeticoes + 1);
    return { profissional, slug: repeticoes === 0 ? base : `${base}-${repeticoes + 1}` };
  });
}
