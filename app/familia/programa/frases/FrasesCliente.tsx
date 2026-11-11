"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { focarCampo } from "@/lib/familia/campo";
import {
  CENARIO_DO_TREINO,
  CHAVE_FRASE_DO_TREINO,
  CONFERENCIA,
  CONFERENCIA_MINIMA,
  FRASES_MODELO,
  FRASES_PARA_CONCLUIR,
  HABILIDADES,
  MAXIMO_FRASE_ANTES,
  MAXIMO_FRASE_NOVA,
  TEXTOS_FRASES,
  type FraseModelo,
  type FraseSalva,
  type HabilidadeId,
} from "@/lib/familia/frases";
import { marcarFeito } from "@/lib/familia/exercicio-cliente";
import { ITEM_FRASE_M8 } from "@/lib/familia/modulo8";
import { useEtapaNaUrl } from "@/lib/familia/useEtapaNaUrl";
import { track } from "@/lib/mixpanel";

// "Reescrever minhas frases" (briefing M3, ferramenta C3). Telas: abertura, escolher a frase de antes,
// exemplo e a frase nova, conferir, frase salva; e a lista "Minhas frases".
//
// ?modulo=3: de onde a pessoa veio. ?ver=1: abre direto a lista "Minhas frases".
// ?modulo=8 (briefing M8, "Escolher minha frase"): copiar uma frase da lista ou salvar uma nova conclui
// o item "Uma frase para a próxima conversa" do módulo 8.
// Sem IA: a conferência é da própria pessoa. A IA só entra se ela tocar em "Treinar esta frase", que
// leva a frase pronta ao simulador. A frase nunca vai pro Mixpanel.
//
// [PENDÊNCIA DO FUNDADOR] Texto ao copiar e texto de erro ao salvar: não estão na especificação. Por ora
// "Copiar" não muda de rótulo e o botão de salvar só volta a ficar disponível.

type Tela = "carregando" | "intro" | "escolha" | "exemplo" | "conferir" | "salva" | "lista";

const PROPRIA = "propria";

