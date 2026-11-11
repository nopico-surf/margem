import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import { MOSTRAR_REVISAO_CLINICA } from "@/lib/familia/config";
import { lerModulo, TOTAL_MODULOS } from "@/lib/familia/conteudo";
import { enderecosDosProfissionais } from "@/lib/familia/convite-servidor";
import { buscarTodosProfissionaisAtivos } from "@/lib/supabase";
import { ModuloCliente } from "./ModuloCliente";

type Props = { params: Promise<{ n: string }> };

// Módulos que terminam com o carrossel de profissionais (briefing M56).
const MODULOS_COM_CARROSSEL = new Set([5, 6]);

// Módulos do programa para familiares, escritos em content/familia/modulos (briefing, seção 7).
// O texto é lido no build; quem pode ver, o apelido e as variações por problema são resolvidos no
// cliente, com o diagnóstico da pessoa. O módulo 1 é aberto pra quem tem conta, mesmo sem ter
// comprado. Os módulos 2 a 8 abrem com a compra e a liberação semanal (briefing 01); o conteúdo deles
// (v2, [REVISÃO CLÍNICA]) só sai no servidor local até a revisão da psicóloga parceira.
export async function generateStaticParams() {
  const numeros = Array.from({ length: TOTAL_MODULOS }, (_, indice) => indice + 1);
  const existentes = await Promise.all(numeros.map(async (numero) => ((await lerModulo(numero)) ? numero : null)));
  return existentes.filter((numero): numero is number => numero !== null).map((numero) => ({ n: String(numero) }));
}

// O params fica dentro do Suspense, como no blog (exigência do cacheComponents).
export default function ModuloPage({ params }: Props) {
  return (
    <Suspense fallback={<Loader />}>
      <Conteudo params={params} />
    </Suspense>
  );
}

async function Conteudo({ params }: Props) {
  const { n } = await params;
  const modulo = await lerModulo(Number(n));
  if (!modulo || !modulo.publicado) notFound();
  // Em revisão (produção, antes da revisão clínica): o texto não sai daqui, só os subtítulos, pra a
  // página de módulo bloqueado mostrar "O que você vai aprender" em vez de um erro (briefing 01).
  const emRevisao = modulo.numero !== 1 && !MOSTRAR_REVISAO_CLINICA;
  const enviado = emRevisao ? { ...modulo, blocos: modulo.blocos.filter((bloco) => bloco.tipo === "titulo"), audio: null, video: null } : modulo;
  // "Retomar o apoio" (módulo 8, briefing M8): a página do profissional salvo no convite.
  const temRetomar = !emRevisao && modulo.blocos.some((bloco) => bloco.tipo === "exercicio" && bloco.acoes.includes("retomar"));
  const enderecos = temRetomar ? await enderecosDosProfissionais() : undefined;
  // Carrossel de profissionais no fim dos módulos 5 e 6 (briefing M56). A busca é cacheada.
  const profissionais = !emRevisao && MODULOS_COM_CARROSSEL.has(modulo.numero) ? await buscarTodosProfissionaisAtivos() : undefined;
  return <ModuloCliente modulo={enviado} emRevisao={emRevisao} enderecos={enderecos} profissionais={profissionais} />;
}
