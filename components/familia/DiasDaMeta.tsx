"use client";

import { useState } from "react";
import { GlifoCheckCircle } from "@/components/icons/glifos";
import { dataDoDia, diaMarcavel, DIAS, resumoDosDias, TEXTOS_META, type Dia } from "@/lib/familia/escala";

// Os 7 dias da meta como bolinhas (componentes-parte1, C1). Não existe no Figma: autorizado pelo
// fundador em 10/11/2026. Dia feito = check verde (planejado ou não); planejado ainda por vir =
// contorno; planejado que já passou sem ser feito = cinza neutro, nunca X vermelho; dia fora do plano
// fica apagado. Embaixo, "2 de 3 dias concluídos" (e ", 1 a mais" quando fez num dia fora do plano).
//
// Com onAlternar (briefing 00, item 6), cada dia é um botão: marca hoje e qualquer dia que já passou
// na semana; tocar de novo desmarca. Dia futuro fica desabilitado e, ao tocar, avisa que não chegou.

type DiasDaMetaProps = {
  dias: Dia[];
  diasFeitos: string[];
  semanaInicio: string;
  // AAAA-MM-DD do aparelho.
  hoje: string;
  onAlternar?: (data: string) => void;
};

type Estado = "feito" | "marcado" | "nao_feito" | "livre";

const DESCRICAO: Record<Estado, string> = { feito: "concluído", marcado: "planejado", nao_feito: "não concluído", livre: "fora do plano" };

export function DiasDaMeta({ dias, diasFeitos, semanaInicio, hoje, onAlternar }: DiasDaMetaProps) {
  const [avisoFuturo, setAvisoFuturo] = useState(false);

  return (
    <div className="dias-da-meta-bloco">
      <ul className="dias-da-meta" aria-label="Dias da meta nesta semana">
        {DIAS.map((dia) => {
          const data = dataDoDia(semanaInicio, dia.id);
          const planejado = dias.includes(dia.id);
          const estado: Estado = diasFeitos.includes(data) ? "feito" : !planejado ? "livre" : data < hoje ? "nao_feito" : "marcado";
          const conteudo = (
            <>
              <span className="dias-da-meta-bolinha" aria-hidden="true">
                {estado === "feito" && <GlifoCheckCircle size={32} color="var(--colors-status-success-500)" />}
              </span>
              <span className="label-xx-small" aria-hidden="true">
                {dia.rotulo}
              </span>
            </>
          );
          const rotulo = `${dia.rotulo}, ${DESCRICAO[estado]}`;
          if (!onAlternar) {
            return (
              <li key={dia.id} className="dias-da-meta-dia" data-estado={estado} aria-label={rotulo}>
                {conteudo}
              </li>
            );
          }
          const marcavel = diaMarcavel(data, semanaInicio, hoje);
          return (
            <li key={dia.id}>
              <button
                type="button"
                className="dias-da-meta-dia"
                data-estado={estado}
                aria-label={rotulo}
                aria-pressed={estado === "feito"}
                aria-disabled={!marcavel}
                onClick={() => {
                  if (!marcavel) return setAvisoFuturo(true);
                  setAvisoFuturo(false);
                  onAlternar(data);
                }}
              >
                {conteudo}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-medium-regular familia-texto-suave" aria-live="polite">
        {resumoDosDias(dias, diasFeitos, semanaInicio)}
      </p>
      {avisoFuturo && (
        <p className="text-medium-regular familia-texto-suave" role="status">
          {TEXTOS_META.diaFuturo}
        </p>
      )}
    </div>
  );
}
