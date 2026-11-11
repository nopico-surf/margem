"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import {
  ATALHOS_QUANDO,
  CAMPOS_DO_TIPO,
  dataDoAtalho,
  opcoesDaPergunta,
  OUTRO,
  paraCampoDataHora,
  PERGUNTAS_BOM,
  PERGUNTAS_DIFICIL,
  SAI_PARA_SE_PROTEGER,
  TAMANHO_MAXIMO_CAMPO,
  TAMANHO_MAXIMO_OUTRO,
  TEXTOS_DIARIO,
  type Anotacao,
  type AtalhoQuando,
  type CampoLista,
  type PerguntaDoDiario,
  type TipoAnotacao,
} from "@/lib/familia/diario";
import { track } from "@/lib/mixpanel";

// Diário do programa (briefing M2). Uma pergunta por tela, no padrão do diagnóstico e da escala, com
// "Pular" em todas. Telas: abertura (só na primeira vez), o que anotar, quando, as perguntas do tipo,
// campo livre (só no momento difícil) e o retorno depois de salvar.
//
// ?tipo=dificil | bom: abre direto no tipo (os cartões do exercício usam). Sem ?tipo, mostra a escolha.
// ?editar=<id>: abre a anotação preenchida, sem abertura nem escolha, e salva por cima.

type Diagnostico = { apelido: string; problemas: string[] };
type Etapa = { tela: "intro" } | { tela: "tipo" } | { tela: "quando" } | { tela: "pergunta"; indice: number } | { tela: "livre" } | { tela: "salvo" };
type Escolhas = Record<CampoLista, string[]>;

const VAZIAS: Escolhas = { antes: [], percebeu: [], buscou: [], reagiu: [], depois: [], bom_o_que: [], bom_sentiu: [] };
const VAZIOS_OUTRO: Record<CampoLista, string> = { antes: "", percebeu: "", buscou: "", reagiu: "", depois: "", bom_o_que: "", bom_sentiu: "" };

function perguntasDo(tipo: TipoAnotacao) {
  return tipo === "bom" ? PERGUNTAS_BOM : PERGUNTAS_DIFICIL;
}

