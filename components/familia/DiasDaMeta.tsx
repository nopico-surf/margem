import { GlifoCheckCircle } from "@/components/icons/glifos";
import { dataDoDia, DIAS, type Dia } from "@/lib/familia/escala";

// Os 7 dias da meta como bolinhas (componentes-parte1, C1). Não existe no Figma: autorizado pelo
// fundador em 10/11/2026. Dia marcado = contorno; feito = check verde; marcado que já passou sem ser
// feito = cinza neutro, nunca X vermelho. Dia que não foi marcado fica apagado.

type DiasDaMetaProps = {
  dias: Dia[];
  diasFeitos: string[];
  semanaInicio: string;
  // AAAA-MM-DD do aparelho.
  hoje: string;
};

type Estado = "feito" | "marcado" | "nao_feito" | "livre";

const DESCRICAO: Record<Estado, string> = { feito: "feito", marcado: "marcado", nao_feito: "não feito", livre: "sem meta" };

export function DiasDaMeta({ dias, diasFeitos, semanaInicio, hoje }: DiasDaMetaProps) {
  return (
    <ul className="dias-da-meta" aria-label="Dias da meta nesta semana">
      {DIAS.map((dia) => {
        const data = dataDoDia(semanaInicio, dia.id);
        const estado: Estado = !dias.includes(dia.id) ? "livre" : diasFeitos.includes(data) ? "feito" : data < hoje ? "nao_feito" : "marcado";
        return (
          <li key={dia.id} className="dias-da-meta-dia" data-estado={estado} aria-label={`${dia.rotulo}, ${DESCRICAO[estado]}`}>
            <span className="dias-da-meta-bolinha" aria-hidden="true">
              {estado === "feito" && <GlifoCheckCircle size={32} color="var(--colors-status-success-500)" />}
            </span>
            <span className="label-xx-small" aria-hidden="true">
              {dia.rotulo}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
