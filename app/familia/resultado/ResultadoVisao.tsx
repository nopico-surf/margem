"use client";

import { useState } from "react";
import { GlifoContentCopy } from "@/components/icons/glifos";
import { ContatosEmergencia } from "@/components/familia/ContatosEmergencia";
import { Button } from "@/components/ui/Button";
import { aplicarApelido, ROTULO_PROBLEMA } from "@/lib/familia/diagnostico";
import type { Resultado } from "@/lib/familia/resultado";
import { track } from "@/lib/mixpanel";

// O desenho da página de resultado (briefing, seção 6), separado de onde os dados vêm: a página real
// busca o diagnóstico da conta; a de exemplo (só no localhost) monta com as respostas do aparelho.
// Ordem: acolhimento, a seu favor e ponto de atenção, primeira conversa (ou segurança), um passo
// pra você, avisos, módulo 1, contatos de emergência. O bloco de oferta entra na Fase 2.
export function ResultadoVisao({ resultado, apelido }: { resultado: Resultado; apelido: string }) {
  const [copiado, setCopiado] = useState(false);
  const t = (texto: string) => aplicarApelido(texto, apelido);
  const conversa = resultado.conversa;

  async function copiarRoteiro() {
    if (!conversa) return;
    const texto = [t(conversa.abertura), ...conversa.frasesUteis.map(t)].join("\n\n");
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      track("roteiro_copiado");
    } catch {}
  }

  return (
    <>
      {/* Abertura da página, com mais peso que as seções: título grande e faixa verde-clara de ponta
          a ponta (a mesma cor do topo da /inicio). */}
      <section className="familia-secao familia-resultado-topo">
        <h1 className="header-large">Seu mapa da situação</h1>
        <p className="text-large">{resultado.acolhimento.map(t).join(" ")}</p>
      </section>

      <section className="familia-secao">
        <h2 className="header-medium">O que joga a seu favor</h2>
        <ul className="familia-lista text-large">
          {resultado.aSeuFavor.map((item) => (
            <li key={item}>{t(item)}</li>
          ))}
        </ul>
        <div className="familia-cartao familia-cartao-alerta">
          <h3 className="header-small">Ponto de atenção</h3>
          <p className="text-large">{t(resultado.pontoDeAtencao)}</p>
        </div>
      </section>

      {conversa ? (
        <section className="familia-secao">
          <div id="primeira-conversa" className="familia-cartao familia-cartao-destaque">
            <h2 className="header-medium">Sua primeira conversa</h2>
            <h3 className="header-small">{t("Quando conversar com {{apelido}}")}</h3>
            <p className="text-large">{t(conversa.quando)}</p>
            <h3 className="header-small">Para começar a conversa</h3>
            <p className="familia-fala text-large">{t(conversa.abertura)}</p>
            <h3 className="header-small">Frases úteis para a conversa</h3>
            {conversa.frasesUteis.map((frase) => (
              <p key={frase} className="familia-fala text-large">
                {t(frase)}
              </p>
            ))}
            <Button variante="secondary" tamanho="small" onClick={copiarRoteiro}>
              <GlifoContentCopy size={20} />
              {copiado ? "Roteiro copiado" : "Copiar o roteiro da conversa"}
            </Button>
            <h3 className="header-small">O que evitar na conversa</h3>
            <ul className="familia-lista text-large">
              {conversa.evite.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
            <h3 className="header-small">{t("Se {{apelido}} reagir mal")}</h3>
            <p className="text-large">{t(conversa.seReagirMal.orientacao)}</p>
            {conversa.seReagirMal.frase && <p className="familia-fala text-large">{t(conversa.seReagirMal.frase)}</p>}
          </div>
        </section>
      ) : (
        <section className="familia-secao">
          <header className="familia-titulo">
            <h2 className="header-medium">Sua segurança vem primeiro</h2>
            <p className="text-large">{t(resultado.seguranca ?? "")}</p>
          </header>
          <ContatosEmergencia />
        </section>
      )}

      {/* Em cartão: no fundo branco do resultado, solto, ele parecia desconectado do resto. */}
      <section className="familia-secao">
        <div className="familia-cartao">
          <h2 className="header-small">Um passo para você</h2>
          <p className="text-large">{t(resultado.umPasso)}</p>
        </div>
      </section>

      <section className="familia-secao">
        {resultado.avisos.map((aviso) => (
          <div key={aviso.problema} className="familia-variacao">
            <span className="label-small-medium">{ROTULO_PROBLEMA[aviso.problema]}</span>
            <p className="text-large">{t(aviso.texto)}</p>
            {aviso.psiquiatra && (
              <div className="familia-exercicio-acoes">
                <Button variante="secondary" tamanho="small" href="/profissionais?especialidade=medicos-psiquiatras">
                  Ver psiquiatra parceiro
                </Button>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="familia-secao">
        <Button tamanho="medium" larguraTotal href="/familia/programa/modulo/1">
          Começar o módulo 1 (grátis)
        </Button>
      </section>
    </>
  );
}
