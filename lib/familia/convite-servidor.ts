import { slugsDosProfissionais } from "@/lib/slug-profissional";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import type { ProfissionalDoConvite } from "./convite";

// Endereço da página de cada profissional ativo, por id. O módulo 8 ("Retomar o apoio") leva ao
// profissional salvo no convite. O slug sai da lista inteira, como na /profissionais.
export async function enderecosDosProfissionais(): Promise<Record<string, string>> {
  const todos = await buscarTodosProfissionaisAtivos();
  return Object.fromEntries(slugsDosProfissionais(todos).map(({ profissional, slug }) => [profissional.id, `/profissionais/${slug}`]));
}

// Psicólogos parceiros do passo 1 do convite (briefing M5). Vem da mesma lista em cache da
// /profissionais, só com o que a tela usa. Não há agenda nem preço no banco (o agendamento é pelo
// WhatsApp): a lista não filtra por horário em até 3 dias.
export async function psicologosDoConvite(): Promise<ProfissionalDoConvite[]> {
  const todos = await buscarTodosProfissionaisAtivos();
  return todos
    .filter((profissional) => profissional.especialidade === "psicologo")
    .map(({ id, nome, abordagem, foto_url, whatsapp_link }) => ({ id, nome, abordagem: abordagem ?? null, foto_url, whatsapp_link }));
}
