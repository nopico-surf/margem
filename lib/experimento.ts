import { cookies } from "next/headers";
import { growthbookAdapter } from "@flags-sdk/growthbook";
import { COOKIE_SESSAO } from "@/lib/sessao-client";

// Chave da flag no GrowthBook: tipo string, o valor de cada variante é o texto do botão.
const FLAG_TEXTO_BOTAO = "texto-botao-continuar";
const TEXTO_PADRAO = "Continuar";

export type BotaoContinuar = {
  texto: string;
  // Preenchidos só quando a pessoa entrou de fato num experimento; vão pro Mixpanel como exposição.
  experimento: string | null;
  variante: string | null;
};

const CONTROLE: BotaoContinuar = { texto: TEXTO_PADRAO, experimento: null, variante: null };

// Se o GrowthBook cair, a flag não existir ou não houver id, a página mostra o texto de sempre.
export async function textoDoBotaoContinuar(): Promise<BotaoContinuar> {
  try {
    const id = (await cookies()).get(COOKIE_SESSAO)?.value;
    if (!id) return CONTROLE;

    const cliente = await growthbookAdapter.initialize();
    const resultado = cliente.evalFeature<string>(FLAG_TEXTO_BOTAO, { attributes: { id } });
    if (typeof resultado.value !== "string" || resultado.value.trim() === "") return CONTROLE;

    const naExperimento = resultado.source === "experiment" && resultado.experimentResult?.inExperiment;
    return {
      texto: resultado.value,
      experimento: naExperimento ? (resultado.experiment?.key ?? null) : null,
      variante: naExperimento ? (resultado.experimentResult?.key ?? null) : null,
    };
  } catch (erro) {
    console.error("growthbook_indisponivel", erro instanceof Error ? erro.message : erro);
    return CONTROLE;
  }
}
