"use client";

import { Fragment } from "react";
import { GlifoCheckCircle } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { diaMes } from "@/lib/familia/escala";
import type { EstadoExercicio, ItemExercicio } from "@/lib/familia/exercicio-cliente";
import { condicoesBatem, type BlocoMarkdown, type Contexto, type Trecho } from "@/lib/familia/markdown";
import { ROTULO_TREINO, ROTULO_TREINO_PADRAO } from "@/lib/familia/simulador";
import { track } from "@/lib/mixpanel";

// Itens do exercício da semana (ajuste do fundador de 10/11/2026): cada item é um cartão com o nome
// do item como título, o texto e os botões logo abaixo. O mesmo componente aparece no módulo e no
// painel do programa.
//
// Padrões do briefing 00 (10/11/2026): status "Concluído em DD/MM" com check verde, ou "Ainda não"
// em cinza (item 4); concluído, o item mostra ações secundárias pra ver, editar ou refazer (item 5);
// o botão do treino diz o que vai ser treinado (item 7). Os botões de ferramentas que ainda não
// existem (listas, plano B, frases, convite...) ficam como "Marcar como feito" até a ferramenta existir.

const ROTULO_ACAO: Record<string, string> = {
  marcar: "Marcar como concluído",
  diario: "Anotar um momento difícil",
  momento_bom: "Anotar um momento bom com {{apelido}}",
  roteiro: "Ver o meu roteiro da conversa",
  profissional: "Ver psicólogo parceiro",
  profissionais_semana: "Ver psicólogos parceiros com horário nesta semana",
  servicos: "Ver serviços perto de mim",
  seguranca: "Ver o que fazer em caso de risco",
  escala: "Dar notas e criar minha meta",
  refazer_escala: "Dar notas de novo e comparar",
  escolher_meta: "Criar minha meta",
};

// Escala e meta (componentes-parte1, C1): a própria ferramenta marca o item quando a pessoa salva.
const HREF_ACAO: Record<string, string> = {
  escala: "/familia/programa/escala?origem=modulo1",
  refazer_escala: "/familia/programa/escala?origem=modulo7",
  escolher_meta: "/familia/programa/escala?origem=modulo7&etapa=meta",
  diario: "/familia/programa/diario",
  momento_bom: "/familia/programa/diario?tipo=momento_bom",
  roteiro: "/familia/resultado#primeira-conversa",
  profissional: "/profissionais",
  profissionais_semana: "/profissionais",
  servicos: "/redes-de-apoio?tipo=publicas",
  seguranca: "/familia/seguranca",
};

// Depois de concluído (briefing 00, item 5): o que dá pra fazer com a ferramenta que já existe.
// Ações fora desta lista continuam como botão secundário, com o mesmo rótulo.
const DEPOIS_DE_CONCLUIDO: Record<string, Array<{ rotulo: string; href: string }>> = {
  escala: [
    { rotulo: "Ver e editar", href: "/familia/programa/escala?origem=modulo1&etapa=meta" },
    { rotulo: "Fazer de novo", href: "/familia/programa/escala?origem=modulo1" },
  ],
  refazer_escala: [
    { rotulo: "Ver e editar", href: "/familia/programa/escala?origem=modulo7&etapa=meta" },
    { rotulo: "Fazer de novo", href: "/familia/programa/escala?origem=modulo7" },
  ],
  escolher_meta: [{ rotulo: "Ver e editar", href: "/familia/programa/escala?origem=modulo7&etapa=editar" }],
};

// Ações que contam o item como feito ao clicar ("Ver psicólogo parceiro" conta no modo segurança).
const ACAO_MARCA = new Set(["marcar", "profissional", "profissionais_semana"]);

// O nome do item é o negrito que abre o texto ("**Anotar os momentos difíceis**", "**Como está a sua vida:**
// dê notas..."). Ele vira o título do cartão; o resto do parágrafo segue como texto.
function separarTitulo(blocos: BlocoMarkdown[]): { titulo: string | null; blocos: BlocoMarkdown[] } {
  const [primeiro, ...resto] = blocos;
  if (primeiro?.tipo !== "paragrafo" || !primeiro.trechos[0]?.negrito) return { titulo: null, blocos };
  const titulo = primeiro.trechos[0].texto.trim().replace(/:$/, "");
  const trechos: Trecho[] = primeiro.trechos.slice(1);
  if (trechos.length > 0) {
    const inicio = trechos[0].texto.trimStart();
    trechos[0] = { ...trechos[0], texto: inicio.charAt(0).toUpperCase() + inicio.slice(1) };
  }
  const sobra = trechos.some((trecho) => trecho.texto.trim()) ? [{ ...primeiro, trechos }, ...resto] : resto;
  return { titulo, blocos: sobra };
}

