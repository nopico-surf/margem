import { naoAutorizado, usuarioDaRequisicao } from "@/lib/familia/auth-servidor";
import { buscarPerfil, buscarUltimoDiagnostico, emailValido } from "@/lib/familia/dados";
import { TEXTO_CONSENTIMENTO_COMUNICACOES, TEXTO_CONSENTIMENTO_DADOS } from "@/lib/familia/config";
import { buscarCompraDaFamilia } from "@/lib/familia/compra-servidor";

// Perfil do familiar: criado no primeiro login, com os dois consentimentos (briefing, seções 4.1 e 11).
// O de dados é obrigatório; o de comunicações é opcional e vem desmarcado.

export async function GET(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { user, supabase } = sessao;
  const [perfil, diagnostico, compra] = await Promise.all([
    buscarPerfil(supabase, user.id),
    buscarUltimoDiagnostico(supabase, user.id),
    buscarCompraDaFamilia(user.id),
  ]);
  return Response.json({
    temPerfil: Boolean(perfil),
    precisaEmail: !perfil?.email && !user.email,
    safetyMode: perfil?.safety_mode ?? false,
    acessoLiberado: Boolean(perfil?.acesso_liberado_em),
    temDiagnostico: Boolean(diagnostico),
    // Só com acesso valendo: o plano comprado e quando o Pix caiu (o prazo da devolução). Acesso
    // sem compra é acesso gratuito.
    compra: perfil?.acesso_liberado_em ? compra : null,
  });
}

export async function POST(request: Request) {
  const sessao = await usuarioDaRequisicao(request);
  if (!sessao) return naoAutorizado();
  const { user, supabase } = sessao;

  const corpo = (await request.json().catch(() => null)) as { consentimentoDados?: unknown; consentimentoComunicacoes?: unknown; email?: unknown } | null;
  const existente = await buscarPerfil(supabase, user.id);

  // Facebook sem e-mail (conta criada com telefone): a pessoa informa depois do login.
  const emailInformado = emailValido(corpo?.email) ? corpo.email.trim().toLowerCase() : null;
  const email = user.email ?? existente?.email ?? emailInformado;
  if (!email) return Response.json({ error: "precisa_email" }, { status: 400 });

  if (existente) {
    if (!existente.email) {
      const { error } = await supabase.from("familia_perfis").update({ email }).eq("user_id", user.id);
      if (error) console.error("[familia] atualizar e-mail falhou:", error.message);
    }
    return Response.json({ ok: true });
  }

  if (corpo?.consentimentoDados !== true) return Response.json({ error: "sem_consentimento" }, { status: 400 });

  const agora = new Date().toISOString();
  const comunicacoes = corpo.consentimentoComunicacoes === true;
  const nomeCompleto = (user.user_metadata?.full_name ?? user.user_metadata?.name) as string | undefined;
  const { error } = await supabase.from("familia_perfis").insert({
    user_id: user.id,
    email,
    nome: nomeCompleto?.split(" ")[0]?.slice(0, 40) ?? null,
    consentimento_dados_em: agora,
    consentimento_dados_texto: TEXTO_CONSENTIMENTO_DADOS,
    consentimento_comunicacoes: comunicacoes,
    consentimento_comunicacoes_em: comunicacoes ? agora : null,
    consentimento_comunicacoes_texto: comunicacoes ? TEXTO_CONSENTIMENTO_COMUNICACOES : null,
  });
  if (error) {
    console.error("[familia] criar perfil falhou:", error.message);
    return Response.json({ error: "falha_ao_salvar" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
