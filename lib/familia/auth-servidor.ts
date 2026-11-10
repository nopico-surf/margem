import { getServerClient } from "@/lib/supabase";

// Confere o token do Supabase Auth que o navegador manda no header Authorization. Toda leitura e
// gravação das tabelas familia_* passa por aqui: as tabelas têm RLS sem policy, então só o servidor
// (service role) acessa, e só depois de saber quem é a pessoa.
export async function usuarioDaRequisicao(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  const supabase = getServerClient();
  if (!token || !supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return { user: data.user, supabase };
}

export function naoAutorizado() {
  return Response.json({ error: "nao_autorizado" }, { status: 401 });
}
