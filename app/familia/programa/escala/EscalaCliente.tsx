"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { CheckBoxGroup } from "@/components/conversa/CheckBoxGroup";
import { DiasDaMeta } from "@/components/familia/DiasDaMeta";
import { EscalaNota } from "@/components/familia/EscalaNota";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { alternarDiaDaMeta } from "@/lib/familia/meta-cliente";
import {
  AREA_OPCIONAL,
  AREAS,
  areaMuitoBaixa,
  areaSugerida,
  CONFIANCA_MINIMA,
  dataLocal,
  DIAS,
  exemplosDaArea,
  MAXIMO_ACAO,
  MAXIMO_OBSTACULO,
  MOMENTOS,
  nomeDaArea,
  segundaDaSemana,
  TEXTOS_ESCALA,
  TEXTOS_META,
  tudoAlto,
  type AreaId,
  type Dia,
  type Escala,
  type Meta,
  type Momento,
  type Notas,
  type OrigemEscala,
} from "@/lib/familia/escala";

// Escala "Como está a sua vida" + meta da semana (componentes-parte1, C1), no padrão "uma pergunta
// por tela" do diagnóstico. Telas: 1 abertura, 2 a 9 uma área por tela, 10 resultado, 11 criar a
// meta, 12 meta salva.
//
// ?origem=modulo1 (padrão) | modulo7 (refazer e comparar) | painel
// ?etapa=meta: abre direto no resultado, com as notas da última escala ("Escolher minha meta da semana").
// ?etapa=editar: abre a criação da meta preenchida com a meta ativa ("Editar minha meta da semana").

type Diagnostico = { apelido: string; problemas: string[] };
type Etapa = { tela: "intro" } | { tela: "area"; indice: number } | { tela: "resultado" } | { tela: "meta" } | { tela: "salva" };

const ID_CAMPO_ACAO = "familia-meta-acao";

function lerParametros() {
  const busca = new URLSearchParams(window.location.search);
  const origem = (["modulo1", "modulo7", "painel"] as OrigemEscala[]).find((item) => item === busca.get("origem")) ?? "modulo1";
  return { origem, etapa: busca.get("etapa") };
}