export function DiarioCliente() {
  const router = useRouter();
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [etapa, setEtapa] = useState<Etapa>({ tela: "tipo" });
  const [tipo, setTipo] = useState<TipoAnotacao>("dificil");
  const [idEditado, setIdEditado] = useState<string | null>(null);
  // Preenchido no efeito: o horário "agora" não pode ser lido na renderização do servidor.
  const [quando, setQuando] = useState<Date | null>(null);
  const [atalho, setAtalho] = useState<AtalhoQuando>("Agora");
  const [escolhas, setEscolhas] = useState<Escolhas>(VAZIAS);
  const [outros, setOutros] = useState(VAZIOS_OUTRO);
  const [livre, setLivre] = useState("");
  const [salvando, setSalvando] = useState(false);
  // Tipo pedido na URL: depois da abertura, vai direto pra ele.
  const [tipoDaUrl, setTipoDaUrl] = useState<TipoAnotacao | null>(null);
  const [reagiuComSeguranca, setReagiuComSeguranca] = useState(false);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const busca = new URLSearchParams(window.location.search);
      const lista = await chamarApi("/api/familia/diario").then(async (r) => (r?.ok ? ((await r.json()) as { anotacoes: Anotacao[] }).anotacoes : []));
      const editar = lista.find((anotacao) => anotacao.id === busca.get("editar"));
      const pedido = busca.get("tipo") === "bom" ? "bom" : busca.get("tipo") === "dificil" ? "dificil" : null;
      if (editar) {
        setIdEditado(editar.id);
        setTipo(editar.tipo);
        setQuando(new Date(editar.quando));
        setAtalho("Escolher dia e hora");
        setLivre(editar.texto_livre ?? "");
        preencher(editar);
        setEtapa({ tela: "quando" });
      } else {
        setQuando(new Date());
        if (pedido) {
          setTipo(pedido);
          setTipoDaUrl(pedido);
        }
        // A abertura aparece só na primeira vez; depois, vai direto pra escolha.
        setEtapa(lista.length === 0 ? { tela: "intro" } : pedido ? { tela: "quando" } : { tela: "tipo" });
      }
      setDiagnostico((await resposta.json()) as Diagnostico);
    })();
  }, [router]);

  // Opções fora das listas voltam como "Outro" com o texto escrito.
  function preencher(anotacao: Anotacao) {
    const novas: Escolhas = { ...VAZIAS };
    const textos = { ...VAZIOS_OUTRO };
    for (const pergunta of perguntasDo(anotacao.tipo)) {
      const conhecidas = new Set([...pergunta.opcoes, ...Object.values(pergunta.extras ?? {}).flat()]);
      const valores = anotacao[pergunta.campo];
      novas[pergunta.campo] = valores.map((valor) => (conhecidas.has(valor) ? valor : OUTRO));
      const outro = valores.find((valor) => !conhecidas.has(valor) && valor !== OUTRO);
      if (outro) textos[pergunta.campo] = outro;
      novas[pergunta.campo] = [...new Set(novas[pergunta.campo])];
    }
    setEscolhas(novas);
    setOutros(textos);
  }

  if (!diagnostico) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const { apelido, problemas } = diagnostico;
  const momento = quando ?? new Date();
  const t = (texto: string) => aplicarApelido(texto, apelido);
  const perguntas = perguntasDo(tipo);
  // Quando + perguntas (+ campo livre no momento difícil).
  const totalDeTelas = 1 + perguntas.length + (tipo === "dificil" ? 1 : 0);

  function irPara(nova: Etapa) {
    setEtapa(nova);
    window.scrollTo({ top: 0 });
  }

  function escolherTipo(novo: TipoAnotacao) {
    setTipo(novo);
    irPara({ tela: "quando" });
  }

  function alternar(campo: CampoLista, opcao: string) {
    setEscolhas((atuais) => ({ ...atuais, [campo]: atuais[campo].includes(opcao) ? atuais[campo].filter((valor) => valor !== opcao) : [...atuais[campo], opcao] }));
  }

  function proxima(atual: Etapa): Etapa {
    if (atual.tela === "quando") return { tela: "pergunta", indice: 0 };
    if (atual.tela === "pergunta") return atual.indice < perguntas.length - 1 ? { tela: "pergunta", indice: atual.indice + 1 } : tipo === "dificil" ? { tela: "livre" } : atual;
    return atual;
  }

  function anterior(atual: Etapa): Etapa | null {
    if (atual.tela === "quando") return idEditado || tipoDaUrl ? null : { tela: "tipo" };
    if (atual.tela === "pergunta") return atual.indice === 0 ? { tela: "quando" } : { tela: "pergunta", indice: atual.indice - 1 };
    if (atual.tela === "livre") return { tela: "pergunta", indice: perguntas.length - 1 };
    return null;
  }

  // O "Outro" vira o texto escrito (ou fica "Outro", se a pessoa não escreveu nada).
  function listaFinal(campo: CampoLista) {
    return escolhas[campo].map((valor) => (valor === OUTRO ? outros[campo].trim().slice(0, TAMANHO_MAXIMO_OUTRO) || OUTRO : valor));
  }

  async function salvar() {
    setSalvando(true);
    const anotacao = {
      tipo,
      quando: momento.toISOString(),
      ...Object.fromEntries(CAMPOS_DO_TIPO[tipo].map((campo) => [campo, listaFinal(campo)])),
      texto_livre: tipo === "dificil" ? livre : "",
    };
    const resposta = await chamarApi("/api/familia/diario", {
      method: idEditado ? "PATCH" : "POST",
      body: JSON.stringify(idEditado ? { id: idEditado, anotacao } : { anotacao }),
    });
    setSalvando(false);
    // [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a ficar disponível.
    if (!resposta?.ok) return;
    track("diario_anotacao_salva", { tipo, editada: Boolean(idEditado) });
    setReagiuComSeguranca(tipo === "dificil" && escolhas.reagiu.includes(SAI_PARA_SE_PROTEGER));
    irPara({ tela: "salvo" });
  }

  const voltar = anterior(etapa);
  const numeroDaTela = etapa.tela === "quando" ? 1 : etapa.tela === "pergunta" ? etapa.indice + 2 : etapa.tela === "livre" ? totalDeTelas : 0;
  const topo = (
    <div className="familia-pergunta-topo">
      <button
        className="familia-voltar"
        type="button"
        aria-label="Voltar"
        onClick={() => (voltar ? irPara(voltar) : router.push("/familia/programa"))}
      >
        <GlifoArrowBack size={24} />
      </button>
      {numeroDaTela > 0 && (
        <>
          <ProgressBar atual={numeroDaTela} total={totalDeTelas} rotulo={`${numeroDaTela} de ${totalDeTelas}`} />
          <span className="label-x-small familia-texto-suave">
            {numeroDaTela} de {totalDeTelas}
          </span>
        </>
      )}
    </div>
  );

  // ===== Abertura (só na primeira vez) =====
  if (etapa.tela === "intro") {
    return (
      <section className="familia-pergunta">
        {topo}
        <header className="familia-titulo">
          <p className="text-large">{t(TEXTOS_DIARIO.introTexto)}</p>
        </header>
        <Button tamanho="medium" larguraTotal onClick={() => irPara(tipoDaUrl ? { tela: "quando" } : { tela: "tipo" })}>
          {TEXTOS_DIARIO.introBotao}
        </Button>
      </section>
    );
  }

  // ===== Tela 1: o que anotar =====
  if (etapa.tela === "tipo") {
    return (
      <section className="familia-pergunta">
        {topo}
        <h1 className="header-large">{t(TEXTOS_DIARIO.tipoPergunta)}</h1>
        <div className="familia-chips escala-chips diario-tipos">
          <Button variante="secondary" tamanho="medium" onClick={() => escolherTipo("dificil")}>
            {TEXTOS_DIARIO.tipoDificil}
          </Button>
          <Button variante="secondary" tamanho="medium" onClick={() => escolherTipo("bom")}>
            {TEXTOS_DIARIO.tipoBom}
          </Button>
        </div>
        <p className="text-medium-regular familia-texto-suave">{TEXTOS_DIARIO.tipoApoio}</p>
      </section>
    );
  }

  // ===== Quando =====
  if (etapa.tela === "quando") {
    return (
      <section className="familia-pergunta">
        {topo}
        <h1 className="header-large">{TEXTOS_DIARIO.quandoPergunta}</h1>
        <div className="familia-chips escala-chips" role="radiogroup" aria-label={TEXTOS_DIARIO.quandoPergunta}>
          {ATALHOS_QUANDO.map((opcao) => (
            <Button
              key={opcao}
              tamanho="small"
              redondo
              variante={atalho === opcao ? "primary" : "secondary"}
              onClick={() => {
                setAtalho(opcao);
                if (opcao !== "Escolher dia e hora") setQuando(dataDoAtalho(opcao));
              }}
            >
              {opcao}
            </Button>
          ))}
        </div>
        {atalho === "Escolher dia e hora" && (
          <label className="diario-data">
            <span className="label-medium-medium">Escolher dia e hora</span>
            <input
              type="datetime-local"
              className="diario-data-campo text-large"
              value={paraCampoDataHora(momento)}
              max={paraCampoDataHora(new Date())}
              onChange={(evento) => {
                const nova = new Date(evento.target.value);
                if (!Number.isNaN(nova.getTime())) setQuando(nova);
              }}
            />
          </label>
        )}
        <div className="familia-acoes">
          <Button tamanho="medium" larguraTotal onClick={() => irPara(proxima(etapa))}>
            {TEXTOS_DIARIO.continuar}
          </Button>
          <Button variante="transparent" tamanho="medium" larguraTotal onClick={() => irPara(proxima(etapa))}>
            {TEXTOS_DIARIO.pular}
          </Button>
        </div>
      </section>
    );
  }

  // ===== Perguntas do tipo =====
  if (etapa.tela === "pergunta") {
    const pergunta: PerguntaDoDiario = perguntas[etapa.indice];
    const opcoes = [...opcoesDaPergunta(pergunta, problemas), OUTRO];
    const marcadas = escolhas[pergunta.campo];
    const ultima = tipo === "bom" && etapa.indice === perguntas.length - 1;
    return (
      <section className="familia-pergunta">
        {topo}
        <div className="familia-pergunta-titulo">
          <h1 className="header-large">{t(pergunta.pergunta)}</h1>
          {pergunta.ajuda && <p className="text-large">{pergunta.ajuda}</p>}
        </div>
        <div className="familia-chips escala-chips" role="group" aria-label={t(pergunta.pergunta)}>
          {opcoes.map((opcao) => (
            <Button key={opcao} tamanho="small" redondo variante={marcadas.includes(opcao) ? "primary" : "secondary"} onClick={() => alternar(pergunta.campo, opcao)}>
              {t(opcao)}
            </Button>
          ))}
        </div>
        {marcadas.includes(OUTRO) && (
          <InputText
            id={`diario-outro-${pergunta.campo}`}
            rotulo={OUTRO}
            value={outros[pergunta.campo]}
            maxLength={TAMANHO_MAXIMO_OUTRO}
            autoComplete="off"
            onChange={(valor) => setOutros((atuais) => ({ ...atuais, [pergunta.campo]: valor }))}
          />
        )}
        <div className="familia-acoes">
          {ultima ? (
            <Button tamanho="medium" larguraTotal carregando={salvando} onClick={salvar}>
              {TEXTOS_DIARIO.salvarBom}
            </Button>
          ) : (
            <>
              <Button tamanho="medium" larguraTotal disabled={marcadas.length === 0} onClick={() => irPara(proxima(etapa))}>
                {TEXTOS_DIARIO.continuar}
              </Button>
              <Button variante="transparent" tamanho="medium" larguraTotal onClick={() => irPara(proxima(etapa))}>
                {TEXTOS_DIARIO.pular}
              </Button>
            </>
          )}
        </div>
      </section>
    );
  }

  // ===== Campo livre (momento difícil) =====
  if (etapa.tela === "livre") {
    return (
      <section className="familia-pergunta">
        {topo}
        <h1 className="header-large">{TEXTOS_DIARIO.livrePergunta}</h1>
        <InputText
          id="diario-livre"
          rotulo={TEXTOS_DIARIO.livrePergunta}
          descricao={TEXTOS_DIARIO.livreDica}
          value={livre}
          maxLength={TAMANHO_MAXIMO_CAMPO}
          autoComplete="off"
          onChange={setLivre}
        />
        <div className="familia-acoes">
          <Button tamanho="medium" larguraTotal carregando={salvando} onClick={salvar}>
            {TEXTOS_DIARIO.salvarDificil}
          </Button>
        </div>
      </section>
    );
  }

  // ===== Retorno depois de salvar =====
  return (
    <section className="familia-pergunta">
      <p className="header-small" role="status">
        {t(tipo === "bom" ? TEXTOS_DIARIO.salvoBom : TEXTOS_DIARIO.salvoDificil)}
      </p>
      {reagiuComSeguranca && (
        <div className="familia-cartao familia-cartao-alerta">
          <p className="text-large">{TEXTOS_DIARIO.segurancaTexto}</p>
          <Button tamanho="small" href="/familia/seguranca">
            {TEXTOS_DIARIO.segurancaBotao}
          </Button>
          <Button variante="secondary" tamanho="small" href="/profissionais">
            {TEXTOS_DIARIO.profissionalBotao}
          </Button>
        </div>
      )}
      <div className="familia-acoes">
        <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/programa/diario/anotacoes">
          Ver minhas anotações
        </Button>
        <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
          Voltar ao painel
        </Button>
      </div>
    </section>
  );
}
