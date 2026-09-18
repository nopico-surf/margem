"use client";

// Cliente por causa do onError: ele é event handler, e a galeria /ui é server component.
// Figma: `avatar`, na página Avatar do Margem System. O set tem `type` = photo, fallback.
//
// `photo` é a foto que veio no cadastro do profissional. `fallback` é o desenho de pessoa, usado
// quando não há foto cadastrada e quando a foto cadastrada não carrega. Quem decide qual dos dois
// aparece é o dado, não quem chama: sem `src`, é fallback; com `src` que falha no carregamento, o
// onError troca para o fallback e desarma a si mesmo, para não entrar em laço se o próprio fallback
// falhar.
//
// Morava em `components/icons/index.tsx` até esta sessão. Saiu de lá porque aquele arquivo é a
// ponte dos glifos, e isto não é um glifo: é um componente com estado de erro.

// O desenho do Figma sem o retângulo técnico de fundo escuro, que criava borda preta nos cantos
// arredondados. Ao trocar este arquivo, remover esse retângulo antes de validar. A regra e o valor
// exato do fill estão no CLAUDE.md, seção 7.
export const URL_AVATAR_PADRAO = "/assets/professional-avatar-fallback.svg";

export function Avatar({ src, className }: { src?: string | null; className?: string }) {
  return <img className={className} src={src || URL_AVATAR_PADRAO} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = URL_AVATAR_PADRAO; }} alt="" />;
}
