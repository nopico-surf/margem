import { Suspense } from "react";
import { ContatosEmergencia } from "@/components/familia/ContatosEmergencia";
import { CardHeader } from "@/components/conversa/CardHeader";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";

// Página de segurança (briefing, seção 5; texto do conteúdo v2) [REVISÃO CLÍNICA]. Desde 09/11/2026 não é mais uma parada do
// diagnóstico nem link fixo no rodapé (pedido do fundador): abre só pelo FAQ da LP e pelo resultado.
// Com risco de violência, o próprio resultado já mostra os contatos no lugar do roteiro.
// O carrossel de profissionais do fim espera a busca (cacheada); os contatos aparecem antes.
export default function SegurancaPage() {
  return (
    <section className="familia-secao">
      <CardHeader
        as="h1"
        title="Sua segurança vem primeiro"
        description="Se você ou alguém da casa está em perigo agora, peça ajuda já. Nenhuma conversa vale mais do que a sua segurança."
      />
      <Suspense fallback={<ContatosEmergencia />}>
        <Contatos />
      </Suspense>
    </section>
  );
}

async function Contatos() {
  return <ContatosEmergencia profissionais={await buscarTodosProfissionaisAtivos()} />;
}
