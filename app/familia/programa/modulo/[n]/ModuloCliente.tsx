"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { GlifoCheckCircle } from "@/components/icons/glifos";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { CHAVE_POSICAO_AUDIO, MOSTRAR_REVISAO_CLINICA } from "@/lib/familia/config";
import { vendaSimulada } from "@/lib/familia/dev";
import { dataDoModulo, moduloChegou } from "@/lib/familia/oferta";
import { OfertaPrograma } from "@/components/familia/OfertaPrograma";
import type { Modulo } from "@/lib/familia/conteudo";
import { SERVICOS_DO_CONVITE, VERSAO_DO_MODULO8, type Convite } from "@/lib/familia/convite";
import { aplicarApelido, ROTULO_PROBLEMA, type Problema } from "@/lib/familia/diagnostico";
import { AREAS, diaMes, type Escala, type Notas } from "@/lib/familia/escala";
import { ITEM_PAUSA_M8 } from "@/lib/familia/modulo8";
import { carregarEstado, contextoDo, itensDoExercicio, marcarFeito, type EstadoExercicio } from "@/lib/familia/exercicio-cliente";
import { condicoesBatem, opcoesDaEscolha, type BlocoMarkdown, type Contexto, type Trecho } from "@/lib/familia/markdown";
import { ExercicioSemana } from "@/components/familia/ExercicioSemana";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";
import type { ProfissionalCadastrado } from "@/lib/supabase";
import { track } from "@/lib/mixpanel";

type AnotacaoContada = { tipo: "dificil" | "bom"; quando: string };
type Diagnostico = { apelido: string; problemas: Problema[]; reacoes: string[]; resultado: { safetyMode: boolean } };

function Trechos({ trechos, apelido }: { trechos: Trecho[]; apelido: string }) {
  return (
    <>
      {trechos.map((trecho, indice) =>
        trecho.negrito ? <strong key={indice}>{aplicarApelido(trecho.texto, apelido)}</strong> : <Fragment key={indice}>{aplicarApelido(trecho.texto, apelido)}</Fragment>,
      )}
    </>
  );
}

type BlocosProps = {
  blocos: BlocoMarkdown[];
  apelido: string;
  problemas: Problema[];
  contexto: Contexto;
  onEscolher: (id: string, valor: string) => void;
  // Itens do exercício, desenhados no lugar do primeiro ":::exercicio" do texto (só no nível de cima).
  exercicio?: ReactNode;
  // Resumo das 8 semanas, no lugar da linha "@resumo" (encerramento do módulo 8).
  resumo?: ReactNode;
};

// Resumo visual do encerramento (briefing M8, C12): as notas da escala do módulo 1 ao 7 (se houver),
// quantas anotações no diário e quantas frases salvas. Sem IA, só contagem.
export type DadosDoResumo = { antes: Notas | null; depois: Notas | null; anotacoes: number; frases: number };

