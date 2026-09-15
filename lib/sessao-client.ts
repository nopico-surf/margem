export function getOrCreateSessaoId(): string {
  try {
    const existing = window.localStorage.getItem("margem-sessao-id");
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem("margem-sessao-id", id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
