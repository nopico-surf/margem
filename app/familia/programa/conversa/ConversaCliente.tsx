"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import {
  FRASE_OUTRA,
  fraseDoRegistro,
  MAXIMO_FRASE,
  MODULOS_DA_CONVERSA,
  OPCOES_COMO_FOI,
  OPCOES_REACAO,
  TEXTOS_CONVERSA,
  type ComoFoi,
  type ReacaoNaConversa,
  type RegistroDaConversa,
} from "@/lib/familia/conversa";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import type { Anotacao } from "@/lib/familia/diario";
import type { FraseSalva } from "@/lib/familia/frases";
import type { Resultado } from "@/lib/familia/resultado";
import { SAI_PARA_SE_PROTEGER } from "@/lib/familia/diario";
import { track } from "@/lib/mixpanel";

// "Como foi a conversa" (briefing M1, item 2): uma tela de rolagem curta e o retorno depois de salvar.
//
// ?modulo=1 | 3 | 5: de onde a pessoa veio (o registro guarda o módulo).
// ?ver=1: mostra o último registro do módulo, com "Contar de novo".

type Dados = { apelido: string; resultado: Resultado };

const OUTRA = "outra";
const NAO_LEMBRO = "nao_lembro";

export function ConversaCliente() {
  const router = useRouter();
  const [dados, setDados] = useState<Dados | null>(null);
  const [modulo, setModulo] = useState(1);
  const [ultimo, setUltimo] = useState<RegistroDaConversa | null>(null);
  const [ver, setVer] = useState(false);
  // Com medo relatado antes (modo segurança ou "saí de perto" no diário), "Se irritou" mostra o plano de segurança.
  const [comMedo, setComMedo] = useState(false);
  // "Minhas frases" (briefing M3): as frases novas que a pessoa salvou entram na lista de "Qual frase você usou?".
  const [minhasFrases, setMinhasFrases] = useState<string[]>([]);

  // Frase: o texto de uma frase salva, "outra" (campo curto) ou "nao_lembro".
  const [frase, setFrase] = useState<string | null>(null);
  const [fraseOutra, setFraseOutra] = useState("");
  const [comoFoi, setComoFoi] = useState<ComoFoi | null>(null);
  const [reacao, setReacao] = useState<ReacaoNaConversa | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState<{ comoFoi: ComoFoi; reacao: ReacaoNaConversa | null } | null>(null);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const busca = new URLSearchParams(window.location.search);
      const pedido = Number(busca.get("modulo"));
      const doModulo = MODULOS_DA_CONVERSA.includes(pedido) ? pedido : 1;
      const lido = (await resposta.json()) as Dados;
      const [registros, anotacoes, frasesNovas] = await Promise.all([
        chamarApi("/api/familia/conversa").then(async (r) => (r?.ok ? ((await r.json()) as { registros: RegistroDaConversa[] }).registros : [])),
        chamarApi("/api/familia/diario").then(async (r) => (r?.ok ? ((await r.json()) as { anotacoes: Anotacao[] }).anotacoes : [])),
        chamarApi("/api/familia/frases").then(async (r) => (r?.ok ? ((await r.json()) as { frases: FraseSalva[] }).frases : [])),
      ]);
      setMinhasFrases(frasesNovas.map((frase) => frase.frase_nova));
      const ultimoDoModulo = registros.find((registro) => registro.modulo === doModulo) ?? null;
      setModulo(doModulo);
      setUltimo(ultimoDoModulo);
      setVer(busca.get("ver") === "1" && Boolean(ultimoDoModulo));
      setComMedo(lido.resultado.safetyMode || anotacoes.some((anotacao) => anotacao.reagiu.includes(SAI_PARA_SE_PROTEGER)));
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

  const { apelido, resultado } = dados;
  const t = (texto: string) => aplicarApelido(texto, apelido);
  // Minhas frases primeiro, depois as do roteiro do diagnóstico.
  const frasesSalvas = [...new Set([...minhasFrases, ...(resultado.conversa ? [resultado.conversa.abertura, ...resultado.conversa.frasesUteis] : [])])];
  const hrefTreino = `/familia/programa/simulador/primeira-conversa?modulo=${modulo}`;
  const hrefModulo = `/familia/programa/modulo/${modulo}`;

  async function salvar() {
    if (!comoFoi) return;
    setSalvando(true);
    // A categoria ("outra" ou uma frase salva) e o texto escrito vão separados.
    const escolhida = frase === OUTRA ? FRASE_OUTRA : frase && frase !== NAO_LEMBRO ? frase : "";
    const resposta = await chamarApi("/api/familia/conversa", {
      method: "POST",
      body: JSON.stringify({ registro: { modulo, frase: escolhida, frase_outra: frase === OUTRA ? fraseOutra : "", como_foi: comoFoi, reacao } }),
    });
    setSalvando(false);
    // [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora o botão só volta a ficar disponível.
    if (!resposta?.ok) return;
    // Só o que a pessoa escolheu, nunca a frase.
    track("conversa_registrada", { modulo, como_foi: comoFoi, reacao });
    setSalvo({ comoFoi, reacao });
    window.scrollTo({ top: 0 });
  }

  const topo = (
    <div className="familia-pergunta-topo">
      <button className="familia-voltar" type="button" aria-label="Voltar ao módulo" onClick={() => router.push(hrefModulo)}>
        <GlifoArrowBack size={24} />
      </button>
    </div>
  );

  // ===== Retorno depois de salvar =====
  if (salvo) {
    const retorno = OPCOES_COMO_FOI.find((opcao) => opcao.valor === salvo.comoFoi)?.retorno ?? "";
    return (
      <section className="familia-pergunta">
        <p className="header-small" role="status">
          {retorno}
        </p>
        {salvo.comoFoi === "travei" && (
          <Button variante="secondary" tamanho="medium" larguraTotal href={hrefTreino}>
            {TEXTOS_CONVERSA.treinar}
          </Button>
        )}
        {salvo.reacao === "irritou" && comMedo && (
          <Button variante="secondary" tamanho="medium" larguraTotal href="/familia/seguranca">
            {TEXTOS_CONVERSA.verSeguranca}
          </Button>
        )}
        <div className="familia-acoes">
          <Button tamanho="medium" larguraTotal href={hrefModulo}>
            {TEXTOS_CONVERSA.voltar}
          </Button>
          <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
            Voltar ao painel
          </Button>
        </div>
      </section>
    );
  }

  // ===== Ver o que a pessoa contou =====
  if (ver && ultimo) {
    return (
      <section className="familia-pergunta">
        {topo}
        <h1 className="header-large">{TEXTOS_CONVERSA.contouTitulo}</h1>
        <div className="familia-cartao">
          {fraseDoRegistro(ultimo) && (
            <div className="diario-resposta">
              <p className="label-small-medium">{TEXTOS_CONVERSA.fraseRotulo}</p>
              <p className="text-large">{t(fraseDoRegistro(ultimo) ?? "")}</p>
            </div>
          )}
          <div className="diario-resposta">
            <p className="label-small-medium">{TEXTOS_CONVERSA.comoFoiRotulo}</p>
            <p className="text-large">{OPCOES_COMO_FOI.find((opcao) => opcao.valor === ultimo.como_foi)?.rotulo}</p>
          </div>
          {ultimo.reacao && (
            <div className="diario-resposta">
              <p className="label-small-medium">{t(TEXTOS_CONVERSA.reacaoRotulo)}</p>
              <p className="text-large">{OPCOES_REACAO.find((opcao) => opcao.valor === ultimo.reacao)?.rotulo}</p>
            </div>
          )}
        </div>
        <div className="familia-acoes">
          <Button tamanho="medium" larguraTotal onClick={() => setVer(false)}>
            {TEXTOS_CONVERSA.contarDeNovo}
          </Button>
          <Button variante="transparent" tamanho="medium" larguraTotal href={hrefModulo}>
            {TEXTOS_CONVERSA.voltar}
          </Button>
        </div>
      </section>
    );
  }

  // ===== Registro =====
  const opcaoDeFrase = (valor: string, rotulo: string) => (
    <Button key={valor} tamanho="small" redondo variante={frase === valor ? "primary" : "secondary"} onClick={() => setFrase(frase === valor ? null : valor)}>
      {rotulo}
    </Button>
  );

  return (
    <section className="familia-pergunta">
      {topo}
      <h1 className="header-large">{t(TEXTOS_CONVERSA.titulo)}</h1>

      <div className="escala-meta-grupo">
        <p className="label-medium-medium">{TEXTOS_CONVERSA.fraseRotulo}</p>
        <div className="familia-chips escala-chips" role="radiogroup" aria-label={TEXTOS_CONVERSA.fraseRotulo}>
          {frasesSalvas.map((salva) => opcaoDeFrase(salva, t(salva)))}
          {opcaoDeFrase(OUTRA, TEXTOS_CONVERSA.outra)}
          {opcaoDeFrase(NAO_LEMBRO, TEXTOS_CONVERSA.naoLembro)}
        </div>
        {frase === OUTRA && (
          <InputText id="conversa-frase" rotulo={TEXTOS_CONVERSA.outra} value={fraseOutra} maxLength={MAXIMO_FRASE} autoComplete="off" onChange={setFraseOutra} />
        )}
      </div>

      <div className="escala-meta-grupo">
        <p className="label-medium-medium">{TEXTOS_CONVERSA.comoFoiRotulo}</p>
        <div className="familia-chips escala-chips" role="radiogroup" aria-label={TEXTOS_CONVERSA.comoFoiRotulo}>
          {OPCOES_COMO_FOI.map((opcao) => (
            <Button key={opcao.valor} tamanho="small" redondo variante={comoFoi === opcao.valor ? "primary" : "secondary"} onClick={() => setComoFoi(opcao.valor)}>
              {opcao.rotulo}
            </Button>
          ))}
        </div>
      </div>

      <div className="escala-meta-grupo">
        <p className="label-medium-medium">{t(TEXTOS_CONVERSA.reacaoRotulo)}</p>
        <div className="familia-chips escala-chips" role="radiogroup" aria-label={t(TEXTOS_CONVERSA.reacaoRotulo)}>
          {OPCOES_REACAO.map((opcao) => (
            <Button key={opcao.valor} tamanho="small" redondo variante={reacao === opcao.valor ? "primary" : "secondary"} onClick={() => setReacao(reacao === opcao.valor ? null : opcao.valor)}>
              {opcao.rotulo}
            </Button>
          ))}
        </div>
      </div>

      <Button tamanho="medium" larguraTotal disabled={!comoFoi} carregando={salvando} onClick={salvar}>
        {TEXTOS_CONVERSA.salvar}
      </Button>
    </section>
  );
}
