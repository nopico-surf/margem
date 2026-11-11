"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { minuscula, resumirSemana, valorUnico, type Anotacao } from "@/lib/familia/diario";
import { BUSCA_DO_DIARIO, GRUPOS_DE_IDEIAS, MAXIMO_ITEM_GOSTA, TEXTOS_GOSTA, type BuscaId } from "@/lib/familia/valorizar";
import { track } from "@/lib/mixpanel";

// "Do que {{apelido}} gosta" (briefing M4, ferramenta A). Duas coisas que a pessoa gosta de fazer sem
// usar, com ideias agrupadas pela busca do diário (a mais marcada abre primeiro; as outras ficam em
// "Ver mais ideias"). Sem dado no diário, todas as ideias ficam abertas. Salvar volta ao módulo, onde o
// card mostra "Concluído em DD/MM". Voltar a esta tela abre a lista já preenchida ("Ver e editar a lista").
//
// [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a
// ficar disponível.

type Lido = { apelido: string };
type Guardado = { itens: string[]; busca_relacionada: BuscaId | null };

export function GostaCliente() {
  const router = useRouter();
  const [dados, setDados] = useState<Lido | null>(null);
  const [itens, setItens] = useState(["", ""]);
  const [resumo, setResumo] = useState<ReturnType<typeof resumirSemana> | null>(null);
  const [maisIdeias, setMaisIdeias] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const lido = (await resposta.json()) as Lido;
      const [diario, guardado] = await Promise.all([
        chamarApi("/api/familia/diario").then(async (r) => (r?.ok ? ((await r.json()) as { anotacoes: Anotacao[] }).anotacoes : [])),
        chamarApi("/api/familia/valorizar").then(async (r) => (r?.ok ? ((await r.json()) as { gosta: Guardado | null }).gosta : null)),
      ]);
      setResumo(resumirSemana(diario));
      if (guardado) setItens([guardado.itens[0] ?? "", guardado.itens[1] ?? ""]);
      setDados(lido);
    })();
  }, [router]);

  if (!dados || !resumo) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const t = (texto: string) => aplicarApelido(texto, dados.apelido);
  // Este texto só sabe falar de uma busca, um dia e um período: com empate (briefing M2b), cai no "sem diário".
  const buscou = valorUnico(resumo.buscou);
  const dia = valorUnico(resumo.dia);
  const periodo = valorUnico(resumo.periodo);
  const buscaDoDiario = buscou ? (BUSCA_DO_DIARIO[buscou] ?? null) : null;
  const comDiario = Boolean(buscou && dia && periodo);
  const gruposAbertos = buscaDoDiario ? GRUPOS_DE_IDEIAS.filter((grupo) => grupo.id === buscaDoDiario) : GRUPOS_DE_IDEIAS;
  const gruposRecolhidos = buscaDoDiario ? GRUPOS_DE_IDEIAS.filter((grupo) => grupo.id !== buscaDoDiario) : [];
  const preenchidos = itens.filter((item) => item.trim()).length;

  // Tocar numa ideia entra no primeiro campo vazio; com os dois cheios, troca o segundo.
  function usarIdeia(ideia: string) {
    setItens((atuais) => {
      const vazio = atuais.findIndex((item) => !item.trim());
      const alvo = vazio === -1 ? 1 : vazio;
      return atuais.map((item, indice) => (indice === alvo ? ideia.slice(0, MAXIMO_ITEM_GOSTA) : item));
    });
  }

  async function salvar() {
    setSalvando(true);
    const resposta = await chamarApi("/api/familia/valorizar", {
      method: "POST",
      body: JSON.stringify({ tipo: "gosta", dados: { itens, busca_relacionada: buscaDoDiario } }),
    });
    setSalvando(false);
    if (!resposta?.ok) return;
    // Só quantos itens e de qual busca, nunca o texto.
    track("lista_gosta_salva", { itens: preenchidos, busca: buscaDoDiario });
    router.push("/familia/programa/modulo/4");
  }

  const grupo = (g: (typeof GRUPOS_DE_IDEIAS)[number]) => (
    <div key={g.id} className="escala-meta-grupo">
      <p className="label-medium-medium">{g.rotulo}</p>
      <div className="familia-chips escala-chips">
        {g.ideias.map((ideia) => (
          <Button key={ideia} tamanho="small" redondo variante="secondary" onClick={() => usarIdeia(t(ideia))}>
            {t(ideia)}
          </Button>
        ))}
      </div>
    </div>
  );

  // Texto do diário com a busca, o dia e o período em negrito.
  const textoDoDiario = t(TEXTOS_GOSTA.comDiario)
    .split(/(\{\{buscou\}\}|\{\{dia\}\}|\{\{periodo\}\})/)
    .map((parte, indice) => {
      const valor = parte === "{{buscou}}" ? minuscula(buscou ?? "") : parte === "{{dia}}" ? dia : parte === "{{periodo}}" ? periodo : null;
      return valor ? <strong key={indice}>{valor}</strong> : <Fragment key={indice}>{parte}</Fragment>;
    });

  return (
    <section className="familia-pergunta">
      <div className="familia-pergunta-topo">
        <button className="familia-voltar" type="button" aria-label="Voltar ao módulo" onClick={() => router.push("/familia/programa/modulo/4")}>
          <GlifoArrowBack size={24} />
        </button>
      </div>
      <header className="familia-titulo">
        <h1 className="header-large">{t(TEXTOS_GOSTA.titulo)}</h1>
        <p className="text-large">{t(TEXTOS_GOSTA.intro)}</p>
      </header>

      <div className="familia-cartao">
        <p className="text-large">{comDiario ? textoDoDiario : t(TEXTOS_GOSTA.semDiario)}</p>
      </div>

      {gruposAbertos.map(grupo)}
      {gruposRecolhidos.length > 0 &&
        (maisIdeias ? (
          gruposRecolhidos.map(grupo)
        ) : (
          <Button variante="secondary" tamanho="small" onClick={() => setMaisIdeias(true)}>
            {TEXTOS_GOSTA.maisIdeias}
          </Button>
        ))}

      <div className="escala-meta-grupo">
        <InputText id="gosta-1" rotulo={t(TEXTOS_GOSTA.campoRotulo)} descricao={t(TEXTOS_GOSTA.campoDica)} value={itens[0]} maxLength={MAXIMO_ITEM_GOSTA} autoComplete="off" onChange={(valor) => setItens([valor, itens[1]])} />
        <InputText id="gosta-2" rotulo={t(TEXTOS_GOSTA.campoRotulo)} value={itens[1]} maxLength={MAXIMO_ITEM_GOSTA} autoComplete="off" onChange={(valor) => setItens([itens[0], valor])} />
        {preenchidos === 1 && <p className="text-medium-regular familia-texto-suave">{TEXTOS_GOSTA.maisUma}</p>}
      </div>

      <Button tamanho="medium" larguraTotal disabled={preenchidos === 0} carregando={salvando} onClick={salvar}>
        {TEXTOS_GOSTA.salvar}
      </Button>
    </section>
  );
}