function Texto({ blocos, apelido, contexto }: { blocos: BlocoMarkdown[]; apelido: string; contexto: Contexto }) {
  return (
    <>
      {blocos.map((bloco, indice) => {
        // Variação dentro do item (ex.: "Anotar os momentos difíceis" por problema marcado).
        if (bloco.tipo === "condicional") {
          return condicoesBatem(bloco.condicoes, contexto) ? <Texto key={indice} blocos={bloco.blocos} apelido={apelido} contexto={contexto} /> : null;
        }
        if (bloco.tipo !== "paragrafo") return null;
        return (
          <p key={indice} className="text-large">
            {bloco.trechos.map((trecho, posicao) =>
              trecho.negrito ? <strong key={posicao}>{aplicarApelido(trecho.texto, apelido)}</strong> : <Fragment key={posicao}>{aplicarApelido(trecho.texto, apelido)}</Fragment>,
            )}
          </p>
        );
      })}
    </>
  );
}

type ExercicioSemanaProps = {
  modulo: number;
  itens: ItemExercicio[];
  estado: EstadoExercicio;
  apelido: string;
  contexto: Contexto;
  onMarcar: (item: string) => void;
};

export function ExercicioSemana({ modulo, itens, estado, apelido, contexto, onMarcar }: ExercicioSemanaProps) {
  return (
    <div className="familia-exercicio">
      {itens.map((item) => {
        const feitoEm = estado[item.id];
        const { titulo, blocos } = separarTitulo(item.blocos);
        // Treino sem cenário com arquivo não ganha botão.
        const acoes = item.acoes.filter((acao) => acao !== "simulador" || item.cenario);
        // Item de ação única (só marcar, só diário, só profissional): é o botão principal.
        const acaoUnica = acoes.length === 1;
        const hrefTreino = `/familia/programa/simulador/${item.cenario}?modulo=${modulo}`;
        const rastrear = (acao: string) => () => {
          track("exercicio_acao", { modulo, item: item.id, acao });
          if (!feitoEm && ACAO_MARCA.has(acao)) onMarcar(item.id);
        };

        return (
          <div key={item.id} className="familia-cartao familia-exercicio-item" data-feito={Boolean(feitoEm)}>
            {titulo && <h3 className="header-small">{aplicarApelido(titulo, apelido)}</h3>}
            <Texto blocos={blocos} apelido={apelido} contexto={contexto} />
            {feitoEm ? (
              <span className="familia-status label-small-medium" data-estado="feito" role="status">
                <GlifoCheckCircle size={20} color="var(--colors-status-success-500)" />
                Concluído em {diaMes(feitoEm)}
              </span>
            ) : (
              <span className="familia-status label-small-medium">Ainda não</span>
            )}
            <div className="familia-exercicio-acoes">
              {feitoEm
                ? acoes
                    .filter((acao) => acao !== "marcar")
                    .flatMap((acao) =>
                      acao === "simulador"
                        ? [{ acao, rotulo: "Treinar de novo", href: hrefTreino }]
                        : (DEPOIS_DE_CONCLUIDO[acao] ?? [{ rotulo: aplicarApelido(ROTULO_ACAO[acao] ?? acao, apelido), href: HREF_ACAO[acao] }]).map((depois) => ({ acao, ...depois })),
                    )
                    .map(({ acao, rotulo, href }) => (
                      <Button key={`${acao}-${rotulo}`} variante="secondary" tamanho="small" href={href} onClick={rastrear(acao)}>
                        {rotulo}
                      </Button>
                    ))
                : acoes.map((acao) => (
                    <Button
                      key={acao}
                      variante={acao === "marcar" || acaoUnica ? "primary" : "secondary"}
                      tamanho="small"
                      href={acao === "simulador" ? hrefTreino : HREF_ACAO[acao]}
                      onClick={rastrear(acao)}
                    >
                      {acao === "simulador" ? aplicarApelido(ROTULO_TREINO[item.cenario as string] ?? ROTULO_TREINO_PADRAO, apelido) : aplicarApelido(ROTULO_ACAO[acao] ?? acao, apelido)}
                    </Button>
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
