import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { buscarCompraDaFamilia } from "@/lib/familia/compra-servidor";
import { buscarPerfil } from "@/lib/familia/dados";
import { podeDesistir } from "@/lib/familia/oferta";

// "Pedir o dinheiro de volta" (briefing 01b): só dentro do prazo, sem motivo obrigatório. O pedido fica
// em familia_pedidos_devolucao (migração 0049) e o fundador devolve à mão no Asaas. Nada é bloqueado na
// hora: o acesso só sai quando o estorno chega pelo webhook. O texto nunca vai pra log nem pro Mixpanel.

const MAXIMO = 500;

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { user, supabase } = sessao;

  const [perfil, compra] = await Promise.all([buscarPerfil(supabase, user.id), buscarCompraDaFamilia(user.id)]);
  if (!perfil?.acesso_liberado_em || !compra || !podeDesistir(compra.pagoEm)) {
    return Response.json({ error: "fora_do_prazo" }, { status: 403 });
  }

  const corpo = (await request.json().catch(() => null)) as { texto?: unknown } | null;
  const texto = typeof corpo?.texto === "string" ? corpo.texto.trim().slice(0, MAXIMO) : "";
  const { error } = await supabase.from("familia_pedidos_devolucao").insert({ user_id: user.id, texto: texto || null });
  if (error) {
    console.error("[familia] pedido de devolução falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