export function EscalaCliente() {
  const router = useRouter();
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [origem, setOrigem] = useState<OrigemEscala>("modulo1");
  const [etapa, setEtapa] = useState<Etapa>({ tela: "intro" });
  const [notas, setNotas] = useState<Notas>({});
  // Escala anterior, pro "módulo 1 → agora" do módulo 7.
  const [anterior, setAnterior] = useState<Notas | null>(null);
  const [salvandoEscala, setSalvandoEscala] = useState(false);

  // Meta
  const [area, setArea] = useState<AreaId | null>(null);
  const [texto, setTexto] = useState("");
  const [dias, setDias] = useState<Dia[]>([]);
  const [momento, setMomento] = useState<Momento | null>(null);
  const [confianca, setConfianca] = useState<number | null>(null);
  const [manterConfianca, setManterConfianca] = useState(false);
  const [obstaculo, setObstaculo] = useState("");
  const [salvandoMeta, setSalvandoMeta] = useState(false);
  // Conferência dos 3 itens antes de salvar (M1, 3.3). O ajuste só aparece depois que a pessoa mexe na conferência.
  const [conferidos, setConferidos] = useState([false, false, false]);
  const [conferiu, setConferiu] = useState(false);
  const [metaSalva, setMetaSalva] = useState<Meta | null>(null);
  // Meta ativa ao abrir a tela: ao escolher a mesma área, "Ver e editar" parte dela em vez de um campo vazio.
  const [metaAtiva, setMetaAtiva] = useState<Meta | null>(null);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const { origem: origemDaUrl, etapa: etapaDaUrl } = lerParametros();
      const [escalas, meta] = await Promise.all([
        chamarApi("/api/familia/escala").then(async (r) => (r?.ok ? ((await r.json()) as { escalas: Escala[] }).escalas : [])),
        chamarApi("/api/familia/meta").then(async (r) => (r?.ok ? ((await r.json()) as { meta: Meta | null }).meta : null)),
      ]);
      const ultima = escalas[0]?.notas ?? null;
      setOrigem(origemDaUrl);
      if (origemDaUrl === "modulo7") setAnterior(ultima);
      setMetaAtiva(meta);
      if (etapaDaUrl === "editar" && meta) {
        if (ultima) setNotas(ultima);
        preencherMeta(meta);
        setEtapa({ tela: "meta" });
      } else if (etapaDaUrl === "meta" && ultima) {
        setNotas(ultima);
        setEtapa({ tela: "resultado" });
      }
      setDiagnostico((await resposta.json()) as Diagnostico);
    })();
  }, [router]);

  function preencherMeta(meta: Meta) {
    setArea(meta.area);
    setTexto(meta.texto);
    setDias(meta.dias);
    setMomento(meta.momento);
    setConfianca(meta.confianca);
    setObstaculo(meta.obstaculo_plano ?? "");
  }

  if (!diagnostico) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const { apelido, problemas } = diagnostico;
  const comApelido = (valor: string) => aplicarApelido(valor, apelido);
  const moduloDeVolta = origem === "modulo7" ? 7 : 1;

  function irPara(nova: Etapa) {
    setEtapa(nova);
    window.scrollTo({ top: 0 });
  }

  async function terminarEscala(finais: Notas) {
    setSalvandoEscala(true);
    const resposta = await chamarApi("/api/familia/escala", { method: "POST", body: JSON.stringify({ origem, notas: finais }) });
    setSalvandoEscala(false);
    // [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a ficar disponível.
    if (!resposta?.ok) return;
    irPara({ tela: "resultado" });
  }

  function avancarArea(indice: number, finais: Notas) {
    if (indice < AREAS.length - 1) irPara({ tela: "area", indice: indice + 1 });
    else void terminarEscala(finais);
  }

  function escolherArea(nova: AreaId) {
    if (metaAtiva && metaAtiva.area === nova && nova !== area) {
      // Área da meta que já existe: abre preenchida, é edição.
      preencherMeta(metaAtiva);
    } else {
      // Trocar de área limpa o texto, que era um exemplo (ou uma ideia) da área anterior.
      if (nova !== area) setTexto("");
      setArea(nova);
    }
    irPara({ tela: "meta" });
  }

  async function salvarMeta() {
    if (!area || !texto.trim() || dias.length === 0) return;
    setSalvandoMeta(true);
    const resposta = await chamarApi("/api/familia/meta", {
      method: "POST",
      body: JSON.stringify({
        meta: { area, texto, dias, momento, confianca, obstaculo_plano: obstaculo },
        hoje: dataLocal(),
        modulo: origem === "painel" ? null : moduloDeVolta,
      }),
    });
    setSalvandoMeta(false);
    // [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a ficar disponível.
    if (!resposta?.ok) return;
    setMetaSalva(((await resposta.json()) as { meta: Meta | null }).meta);
    irPara({ tela: "salva" });
  }

  // ===== Tela 1: abertura =====
  if (etapa.tela === "intro") {
    return (
      <section className="familia-pergunta">
        <div className="familia-pergunta-topo">
          <button className="familia-voltar" type="button" aria-label="Voltar ao módulo" onClick={() => router.push(`/familia/programa/modulo/${moduloDeVolta}`)}>
            <GlifoArrowBack size={24} />
          </button>
        </div>
        <header className="familia-titulo">
          <h1 className="header-large">{origem === "modulo7" ? TEXTOS_ESCALA.introTituloModulo7 : TEXTOS_ESCALA.introTitulo}</h1>
          <p className="text-large">{TEXTOS_ESCALA.introTexto}</p>
        </header>
        <Button tamanho="medium" larguraTotal onClick={() => irPara({ tela: "area", indice: 0 })}>
          Começar a dar as notas
        </Button>
      </section>
    );
  }

  // ===== Telas 2 a 9: uma área por tela =====
  if (etapa.tela === "area") {
    const { indice } = etapa;
    const atual = AREAS[indice];
    const nota = notas[atual.id];
    return (
      <section className="familia-pergunta">
        <div className="familia-pergunta-topo">
          <button
            className="familia-voltar"
            type="button"
            aria-label="Voltar para a área anterior"
            onClick={() => irPara(indice > 0 ? { tela: "area", indice: indice - 1 } : { tela: "intro" })}
          >
            <GlifoArrowBack size={24} />
          </button>
          <ProgressBar atual={indice + 1} total={AREAS.length} rotulo={`${indice + 1} de ${AREAS.length}`} />
          <span className="label-x-small familia-texto-suave">
            {indice + 1} de {AREAS.length}
          </span>
        </div>

        <header className="familia-titulo">
          <h1 className="header-large">{atual.nome}</h1>
          <p className="text-large">{atual.dica}</p>
        </header>
        <p className="label-medium-medium">{TEXTOS_ESCALA.pergunta}</p>
        <EscalaNota
          minimo={1}
          maximo={10}
          valor={typeof nota === "number" ? nota : null}
          onEscolher={(valor) => setNotas({ ...notas, [atual.id]: valor })}
          rotulo={`${atual.nome}: ${TEXTOS_ESCALA.pergunta}`}
          legendaMinimo={TEXTOS_ESCALA.legendaMin}
          legendaMaximo={TEXTOS_ESCALA.legendaMax}
        />
        {atual.id === AREA_OPCIONAL && (
          <Button
            variante="transparent"
            tamanho="small"
            onClick={() => {
              const finais = { ...notas, [atual.id]: null };
              setNotas(finais);
              avancarArea(indice, finais);
            }}
          >
            {TEXTOS_ESCALA.naoSeAplica}
          </Button>
        )}
        <Button tamanho="medium" larguraTotal disabled={typeof nota !== "number"} carregando={salvandoEscala} onClick={() => avancarArea(indice, notas)}>
          Continuar
        </Button>
      </section>
    );
  }

  // ===== Tela 10: resultado =====
  if (etapa.tela === "resultado") {
    const sugerida = areaSugerida(notas);
    const muitoBaixa = areaMuitoBaixa(notas);
    const comparar = origem === "modulo7" && anterior;
    const textoResultado = tudoAlto(notas) ? TEXTOS_ESCALA.tudoAlto : comparar ? TEXTOS_ESCALA.resultadoTextoModulo7 : TEXTOS_ESCALA.resultadoTexto;
    return (
      <section className="familia-pergunta">
        <header className="familia-titulo">
          <h1 className="header-large">{TEXTOS_ESCALA.resultadoTitulo}</h1>
          <p className="text-large">{textoResultado}</p>
        </header>

        {sugerida && (
          <div className="familia-cartao familia-cartao-destaque">
            <h2 className="header-small">
              Comece por aqui: {nomeDaArea(sugerida)} · nota {notas[sugerida]}
            </h2>
            <Button tamanho="medium" larguraTotal onClick={() => escolherArea(sugerida)}>
              Criar minha meta para {nomeDaArea(sugerida)}
            </Button>
          </div>
        )}

        {muitoBaixa && (
          <div className="familia-cartao">
            <p className="text-large">{TEXTOS_ESCALA.muitoBaixo.replace("{{area_nome}}", nomeDaArea(muitoBaixa))}</p>
            <Button variante="secondary" tamanho="medium" larguraTotal href="/profissionais">
              Ver psicólogo parceiro
            </Button>
          </div>
        )}

        <p className="text-medium-regular familia-texto-suave">{TEXTOS_ESCALA.outraArea}</p>
        <ul className="escala-resultado">
          {AREAS.map((item) => {
            const nota = notas[item.id];
            const antes = comparar ? anterior[item.id] : undefined;
            return (
              <li key={item.id}>
                <button type="button" className="escala-resultado-area" onClick={() => escolherArea(item.id)} data-area={item.id}>
                  <span className="label-small-medium">{item.nome}</span>
                  {typeof nota !== "number" ? (
                    <span className="text-medium-regular familia-texto-suave">{TEXTOS_ESCALA.naoSeAplica}</span>
                  ) : comparar ? (
                    <span className="label-small-medium">
                      {typeof antes === "number" ? antes : "-"} → {nota}
                    </span>
                  ) : (
                    <span className="escala-resultado-nota">
                      <ProgressBar atual={nota} total={10} rotulo={`${item.nome}: nota ${nota} de 10`} neutra />
                      <span className="label-small-medium">{nota}</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  // ===== Tela 11: criar a meta da semana =====
  if (etapa.tela === "meta" && area) {
    const exemplos = exemplosDaArea(area, problemas).map(comApelido);
    const podeSalvar = Boolean(texto.trim()) && dias.length > 0;
    const confiancaBaixa = confianca !== null && confianca < CONFIANCA_MINIMA && !manterConfianca;
    return (
      <section className="familia-pergunta">
        <div className="familia-pergunta-topo">
          <button className="familia-voltar" type="button" aria-label="Voltar para o resultado" onClick={() => irPara({ tela: "resultado" })}>
            <GlifoArrowBack size={24} />
          </button>
        </div>
        <h1 className="header-large">{TEXTOS_META.titulo}</h1>

        <div className="escala-meta-area">
          <span className="escala-chip label-small-medium">{nomeDaArea(area)}</span>
          <Button variante="transparent" tamanho="small" onClick={() => irPara({ tela: "resultado" })}>
            Escolher outra área
          </Button>
        </div>

        {/* Briefing M1, 3.2: a explicação da meta concreta substitui o primeiro item da orientação e vem antes dos exemplos. */}
        <div className="familia-cartao">
          <h2 className="header-small">{TEXTOS_META.porQueTitulo}</h2>
          {TEXTOS_META.porQueTexto.map((paragrafo) => (
            <p key={paragrafo} className="text-large">
              {paragrafo}
            </p>
          ))}
          <p className="text-large">Uma meta que funciona é assim:</p>
          <ul className="familia-lista text-large">
            <li>
              <strong>cabe na sua semana de verdade</strong>, até num dia ruim;
            </li>
            <li>
              <strong>tem dia marcado</strong>;
            </li>
            <li>
              <strong>depende só de você</strong>, não de {apelido}.
            </li>
          </ul>
          <p className="text-large">Uma meta pequena cumprida vale mais do que uma grande abandonada.</p>
        </div>

        <div className="familia-chips escala-chips" role="group" aria-label={`Exemplos de meta para ${nomeDaArea(area)}`}>
          {exemplos.map((exemplo) => (
            <Button key={exemplo} variante={texto === exemplo ? "primary" : "secondary"} tamanho="small" redondo onClick={() => setTexto(exemplo)}>
              {exemplo}
            </Button>
          ))}
        </div>

        <InputText id={ID_CAMPO_ACAO} rotulo={TEXTOS_META.campoAcaoRotulo} descricao={TEXTOS_META.campoAcaoDica} value={texto} maxLength={MAXIMO_ACAO} autoComplete="off" onChange={setTexto} />

        <div className="escala-meta-grupo">
          <p className="label-medium-medium">{TEXTOS_META.campoQuandoRotulo}</p>
          <div className="familia-chips escala-chips" role="group" aria-label={TEXTOS_META.campoQuandoRotulo}>
            {DIAS.map((dia) => (
              <Button
                key={dia.id}
                variante={dias.includes(dia.id) ? "primary" : "secondary"}
                tamanho="small"
                redondo
                // Sempre na ordem seg..dom, qualquer que seja a ordem dos toques.
                onClick={() =>
                  setDias((atuais) => (atuais.includes(dia.id) ? atuais.filter((item) => item !== dia.id) : DIAS.map((d) => d.id).filter((id) => id === dia.id || atuais.includes(id))))
                }
              >
                {dia.rotulo}
              </Button>
            ))}
          </div>
          <p className="label-small-medium">{TEXTOS_META.momentoRotulo}</p>
          <div className="familia-chips escala-chips" role="radiogroup" aria-label={TEXTOS_META.momentoRotulo}>
            {MOMENTOS.map((item) => (
              <Button key={item.id} variante={momento === item.id ? "primary" : "secondary"} tamanho="small" redondo onClick={() => setMomento(momento === item.id ? null : item.id)}>
                {item.rotulo}
              </Button>
            ))}
          </div>
        </div>

        <div className="escala-meta-grupo">
          <p className="label-medium-medium">{TEXTOS_META.confiancaPergunta}</p>
          <EscalaNota
            minimo={0}
            maximo={10}
            valor={confianca}
            onEscolher={(valor) => {
              setConfianca(valor);
              setManterConfianca(false);
            }}
            rotulo={TEXTOS_META.confiancaPergunta}
          />
          {confiancaBaixa && (
            <div className="familia-cartao familia-cartao-destaque">
              <p className="text-large">{TEXTOS_META.confiancaBaixa}</p>
              <ul className="familia-lista text-large">
                {TEXTOS_META.confiancaBaixaOpcoes.map((opcao) => (
                  <li key={opcao}>{opcao}</li>
                ))}
              </ul>
              <Button
                tamanho="medium"
                larguraTotal
                onClick={() => {
                  const campo = document.getElementById(ID_CAMPO_ACAO);
                  campo?.scrollIntoView({ block: "center" });
                  campo?.focus();
                }}
              >
                Ajustar minha meta da semana
              </Button>
              <Button variante="transparent" tamanho="small" onClick={() => setManterConfianca(true)}>
                Manter a meta assim
              </Button>
            </div>
          )}
        </div>

        <InputText
          id="familia-meta-obstaculo"
          rotulo={TEXTOS_META.obstaculoRotulo}
          descricao={TEXTOS_META.obstaculoDica}
          value={obstaculo}
          maxLength={MAXIMO_OBSTACULO}
          autoComplete="off"
          onChange={setObstaculo}
        />

        {/* Briefing M1, 3.3: conferência antes de salvar. Não é obrigatória e não impede de salvar. */}
        <div className="familia-cartao">
          <div className="figma-checklist">
            {TEXTOS_META.conferencia.map((item, indice) => (
              <CheckBoxGroup
                key={item}
                item={comApelido(item)}
                selected={conferidos[indice]}
                onChange={(marcado) => {
                  setConferidos((atuais) => atuais.map((valor, posicao) => (posicao === indice ? marcado : valor)));
                  setConferiu(true);
                }}
              />
            ))}
          </div>
          {conferiu && conferidos.some((marcado) => !marcado) && (
            <p className="text-large" role="status">
              {TEXTOS_META.conferenciaAjuste}
            </p>
          )}
        </div>

        <Button tamanho="medium" larguraTotal disabled={!podeSalvar} carregando={salvandoMeta} onClick={salvarMeta}>
          Salvar minha meta
        </Button>
      </section>
    );
  }

  // ===== Tela 12: meta salva =====
  const hoje = dataLocal();
  return (
    <section className="familia-pergunta">
      <p className="header-small" role="status">
        {TEXTOS_META.salva}
      </p>
      {metaSalva && (
        <div className="familia-cartao">
          <span className="label-small-medium familia-texto-suave">Sua meta · {nomeDaArea(metaSalva.area)}</span>
          <h2 className="header-small">{metaSalva.texto}</h2>
          <DiasDaMeta
            dias={metaSalva.dias}
            diasFeitos={metaSalva.dias_feitos}
            semanaInicio={metaSalva.semana_inicio ?? segundaDaSemana(hoje)}
            hoje={hoje}
            onAlternar={async (data) => {
              const nova = await alternarDiaDaMeta(data, hoje);
              if (nova) setMetaSalva(nova);
            }}
          />
        </div>
      )}
      <div className="familia-acoes">
        <Button tamanho="medium" larguraTotal href={`/familia/programa/modulo/${moduloDeVolta}`}>
          Voltar ao módulo
        </Button>
        <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/programa">
          Ver meu painel
        </Button>
      </div>
    </section>
  );
}
