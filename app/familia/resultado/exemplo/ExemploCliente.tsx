"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { diagnosticoCompleto, type Respostas } from "@/lib/familia/diagnostico";
import { lerRespostasLocais } from "@/lib/familia/fluxo-cliente";
import type { Resultado } from "@/lib/familia/resultado";
import { ResultadoVisao } from "../ResultadoVisao";

// Sem diagnóstico respondido no aparelho, usa um exemplo fixo.
const EXEMPLO: Respostas = {
  relacao: "filho",
  apelido: "",
  problemas: ["alcool"],
  frequencia_alcool: "diario",
  tempo: "medio",
  estagio: "NAO_RECONHECE",
  reacoes: ["vira_briga"],
  mora_junto: "sim",
  medo: "nao",
  agressao: "nao",
  dinheiro: "pouco",
  esgotamento: "2",
  objetivo: "parar_de_brigar",
};

// Casos prontos pra conferência, por ?caso= na URL (pedido do fundador em 10/11/2026).
const CASOS: Record<string, { descricao: string; respostas: Respostas }> = {
  a: { descricao: "álcool, bebe todo dia, vira briga", respostas: { ...EXEMPLO, apelido: "Lu", frequencia_alcool: "diario", reacoes: ["vira_briga"] } },
  b: {
    descricao: "álcool, mais nos fins de semana, nega (sem card de aviso)",
    respostas: { ...EXEMPLO, apelido: "Lu", frequencia_alcool: "fim_de_semana", reacoes: ["nega"] },
  },
  c: {
    descricao: "apostas, dinheiro muito afetado, se afasta, sem apelido",
    respostas: { ...EXEMPLO, apelido: "", problemas: ["apostas"], frequencia_alcool: undefined, dinheiro: "muito", reacoes: ["se_afasta"] },
  },
};

// SÓ DESENVOLVIMENTO. Sem faixa de aviso (tirada a pedido do fundador em 10/11/2026): a página é igual à real.
// Ordem: ?caso= na URL, senão as respostas do diagnóstico feito no aparelho, senão o EXEMPLO.
export function ExemploCliente() {
  const [dados, setDados] = useState<{ apelido: string; resultado: Resultado } | null>(null);

  useEffect(() => {
    const caso = CASOS[new URLSearchParams(window.location.search).get("caso") ?? ""];
    const locais = lerRespostasLocais();
    const usarLocais = !caso && diagnosticoCompleto(locais);
    void fetch("/api/familia/exemplo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ respostas: caso ? caso.respostas : usarLocais ? locais : EXEMPLO }),
    })
      .then((resposta) => resposta.json())
      .then(setDados);
  }, []);

  if (!dados) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  return <ResultadoVisao resultado={dados.resultado} apelido={dados.apelido} />;
}
