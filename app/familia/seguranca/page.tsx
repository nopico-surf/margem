import { ContatosEmergencia } from "@/components/familia/ContatosEmergencia";
import { CardHeader } from "@/components/conversa/CardHeader";

// Página de segurança (briefing, seção 5) [REVISÃO CLÍNICA]. Desde 09/11/2026 não é mais uma parada do
// diagnóstico nem link fixo no rodapé (pedido do fundador): abre só pelo FAQ da LP e pelo resultado.
// Com risco de violência, o próprio resultado já mostra os contatos no lugar do roteiro.
export default function SegurancaPage() {
  return (
    <section className="familia-secao">
      <CardHeader
        as="h1"
        title="Sua segurança vem primeiro"
        description="Se você ou alguém da casa está em perigo agora, procure ajuda imediata. Nenhuma técnica de conversa é mais importante do que estar seguro."
      />
      <ContatosEmergencia />
    </section>
  );
}
