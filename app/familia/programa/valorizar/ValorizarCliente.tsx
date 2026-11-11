"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { DIAS, MOMENTOS, dataLocal, type Dia, type Momento } from "@/lib/familia/escala";
import {
  CENARIO_DO_ELOGIO,
  ELOGIOS_A_EVITAR,
  ELOGIOS_QUE_FUNCIONAM,
  FORMA_ELOGIO,
  FORMAS_DE_VALORIZAR,
  FORMAS_PARA_ESCOLHER,
  TEXTOS_VALORIZAR,
  type PlanoValorizar,
} from "@/lib/familia/valorizar";
import { track } from "@/lib/mixpanel";

// "Como você vai valorizar nesta semana" (briefing M4, ferramenta B). Escolher 2 formas, ver os elogios
// (que funcionam e que soam como cobrança) se escolher "Um elogio sincero", e marcar quando. Salvar
// mostra a confirmação; o plano e os 7 dias ficam no painel. Voltar a esta tela abre o plano preenchido
// ("Ver e editar o plano").
//
// `temTreinoDeElogio`: o cenário "elogiar-sem-ironia" tem arquivo. Sem ele, "Treinar um elogio" não aparece.
//
// [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a
// ficar disponível.

type Lido = { apelido: string };

export function ValorizarCliente({ temTreinoDeElogio }: { temTreinoDeElogio: boolean }) {
  const router = useRouter();
  const [dados, setDados] = useState<Lido | null>(null);
  const [formas, setFormas] = useState<string[]>([]);
  const [dias, setDias] = useState<Dia[]>([]);
  const [periodos, setPeriodos] = useState<Momento[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const lido = (await resposta.json()) as Lido;
      const guardado = await chamarApi("/api/familia/valorizar").then(async (r) => (r?.ok ? ((await r.json()) as { plano: PlanoValorizar | null }).plano : null));
      if (guardado) {
        setFormas(guardado.formas);
        setDias(guardado.dias);
        setPeriodos(guardado.periodos);
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
  const voltarAoModulo = () => router.push("/familia/programa/modulo/4");

  function alternarForma(forma: string) {
    setFormas((atuais) => (atuais.includes(forma) ? atuais.filter((item) => item !== forma) : atuais.length < FORMAS_PARA_ESCOLHER ? [...atuais, forma] : atuais));
  }

  async function salvar() {
    setSalvando(true);
    const resposta = await chamarApi("/api/familia/valorizar", {
      method: "POST",
      body: JSON.stringify({ tipo: "plano", dados: { formas, dias, periodos }, hoje: dataLocal() }),
    });
    setSalvando(false);
    if (!resposta?.ok) return;
    // Só o que a pessoa escolheu entre as opções, nunca texto livre (aqui não há).
    track("plano_valorizar_salvo", { formas, dias: dias.length, periodos: periodos.length });
    setSalvo(true);
    window.scrollTo({ top: 0 });
  }

  if (salvo) {
    return (
      <section className="familia-pergunta">
        <p className="header-small" role="status">
          {TEXTOS_VALORIZAR.salvo}
        </p>
        <div className="familia-acoes">
          <Button tamanho="medium" larguraTotal href="/familia/programa/modulo/4">
            Voltar ao módulo
          </Button>
          <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
            Voltar ao painel
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="familia-pergunta">
      <div className="familia-pergunta-topo">
        <button className="familia-voltar" type="button" aria-label="Voltar ao módulo" onClick={voltarAoModulo}>
          <GlifoArrowBack size={24} />
        </button>
      </div>
      <header className="familia-titulo">
        <h1 className="header-large">{TEXTOS_VALORIZAR.titulo}</h1>
        <p className="text-large">{t(TEXTOS_VALORIZAR.intro)}</p>
      </header>

      <div className="familia-chips escala-chips" aria-label={TEXTOS_VALORIZAR.titulo}>
        {FORMAS_DE_VALORIZAR.map((forma) => (
          <Button key={forma} tamanho="small" redondo variante={formas.includes(forma) ? "primary" : "secondary"} onClick={() => alternarForma(forma)}>
            {t(forma)}
          </Button>
        ))}
      </div>

      {formas.includes(FORMA_ELOGIO) && (
        <div className="familia-cartao">
          <h2 className="header-small">{TEXTOS_VALORIZAR.funcionam}</h2>
          <ul className="familia-lista text-large">
            {ELOGIOS_QUE_FUNCIONAM.map((frase) => (
              <li key={frase}>{`"${frase}"`}</li>
            ))}
          </ul>
          <h2 className="header-small">{TEXTOS_VALORIZAR.evitar}</h2>
          <ul className="familia-lista text-large">
            {ELOGIOS_A_EVITAR.map((elogio) => (
              <li key={elogio.frase}>
                {`"${elogio.frase}"`} {elogio.motivo}
              </li>
            ))}
          </ul>
          {temTreinoDeElogio && (
            <Button variante="secondary" tamanho="small" href={`/familia/programa/simulador/${CENARIO_DO_ELOGIO}?modulo=4`}>
              {TEXTOS_VALORIZAR.treinarElogio}
            </Button>
          )}
        </div>
      )}

      <div className="escala-meta-grupo">
        <p className="label-medium-medium">{TEXTOS_VALORIZAR.quandoRotulo}</p>
        <p className="text-medium-regular familia-texto-suave">{TEXTOS_VALORIZAR.quandoDica}</p>
        <div className="familia-chips escala-chips">
          {DIAS.map((dia) => (
            <Button
              key={dia.id}
              tamanho="small"
              redondo
              variante={dias.includes(dia.id) ? "primary" : "secondary"}
              onClick={() => setDias((atuais) => (atuais.includes(dia.id) ? atuais.filter((item) => item !== dia.id) : [...atuais, dia.id]))}
            >
              {dia.rotulo}
            </Button>
          ))}
        </div>
        <div className="familia-chips escala-chips">
          {MOMENTOS.map((momento) => (
            <Button
              key={momento.id}
              tamanho="small"
              redondo
              variante={periodos.includes(momento.id) ? "primary" : "secondary"}
              onClick={() => setPeriodos((atuais) => (atuais.includes(momento.id) ? atuais.filter((item) => item !== momento.id) : [...atuais, momento.id]))}
            >
              {momento.rotulo}
            </Button>
          ))}
        </div>
      </div>

      <Button tamanho="medium" larguraTotal disabled={formas.length !== FORMAS_PARA_ESCOLHER} carregando={salvando} onClick={salvar}>
        {TEXTOS_VALORIZAR.salvar}
      </Button>
    </section>
  );
}
