// Gravado pelo proxy.ts na primeira visita a /bem-vindo, pra o servidor sortear a variante do teste A/B
// antes de a página ser montada. Quem ainda não tem id no localStorage adota o do cookie, e assim o
// Mixpanel e o GrowthBook enxergam a mesma pessoa.
export const COOKIE_SESSAO = "margem-sessao-id";

function lerCookieDeSessao(): string | undefined {
  return document.cookie.match(new RegExp(`(?:^|; )${COOKIE_SESSAO}=([^;]+)`))?.[1];
}

export function getOrCreateSessaoId(): string {
  try {
    const existing = window.localStorage.getItem("margem-sessao-id");
    if (existing) return existing;
    const id = lerCookieDeSessao() ?? crypto.randomUUID();
    window.localStorage.setItem("margem-sessao-id", id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
