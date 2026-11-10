"use client";

import { useState } from "react";
import { EscalaNota } from "@/components/familia/EscalaNota";
import { TEXTOS_ESCALA, TEXTOS_META } from "@/lib/familia/escala";

// Estados da escala de nota na galeria: sem nota, com nota (tocável) e a versão 0 a 10 da confiança.
export function EscalaNotaGaleria() {
  const [nota, setNota] = useState<number | null>(4);
  const [confianca, setConfianca] = useState<number | null>(null);
  return (
    <>
      <EscalaNota minimo={1} maximo={10} valor={null} onEscolher={() => {}} rotulo="Sem nota" legendaMinimo={TEXTOS_ESCALA.legendaMin} legendaMaximo={TEXTOS_ESCALA.legendaMax} />
      <EscalaNota minimo={1} maximo={10} valor={nota} onEscolher={setNota} rotulo={TEXTOS_ESCALA.pergunta} legendaMinimo={TEXTOS_ESCALA.legendaMin} legendaMaximo={TEXTOS_ESCALA.legendaMax} />
      <EscalaNota minimo={0} maximo={10} valor={confianca} onEscolher={setConfianca} rotulo={TEXTOS_META.confiancaPergunta} />
    </>
  );
}