export function FrasesCliente() {
  const router = useRouter();
  // Cada tela tem endereço próprio (?tela=escolha, ?tela=exemplo...). Salvar desfaz as etapas no
  // histórico: voltar da frase salva não reabre a conferência.
  const { etapa: tela, irPara, trocar, concluir, voltar, podeVoltar } = useEtapaNaUrl<Tela>("carregando", (t) =>
    t === "carregando" || t === "intro" ? null : t,
  );
  const [modulo, setModulo] = useState(3);
  const [salvas, setSalvas] = useState<FraseSalva[]>([]);

  // Frase de antes: uma das 10 (modelo) ou a que a pessoa escreveu.
  const [modelo, setModelo] = useState<FraseModelo | null>(null);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [propria, setPropria] = useState("");
  const [habilidadeAberta, setHabilidadeAberta] = useState<HabilidadeId | null>(null);
  const [nova, setNova] = useState("");
  const [marcados, setMarcados] = useState<number[]>([]);
  const [ajuste, setAjuste] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/frases");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      const lidas = resposta.ok ? ((await resposta.json()) as { frases: FraseSalva[] }).frases : [];
      const busca = new URLSearchParams(window.location.search);
      const pedido = Number(busca.get("modulo"));
      setModulo(Number.isInteger(pedido) && pedido >= 1 && pedido <= 8 ? pedido : 3);
      setSalvas(lidas);
      trocar(busca.get("ver") === "1" && lidas.length > 0 ? "lista" : "intro");
    })();
  }, [router]);

  if (tela === "carregando") {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const hrefModulo = `/familia/programa/modulo/${modulo}`;
  const fraseAntes = modelo ? modelo.antes : propria.trim();

  // Etapas empilhadas voltam pelo histórico; a primeira volta ao módulo.
  const voltarUmaEtapa = () => (podeVoltar ? voltar() : router.push(hrefModulo));

  function recomecar() {
    setModelo(null);
    setEscolhida(null);
    setPropria("");
    setHabilidadeAberta(null);
    setNova("");
    setMarcados([]);
    setAjuste(false);
    irPara("escolha");
  }

  function escolherModelo(frase: FraseModelo) {
    setModelo(frase);
    setEscolhida(frase.id);
    setNova("");
    setHabilidadeAberta(null);
    irPara("exemplo");
  }

  function irParaOExemplo() {
    setModelo(null);
    setNova("");
    setHabilidadeAberta(null);
    irPara("exemplo");
  }

  function alternarItem(numero: number) {
    setAjuste(false);
    setMarcados((atuais) => (atuais.includes(numero) ? atuais.filter((item) => item !== numero) : [...atuais, numero]));
  }

  async function salvar() {
    setSalvando(true);
    const resposta = await chamarApi("/api/familia/frases", {
      method: "POST",
      body: JSON.stringify({ frase: { frase_antes_id: modelo?.id ?? null, frase_antes_texto: fraseAntes, frase_nova: nova, conferencia: marcados } }),
    });
    setSalvando(false);
    if (!resposta?.ok) return;
    // Só quantas frases e quantos itens da conferência, nunca o texto.
    track("frase_reescrita", { total: salvas.length + 1, itens_marcados: marcados.length, partiu_de_exemplo: Boolean(modelo) });
    const lidas = await chamarApi("/api/familia/frases");
    if (lidas?.ok) setSalvas(((await lidas.json()) as { frases: FraseSalva[] }).frases);
    if (modulo === 8) await marcarFeito(8, ITEM_FRASE_M8);
    concluir("salva");
  }

  // Menos de 3 itens marcados: pergunta se quer ajustar antes de salvar (nada é obrigatório).
  function tentarSalvar() {
    if (marcados.length < CONFERENCIA_MINIMA && !ajuste) {
      setAjuste(true);
      return;
    }
    void salvar();
  }

  function treinar(texto: string) {
    try {
      window.sessionStorage.setItem(CHAVE_FRASE_DO_TREINO, texto);
    } catch {}
    track("frase_treinar", { origem: "frases" });
    router.push(`/familia/programa/simulador/${CENARIO_DO_TREINO}?modulo=${modulo}`);
  }

  function copiar(texto: string) {
    void navigator.clipboard?.writeText(texto).catch(() => {});
    // Módulo 8, versão "voltou a usar": copiar uma das frases é escolher a frase da próxima conversa.
    if (modulo === 8) void marcarFeito(8, ITEM_FRASE_M8);
  }

  const topo = (voltar: () => void, rotulo: string) => (
    <div className="familia-pergunta-topo">
      <button className="familia-voltar" type="button" aria-label={rotulo} onClick={voltar}>
        <GlifoArrowBack size={24} />
      </button>
    </div>
  );

  // ===== Minhas frases =====
  if (tela === "lista") {
    return (
      <section className="familia-pergunta">
        {topo(() => router.push(hrefModulo), TEXTOS_FRASES.voltar)}
        <h1 className="header-large">{TEXTOS_FRASES.tituloLista}</h1>
        {salvas.map((frase) => (
          <div key={frase.id} className="familia-cartao">
            <p className="text-medium-regular familia-texto-suave frase-antes">{frase.frase_antes_texto}</p>
            <p className="text-large">{frase.frase_nova}</p>
            <div className="familia-exercicio-acoes">
              <Button variante="secondary" tamanho="small" onClick={() => copiar(frase.frase_nova)}>
                {TEXTOS_FRASES.copiar}
              </Button>
              <Button variante="secondary" tamanho="small" onClick={() => treinar(frase.frase_nova)}>
                {TEXTOS_FRASES.treinar}
              </Button>
            </div>
          </div>
        ))}
        <div className="familia-acoes">
          <Button tamanho="medium" larguraTotal onClick={recomecar}>
            {TEXTOS_FRASES.outra}
          </Button>
          <Button variante="transparent" tamanho="medium" larguraTotal href={hrefModulo}>
            {TEXTOS_FRASES.voltar}
          </Button>
        </div>
      </section>
    );
  }

  // ===== Tela 1: abertura =====
  if (tela === "intro") {
    return (
      <section className="familia-pergunta">
        {topo(() => router.push(hrefModulo), TEXTOS_FRASES.voltar)}
        <header className="familia-titulo">
          <h1 className="header-large">{TEXTOS_FRASES.titulo}</h1>
          <p className="text-large">{TEXTOS_FRASES.intro}</p>
        </header>
        <p className="label-small-medium familia-texto-suave">{TEXTOS_FRASES.contador(salvas.length)}</p>
        <Button tamanho="medium" larguraTotal onClick={recomecar}>
          {TEXTOS_FRASES.comecar}
        </Button>
      </section>
    );
  }

  // ===== Tela 2: escolher a frase de antes =====
  if (tela === "escolha") {
    return (
      <section className="familia-pergunta">
        {topo(voltarUmaEtapa, "Voltar")}
        <p className="header-small">{TEXTOS_FRASES.escolha}</p>
        <div className="familia-chips escala-chips" role="radiogroup" aria-label={TEXTOS_FRASES.escolha}>
          {FRASES_MODELO.map((frase) => (
            <Button key={frase.id} tamanho="small" redondo variante={escolhida === frase.id ? "primary" : "secondary"} onClick={() => escolherModelo(frase)}>
              {frase.antes}
            </Button>
          ))}
          <Button tamanho="small" redondo variante={escolhida === PROPRIA ? "primary" : "secondary"} onClick={() => setEscolhida(PROPRIA)}>
            {TEXTOS_FRASES.escreverMinha}
          </Button>
        </div>
        <p className="text-medium-regular familia-texto-suave">{TEXTOS_FRASES.escolhaAjuda}</p>
        {escolhida === PROPRIA && (
          <>
            <InputText id="frase-propria" rotulo={TEXTOS_FRASES.escreverMinha} value={propria} maxLength={MAXIMO_FRASE_ANTES} autoComplete="off" onChange={setPropria} />
            <Button tamanho="medium" larguraTotal disabled={!propria.trim()} onClick={irParaOExemplo}>
              {TEXTOS_FRASES.continuar}
            </Button>
          </>
        )}
      </section>
    );
  }

  // ===== Tela 3: ver um exemplo e escrever a sua =====
  if (tela === "exemplo") {
    return (
      <section className="familia-pergunta">
        {topo(voltarUmaEtapa, "Voltar")}
        <p className="text-large familia-texto-suave frase-antes">{fraseAntes}</p>
        {modelo ? (
          <div className="familia-cartao">
            <h2 className="header-small">{TEXTOS_FRASES.exemploTitulo}</h2>
            <p className="text-large">{modelo.novo}</p>
            <div className="familia-chips">
              {modelo.habilidades.map((id) => (
                <Button key={id} tamanho="small" redondo variante={habilidadeAberta === id ? "primary" : "secondary"} onClick={() => setHabilidadeAberta(habilidadeAberta === id ? null : id)}>
                  {HABILIDADES[id].rotulo}
                </Button>
              ))}
            </div>
            {habilidadeAberta && HABILIDADES[habilidadeAberta].explicacao && <p className="text-medium-regular">{HABILIDADES[habilidadeAberta].explicacao}</p>}
          </div>
        ) : (
          <p className="text-large">{TEXTOS_FRASES.pensar}</p>
        )}
        <div className="escala-meta-grupo">
          <InputText id="frase-nova" rotulo={TEXTOS_FRASES.campoRotulo} descricao={TEXTOS_FRASES.campoDica} value={nova} maxLength={MAXIMO_FRASE_NOVA} autoComplete="off" onChange={setNova} />
          {modelo && (
            <Button variante="transparent" tamanho="small" onClick={() => {
                setNova(modelo.novo);
                focarCampo("frase-nova");
              }}
            >
              {TEXTOS_FRASES.usarExemplo}
            </Button>
          )}
        </div>
        <Button tamanho="medium" larguraTotal disabled={!nova.trim()} onClick={() => irPara("conferir")}>
          {TEXTOS_FRASES.continuar}
        </Button>
      </section>
    );
  }

  // ===== Tela 4: conferir =====
  if (tela === "conferir") {
    return (
      <section className="familia-pergunta">
        {topo(voltarUmaEtapa, "Voltar")}
        <h1 className="header-large">{TEXTOS_FRASES.conferirTitulo}</h1>
        <p className="text-large">{nova}</p>
        <div className="familia-chips escala-chips">
          {CONFERENCIA.map((item, indice) => (
            <Button key={item} tamanho="small" redondo variante={marcados.includes(indice + 1) ? "primary" : "secondary"} onClick={() => alternarItem(indice + 1)}>
              {item}
            </Button>
          ))}
        </div>
        <p className="text-medium-regular familia-texto-suave">{TEXTOS_FRASES.conferirAjuda}</p>
        {ajuste ? (
          <div className="familia-acoes">
            <p className="header-small">{TEXTOS_FRASES.ajustarPergunta}</p>
            <Button tamanho="medium" larguraTotal onClick={voltarUmaEtapa}>
              {TEXTOS_FRASES.ajustar}
            </Button>
            <Button variante="transparent" tamanho="small" carregando={salvando} onClick={() => void salvar()}>
              {TEXTOS_FRASES.salvarMesmoAssim}
            </Button>
          </div>
        ) : (
          <Button tamanho="medium" larguraTotal carregando={salvando} onClick={tentarSalvar}>
            {TEXTOS_FRASES.salvar}
          </Button>
        )}
      </section>
    );
  }

  // ===== Frase salva =====
  return (
    <section className="familia-pergunta">
      <p className="header-small" role="status">
        {TEXTOS_FRASES.salva}
      </p>
      {salvas.length >= FRASES_PARA_CONCLUIR && <p className="text-large">{TEXTOS_FRASES.todas}</p>}
      <div className="familia-acoes">
        <Button tamanho="medium" larguraTotal onClick={() => treinar(nova)}>
          {TEXTOS_FRASES.treinar}
        </Button>
        <Button variante="secondary" tamanho="medium" larguraTotal onClick={recomecar}>
          {TEXTOS_FRASES.proxima}
        </Button>
        <Button variante="transparent" tamanho="medium" larguraTotal href={hrefModulo}>
          {TEXTOS_FRASES.voltar}
        </Button>
      </div>
    </section>
  );
}
