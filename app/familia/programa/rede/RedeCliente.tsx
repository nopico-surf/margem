"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionRow } from "@/components/conversa/ActionRow";
import { CardHeader } from "@/components/conversa/CardHeader";
import { IconeDeAcao } from "@/components/icons";
import { GlifoArrowBack, GlifoCheckCircle } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { diaMes } from "@/lib/familia/escala";
import { GRUPOS_DA_REDE, gruposEmOrdem, MAXIMO_NOME, MAXIMO_NOMES, MENSAGENS_DA_REDE, TEXTOS_REDE, type GrupoId, type Rede } from "@/lib/familia/rede";
import { track } from "@/lib/mixpanel";

// "A sua rede de apoio" (briefing M7, C10). Uma página com as duas partes do briefing, uma embaixo da
// outra: alguém de confiança (nomes, 4 mensagens prontas e "Contar que mandei") e um grupo para
// familiares (os do problema marcado primeiro, com "Ver reuniões" no site oficial e "Contar que fui").
// Contar uma mensagem ou um grupo conclui o item "apoio" do módulo 7 (a rota marca).
//
// ?ver=1: abre o que a pessoa já contou ("Ver meu apoio", "Ver minhas mensagens").
// ?origem=painel: o voltar leva ao painel em vez do módulo 7.
// "Copiar mensagem" só copia: a Margem não envia nada. Os nomes nunca vão pro Mixpanel.
//
// [PENDÊNCIA DO FUNDADOR] Texto ao copiar e texto de erro ao salvar: não estão na especificação. Por ora
// "Copiar mensagem" não muda de rótulo e o botão de contar só volta a ficar disponível.

type Lido = { problemas: string[] };

function Concluido({ quando }: { quando: string }) {
  return (
    <span className="familia-status label-small-medium" data-estado="feito" role="status">
      <GlifoCheckCircle size={20} color="var(--colors-status-success-500)" />
      Concluído em {diaMes(quando)}
    </span>
  );
}

