import { SeloDevolucaoIcone } from "@/components/icons/SeloDevolucao";
import { DIAS_PARA_DESISTIR } from "@/lib/familia/oferta";

// Selo dos 14 dias para pedir o dinheiro de volta (canvas "Ofertas do Fôlego"). Aparece acima do
// botão que leva ao checkout (bloco de oferta) e acima do "Continuar para o pagamento" da etapa em
// que a pessoa escolhe o valor. Texto fixo, sem contador regressivo.
export function SeloDevolucao() {
  return (
    <div className="selo-devolucao">
      <SeloDevolucaoIcone />
      <p>{DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta</p>
    </div>
  );
}
