"use client";

import { Fragment } from "react";
import { GlifoCheckCircle } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { ANOTACOES_PARA_CONCLUIR, contagens, ITEM_ANOTAR_M2 } from "@/lib/familia/diario";
import { diaMes } from "@/lib/familia/escala";
import type { EstadoExercicio, ItemExercicio } from "@/lib/familia/exercicio-cliente";
import { condicoesBatem, type BlocoMarkdown, type Contexto, type Trecho } from "@/lib/familia/markdown";
import { TEXTOS_FRASES } from "@/lib/familia/frases";
import { ITENS_QUE_CONCLUEM_NO_TREINO, ROTULO_TREINO, ROTULO_TREINO_PADRAO } from "@/lib/familia/simulador";
import { TEXTOS_ADIAR } from "@/lib/familia/valorizar";
import { TEXTOS_CONVITE } from "@/lib/familia/convite";
import { track } from "@/lib/mixpanel";

// Itens do exercício da semana (ajuste do fundador de 10/11/2026): cada item é um cartão com o nome
// do item como título, o texto e os botões logo abaixo. O mesmo componente aparece no módulo e no
// painel do programa.
//
// Briefings M1 e M2 (10/11/2026): diário, resumo e "Como foi a conversa" são ferramentas de verdade,
// e o item conclui quando a pessoa termina a ferramenta (a rota do diário e a da conversa marcam).
//
// Briefings M3 e M4 (10/11/2026): reescrever frases, lista do que a pessoa gosta, plano de valorizar e
// "o combinado fica para outro dia" são ferramentas de verdade. "Ver o retorno do treino" abre o último
// retorno do simulador. O item "o combinado fica para outro dia" mostra "Deixado para depois" quando a
// pessoa respondeu que o clima pode ficar tenso.
//
// Briefing M5 (10/11/2026): "Preparar o convite" (5 passos, mostra "Passo X de 5" e só libera o treino
// depois do passo 3) e "Contar como foi o convite" são ferramentas de verdade.
//
// Padrões do briefing 00 (10/11/2026): status "Concluído em DD/MM" com check verde, ou "Ainda não"
// em cinza (item 4); concluído, o item mostra ações secundárias pra ver, editar ou refazer (item 5);
// o botão do treino diz o que vai ser treinado (item 7). Os botões de ferramentas que ainda não
// existem (listas, plano B, frases, convite...) ficam como "Marcar como feito" até a ferramenta existir.

const ROTULO_ACAO: Record<string, string> = {
  marcar: "Marcar como concluído",
  diario: "Anotar um momento difícil",
  momento_bom: "Anotar um momento bom",
  resumo: "Ver o resumo da minha semana",
  contar_conversa: "Contar como foi a conversa",
  treinar_roteiro: "Treinar o meu roteiro",
  plano_seguranca: "Fazer meu plano de segurança",
  roteiro: "Ver o meu roteiro da conversa",
  profissional: "Ver psicólogo parceiro",
  profissionais_semana: "Ver psicólogos parceiros com horário nesta semana",
  servicos: "Ver serviços perto de mim",
  seguranca: "Ver o que fazer em caso de risco",
  escala: "Dar notas e criar minha meta",
  refazer_escala: "Dar notas de novo e comparar",
  escolher_meta: "Criar minha meta",
  frases: TEXTOS_FRASES.comecar,
  gosta: "Fazer a lista do que {{apelido}} gosta",
  valorizar: "Planejar como valorizar",
  adiar: "Escolher o que dizer",
  convite: "Preparar meu convite",
  contar_convite: TEXTOS_CONVITE.contarBotao,
};

// Escala e meta (componentes-parte1, C1): a própria ferramenta marca o item quando a pessoa salva.
const HREF_ACAO: Record<string, string> = {
  escala: "/familia/programa/escala?origem=modulo1",
  refazer_escala: "/familia/programa/escala?origem=modulo7",
  escolher_meta: "/familia/programa/escala?origem=modulo7&etapa=meta",
  diario: "/familia/programa/diario?tipo=dificil",
  momento_bom: "/familia/programa/diario?tipo=bom",
  resumo: "/familia/programa/diario/resumo",
  plano_seguranca: "/familia/seguranca",
  roteiro: "/familia/resultado#primeira-conversa",
  profissional: "/profissionais",
  profissionais_semana: "/profissionais",
  servicos: "/redes-de-apoio?tipo=publicas",
  seguranca: "/familia/seguranca",
  frases: "/familia/programa/frases?modulo=3",
  gosta: "/familia/programa/gosta",
  valorizar: "/familia/programa/valorizar",
  adiar: "/familia/programa/adiar",
  convite: "/familia/programa/convite",
  contar_convite: "/familia/programa/convite/contar",
};