function ResumoDoPrograma({ dados }: { dados: DadosDoResumo }) {
  const { antes, depois, anotacoes, frases } = dados;
  const areas = antes && depois ? AREAS.filter((area) => typeof antes[area.id] === "number" || typeof depois[area.id] === "number") : [];
  return (
    <div className="familia-cartao">
      {areas.length > 0 && antes && depois && (
        <>
          <h3 className="header-small">Como está a sua vida</h3>
          <ul className="familia-lista text-large">
            {areas.map((area) => (
              <li key={area.id}>
                {area.nome}: {antes[area.id] ?? "-"} → {depois[area.id] ?? "-"}
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="text-large">
        <strong>{anotacoes}</strong> {anotacoes === 1 ? "anotação no diário" : "anotações no diário"}
      </p>
      <p className="text-large">
        <strong>{frases}</strong> {frases === 1 ? "frase salva" : "frases salvas"}
      </p>
    </div>
  );
}

function Blocos({ blocos, apelido, problemas, contexto, onEscolher, exercicio, resumo }: BlocosProps) {
  const posicaoDoExercicio = exercicio ? blocos.findIndex((bloco) => bloco.tipo === "exercicio") : -1;
  return (
    <>
      {blocos.map((bloco, indice) => {
        if (bloco.tipo === "titulo") return <h2 key={indice} className="header-medium">{aplicarApelido(bloco.texto, apelido)}</h2>;
        if (bloco.tipo === "resumo") return <Fragment key={indice}>{resumo}</Fragment>;
        if (bloco.tipo === "link")
          return (
            <div key={indice} className="familia-exercicio-acoes">
              <Button variante={bloco.botao ? "secondary" : "transparent"} tamanho="small" href={bloco.href}>
                {bloco.rotulo}
              </Button>
            </div>
          );
        // Seletor (módulo 8, "Como estão as coisas agora?"): os mesmos chips do "Como {{apelido}}
        // costuma reagir?" do simulador. Sem escolha, nada das versões aparece.
        if (bloco.tipo === "escolha") {
          const { pergunta, opcoes } = opcoesDaEscolha(bloco);
          const escolhida = contexto.escolhas?.[bloco.id];
          return (
            <Fragment key={indice}>
              <h2 className="header-medium">{aplicarApelido(pergunta, apelido)}</h2>
              <div className="familia-chips" role="group" aria-label={aplicarApelido(pergunta, apelido)}>
                {opcoes.map((opcao) => (
                  <Button
                    key={opcao.valor}
                    tamanho="x-small"
                    redondo
                    variante={escolhida === opcao.valor ? "primary" : "secondary"}
                    onClick={() => onEscolher(bloco.id, opcao.valor)}
                  >
                    {aplicarApelido(opcao.rotulo, apelido)}
                  </Button>
                ))}
              </div>
            </Fragment>
          );
        }
        if (bloco.tipo === "paragrafo")
          return (
            <p key={indice} className="text-large">
              <Trechos trechos={bloco.trechos} apelido={apelido} />
            </p>
          );
        if (bloco.tipo === "lista") {
          const Lista = bloco.ordenada ? "ol" : "ul";
          return (
            <Lista key={indice} className="familia-lista text-large">
              {bloco.itens.map((item, posicao) => (
                <li key={posicao}>
                  <Trechos trechos={item} apelido={apelido} />
                </li>
              ))}
            </Lista>
          );
        }
        // Itens do exercício: todos juntos, com os botões (ExercicioSemana), no lugar do primeiro.
        if (bloco.tipo === "exercicio") return indice === posicaoDoExercicio ? <Fragment key={indice}>{exercicio}</Fragment> : null;
        // Bloco condicional (ex.: só pro problema principal): o texto entra solto, sem moldura.
        if (bloco.tipo === "condicional") {
          if (!condicoesBatem(bloco.condicoes, contexto)) return null;
          return <Blocos key={indice} blocos={bloco.blocos} apelido={apelido} problemas={problemas} contexto={contexto} onEscolher={onEscolher} />;
        }
        // Variação (formato antigo): só pra quem marcou aquele problema na Q3.
        if (!problemas.includes(bloco.problema as Problema)) return null;
        return (
          <div key={indice} className="familia-variacao">
            <span className="label-small-medium">{ROTULO_PROBLEMA[bloco.problema as Problema] ?? bloco.problema}</span>
            <Blocos blocos={bloco.blocos} apelido={apelido} problemas={problemas} contexto={contexto} onEscolher={onEscolher} />
          </div>
        );
      })}
    </>
  );
}

// `emRevisao`: o módulo chegou sem o texto (produção, antes da revisão clínica). Quem comprou vê o
// título e volta ao painel; quem não comprou, a página de módulo bloqueado.
// `enderecos`: página de cada profissional ativo, por id (só no módulo 8, pro "Retomar o apoio").
// `profissionais`: lista do carrossel do fim do módulo (só nos módulos 5 e 6, briefing M56).
export function ModuloCliente({
  modulo,
  emRevisao = false,
  enderecos,
  profissionais,
}: {
  modulo: Modulo;
  emRevisao?: boolean;
  enderecos?: Record<string, string>;
  profissionais?: ProfissionalCadastrado[];
}) {
  const router = useRouter();
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  // Data em que o módulo foi concluído (a primeira vez vale), ou null.
  const [concluidoEm, setConcluidoEm] = useState<string | null>(null);
  const [concluindo, setConcluindo] = useState(false);
  const [estado, setEstado] = useState<EstadoExercicio>({});
  const [anotacoes, setAnotacoes] = useState<AnotacaoContada[]>([]);
  // Frases reescritas (módulo 3) e itens deixados para depois (módulo 4).
  const [frasesSalvas, setFrasesSalvas] = useState(0);
  const [deixados, setDeixados] = useState<string[]>([]);
  const [passoDoConvite, setPassoDoConvite] = useState(0);
  // Módulo 8: o convite salvo (data do "dar um tempo" e profissional de antes) e o resumo do encerramento.
  const [convite, setConvite] = useState<Convite | null>(null);
  const [resumo, setResumo] = useState<DadosDoResumo | null>(null);
  // Respostas dos seletores do módulo (":::escolha"). Ficam só nesta tela: o check-in que pré-marcaria
  // o seletor ainda não existe.
  const [escolhas, setEscolhas] = useState<Record<string, string>>({});
  // Compra e liberação semanal (briefing 01). `acesso` null enquanto não se sabe: o banner do módulo 1
  // só aparece com a resposta. `acesso` "bloqueado": sem compra; "chega_em": comprou, mas a semana do
  // módulo ainda não chegou.
  const [acessoLiberado, setAcessoLiberado] = useState<boolean | null>(null);
  const [modulo1ConcluidoEm, setModulo1ConcluidoEm] = useState<string | null>(null);
  const [acesso, setAcesso] = useState<"aberto" | "bloqueado" | "chega_em" | null>(null);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const lido = (await resposta.json()) as Diagnostico;
      const [perfil, progresso] = await Promise.all([chamarApi("/api/familia/perfil"), chamarApi("/api/familia/progresso")]);
      const liberado = perfil?.ok ? ((await perfil.json()) as { acessoLiberado: boolean }).acessoLiberado : false;
      const modulos = progresso?.ok ? ((await progresso.json()) as { modulos: Record<string, { concluido_em: string | null }> }).modulos : {};
      const concluidoM1 = modulos[1]?.concluido_em ?? null;
      setAcessoLiberado(liberado);
      setModulo1ConcluidoEm(concluidoM1);
      setConcluidoEm(modulos[modulo.numero]?.concluido_em ?? null);

      // Todos os módulos só com a compra (briefing 01b), e do 2 ao 8 depois da semana deles. No
      // localhost, como antes, todos abrem pra revisão, a menos que a venda simulada esteja ligada
      // (lib/familia/dev.ts).
      const travar = !MOSTRAR_REVISAO_CLINICA || vendaSimulada();
      const situacao = !travar
        ? "aberto"
        : !liberado
          ? "bloqueado"
          : moduloChegou(modulo.numero, concluidoM1) && !emRevisao
            ? "aberto"
            : "chega_em";
      setAcesso(situacao);
      setDiagnostico(lido);
      if (situacao !== "aberto") return;

      setEstado(await carregarEstado(modulo.numero));
      // Contador "n anotações nesta semana" dos itens do diário.
      if (modulo.blocos.some((bloco) => bloco.tipo === "exercicio" && bloco.acoes.includes("diario"))) {
        const diario = await chamarApi("/api/familia/diario");
        if (diario?.ok) setAnotacoes(((await diario.json()) as { anotacoes: AnotacaoContada[] }).anotacoes);
      }
      const temAcao = (acao: string) => modulo.blocos.some((bloco) => bloco.tipo === "exercicio" && bloco.acoes.includes(acao));
      if (temAcao("frases")) {
        const frases = await chamarApi("/api/familia/frases");
        if (frases?.ok) setFrasesSalvas(((await frases.json()) as { frases: unknown[] }).frases.length);
      }
      if (temAcao("adiar")) {
        const valorizar = await chamarApi("/api/familia/valorizar");
        const clima = valorizar?.ok ? ((await valorizar.json()) as { adiar: { clima: string } | null }).adiar?.clima : null;
        if (clima === "sim" || clima === "nao_sei") setDeixados(["situacao"]);
      }
      // Convite (briefing M5): o passo do "Preparar o convite" no módulo 5 e, no módulo 8, a versão que
      // o "Contar como foi" escolhe ("Vou pensar" deixa o seletor como está).
      const temEscolhaVersao = modulo.blocos.some((bloco) => bloco.tipo === "escolha" && bloco.id === "versao");
      if (temAcao("convite") || temEscolhaVersao) {
        const resposta = await chamarApi("/api/familia/convite");
        const guardado = resposta?.ok ? ((await resposta.json()) as { convite: Convite | null }).convite : null;
        setPassoDoConvite(guardado?.passo ?? 0);
        setConvite(guardado);
        const versao = guardado?.resultado ? VERSAO_DO_MODULO8[guardado.resultado] : undefined;
        if (temEscolhaVersao && versao) setEscolhas((atuais) => ({ ...atuais, versao }));
      }
      // Encerramento do módulo 8: a escala do módulo 7 ao lado da anterior (as duas últimas), o diário e as frases.
      if (modulo.blocos.some((bloco) => bloco.tipo === "resumo")) {
        const [escalas, diario, frases] = await Promise.all([
          chamarApi("/api/familia/escala").then(async (r) => (r?.ok ? ((await r.json()) as { escalas: Escala[] }).escalas : [])),
          chamarApi("/api/familia/diario").then(async (r) => (r?.ok ? ((await r.json()) as { anotacoes: unknown[] }).anotacoes.length : 0)),
          chamarApi("/api/familia/frases").then(async (r) => (r?.ok ? ((await r.json()) as { frases: unknown[] }).frases.length : 0)),
        ]);
        const comparar = escalas[0]?.origem === "modulo7" && escalas[1];
        setResumo({ antes: comparar ? escalas[1].notas : null, depois: comparar ? escalas[0].notas : null, anotacoes: diario, frases });
      }
      track(modulo.numero === 1 ? "modulo1_iniciado" : "modulo_iniciado", { modulo: modulo.numero });
      void chamarApi("/api/familia/progresso", { method: "POST", body: JSON.stringify({ modulo: modulo.numero, acao: "iniciar" }) });
    })();
  }, [modulo.numero, router, emRevisao]);

  if (!diagnostico || !acesso) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const { apelido, problemas } = diagnostico;

  // Módulo bloqueado (briefing 01, variação d): o título, "O que você vai aprender" (os dois primeiros
  // subtítulos do texto do módulo) e o banner. Nunca a página vazia ou um erro.
  if (acesso === "bloqueado") {
    const aprender = modulo.blocos.filter((bloco): bloco is Extract<BlocoMarkdown, { tipo: "titulo" }> => bloco.tipo === "titulo").slice(0, 2);
    return (
      <article className="familia-secao familia-modulo">
        <header className="familia-titulo">
          <span className="label-small-medium familia-texto-suave">Módulo {modulo.numero}</span>
          <h1 className="header-large">{modulo.titulo}</h1>
        </header>
        {aprender.length > 0 && (
          <section className="familia-titulo">
            <h2 className="header-medium">O que você vai aprender</h2>
            <ul className="oferta-aprender">
              {aprender.map((bloco) => (
                <li key={bloco.texto} className="text-large">
                  {aplicarApelido(bloco.texto, apelido)}
                </li>
              ))}
            </ul>
          </section>
        )}
        <OfertaPrograma variante="bloqueado" apelido={apelido} />
      </article>
    );
  }

  // Comprou, mas a semana do módulo ainda não chegou: a liberação semanal continua valendo.
  if (acesso === "chega_em") {
    // Em revisão, a data da semana pode já ter passado: sem data, pra não prometer o que não dá.
    const chegaEm = emRevisao ? null : dataDoModulo(modulo.numero, modulo1ConcluidoEm);
    return (
      <article className="familia-secao familia-modulo">
        <header className="familia-titulo">
          <span className="label-small-medium familia-texto-suave">Módulo {modulo.numero}</span>
          <h1 className="header-large">{modulo.titulo}</h1>
        </header>
        {chegaEm && <span className="familia-status label-small-medium">Chega em {diaMes(chegaEm.toISOString())}</span>}
        <div className="familia-acoes">
          <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
            Voltar ao painel
          </Button>
        </div>
      </article>
    );
  }
  const contexto: Contexto = { ...contextoDo(diagnostico), escolhas };
  const escolher = (id: string, valor: string) => setEscolhas((atuais) => ({ ...atuais, [id]: valor }));
  const itens = itensDoExercicio(modulo.blocos, contexto);

  async function marcar(item: string) {
    if (estado[item]) return;
    setEstado((atual) => ({ ...atual, [item]: new Date().toISOString() }));
    await marcarFeito(modulo.numero, item);
  }

  // "Dar um tempo no assunto" (módulo 8): grava a data no convite e conclui o item.
  async function escolherPausa(data: string) {
    const resposta = await chamarApi("/api/familia/convite", { method: "POST", body: JSON.stringify({ tipo: "pausa", data_retorno: data }) });
    if (!resposta?.ok) return false;
    setConvite(((await resposta.json()) as { convite: Convite }).convite);
    await marcar(ITEM_PAUSA_M8);
    return true;
  }

  // "Retomar o apoio" (módulo 8): o primeiro profissional ou serviço salvo no convite que ainda existe.
  const retomarHref =
    convite?.profissionais_salvos.map((id) => SERVICOS_DO_CONVITE.find((servico) => servico.id === id)?.href ?? enderecos?.[id]).find(Boolean) ?? null;

  async function concluir() {
    setConcluindo(true);
    const resposta = await chamarApi("/api/familia/progresso", { method: "POST", body: JSON.stringify({ modulo: modulo.numero, acao: "concluir" }) });
    setConcluindo(false);
    if (resposta?.ok) {
      setConcluidoEm(new Date().toISOString());
      track("modulo_concluido", { modulo: modulo.numero });
    }
  }

  return (
    <article className="familia-secao familia-modulo">
      <header className="familia-titulo">
        <span className="label-small-medium familia-texto-suave">
          Módulo {modulo.numero}
          {modulo.minutos ? ` · ${modulo.minutos} min de leitura` : ""}
        </span>
        <h1 className="header-large">{modulo.titulo}</h1>
      </header>

      {modulo.video && (
        // Vídeo vertical, no formato dos reels da Margem. Sem vídeo, nada aparece.
        <video className="familia-video" src={modulo.video} controls playsInline preload="metadata" />
      )}
      {modulo.audio && (
        <AudioPlayer
          src={modulo.audio}
          rotulo={modulo.minutos ? `Ouvir este módulo (${modulo.minutos} min)` : "Prefere ouvir este módulo?"}
          chave={`${CHAVE_POSICAO_AUDIO}-${modulo.numero}`}
        />
      )}

      <Blocos
        blocos={modulo.blocos}
        apelido={apelido}
        problemas={problemas}
        contexto={contexto}
        onEscolher={escolher}
        exercicio={
          itens.length > 0 && (
            <ExercicioSemana
              modulo={modulo.numero}
              itens={itens}
              estado={estado}
              apelido={apelido}
              contexto={contexto}
              onMarcar={marcar}
              anotacoes={anotacoes}
              frasesSalvas={frasesSalvas}
              deixados={deixados}
              passoDoConvite={passoDoConvite}
              dataRetorno={convite?.data_retorno ?? null}
              onPausa={escolherPausa}
              retomarHref={retomarHref}
            />
          )
        }
        resumo={resumo && <ResumoDoPrograma dados={resumo} />}
      />

      {/* Briefing M56: no fim dos módulos 5 e 6, o carrossel no lugar do botão. Não conclui nenhum item. */}
      {profissionais && (
        <CardProfissionais
          profissionais={profissionais}
          variante="home"
          id="familia-profissionais"
          origem={`programa-modulo-${modulo.numero}`}
          titulo="Profissionais que podem atender você"
        />
      )}

      {/* Banner do módulo 1 (briefing 01, variação c): só depois de concluído e pra quem não comprou. */}
      {modulo.numero === 1 && concluidoEm && acessoLiberado === false && (
        <OfertaPrograma variante="modulo1" dataModulo2={diaMes((dataDoModulo(2, concluidoEm) ?? new Date()).toISOString())} />
      )}

      <div className="familia-acoes">
        {concluidoEm ? (
          <span className="familia-status label-small-medium" data-estado="feito" role="status">
            <GlifoCheckCircle size={20} color="var(--colors-status-success-500)" />
            Concluído em {diaMes(concluidoEm)}
          </span>
        ) : (
          <Button tamanho="medium" larguraTotal carregando={concluindo} onClick={concluir}>
            Concluir o módulo {modulo.numero}
          </Button>
        )}
        <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
          Voltar ao painel
        </Button>
      </div>
    </article>
  );
}
