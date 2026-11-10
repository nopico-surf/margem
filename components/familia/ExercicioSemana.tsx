"use client";

import { Fragment } from "react";
import { Button } from "@/components/ui/Button";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import type { EstadoExercicio, ItemExercicio } from "@/lib/familia/exercicio-cliente";
import { condicoesBatem, type BlocoMarkdown, type Contexto } from "@/lib/familia/markdown";
import { track } from "@/lib/mixpanel";

// Itens do exercício da semana (ajuste do fundador de 10/11/2026): cada item é um cartão com o texto
// e os botões logo abaixo. Feito, o "Marcar como feito" (ou o botão único do item) vira
// "Feito ✓ em DD/MM". O mesmo componente aparece no módulo e no painel do programa.
//
// Rótulos do conteúdo v2. Os botões de ferramentas que ainda não existem (escala, listas, plano B,
// plano de segurança...) ficam como "Marcar como feito" no markdown até a ferramenta existir.

const ROTULO_ACAO: Record<string, string> = {
  marcar: "Marcar como feito",
  diario: "Fazer uma anotação",
  momento_bom: "Anotar um momento bom",
  roteiro: "Ver meu roteiro",
  simulador: "Ensaiar no treino",
  profissional: "Ver psicólogo parceiro",
  profissionais_semana: "Ver psicólogos parceiros com horário nesta semana",
  servicos: "Ver serviços perto de mim",
  seguranca: "Ver o que fazer em caso de risco",
  escala: "Fazer minha escala",
  refazer_escala: "Refazer minha escala",
  escolher_meta: "Escolher minha meta",
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

// Ações que contam o item como feito ao clicar ("Ver psicólogo parceiro" conta no modo segurança).
const ACAO_MARCA = new Set(["marcar", "profissional", "profissionais_semana"]);

function formatarData(iso: string) {
  const data = new Date(iso);
  return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}`;
}

function Texto({ blocos, apelido, contexto }: { blocos: BlocoMarkdown[]; apelido: string; contexto: Contexto }) {
  return (
    <>
      {blocos.map((bloco, indice) => {
        // Variação dentro do item (ex.: "Observar sem reagir" por problema marcado).
        if (bloco.tipo === "condicional") {
          return condicoesBatem(bloco.condicoes, contexto) ? <Texto key={indice} blocos={bloco.blocos} apelido={apelido} contexto={contexto} /> : null;
        }
        if (bloco.tipo !== "paragrafo") return null;
        return (
          <p key={indice} className="text-medium-regular">
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
        // Sem cenário com arquivo, o "Ensaiar no treino" não aparece.
        const acoes = item.acoes.filter((acao) => acao !== "simulador" || item.cenario);
        // Item de ação única (só marcar, só diário, só profissional): feito, o botão vira o selo.
        const acaoUnica = acoes.length === 1;
        return (
          <div key={item.id} className="familia-cartao familia-exercicio-item" data-feito={Boolean(feitoEm)}>
            <Texto blocos={item.blocos} apelido={apelido} contexto={contexto} />
            <div className="familia-exercicio-acoes">
              {acoes.map((acao) => {
                const vira = feitoEm && (acao === "marcar" || acaoUnica);
                if (vira) {
                  return (
                    <span key={acao} className="familia-exercicio-feito label-medium-medium" role="status">
                      Feito ✓ em {formatarData(feitoEm)}
                    </span>
                  );
                }
                const href = acao === "simulador" ? `/familia/programa/simulador/${item.cenario}` : HREF_ACAO[acao];
                const principal = acao === "marcar" || acaoUnica;
                return (
                  <Button
                    key={acao}
                    variante={principal ? "primary" : "secondary"}
                    tamanho="small"
                    href={href}
                    onClick={() => {
                      track("exercicio_acao", { modulo, item: item.id, acao });
                      if (ACAO_MARCA.has(acao)) onMarcar(item.id);
                    }}
                  >
                    {ROTULO_ACAO[acao] ?? acao}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