// Ferramentas que são o botão principal do cartão, mesmo com um treino ao lado.
const ACAO_PRINCIPAL = new Set(["marcar", "contar_conversa", "frases", "gosta", "valorizar", "adiar", "convite", "contar_convite"]);

// Itens que, concluídos, só oferecem o que o briefing lista (sem "Treinar de novo" do treino ao lado).
const SEM_TREINO_DEPOIS = new Set(["4:planejar", "5:preparar"]);

// Depois de concluído (briefing 00, item 5): o que dá pra fazer com a ferramenta que já existe.
// Ações fora desta lista continuam como botão secundário, com o mesmo rótulo.
const DEPOIS_DE_CONCLUIDO: Record<string, Array<{ rotulo: string; href: string }>> = {
  escala: [
    { rotulo: "Ver e editar minha meta", href: "/familia/programa/escala?origem=modulo1&etapa=editar" },
    { rotulo: "Fazer a escala de novo", href: "/familia/programa/escala?origem=modulo1" },
  ],
  diario: [
    { rotulo: "Anotar outro momento", href: "/familia/programa/diario?tipo=dificil" },
    { rotulo: "Ver minhas anotações", href: "/familia/programa/diario/anotacoes" },
  ],
  momento_bom: [
    { rotulo: "Anotar outro momento bom", href: "/familia/programa/diario?tipo=bom" },
    { rotulo: "Ver minhas anotações", href: "/familia/programa/diario/anotacoes" },
  ],
  resumo: [{ rotulo: "Ver o resumo de novo", href: "/familia/programa/diario/resumo" }],
  refazer_escala: [
    { rotulo: "Ver e editar", href: "/familia/programa/escala?origem=modulo7&etapa=meta" },
    { rotulo: "Fazer de novo", href: "/familia/programa/escala?origem=modulo7" },
  ],
  escolher_meta: [{ rotulo: "Ver e editar", href: "/familia/programa/escala?origem=modulo7&etapa=editar" }],
  frases: [
    { rotulo: TEXTOS_FRASES.verMinhas, href: "/familia/programa/frases?modulo=3&ver=1" },
    { rotulo: TEXTOS_FRASES.outra, href: "/familia/programa/frases?modulo=3" },
  ],
  gosta: [{ rotulo: "Ver e editar a lista", href: "/familia/programa/gosta" }],
  valorizar: [{ rotulo: "Ver e editar o plano", href: "/familia/programa/valorizar" }],
  adiar: [{ rotulo: "Ver e editar", href: "/familia/programa/adiar" }],
  convite: [{ rotulo: TEXTOS_CONVITE.verEditar, href: "/familia/programa/convite" }],
  contar_convite: [
    { rotulo: "Ver o que você contou", href: "/familia/programa/convite/contar?ver=1" },
    { rotulo: "Contar de novo", href: "/familia/programa/convite/contar" },
  ],
};

// Ações que contam o item como feito ao clicar ("Ver psicólogo parceiro" conta no modo segurança).
// "Fazer meu plano de segurança" também conta: a ferramenta do plano ainda não existe, e o botão leva à página de segurança.
const ACAO_MARCA = new Set(["marcar", "profissional", "profissionais_semana", "plano_seguranca"]);

// Anotações do diário (só tipo e data bastam pra contar).
type AnotacaoContada = { tipo: "dificil" | "bom"; quando: string };

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
  // Anotações recentes do diário, pro contador dos itens que anotam momentos difíceis.
  anotacoes?: AnotacaoContada[];
  // Frases reescritas até agora (contador "n de 3 frases" do módulo 3).
  frasesSalvas?: number;
  // Itens "deixados para depois" (hoje só o "combinado fica para outro dia" do módulo 4).
  deixados?: string[];
  // Último passo concluído do convite (módulo 5), de 0 a 5.
  passoDoConvite?: number;
};

