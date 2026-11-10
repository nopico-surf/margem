import { calcularSafetyMode, sanitizarRespostas } from "@/lib/familia/diagnostico";
import { lerBlocosDoResultado } from "@/lib/familia/conteudo";
import { montarResultado } from "@/lib/familia/resultado";

// SÓ DESENVOLVIMENTO. Monta o resultado com as respostas que vierem, sem login e sem gravar nada,
// pra ver a página de resultado enquanto o login social não está ligado no Supabase.
// Em produção responde 404.
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });

  const corpo = (await request.json().catch(() => null)) as { respostas?: unknown } | null;
  const respostas = sanitizarRespostas(corpo?.respostas);
  const blocos = await lerBlocosDoResultado();
  // Mesmo formato da rota real (/api/familia/diagnostico): o modo sem login (lib/familia/dev.ts) usa
  // esta resposta no resultado, no módulo e no simulador.
  return Response.json({
    apelido: respostas.apelido ?? "",
    problemas: respostas.problemas ?? [],
    reacoes: respostas.reacoes ?? [],
    relacao: respostas.relacao ?? null,
    resultado: montarResultado(respostas, blocos, calcularSafetyMode(respostas)),
  });
}
