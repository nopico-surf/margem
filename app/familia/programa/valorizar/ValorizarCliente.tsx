"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { focarCampo, TEXTO_CAMPOS_CHEIOS, TEXTO_SUGESTOES } from "@/lib/familia/campo";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { marcarFeito } from "@/lib/familia/exercicio-cliente";
import { ITEM_VALORIZAR_M8 } from "@/lib/familia/modulo8";
import { DIAS, MOMENTOS, dataLocal, type Dia, type Momento } from "@/lib/familia/escala";
import {
  CENARIO_DO_ELOGIO,
  ELOGIOS_A_EVITAR,
  ELOGIOS_QUE_FUNCIONAM,
  FORMA_ELOGIO,
  FORMAS_DE_VALORIZAR,
  FORMAS_PARA_ESCOLHER,
  MAXIMO_FORMA,
  TEXTOS_VALORIZAR,
  type PlanoValorizar,
} from "@/lib/familia/valorizar";
import { track } from "@/lib/mixpanel";

// "Como você vai valorizar nesta semana" (briefing M4, ferramenta B). Escolher 2 formas, ver os elogios
// (que funcionam e que soam como cobrança) se escolher "Um elogio sincero", e marcar quando. Salvar
// mostra a confirmação; o plano e os 7 dias ficam no painel. Voltar a esta tela abre o plano preenchido
// ("Ver e editar o plano").
//
// ?modulo=8: aberto pelo card "Valorizar sem vigiar" do módulo 8 (briefing M8, versão "aceitou"). Salvar
// também conclui o item de lá, e voltar leva ao módulo 8.
//
// `temTreinoDeElogio`: o cenário "elogiar-sem-ironia" tem arquivo. Sem ele, "Treinar um elogio" não aparece.
//
// [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a
// ficar disponível.

type Lido = { apelido: string };

export function ValorizarCliente({ temTreinoDeElogio }: { temTreinoDeElogio: boolean }) {
  const router = useRouter();
  const [dados, setDados] = useState<Lido | null>(null);
  const [formas, setFormas] = useState<[string, string]>(["", ""]);
  const [dias, setDias] = useState<Dia[]>([]);
  const [periodos, setPeriodos] = useState<Momento[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [tocouComTudoCheio, setTocouComTudoCheio] = useState(false);
  const [modulo, setModulo] = useState(4);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const lido = (await resposta.json()) as Lido;
      const guardado = await chamarApi("/api/familia/valorizar").then(async (r) => (r?.ok ? ((await r.json()) as { plano: PlanoValorizar | null }).plano : null));
      if (guardado) {
        setFormas([aplicarApelido(guardado.formas[0] ?? "", lido.apelido), aplicarApelido(guardado.formas[1] ?? "", lido.apelido)]);
        setDias(guardado.dias);
        setPeriodos(guardado.periodos);
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
  const hrefModulo = `/familia/programa/modulo/${modulo}`;
  const voltarAoModulo = () => router.push(hrefModulo);

  const preenchidas = formas.map((forma) => forma.trim()).filter(Boolean);
  const completo = preenchidas.length === FORMAS_PARA_ESCOLHER && new Set(preenchidas).size === FORMAS_PARA_ESCOLHER;

  // Tocar numa ideia entra no primeiro campo vazio. Com os dois cheios, não apaga nada.
  function usarForma(forma: string) {
    const vazio = formas.findIndex((item) => !item.trim());
    if (vazio === -1) {
      setTocouComTudoCheio(true);
      return;
    }
    setFormas(formas.map((item, indice) => (indice === vazio ? forma.slice(0, MAXIMO_FORMA) : item)) as [string, string]);
    focarCampo(`valorizar-${vazio + 1}`);
  }

  async function salvar() {
    setSalvando(true);
    const resposta = await chamarApi("/api/familia/valorizar", {
      method: "POST",
      body: JSON.stringify({ tipo: "plano", dados: { formas: preenchidas, dias, periodos }, hoje: dataLocal() }),
    });
    setSalvando(false);
    if (!resposta?.ok) return;
    // Só as sugestões da lista que ficaram no plano, nunca o texto escrito pela pessoa.
    const daLista = FORMAS_DE_VALORIZAR.filter((forma) => preenchidas.includes(t(forma)));
    track("plano_valorizar_salvo", { formas: daLista, escritas: preenchidas.length - daLista.length, dias: dias.length, periodos: periodos.length });
    if (modulo === 8) await marcarFeito(8, ITEM_VALORIZAR_M8);
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
          <Button tamanho="medium" larguraTotal href={hrefModulo}>
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

      <p className="text-medium-regular familia-texto-suave">{TEXTO_SUGESTOES}</p>
      <div className="familia-chips escala-chips" role="group" aria-label={TEXTOS_VALORIZAR.titulo}>
        {FORMAS_DE_VALORIZAR.map((forma) => (
          <Button key={forma} tamanho="small" redondo variante="secondary" onClick={() => usarForma(t(forma))}>
            {t(forma)}
          </Button>
        ))}
      </div>

      <div className="escala-meta-grupo">
        <InputText id="valorizar-1" rotulo={TEXTOS_VALORIZAR.campoRotulo} descricao={TEXTOS_VALORIZAR.campoDica} value={formas[0]} maxLength={MAXIMO_FORMA} autoComplete="off" onChange={(valor) => setFormas([valor, formas[1]])} />
        <InputText id="valorizar-2" rotulo={TEXTOS_VALORIZAR.campoRotulo} value={formas[1]} maxLength={MAXIMO_FORMA} autoComplete="off" onChange={(valor) => setFormas([formas[0], valor])} />
        {tocouComTudoCheio && formas.every((forma) => forma.trim()) && <p className="text-medium-regular familia-texto-suave">{TEXTO_CAMPOS_CHEIOS}</p>}
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
            <Button variante="secondary" tamanho="small" href={`/familia/programa/simulador/${CENARIO_DO_ELOGIO}?modulo=${modulo}`}>
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

      <Button tamanho="medium" larguraTotal disabled={!completo} carregando={salvando} onClick={salvar}>
        {TEXTOS_VALORIZAR.salvar}
      </Button>
    </section>
  );
}
