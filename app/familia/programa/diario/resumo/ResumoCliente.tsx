"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { ANOTACOES_PARA_CONCLUIR, ITEM_RESUMO_M2, minuscula, resumirSemana, type Anotacao, type ResumoDaSemana } from "@/lib/familia/diario";
import { marcarFeito } from "@/lib/familia/exercicio-cliente";

// Resumo da semana (briefing M2). Um cartão por pista, e a pista só aparece se houver dado. Abrir o
// resumo com 3 anotações ou mais conclui o item "Ver o resumo da semana" do módulo 2.

export function ResumoCliente() {
  const router = useRouter();
  const [apelido, setApelido] = useState<string | null>(null);
  const [resumo, setResumo] = useState<ResumoDaSemana | null>(null);

  useEffect(() => {
    (async () => {
      const diagnostico = await chamarApi("/api/familia/diagnostico");
      if (!diagnostico || diagnostico.status === 401) return router.replace("/familia/entrar");
      if (diagnostico.status === 404) return router.replace("/familia/diagnostico");
      if (!diagnostico.ok) return;
      const lista = await chamarApi("/api/familia/diario").then(async (r) => (r?.ok ? ((await r.json()) as { anotacoes: Anotacao[] }).anotacoes : []));
      const lido = resumirSemana(lista);
      if (lido.total >= ANOTACOES_PARA_CONCLUIR) void marcarFeito(ITEM_RESUMO_M2.modulo, ITEM_RESUMO_M2.item);
      setResumo(lido);
      setApelido(((await diagnostico.json()) as { apelido: string }).apelido);
    })();
  }, [router]);

  if (apelido === null || !resumo) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const t = (texto: string) => aplicarApelido(texto, apelido);
  const { quando, antes, buscou, reacao, bons } = resumo;
  const poucas = resumo.total < ANOTACOES_PARA_CONCLUIR;

  return (
    <section className="familia-pergunta">
      <div className="familia-pergunta-topo">
        <button className="familia-voltar" type="button" aria-label="Voltar ao painel" onClick={() => router.push("/familia/programa")}>
          <GlifoArrowBack size={24} />
        </button>
      </div>
      <header className="familia-titulo">
        <h1 className="header-large">O que a sua semana mostrou</h1>
        <p className="text-large">{t("Este resumo junta as anotações que você fez nos últimos 7 dias sobre os momentos com {{apelido}}. Não é diagnóstico: é um retrato da sua semana.")}</p>
      </header>

      {poucas ? (
        <div className="familia-cartao">
          <p className="text-large">{t("Você fez menos de 3 anotações nesta semana, e tudo bem. Com mais algumas, dá para ver quando os momentos difíceis com {{apelido}} costumam acontecer.")}</p>
          <Button tamanho="small" href="/familia/programa/diario">
            Fazer uma anotação
          </Button>
        </div>
      ) : (
        <>
          {quando && (
            <div className="familia-cartao">
              <p className="text-large">{t(`Os momentos difíceis com {{apelido}} aconteceram mais ${quando.dia}, ${quando.periodo}.`)}</p>
            </div>
          )}
          {antes && (
            <div className="familia-cartao">
              <p className="text-large">{t(`O que mais aconteceu logo antes desses momentos difíceis: ${minuscula(antes)}.`)}</p>
            </div>
          )}
          {buscou && (
            <div className="familia-cartao">
              <p className="text-large">
                {t(`Pelas suas anotações, o que {{apelido}} mais pareceu buscar com o uso foi: ${minuscula(buscou)}. No módulo 4, você vai pensar em outras formas de trazer isso.`)}
              </p>
            </div>
          )}
          {reacao && (
            <div className="familia-cartao">
              <p className="text-large">{t(`Nesses momentos, a sua reação mais comum foi: ${reacao.texto}.${reacao.frase ? ` ${reacao.frase}` : ""}`)}</p>
              {reacao.seguranca && (
                <Button variante="transparent" tamanho="small" href="/familia/seguranca">
                  Veja o seu plano de segurança
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Com 3 anotações ou mais (briefing M2): os momentos bons em três versões e a frase final das pistas. */}
      {!poucas && (
        <>
          <div className="familia-cartao">
            <p className="text-large">
              {bons === 0
                ? t("Você ainda não anotou nenhum momento bom com {{apelido}}. Eles costumam passar despercebidos: vale prestar atenção nesta semana.")
                : t(bons === 1 ? "Você anotou 1 momento bom com {{apelido}} nesta semana." : `Você anotou ${bons} momentos bons com {{apelido}} nesta semana.`)}
            </p>
          </div>
          <p className="text-large">{t("Essas pistas mostram em que dias e horários é melhor se preparar, e em quais momentos uma conversa com {{apelido}} tem mais chance de ir bem.")}</p>
        </>
      )}

      <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/programa/diario/anotacoes">
        Ver todas as minhas anotações
      </Button>
    </section>
  );
}
