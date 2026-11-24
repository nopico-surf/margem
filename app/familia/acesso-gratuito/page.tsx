import { redirect } from "next/navigation";

// "Pedir acesso gratuito" (briefing 01) está escondido. Pra reativar, voltar este arquivo pra renderizar
// <AcessoGratuitoCliente /> e recolocar os links no checkout, na OfertaPrograma e a pergunta na FAQ da LP.
export default function AcessoGratuitoPage() {
  redirect("/familia");
}
