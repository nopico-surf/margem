"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Avatar } from "@/components/ui/Avatar";
import { BotaoAgendar } from "@/components/ui/BotaoAgendar";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { chamarApi } from "@/lib/familia/auth-cliente";
import {
  ABRIR_COM_PROGRAMA,
  alvoDoAgendar,
  CENARIO_DO_CONVITE,
  MAXIMO_FRASE_CONVITE,
  MAXIMO_SALVOS,
  PARTE_ABRIR,
  PARTE_OFERECER,
  PARTE_SENTIR,
  PASSOS_DO_CONVITE,
  PLANOS_B,
  RESPOSTAS_DO_CONVITE,
  SEMANAS_PADRAO_RETORNO,
  SERVICOS_DO_CONVITE,
  SINAIS_BOA_HORA,
  SINAIS_ESPERAR,
  TEXTOS_CONVITE,
  type Convite,
  type PlanoB,
  type ProfissionalDoConvite,
} from "@/lib/familia/convite";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { momentoBomMaisComum, type Anotacao } from "@/lib/familia/diario";
import { dataLocal } from "@/lib/familia/escala";
import { marcarFeito } from "@/lib/familia/exercicio-cliente";
import { ITEM_NOVO_CONVITE_M8 } from "@/lib/familia/modulo8";
import { fotoPequena } from "@/lib/foto-pequena";
import { track } from "@/lib/mixpanel";

// "Preparar o convite" (briefing M5, C6): 5 passos, um por tela, com "Passo X de 5". Cada passo grava
// ao avançar, e voltar a esta tela abre no passo seguinte ao último concluído. Com os 5 passos feitos,
// abre do passo 1 com tudo preenchido ("Ver e editar meu convite"). Salvar o passo 5 volta ao módulo
// (o briefing não traz texto de confirmação).
//
// Sem agenda nem preço no banco, a lista do passo 1 não filtra por horário em até 3 dias, e o bloco "Se
// não houver horário rápido" aparece sempre embaixo dela. O banco não guarda o gênero do profissional:
// a oferta usa "alguém". caution_mode ainda não tem regra (contextoDo, exercicio-cliente.ts), então a
// opção "Eu tenho feito um programa..." aparece sempre; a constante CAUTELA fica pronta pra quando tiver.
//
// [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a
// ficar disponível. O aviso por e-mail na data do plano B ainda não existe: a data só fica salva.

type Lido = { apelido: string };
type Tela = "intro" | 1 | 2 | 3 | 4 | 5;

const CAUTELA = false;

function emSemanas(semanas: number) {
  const data = new Date();
  data.setDate(data.getDate() + semanas * 7);
  return dataLocal(data);
}