export function RedeCliente() {
  const router = useRouter();
  const [dados, setDados] = useState<Lido | null>(null);
  const [rede, setRede] = useState<Rede | null>(null);
  const [nomes, setNomes] = useState<string[]>(["", ""]);
  const [copiada, setCopiada] = useState<number | null>(null);
  // "Mandar outra": mostra de novo o "Contar que mandei" depois de já ter contado uma.
  const [mandarOutra, setMandarOutra] = useState(false);
  const [ver, setVer] = useState(false);
  const [voltarPara, setVoltarPara] = useState("/familia/programa/modulo/7");
  const [salvando, setSalvando] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const lido = (await resposta.json()) as Lido;
      const guardada = await chamarApi("/api/familia/rede").then(async (r) => (r?.ok ? ((await r.json()) as { rede: Rede | null }).rede : null));
      const busca = new URLSearchParams(window.location.search);
      if (busca.get("origem") === "painel") setVoltarPara("/familia/programa");
      if (guardada) {
        setRede(guardada);
        setNomes([guardada.nomes[0] ?? "", guardada.nomes[1] ?? ""]);
      }
      setVer(busca.get("ver") === "1" && Boolean(guardada && (guardada.mensagens.length || guardada.grupos.length)));
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

  const topo = (
    <div className="familia-pergunta-topo">
      <button className="familia-voltar" type="button" aria-label={TEXTOS_REDE.voltar} onClick={() => router.push(voltarPara)}>
        <GlifoArrowBack size={24} />
      </button>
    </div>
  );

  const rodape = (
    <Button variante="transparent" tamanho="medium" larguraTotal href={voltarPara}>
      {TEXTOS_REDE.voltar}
    </Button>
  );

  async function contar(passo: { tipo: "mensagem"; mensagem: number | null } | { tipo: "grupo"; grupo: GrupoId }) {
    setSalvando(passo.tipo === "grupo" ? passo.grupo : "mensagem");
    const resposta = await chamarApi("/api/familia/rede", { method: "POST", body: JSON.stringify({ ...passo, nomes: nomes.slice(0, MAXIMO_NOMES) }) });
    setSalvando(null);
    if (!resposta?.ok) return;
    setRede(((await resposta.json()) as { rede: Rede }).rede);
    // Só o tipo do passo (e qual grupo), nunca os nomes.
    track("rede_passo_contado", passo.tipo === "grupo" ? { tipo: "grupo", grupo: passo.grupo } : { tipo: "mensagem" });
    if (passo.tipo === "mensagem") {
      setMandarOutra(false);
      setCopiada(null);
    }
  }

  function copiar(indice: number) {
    void navigator.clipboard?.writeText(MENSAGENS_DA_REDE[indice]).catch(() => {});
    setCopiada(indice);
    track("rede_mensagem_copiada", { mensagem: indice });
  }

  const ultimaMensagem = rede?.mensagens.at(-1);
  const quandoFoi = (grupo: GrupoId) => rede?.grupos.find((registro) => registro.grupo === grupo)?.quando;

  // ===== Ver meu apoio =====
  if (ver && rede) {
    const nomesSalvos = rede.nomes.filter(Boolean);
    return (
      <section className="familia-pergunta">
        {topo}
        <h1 className="header-large">{TEXTOS_REDE.titulo}</h1>
        {nomesSalvos.length > 0 && (
          <div className="familia-titulo">
            <h2 className="header-medium">{TEXTOS_REDE.quemTitulo}</h2>
            <p className="text-large">{nomesSalvos.join(", ")}</p>
          </div>
        )}
        {rede.mensagens.length > 0 && (
          <>
            <h2 className="header-medium">{TEXTOS_REDE.mensagensTitulo}</h2>
            {[...rede.mensagens].reverse().map((registro) => (
              <div key={registro.quando} className="familia-cartao">
                {registro.mensagem !== null && <p className="text-large">{MENSAGENS_DA_REDE[registro.mensagem]}</p>}
                <Concluido quando={registro.quando} />
              </div>
            ))}
          </>
        )}
        {rede.grupos.length > 0 && (
          <>
            <CardHeader title={TEXTOS_REDE.gruposTitulo} />
            <div className="figma-resource-list">
              {[...rede.grupos].reverse().map((registro) => (
                <article key={registro.quando} className="figma-resource-card">
                  <div className="figma-resource-heading">
                    <div>
                      <h3>{GRUPOS_DA_REDE.find((grupo) => grupo.id === registro.grupo)?.nome}</h3>
                    </div>
                  </div>
                  <Concluido quando={registro.quando} />
                </article>
              ))}
            </div>
          </>
        )}
        <div className="familia-acoes">
          <Button
            tamanho="medium"
            larguraTotal
            onClick={() => {
              setVer(false);
              window.scrollTo({ top: 0 });
            }}
          >
            {TEXTOS_REDE.outroPasso}
          </Button>
          {rodape}
        </div>
      </section>
    );
  }

  // ===== A ferramenta =====
  return (
    <section className="familia-pergunta">
      {topo}
      <h1 className="header-large">{TEXTOS_REDE.titulo}</h1>

      <div className="familia-titulo">
        <h2 className="header-medium">{TEXTOS_REDE.quemTitulo}</h2>
        <p className="text-large">{TEXTOS_REDE.intro}</p>
      </div>
      {nomes.map((nome, indice) => (
        <InputText
          key={indice}
          id={`rede-nome-${indice}`}
          rotulo={TEXTOS_REDE.nomeRotulo(indice + 1)}
          descricao={indice === 0 ? TEXTOS_REDE.nomeDica : undefined}
          value={nome}
          maxLength={MAXIMO_NOME}
          autoComplete="off"
          onChange={(valor) => setNomes((atuais) => atuais.map((atual, posicao) => (posicao === indice ? valor : atual)))}
        />
      ))}

      <h3 className="header-small">{TEXTOS_REDE.mensagensTitulo}</h3>
      {MENSAGENS_DA_REDE.map((mensagem, indice) => (
        <div key={indice} className="familia-cartao">
          <p className="text-large">{mensagem}</p>
          <div className="familia-exercicio-acoes">
            <Button variante={copiada === indice ? "primary" : "secondary"} tamanho="small" onClick={() => copiar(indice)}>
              {TEXTOS_REDE.copiar}
            </Button>
          </div>
        </div>
      ))}
      {ultimaMensagem && !mandarOutra ? (
        <div className="familia-cartao">
          <Concluido quando={ultimaMensagem.quando} />
          <div className="familia-exercicio-acoes">
            <Button
              variante="secondary"
              tamanho="small"
              onClick={() => {
                setVer(true);
                window.scrollTo({ top: 0 });
              }}
            >
              {TEXTOS_REDE.verMensagens}
            </Button>
            <Button variante="secondary" tamanho="small" onClick={() => setMandarOutra(true)}>
              {TEXTOS_REDE.mandarOutra}
            </Button>
          </div>
        </div>
      ) : (
        <Button tamanho="medium" larguraTotal carregando={salvando === "mensagem"} onClick={() => void contar({ tipo: "mensagem", mensagem: copiada })}>
          {TEXTOS_REDE.contarMandei}
        </Button>
      )}

      {/* Mesmo card dos serviços e espaços de apoio da /conversa (Figma: cards-instituicoes-completo),
          como na Segurança. Button direto em vez do ActionButton: "Contar que fui" precisa do carregando
          e "Ver serviços perto de mim" é link interno (o ActionButton abre todo link em nova aba). */}
      <CardHeader title={TEXTOS_REDE.gruposTitulo} description={TEXTOS_REDE.gruposIntro} />
      <div className="figma-resource-list">
        {gruposEmOrdem(dados.problemas).map((grupo) => {
          const foi = quandoFoi(grupo.id);
          return (
            <article key={grupo.id} className="figma-resource-card">
              <div className="figma-resource-heading">
                <div>
                  <h3>{grupo.nome}</h3>
                  <p>{grupo.texto}</p>
                </div>
              </div>
              {foi && <Concluido quando={foi} />}
              <ActionRow origem="rede_grupos">
                <Button variante="secondary" redondo href={grupo.href} alvoExterno={!grupo.servicos} onClick={() => track("rede_grupo_aberto", { grupo: grupo.id })}>
                  <IconeDeAcao nome={grupo.servicos ? "place" : "link"} />
                  {grupo.servicos ? TEXTOS_REDE.verServicos : TEXTOS_REDE.verReunioes}
                </Button>
                {!foi && (
                  <Button variante="secondary" redondo carregando={salvando === grupo.id} onClick={() => void contar({ tipo: "grupo", grupo: grupo.id })}>
                    {TEXTOS_REDE.contarFui}
                  </Button>
                )}
              </ActionRow>
            </article>
          );
        })}
      </div>

      <div className="familia-acoes">{rodape}</div>
    </section>
  );
}
