"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";
import { Button } from "@/components/ui/Button";
import type { ProfissionalCadastrado } from "@/lib/supabase";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { focarCampo, TEXTO_SUGESTOES } from "@/lib/familia/campo";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import {
  fraseDepoisDoProblema,
  FRASES_DEPOIS,
  FRASES_NA_HORA,
  MAXIMO_FRASE_ADIAR,
  MAXIMO_SITUACAO,
  SITUACOES_DO_ADIAR,
  TEXTOS_ADIAR,
  type Adiar,
  type ClimaDoAdiar,
  type PlanoValorizar,
} from "@/lib/familia/valorizar";
import { useEtapaNaUrl } from "@/lib/familia/useEtapaNaUrl";
import { track } from "@/lib/mixpanel";

// "Quando o combinado fica para outro dia" (briefing M4, C5). Começa pela pergunta de segurança: com
// "Sim" ou "Não sei" a ferramenta para e o exercício fica "Deixado para depois". Com "Não": escolher a
// situação e o que dizer na hora e no dia seguinte (as frases são editáveis). Voltar a esta tela abre o
// combinado salvo ("Ver e editar").
//
// [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a
// ficar disponível.

type Lido = { apelido: string; problemas: string[] };
type Tela = "clima" | "deixado" | "situacao" | "frases" | "salvo";

