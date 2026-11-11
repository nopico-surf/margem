"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { ANOTACOES_PARA_CONCLUIR, ITEM_RESUMO_M2, juntar, minuscula, resumirSemana, type Anotacao, type ResumoDaSemana } from "@/lib/familia/diario";
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
  const { dia, periodo, antes, buscou, reacao, bons, escritos } = resumo;
  const poucas = resumo.total < ANOTACOES_PARA_CONCLUIR;
  const temQuando = Boolean(dia || periodo);
  const temPista = Boolean(temQuando || antes || buscou || reacao);
  const dias = dia ? juntar(dia.valores) : null;
  const periodos = periodo ? juntar(periodo.valores) : null;
  const fraseQuando = dias && periodos ? `${dias}, ${periodos}` : dias ? dias : `${periodos}, em dias variados`;
  const dois = (pista: { valores: string[] }) => juntar(pista.valores.map(minuscula));

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
          {temQuando && (
            <div className="familia-cartao">
              <p className="text-large">{t(`Os momentos difíceis com {{apelido}} aconteceram mais ${fraseQuando}.`)}</p>
            </div>
          )}
          {antes && (
            <div className="familia-cartao">
              <p className="text-large">
                {antes.valores.length === 1
                  ? t(`O que mais aconteceu logo antes desses momentos difíceis: ${dois(antes)}.`)
                  : t(`Logo antes dos momentos difíceis, duas coisas apareceram o mesmo número de vezes: ${dois(antes)}.`)}
              </p>
            </div>
          )}
          {buscou && (
            <div className="familia-cartao">
              <p className="text-large">
                {buscou.valores.length === 1
                  ? t(`Pelas suas anotações, o que {{apelido}} mais pareceu buscar com o uso foi: ${dois(buscou)}. No módulo 4, você vai pensar em outras formas de trazer isso.`)
                  : t(`Pelas suas anotações, {{apelido}} pareceu buscar duas coisas com o uso, nas mesmas vezes: ${dois(buscou)}. No módulo 4, você vai pensar em outras formas de trazer isso.`)}
              </p>
            </div>
          )}
          {reacao && (
            <div className="familia-cartao">
              <p className="text-large">
                {t(
                  `${reacao.textos.length === 1 ? "Nesses momentos, a sua reação mais comum foi" : "Nesses momentos, as suas reações mais comuns foram"}: ${juntar(reacao.textos)}.${reacao.frase ? ` ${reacao.frase}` : ""}`,
                )}
              </p>
              {reacao.seguranca && (
                <Button variante="transparent" tamanho="small" href="/familia/seguranca">
                  Veja o seu plano de segurança
                </Button>
              )}
            </div>
          )}
          {/* Briefing M2b, item 4: o que a pessoa escreveu no "Outro" não some da tela. */}
          {escritos.length > 0 && (
            <div className="familia-cartao">
              <h2 className="header-small">O que você escreveu com as suas palavras</h2>
              <p className="text-large">Nesta semana você escreveu isto nos campos de &apos;Outro&apos;. Não entra na contagem acima porque cada coisa apareceu de um jeito diferente.</p>
              <ul className="familia-lista text-large">
                {escritos.map((escrito, indice) => (
                  <li key={indice}>{escrito}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Com 3 anotações ou mais (briefing M2): os momentos bons em três versões. A frase final só fala
          de pista quando existe pista (briefing M2b); sem nenhuma, entra o cartão de "nada se repetiu". */}
      {!poucas && (
        <>
          <div className="familia-cartao">
            <p className="text-large">
              {bons === 0
                ? t("Você ainda não anotou nenhum momento bom com {{apelido}}. Eles costumam passar despercebidos: vale prestar atenção nesta semana.")
                : t(bons === 1 ? "Você anotou 1 momento bom com {{apelido}} nesta semana." : `Você anotou ${bons} momentos bons com {{apelido}} nesta semana.`)}
            </p>
          </div>
          {temQuando ? (
            <p className="text-large">{t("Essas pistas mostram em que dias e horários é melhor se preparar, e em quais momentos uma conversa com {{apelido}} tem mais chance de ir bem.")}</p>
          ) : temPista ? (
            <p className="text-large">{t("Essas pistas ajudam a ver o que costuma vir antes dos momentos difíceis com {{apelido}}.")}</p>
          ) : (
            <div className="familia-cartao">
              <p className="text-large">
                Nesta semana nada se repetiu nas suas anotações: cada momento foi diferente do outro. Isso também diz algo, e quer dizer que ainda não dá para apontar um padrão. Com mais uma ou duas semanas de anotações, ele costuma aparecer.
              </p>
            </div>
          )}
        </>
      )}

      <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/programa/diario/anotacoes">
        Ver todas as minhas anotações
      </Button>
    </section>
  );
}
