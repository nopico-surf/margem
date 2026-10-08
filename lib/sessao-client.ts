// O cookie era gravado pelo proxy.ts na primeira visita a /bem-vindo, pro teste A/B do botão Continuar
// (encerrado em 07/10/2026, quando a /bem-vindo se juntou à /inicio). Quem ainda tem o cookie e não tem
// id no localStorage adota o dele, e assim a pessoa continua a mesma no Mixpanel.
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