// `profissionais`: carrossel de psicólogos quando a pessoa responde que o clima pode ficar tenso.
export function AdiarCliente({ profissionais }: { profissionais: ProfissionalCadastrado[] }) {
  const router = useRouter();
  const [dados, setDados] = useState<Lido | null>(null);
  // Cada tela tem endereço próprio (?tela=situacao, ?tela=frases...). Salvar desfaz as etapas no
  // histórico: voltar da confirmação não reabre o que já foi salvo.
  const { etapa: tela, irPara, trocar, concluir, voltar, podeVoltar } = useEtapaNaUrl<Tela>("clima", (t) => (t === "clima" ? null : t));
  const [formasDoPlano, setFormasDoPlano] = useState<string[]>([]);
  // Padrão 2 (briefing 00d): a situação é uma frase da pessoa, e os chips são só sugestão.
  const [situacao, setSituacao] = useState("");
  const [naHora, setNaHora] = useState("");
  const [depois, setDepois] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const lido = (await resposta.json()) as Lido;
      const guardado = await chamarApi("/api/familia/valorizar").then(async (r) => (r?.ok ? ((await r.json()) as { plano: PlanoValorizar | null; adiar: Adiar | null }) : null));
      setFormasDoPlano(guardado?.plano?.formas ?? []);
      const salvo = guardado?.adiar;
      if (salvo?.clima === "nao") {
        setSituacao(salvo.situacao ?? "");
        setNaHora(salvo.na_hora ?? "");
        setDepois(salvo.depois ?? "");
        trocar("situacao");
      }
      setDados(lido);
    })();
  }, [router]);

  if (!dados) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const t = (texto: string) => aplicarApelido(texto, dados.apelido);
  const problema = dados.problemas[0] ?? "alcool";
  const voltarAoModulo = () => router.push("/familia/programa/modulo/4");

  async function responderClima(clima: ClimaDoAdiar) {
    if (clima === "nao") {
      irPara("situacao");
      return;
    }
    setSalvando(true);
    const resposta = await chamarApi("/api/familia/valorizar", { method: "POST", body: JSON.stringify({ tipo: "adiar", dados: { clima } }) });
    setSalvando(false);
    if (!resposta?.ok) return;
    track("adiar_clima", { clima });
    concluir("deixado");
  }

  async function salvar() {
    setSalvando(true);
    const resposta = await chamarApi("/api/familia/valorizar", {
      method: "POST",
      body: JSON.stringify({ tipo: "adiar", dados: { clima: "nao", situacao: situacao.trim(), na_hora: naHora, depois } }),
    });
    setSalvando(false);
    if (!resposta?.ok) return;
    // Só a resposta de segurança, nunca o texto das frases.
    track("adiar_salvo", { clima: "nao" });
    concluir("salvo");
  }

  const topo = (voltar: () => void) => (
    <div className="familia-pergunta-topo">
      <button className="familia-voltar" type="button" aria-label="Voltar" onClick={voltar}>
        <GlifoArrowBack size={24} />
      </button>
    </div>
  );

  // ===== Tela 1: pergunta de segurança =====
  if (tela === "clima") {
    return (
      <section className="familia-pergunta">
        {topo(voltarAoModulo)}
        <h1 className="header-large">{TEXTOS_ADIAR.titulo}</h1>
        <p className="header-small">{t(TEXTOS_ADIAR.climaPergunta)}</p>
        <div className="familia-chips escala-chips" role="radiogroup" aria-label={t(TEXTOS_ADIAR.climaPergunta)}>
          <Button tamanho="small" redondo variante="secondary" disabled={salvando} onClick={() => void responderClima("sim")}>
            {TEXTOS_ADIAR.sim}
          </Button>
          <Button tamanho="small" redondo variante="secondary" disabled={salvando} onClick={() => void responderClima("nao")}>
            {TEXTOS_ADIAR.nao}
          </Button>
          <Button tamanho="small" redondo variante="secondary" disabled={salvando} onClick={() => void responderClima("nao_sei")}>
            {TEXTOS_ADIAR.naoSei}
          </Button>
        </div>
      </section>
    );
  }

  // ===== Sim ou Não sei: deixar para depois =====
  if (tela === "deixado") {
    return (
      <section className="familia-pergunta">
        <p className="header-small" role="status">
          {TEXTOS_ADIAR.climaSim}
        </p>
        <CardProfissionais
          profissionais={profissionais}
          variante="home"
          especialidades={["psicologo"]}
          id="familia-profissionais"
          origem="programa-adiar"
          titulo="Profissionais que podem atender você"
        />
        <div className="familia-acoes">
          <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/programa/modulo/4">
            {TEXTOS_ADIAR.voltarAoModulo}
          </Button>
        </div>
      </section>
    );
  }

  // ===== Combinado salvo =====
  if (tela === "salvo") {
    return (
      <section className="familia-pergunta">
        <p className="header-small" role="status">
          {TEXTOS_ADIAR.salvo}
        </p>
        <div className="familia-acoes">
          <Button tamanho="medium" larguraTotal href="/familia/programa/modulo/4">
            {TEXTOS_ADIAR.voltarAoModulo}
          </Button>
          <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
            Voltar ao painel
          </Button>
        </div>
      </section>
    );
  }

  // ===== Tela 2: escolher a situação =====
  if (tela === "situacao") {
    const opcoes = [...formasDoPlano, ...SITUACOES_DO_ADIAR.filter((opcao) => !formasDoPlano.includes(opcao))];
    return (
      <section className="familia-pergunta">
        {topo(() => (podeVoltar ? voltar() : trocar("clima")))}
        <header className="familia-titulo">
          <h1 className="header-large">{TEXTOS_ADIAR.titulo}</h1>
          <p className="text-large">{t(TEXTOS_ADIAR.intro)}</p>
        </header>
        {formasDoPlano.length > 0 && <p className="text-medium-regular familia-texto-suave">{TEXTOS_ADIAR.doPlano}</p>}
        <InputText id="adiar-situacao" rotulo={TEXTOS_ADIAR.situacaoRotulo} value={situacao} maxLength={MAXIMO_SITUACAO} autoComplete="off" onChange={setSituacao} />
        <p className="text-medium-regular familia-texto-suave">{TEXTO_SUGESTOES}</p>
        <div className="familia-chips escala-chips" role="group" aria-label={TEXTOS_ADIAR.titulo}>
          {opcoes.map((opcao) => (
            <Button
              key={opcao}
              tamanho="small"
              redondo
              variante="secondary"
              onClick={() => {
                setSituacao(t(opcao).slice(0, MAXIMO_SITUACAO));
                focarCampo("adiar-situacao");
              }}
            >
              {t(opcao)}
            </Button>
          ))}
        </div>
        <Button tamanho="medium" larguraTotal disabled={!situacao.trim()} onClick={() => irPara("frases")}>
          Continuar
        </Button>
      </section>
    );
  }

  // ===== Tela 3: o que dizer na hora e depois =====
  return (
    <section className="familia-pergunta">
      {topo(() => (podeVoltar ? voltar() : trocar("situacao")))}
      <div className="escala-meta-grupo">
        <p className="label-medium-medium">{TEXTOS_ADIAR.naHora}</p>
        <p className="text-medium-regular familia-texto-suave">{TEXTO_SUGESTOES}</p>
        <div className="familia-chips escala-chips">
          {FRASES_NA_HORA.map((frase) => (
            <Button
              key={frase}
              tamanho="small"
              redondo
              variante="secondary"
              onClick={() => {
                setNaHora(frase);
                focarCampo("adiar-na-hora");
              }}
            >
              {frase}
            </Button>
          ))}
        </div>
        <InputText id="adiar-na-hora" rotulo={TEXTOS_ADIAR.naHora} descricao={TEXTOS_ADIAR.naHoraDica} value={naHora} maxLength={MAXIMO_FRASE_ADIAR} autoComplete="off" onChange={setNaHora} />
      </div>
      <div className="escala-meta-grupo">
        <p className="label-medium-medium">{TEXTOS_ADIAR.depois}</p>
        <p className="text-medium-regular familia-texto-suave">{TEXTO_SUGESTOES}</p>
        <div className="familia-chips escala-chips">
          {FRASES_DEPOIS.map((frase) => {
            const ajustada = fraseDepoisDoProblema(frase, problema);
            return (
              <Button
                key={frase}
                tamanho="small"
                redondo
                variante="secondary"
                onClick={() => {
                  setDepois(ajustada);
                  focarCampo("adiar-depois");
                }}
              >
                {ajustada}
              </Button>
            );
          })}
        </div>
        <InputText id="adiar-depois" rotulo={TEXTOS_ADIAR.depois} value={depois} maxLength={MAXIMO_FRASE_ADIAR} autoComplete="off" onChange={setDepois} />
      </div>
      <Button tamanho="medium" larguraTotal disabled={!naHora.trim() || !depois.trim()} carregando={salvando} onClick={salvar}>
        {TEXTOS_ADIAR.salvar}
      </Button>
    </section>
  );
}