// "3 anotações nesta semana" (0 não aparece) e, no item do módulo 2 ainda aberto, "2 de 3 anotações".
function contadorDoDiario(itemId: string, concluido: boolean, anotacoes: AnotacaoContada[]) {
  const { dificeis } = contagens(anotacoes);
  if (itemId === ITEM_ANOTAR_M2.item && !concluido) return `${dificeis} de ${ANOTACOES_PARA_CONCLUIR} anotações`;
  if (dificeis === 0) return null;
  return `${dificeis} ${dificeis === 1 ? "anotação" : "anotações"} nesta semana`;
}

export function ExercicioSemana({ modulo, itens, estado, apelido, contexto, onMarcar, anotacoes = [], frasesSalvas = 0, deixados = [], passoDoConvite = 0 }: ExercicioSemanaProps) {
  return (
    <div className="familia-exercicio">
      {itens.map((item) => {
        const deixado = deixados.includes(item.id);
        const feitoEm = deixado ? undefined : estado[item.id];
        const { titulo, blocos } = separarTitulo(item.blocos);
        // Treino sem cenário com arquivo não ganha botão.
        const acoes = item.acoes.filter((acao) => (acao !== "simulador" && acao !== "treinar_roteiro") || item.cenario);
        // Item de ação única (só marcar, só diário, só profissional): é o botão principal.
        const acaoUnica = acoes.length === 1;
        // Treino que conclui o item quando termina (briefing M3, card 2): o simulador marca ao mostrar o retorno.
        const concluiNoTreino = ITENS_QUE_CONCLUEM_NO_TREINO.has(`${modulo}:${item.id}`);
        const hrefTreino = `/familia/programa/simulador/${item.cenario}?modulo=${modulo}${concluiNoTreino ? `&item=${item.id}` : ""}`;
        const hrefDaAcao = (acao: string) => (acao === "simulador" || acao === "treinar_roteiro" ? hrefTreino : acao === "contar_conversa" ? `/familia/programa/conversa?modulo=${modulo}` : HREF_ACAO[acao]);
        const contador = item.acoes.includes("diario")
          ? contadorDoDiario(item.id, Boolean(feitoEm), anotacoes)
          : item.acoes.includes("frases")
            ? TEXTOS_FRASES.contador(frasesSalvas)
            : item.acoes.includes("convite") && !feitoEm && passoDoConvite > 0
              ? TEXTOS_CONVITE.passo(passoDoConvite + 1)
              : null;
        // O treino do convite fica ativo depois do passo 3 (briefing M5, card 1).
        const treinoTravado = item.acoes.includes("convite") && passoDoConvite < 3;
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
            ) : deixado ? (
              // Cinza neutro, sem contar como pendente (briefing M4, C5).
              <span className="familia-status label-small-medium">{TEXTOS_ADIAR.deixadoParaDepois}</span>
            ) : (
              <span className="familia-status label-small-medium">Ainda não</span>
            )}
            <div className="familia-exercicio-acoes">
              {feitoEm
                ? acoes
                    .filter((acao) => acao !== "marcar" && acao !== "treinar_roteiro")
                    .flatMap((acao) =>
                      acao === "simulador"
                        ? SEM_TREINO_DEPOIS.has(`${modulo}:${item.id}`)
                          ? []
                          : concluiNoTreino
                            ? [
                                { acao, rotulo: "Ver o retorno do treino", href: `${hrefTreino}&ver=1` },
                                { acao, rotulo: "Treinar de novo", href: hrefTreino },
                              ]
                            : [{ acao, rotulo: "Treinar de novo", href: hrefTreino }]
                        : acao === "contar_conversa"
                          ? [
                              { acao, rotulo: "Ver o que você contou", href: `${hrefDaAcao(acao)}&ver=1` },
                              { acao, rotulo: "Contar de novo", href: hrefDaAcao(acao) },
                            ]
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
                      variante={ACAO_PRINCIPAL.has(acao) || acaoUnica ? "primary" : "secondary"}
                      tamanho="small"
                      disabled={acao === "simulador" && treinoTravado}
                      href={acao === "simulador" && treinoTravado ? undefined : hrefDaAcao(acao)}
                      onClick={rastrear(acao)}
                    >
                      {acao === "simulador" ? aplicarApelido(ROTULO_TREINO[item.cenario as string] ?? ROTULO_TREINO_PADRAO, apelido) : aplicarApelido(ROTULO_ACAO[acao] ?? acao, apelido)}
                    </Button>
                  ))}
            </div>
            {contador && <p className="text-medium-regular familia-texto-suave">{contador}</p>}
          </div>
        );
      })}
    </div>
  );
}
