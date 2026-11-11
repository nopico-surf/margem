"use client";

import { useEffect } from "react";
import { GlifoCheckCircle, GlifoLock } from "@/components/icons/glifos";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DIAS_PARA_DESISTIR, VALOR_PROGRAMA_COM_ACOMPANHAMENTO, VALORES_PROGRAMA } from "@/lib/familia/oferta";
import { track } from "@/lib/mixpanel";

// Banner de oferta do programa para familiares (briefing 01). Design: canvas "Banner de oferta", quatro
// variações do mesmo cartão: faixa verde-escura em cima (título e preço) e corpo branco embaixo.
// - lp: antes da FAQ da LP. Preço em destaque, o que inclui, o plano com acompanhamento, os dois botões.
// - resultado: no resultado do diagnóstico, depois dos avisos, com a lista dos módulos 1 a 8 trancados
//   (briefing 01b: o módulo 1 deixou de ser grátis). Também quando o treino grátis acaba.
// - modulo1: no fim do módulo 1, só depois de concluído.
// - bloqueado: na página de um módulo que a pessoa ainda não comprou (mesmo texto do resultado).
//
// Nunca em modal, pop-up ou barra fixa, no máximo um por tela, e some depois da compra (quem decide
// se aparece é a tela). Nunca acima de conteúdo de segurança.

export type VarianteOferta = "lp" | "resultado" | "modulo1" | "bloqueado";

type OfertaProgramaProps = {
  variante: VarianteOferta;
  // "{{apelido}}" do texto do resultado e do bloqueado.
  apelido?: string;
  // Títulos dos módulos 1 a 8, na ordem (só no resultado).
  modulos?: string[];
  // "O módulo 2 chega em DD/MM" (só no módulo 1).
  dataModulo2?: string;
};

const MINIMO = VALORES_PROGRAMA[0];
const MAXIMO = VALORES_PROGRAMA[VALORES_PROGRAMA.length - 1];
const FAIXA = `De R$ ${MINIMO} a R$ ${MAXIMO}, você escolhe. Uma vez só, no Pix.`;

const ITENS_LP = [
  "8 módulos, um por semana, também em áudio",
  "Diário e escala da sua vida",
  "Treino de conversa com IA",
  "Plano de segurança",
  "Resumo para levar a um profissional",
];

const HREF_GRATUITO = "/familia/acesso-gratuito";

export function OfertaPrograma({ variante, apelido = "", modulos = [], dataModulo2 }: OfertaProgramaProps) {
  useEffect(() => {
    track("oferta_vista", { variacao: variante });
  }, [variante]);

  const clicar = (acao: string) => () => track("oferta_clicada", { variacao: variante, acao });
  const idTitulo = `oferta-${variante}-titulo`;

  const titulo =
    variante === "lp"
      ? "Quanto custa"
      : variante === "modulo1"
        ? `O módulo 2 chega em ${dataModulo2 ?? ""}`.trim()
        : "Seu programa já está montado";

  const texto =
    variante === "lp"
      ? "O diagnóstico é grátis. Você só paga se quiser seguir com as 8 semanas."
      : variante === "modulo1"
        ? "Na próxima semana, você vai entender o padrão: quando o uso acontece, o que vem antes e o que vem depois. Para seguir, escolha quanto pagar."
        : `As 8 semanas foram pensadas para a sua situação com ${apelido}.`;

  return (
    <section className="oferta-programa" data-variante={variante} aria-labelledby={idTitulo}>
      <div className="oferta-programa-faixa">
        {variante === "lp" ? (
          <>
            <h2 id={idTitulo} className="oferta-programa-rotulo">
              {titulo}
            </h2>
            <p className="oferta-programa-preco">
              R$ {MINIMO} a R$ {MAXIMO}
            </p>
            <p className="oferta-programa-apoio">Você escolhe o valor. Uma vez só, no Pix.</p>
            <p className="oferta-programa-apoio">
              Você tem {DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta. Num toque, sem precisar explicar por quê.
            </p>
          </>
        ) : (
          <>
            <h2 id={idTitulo} className="oferta-programa-titulo">
              {titulo}
            </h2>
            <p className="oferta-programa-apoio">{FAIXA}</p>
          </>
        )}
      </div>

      <div className="oferta-programa-corpo">
        <p className="oferta-programa-texto">{texto}</p>

        {variante === "lp" && (
          <div className="oferta-programa-inclui">
            <p className="oferta-programa-subtitulo">O que inclui</p>
            <ul className="oferta-programa-lista">
              {ITENS_LP.map((item) => (
                <li key={item}>
                  <GlifoCheckCircle size={20} color="var(--colors-brand-primary-800)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {variante === "lp" && (
          <div className="oferta-programa-plano">
            <Badge color="primary">Recomendado</Badge>
            <p className="oferta-programa-plano-nome">Programa com acompanhamento</p>
            <p className="oferta-programa-texto">
              R$ {VALOR_PROGRAMA_COM_ACOMPANHAMENTO} + a primeira sessão com um profissional parceiro, no valor social que você escolher.
            </p>
          </div>
        )}

        {variante === "resultado" && modulos.length > 0 && (
          <ul className="oferta-programa-modulos">
            {modulos.map((tituloDoModulo, indice) => (
              <li key={tituloDoModulo}>
                <GlifoLock size={20} color="var(--colors-neutral-700)" />
                <span>
                  Módulo {indice + 1} · {tituloDoModulo}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="oferta-programa-acoes">
          {variante === "lp" ? (
            <>
              <Button tamanho="medium" larguraTotal href="/familia/checkout?origem=lp" onClick={clicar("garantir_acesso")}>
                Já quero garantir meu acesso
              </Button>
              <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/diagnostico" onClick={clicar("diagnostico")}>
                Começar pelo diagnóstico grátis
              </Button>
            </>
          ) : (
            <>
              <Button tamanho="medium" larguraTotal href={`/familia/checkout?origem=${variante}`} onClick={clicar("escolher_valor")}>
                Escolher meu valor e continuar
              </Button>
              <Button variante="transparent" tamanho="medium" larguraTotal href={`${HREF_GRATUITO}?origem=${variante}`} onClick={clicar("gratuito")}>
                Pedir acesso gratuito
              </Button>
            </>
          )}
        </div>

        {variante === "lp" ? (
          <div className="oferta-programa-rodape">
            <p>
              Nem o valor mínimo cabe agora?{" "}
              <a href={`${HREF_GRATUITO}?origem=lp`} onClick={clicar("gratuito")}>
                Pedir acesso gratuito
              </a>
            </p>
          </div>
        ) : (
          <div className="oferta-programa-rodape">
            <p>{DIAS_PARA_DESISTIR} dias para pedir o dinheiro de volta.</p>
          </div>
        )}
      </div>
    </section>
  );
}