export function ConviteCliente({ profissionais, temTreino }: { profissionais: ProfissionalDoConvite[]; temTreino: boolean }) {
  const router = useRouter();
  const [dados, setDados] = useState<Lido | null>(null);
  const [tela, setTela] = useState<Tela>("intro");
  const [momentoBom, setMomentoBom] = useState<string | null>(null);
  const [salvos, setSalvos] = useState<string[]>([]);
  const [abrir, setAbrir] = useState<string | null>(null);
  const [sentir, setSentir] = useState<string | null>(null);
  const [oferecer, setOferecer] = useState<string | null>(null);
  const [frase, setFrase] = useState("");
  const [planoB, setPlanoB] = useState<PlanoB | null>(null);
  const [dataRetorno, setDataRetorno] = useState(() => emSemanas(SEMANAS_PADRAO_RETORNO));
  const [salvando, setSalvando] = useState(false);
  // ?modulo=8: "Rever meu convite" do módulo 8 (versão "disse não"). Abre com o que já foi salvo; salvar
  // o passo 5 conclui o item "Preparar um novo convite" de lá, e voltar leva ao módulo 8.
  const [modulo, setModulo] = useState(5);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const lido = (await resposta.json()) as Lido;
      const [guardado, diario] = await Promise.all([
        chamarApi("/api/familia/convite").then(async (r) => (r?.ok ? ((await r.json()) as { convite: Convite | null }).convite : null)),
        chamarApi("/api/familia/diario").then(async (r) => (r?.ok ? ((await r.json()) as { anotacoes: Anotacao[] }).anotacoes : [])),
      ]);
      setMomentoBom(momentoBomMaisComum(diario));
      if (guardado) {
        setSalvos(guardado.profissionais_salvos);
        setFrase(guardado.frase ?? "");
        setPlanoB(guardado.plano_b);
        if (guardado.data_retorno) setDataRetorno(guardado.data_retorno);
        setTela(guardado.passo >= PASSOS_DO_CONVITE ? 1 : guardado.passo === 0 ? "intro" : ((guardado.passo + 1) as Tela));
      }
      if (new URLSearchParams(window.location.search).get("modulo") === "8") setModulo(8);
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
  const agendar = alvoDoAgendar(salvos, profissionais);

  async function gravarPasso(passo: number, extra: Record<string, unknown> = {}) {
    setSalvando(true);
    const resposta = await chamarApi("/api/familia/convite", { method: "POST", body: JSON.stringify({ tipo: "passo", dados: { passo, ...extra } }) });
    setSalvando(false);
    if (!resposta?.ok) return false;
    // Só o número do passo, nunca a frase.
    track("convite_passo_salvo", { passo });
    return true;
  }

  async function avancar(passo: number, extra: Record<string, unknown> = {}) {
    if (!(await gravarPasso(passo, extra))) return;
    if (passo >= PASSOS_DO_CONVITE) {
      if (modulo === 8) await marcarFeito(8, ITEM_NOVO_CONVITE_M8);
      return router.push(`/familia/programa/modulo/${modulo}`);
    }
    setTela((passo + 1) as Tela);
    window.scrollTo({ top: 0 });
  }

  function alternarSalvo(id: string) {
    setSalvos((atuais) => (atuais.includes(id) ? atuais.filter((item) => item !== id) : atuais.length < MAXIMO_SALVOS ? [...atuais, id] : atuais));
  }

  // Escolher uma parte remonta a frase com as partes escolhidas; depois a pessoa edita do jeito dela.
  function escolherParte(parte: "abrir" | "sentir" | "oferecer", valor: string) {
    const novas = { abrir, sentir, oferecer, [parte]: valor };
    setAbrir(novas.abrir);
    setSentir(novas.sentir);
    setOferecer(novas.oferecer);
    setFrase([novas.abrir, novas.sentir, novas.oferecer].filter(Boolean).map((texto) => t(texto as string)).join(" "));
  }

  const voltar = () => {
    if (tela === "intro" || tela === 1) return router.push(`/familia/programa/modulo/${modulo}`);
    setTela((tela - 1) as Tela);
    window.scrollTo({ top: 0 });
  };

  const topo = (
    <div className="familia-pergunta-topo">
      <button className="familia-voltar" type="button" aria-label="Voltar" onClick={voltar}>
        <GlifoArrowBack size={24} />
      </button>
    </div>
  );

  const progresso =
    tela === "intro" ? null : (
      <div className="familia-titulo">
        <ProgressBar atual={tela} total={PASSOS_DO_CONVITE} rotulo={TEXTOS_CONVITE.passo(tela)} />
        <p className="label-small-medium familia-texto-suave">{TEXTOS_CONVITE.passo(tela)}</p>
      </div>
    );

  // ===== Abertura =====
  if (tela === "intro") {
    return (
      <section className="familia-pergunta">
        {topo}
        <header className="familia-titulo">
          <h1 className="header-large">{TEXTOS_CONVITE.titulo}</h1>
          <p className="text-large">{TEXTOS_CONVITE.intro}</p>
        </header>
        <Button tamanho="medium" larguraTotal onClick={() => setTela(1)}>
          {TEXTOS_CONVITE.continuar}
        </Button>
      </section>
    );
  }

  // ===== Passo 1: deixar a ajuda pronta =====
  if (tela === 1) {
    const botaoSalvar = (id: string) => {
      const salvo = salvos.includes(id);
      return (
        <Button variante={salvo ? "primary" : "secondary"} tamanho="small" disabled={!salvo && salvos.length >= MAXIMO_SALVOS} aria-pressed={salvo} onClick={() => alternarSalvo(id)}>
          {salvo ? TEXTOS_CONVITE.salvoProfissional : TEXTOS_CONVITE.salvarProfissional}
        </Button>
      );
    };
    return (
      <section className="familia-pergunta">
        {topo}
        {progresso}
        <header className="familia-titulo">
          <h1 className="header-large">{TEXTOS_CONVITE.passo1Titulo}</h1>
          <p className="text-large">{t(TEXTOS_CONVITE.passo1Texto)}</p>
        </header>
        {profissionais.map((profissional) => (
          <div key={profissional.id} className="familia-cartao">
            <div className="convite-profissional-topo">
              <Avatar className="convite-profissional-foto" src={profissional.foto_url && fotoPequena(profissional.foto_url)} />
              <div>
                <h2 className="header-small">{profissional.nome}</h2>
                {profissional.abordagem && <p className="text-medium-regular familia-texto-suave">{profissional.abordagem}</p>}
              </div>
            </div>
            {botaoSalvar(profissional.id)}
          </div>
        ))}
        <p className="text-medium-regular familia-texto-suave">{t(TEXTOS_CONVITE.passo1Apoio)}</p>

        <h2 className="header-medium">{TEXTOS_CONVITE.semHorarioTitulo}</h2>
        <p className="text-large">{TEXTOS_CONVITE.semHorarioTexto}</p>
        {SERVICOS_DO_CONVITE.map((servico) => (
          <div key={servico.id} className="familia-cartao">
            <h3 className="header-small">{servico.nome}</h3>
            <p className="text-large">{servico.descricao}</p>
            {botaoSalvar(servico.id)}
          </div>
        ))}
        <Button variante="secondary" tamanho="small" href="/redes-de-apoio?tipo=publicas">
          {TEXTOS_CONVITE.servicosPerto}
        </Button>

        <Button tamanho="medium" larguraTotal carregando={salvando} onClick={() => void avancar(1, { profissionais_salvos: salvos })}>
          {TEXTOS_CONVITE.continuar}
        </Button>
      </section>
    );
  }

  // ===== Passo 2: a hora certa =====
  if (tela === 2) {
    return (
      <section className="familia-pergunta">
        {topo}
        {progresso}
        <header className="familia-titulo">
          <h1 className="header-large">{TEXTOS_CONVITE.passo2Titulo}</h1>
        </header>
        <div className="familia-cartao">
          <h2 className="header-small">{t(TEXTOS_CONVITE.boaHora)}</h2>
          <ul className="familia-lista text-large">
            {SINAIS_BOA_HORA.map((sinal) => (
              <li key={sinal}>{t(sinal)}</li>
            ))}
          </ul>
        </div>
        <div className="familia-cartao">
          <h2 className="header-small">{TEXTOS_CONVITE.esperar}</h2>
          <ul className="familia-lista text-large">
            {SINAIS_ESPERAR.map((sinal) => (
              <li key={sinal}>{t(sinal)}</li>
            ))}
          </ul>
        </div>
        {momentoBom && <p className="text-large">{TEXTOS_CONVITE.janelaDoDiario.replace("{{momento}}", momentoBom)}</p>}
        <Button tamanho="medium" larguraTotal carregando={salvando} onClick={() => void avancar(2)}>
          {TEXTOS_CONVITE.entendi}
        </Button>
      </section>
    );
  }

  // ===== Passo 3: montar a frase =====
  if (tela === 3) {
    const partes: Array<{ id: "abrir" | "sentir" | "oferecer"; rotulo: string; opcoes: string[]; escolhida: string | null }> = [
      { id: "abrir", rotulo: TEXTOS_CONVITE.parteAbrir, opcoes: PARTE_ABRIR.filter((opcao) => !CAUTELA || opcao !== ABRIR_COM_PROGRAMA), escolhida: abrir },
      { id: "sentir", rotulo: TEXTOS_CONVITE.parteSentir, opcoes: PARTE_SENTIR, escolhida: sentir },
      { id: "oferecer", rotulo: TEXTOS_CONVITE.parteOferecer, opcoes: PARTE_OFERECER, escolhida: oferecer },
    ];
    return (
      <section className="familia-pergunta">
        {topo}
        {progresso}
        <header className="familia-titulo">
          <h1 className="header-large">{TEXTOS_CONVITE.passo3Titulo}</h1>
          <p className="text-large">{TEXTOS_CONVITE.passo3Texto}</p>
        </header>
        {partes.map((parte) => (
          <div key={parte.id} className="escala-meta-grupo">
            <p className="label-medium-medium">{parte.rotulo}</p>
            <div className="familia-chips escala-chips" role="radiogroup" aria-label={parte.rotulo}>
              {parte.opcoes.map((opcao) => (
                <Button key={opcao} tamanho="small" redondo variante={parte.escolhida === opcao ? "primary" : "secondary"} onClick={() => escolherParte(parte.id, opcao)}>
                  {t(opcao)}
                </Button>
              ))}
            </div>
          </div>
        ))}
        <InputText
          id="convite-frase"
          rotulo={TEXTOS_CONVITE.passo3Titulo}
          descricao={`${TEXTOS_CONVITE.respiracao} ${frase.length}/${MAXIMO_FRASE_CONVITE}`}
          value={frase}
          maxLength={MAXIMO_FRASE_CONVITE}
          autoComplete="off"
          onChange={setFrase}
        />
        <Button tamanho="medium" larguraTotal disabled={!frase.trim()} carregando={salvando} onClick={() => void avancar(3, { frase })}>
          {TEXTOS_CONVITE.salvarFrase}
        </Button>
      </section>
    );
  }

  // ===== Passo 4: treinar =====
  if (tela === 4) {
    return (
      <section className="familia-pergunta">
        {topo}
        {progresso}
        <header className="familia-titulo">
          <h1 className="header-large">{TEXTOS_CONVITE.passo4Titulo}</h1>
          <p className="text-large">{t(TEXTOS_CONVITE.passo4Texto)}</p>
        </header>
        <div className="familia-acoes">
          {temTreino && (
            <Button
              tamanho="medium"
              larguraTotal
              carregando={salvando}
              onClick={async () => {
                if (await gravarPasso(4)) router.push(`/familia/programa/simulador/${CENARIO_DO_CONVITE}?modulo=${modulo}`);
              }}
            >
              {TEXTOS_CONVITE.treinar}
            </Button>
          )}
          <Button variante="transparent" tamanho="medium" larguraTotal carregando={salvando && !temTreino} onClick={() => void avancar(4)}>
            {TEXTOS_CONVITE.pular}
          </Button>
        </div>
      </section>
    );
  }

  // ===== Passo 5: e se a resposta for... =====
  return (
    <section className="familia-pergunta">
      {topo}
      {progresso}
      <header className="familia-titulo">
        <h1 className="header-large">{TEXTOS_CONVITE.passo5Titulo}</h1>
      </header>
      {RESPOSTAS_DO_CONVITE.map((resposta) => (
        <div key={resposta.id} className="familia-cartao">
          <h2 className="header-small">{resposta.titulo}</h2>
          <p className="text-large">{t(resposta.texto)}</p>
          {resposta.frase && <p className="text-large">{`"${resposta.frase}"`}</p>}
          {resposta.id === "sim" && agendar && (
            <BotaoAgendar
              tamanho="small"
              label={TEXTOS_CONVITE.agendarCom.replace("{{profissional}}", agendar.nome)}
              href={agendar.href}
              onClick={() => {
                track("agendar_whatsapp_clicado", { rota: "/familia/programa/convite", tipo_recurso: agendar.profissional ? "profissional" : "servico", profissional_id: agendar.profissional ? agendar.id : null, origem: "convite" });
                if (!agendar.profissional) return;
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ event: "agendar_whatsapp" });
              }}
            />
          )}
        </div>
      ))}

      <h2 className="header-medium">{TEXTOS_CONVITE.planoBPergunta}</h2>
      <div className="convite-planos" role="radiogroup" aria-label={TEXTOS_CONVITE.planoBPergunta}>
        {PLANOS_B.map((plano) => (
          <div key={plano.id} className="familia-cartao">
            <Button tamanho="small" redondo variante={planoB === plano.id ? "primary" : "secondary"} aria-pressed={planoB === plano.id} onClick={() => setPlanoB(plano.id)}>
              {plano.titulo}
            </Button>
            <p className="text-large">{plano.texto}</p>
            {plano.id === "focar_metas" && planoB === "focar_metas" && (
              <input
                type="date"
                className="diario-data-campo text-large"
                aria-label="Escolher a data"
                value={dataRetorno}
                min={dataLocal()}
                onChange={(evento) => evento.target.value && setDataRetorno(evento.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <Button
        tamanho="medium"
        larguraTotal
        disabled={!planoB}
        carregando={salvando}
        onClick={() => void avancar(5, { plano_b: planoB, data_retorno: planoB === "focar_metas" ? dataRetorno : null })}
      >
        {TEXTOS_CONVITE.salvarPlano}
      </Button>
    </section>
  );
}
