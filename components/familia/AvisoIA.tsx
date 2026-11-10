import { GlifoInfo } from "@/components/icons/glifos";

// Aviso de IA. Aparece em todo lugar do programa para familiares onde há texto escrito por IA
// (hoje, só o simulador e o feedback dele). Pedido do fundador em 09/11/2026: deixar claro que é
// uma IA e que ela pode cometer erros.
export function AvisoIA({ children }: { children: React.ReactNode }) {
  return (
    <p className="familia-aviso-ia text-small-regular" role="note">
      <GlifoInfo className="familia-aviso-ia-icone" size={20} />
      <span>{children}</span>
    </p>
  );
}
