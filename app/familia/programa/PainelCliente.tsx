"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlifoCheckCircle, GlifoLock } from "@/components/icons/glifos";
import { DiasDaMeta } from "@/components/familia/DiasDaMeta";
import { CardProfissionais } from "@/components/conversa/CardProfissionais";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { dataLocal, diaMes, nomeDaArea, segundaDaSemana, TEXTOS_META, type Escala, type Meta } from "@/lib/familia/escala";
import { alternarDiaDaMeta } from "@/lib/familia/meta-cliente";
import { MOSTRAR_REVISAO_CLINICA } from "@/lib/familia/config";
import { TEXTOS_FRASES, type FraseSalva } from "@/lib/familia/frases";
import { TEXTOS_VALORIZAR, type PlanoValorizar } from "@/lib/familia/valorizar";
import { nomeDoSalvo, PLANOS_B, TEXTOS_CONVITE, type Convite, type ProfissionalDoConvite } from "@/lib/familia/convite";
import { vendaSimulada } from "@/lib/familia/dev";
import { dataDoModulo, moduloChegou, podeDesistir } from "@/lib/familia/oferta";
import { CONTATOS } from "@/lib/contatos";
import { track } from "@/lib/mixpanel";
import type { ProfissionalCadastrado } from "@/lib/supabase";

// Painel do programa (componentes-parte2, "Painel do programa"). Ordem dos blocos, só os que têm
// conteúdo: alertas fixos, "Esta semana" (módulo atual + sua meta), ferramentas, os 8 módulos e
// profissionais. Briefings M3 e M4: "Minhas frases" entra nas ferramentas e "Valorizar o que é bom" em
// "Esta semana". Briefing M5: "Meu convite" (profissional salvo, frase, plano B) também em "Esta semana".
// Ficam de fora até a ferramenta existir: card de check-in, "Anotar" e os cards de devolver, problema e
// dinheiro. Também fora, até haver decisão:
// "Semana X de 8", "Precisa de ajuda agora?" e configurações.
//
// Compra e liberação semanal (briefing 01): sem compra, o módulo com cadeado leva à página de módulo
// bloqueado (com o banner de oferta); com compra, o módulo cuja semana não chegou mostra "Chega em
// DD/MM". Nos 7 dias depois da compra aparece "Desistir e pedir reembolso", que abre o WhatsApp (o
// reembolso é feito à mão no Asaas). No localhost, como antes, todos os módulos abrem pra revisão, a
// menos que a venda simulada esteja ligada (lib/familia/dev.ts).

// liberado: o servidor pode mandar o conteúdo (módulo 1 sempre; 2 a 8 depois da revisão clínica).
export type ModuloDoPainel = { numero: number; titulo: string; liberado: boolean; bloqueadoEmModoSeguranca: boolean };

type Progresso = Record<string, { iniciado_em: string; concluido_em: string | null }>;
type Perfil = { acessoLiberado: boolean; compra: { plano: string; pagoEm: string } | null };
// ultimaEscala: criado_em da escala mais recente (o "Concluído em" da ferramenta), ou null.
type Dados = {
  apelido: string;
  safetyMode: boolean;
  progresso: Progresso;
  meta: Meta | null;
  ultimaEscala: string | null;
  perfil: Perfil;
  travar: boolean;
  // Plano de valorizar (módulo 4) e quantas frases a pessoa reescreveu (módulo 3).
  plano: PlanoValorizar | null;
  frases: number;
  // Convite do módulo 5 (briefing M5).
  convite: Convite | null;
};

const LINK_WHATSAPP = CONTATOS.find((contato) => contato.tipo === "whatsapp")!.href;

async function lerJson<T>(caminho: string, padrao: T): Promise<T> {
  const resposta = await chamarApi(caminho);
  return resposta?.ok ? ((await resposta.json()) as T) : padrao;
}

export function PainelCliente({
  modulos,
  profissionais,
  todosProfissionais,
}: {
  modulos: ModuloDoPainel[];
  profissionais: ProfissionalDoConvite[];
  todosProfissionais: ProfissionalCadastrado[];
}) {
  const router = useRouter();
  const [dados, setDados] = useState<Dados | null>(null);
  const [retornoMeta, setRetornoMeta] = useState(false);

  useEffect(() => {
    (async () => {
      const diagnostico = await chamarApi("/api/familia/diagnostico");
      if (!diagnostico || diagnostico.status === 401) return router.replace("/familia/entrar");
      if (diagnostico.status === 404) return router.replace("/familia/diagnostico");
      if (!diagnostico.ok) return;
      const { resultado, apelido } = (await diagnostico.json()) as { resultado: { safetyMode: boolean }; apelido: string };
      const [progresso, meta, escalas, perfil, valorizar, frases, convite] = await Promise.all([
        lerJson<{ modulos: Progresso }>("/api/familia/progresso", { modulos: {} }),
        lerJson<{ meta: Meta | null }>("/api/familia/meta", { meta: null }),
        lerJson<{ escalas: Escala[] }>("/api/familia/escala", { escalas: [] }),
        lerJson<Perfil>("/api/familia/perfil", { acessoLiberado: false, compra: null }),
        lerJson<{ plano: PlanoValorizar | null }>("/api/familia/valorizar", { plano: null }),
        lerJson<{ frases: FraseSalva[] }>("/api/familia/frases", { frases: [] }),
        lerJson<{ convite: Convite | null }>("/api/familia/convite", { convite: null }),
      ]);
      setDados({
        apelido,
        safetyMode: resultado.safetyMode,
        progresso: progresso.modulos,
        meta: meta.meta,
        ultimaEscala: escalas.escalas[0]?.criado_em ?? null,
        perfil,
        travar: !MOSTRAR_REVISAO_CLINICA || vendaSimulada(),
        plano: valorizar.plano,
        frases: frases.frases.length,
        convite: convite.convite,
      });
    })();
  }, [router]);

  if (!dados) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const { apelido, safetyMode, progresso, meta, ultimaEscala, perfil, travar, plano, frases, convite } = dados;
  const temConvite = Boolean(convite && convite.passo > 0);
  const hoje = dataLocal();
  const modulo1ConcluidoEm = progresso[1]?.concluido_em ?? null;

  // Em modo de segurança, os módulos marcados como bloqueados ficam guardados.
  const guardado = (modulo: ModuloDoPainel) => safetyMode && modulo.bloqueadoEmModoSeguranca;
  const chegou = (modulo: ModuloDoPainel) => modulo.numero === 1 || !travar || (perfil.acessoLiberado && moduloChegou(modulo.numero, modulo1ConcluidoEm));
  const aberto = (modulo: ModuloDoPainel) => modulo.liberado && chegou(modulo) && !guardado(modulo);
  // Sem compra, o cadeado leva à página de módulo bloqueado, com a oferta.
  const levaAOferta = (modulo: ModuloDoPainel) => !aberto(modulo) && !guardado(modulo) && !perfil.acessoLiberado;
  // Com compra, a data em que o módulo chega (só quando o conteúdo já pode sair).
  const chegaEm = (modulo: ModuloDoPainel) => {
    if (!perfil.acessoLiberado || aberto(modulo) || guardado(modulo) || !modulo.liberado) return null;
    const data = dataDoModulo(modulo.numero, modulo1ConcluidoEm);
    return data ? diaMes(data.toISOString()) : null;
  };
  const mostrarReembolso = perfil.compra !== null && podeDesistir(perfil.compra.pagoEm);
  const concluido = (modulo: ModuloDoPainel) => Boolean(progresso[modulo.numero]?.concluido_em);
  const atual = modulos.find((modulo) => aberto(modulo) && !concluido(modulo));
  const algumGuardado = modulos.some(guardado);

  // Toque num dia da meta (briefing 00, item 6): marca ou desmarca. O retorno aparece quando marca.
  async function alternarDia(data: string) {
    const marcou = !meta?.dias_feitos.includes(data);
    const nova = await alternarDiaDaMeta(data, hoje);
    if (!nova) return;
    setDados((anterior) => (anterior ? { ...anterior, meta: nova } : anterior));
    setRetornoMeta(marcou);
  }

  // Toque num dia do plano de valorizar: mesma regra dos dias da meta.
  async function alternarDiaDoPlano(data: string) {
    const resposta = await chamarApi("/api/familia/valorizar", { method: "PATCH", body: JSON.stringify({ data, hoje }) });
    if (!resposta?.ok) return;
    const { plano: novo } = (await resposta.json()) as { plano: PlanoValorizar };
    setDados((anterior) => (anterior ? { ...anterior, plano: novo } : anterior));
  }

  return (
    <>
      <section className="familia-secao">
        <h1 className="header-large">Seu painel</h1>
      </section>

      {safetyMode && (
        <section className="familia-secao">
          <div className="familia-cartao familia-cartao-alerta">
            <h2 className="header-medium">Sua segurança vem primeiro</h2>
            <Button variante="secondary" tamanho="small" href="/familia/seguranca">
              Ver o que fazer em caso de risco
            </Button>
          </div>
        </section>
      )}

      {(atual || meta || plano || temConvite) && (
        <section className="familia-secao">
          <h2 className="header-medium">Esta semana</h2>
          {atual && (
            <div className="familia-cartao">
              <span className="label-small-medium familia-texto-suave">Módulo {atual.numero}</span>
              <h3 className="header-small">{atual.titulo}</h3>
              <Button tamanho="medium" larguraTotal href={`/familia/programa/modulo/${atual.numero}`}>
                Continuar o módulo
              </Button>
            </div>
          )}
          {meta && (
            <div className="familia-cartao">
              <span className="label-small-medium familia-texto-suave">Sua meta · {nomeDaArea(meta.area)}</span>
              <h3 className="header-small">{meta.texto}</h3>
              <DiasDaMeta
                dias={meta.dias}
                diasFeitos={meta.dias_feitos}
                semanaInicio={meta.semana_inicio ?? segundaDaSemana(hoje)}
                hoje={hoje}
                onAlternar={(data) => void alternarDia(data)}
              />
              <p className="text-medium-regular familia-texto-suave">Toque no dia para marcar que você cumpriu a meta.</p>
              {retornoMeta && (
                <p className="text-large" role="status">
                  {TEXTOS_META.feitoRetorno}
                </p>
              )}
              <Button variante="transparent" tamanho="small" href="/familia/programa/escala?etapa=editar">
                Editar minha meta da semana
              </Button>
            </div>
          )}
          {plano && (
            <div className="familia-cartao">
              <h3 className="header-small">{TEXTOS_VALORIZAR.painelTitulo}</h3>
              <ul className="familia-lista text-large">
                {plano.formas.map((forma) => (
                  <li key={forma}>{aplicarApelido(forma, apelido)}</li>
                ))}
              </ul>
              {plano.semana_inicio === segundaDaSemana(hoje) && (
                <DiasDaMeta dias={plano.dias} diasFeitos={plano.feitos} semanaInicio={plano.semana_inicio} hoje={hoje} onAlternar={(data) => void alternarDiaDoPlano(data)} />
              )}
              <Button variante="secondary" tamanho="small" href="/familia/programa/valorizar">
                {TEXTOS_VALORIZAR.verEditar}
              </Button>
            </div>
          )}
          {convite && temConvite && (
            <div className="familia-cartao">
              <h3 className="header-small">{TEXTOS_CONVITE.painelTitulo}</h3>
              {convite.profissionais_salvos.length > 0 && (
                <ul className="familia-lista text-large">
                  {convite.profissionais_salvos.map((id) => {
                    const nome = nomeDoSalvo(id, profissionais);
                    return nome ? <li key={id}>{nome}</li> : null;
                  })}
                </ul>
              )}
              {convite.frase && <p className="text-large">{`"${convite.frase}"`}</p>}
              {convite.plano_b && <p className="text-medium-regular familia-texto-suave">{PLANOS_B.find((plano) => plano.id === convite.plano_b)?.titulo}</p>}
              <Button variante="secondary" tamanho="small" href="/familia/programa/convite/contar?origem=painel">
                {TEXTOS_CONVITE.painelContar}
              </Button>
            </div>
          )}
        </section>
      )}

      <section className="familia-secao">
        <h2 className="header-medium">Ferramentas</h2>
        {frases > 0 && (
          <div className="familia-cartao">
            <h3 className="header-small">{TEXTOS_FRASES.tituloLista}</h3>
            <Button variante="secondary" tamanho="small" href="/familia/programa/frases?modulo=3&ver=1">
              {TEXTOS_FRASES.verMinhas}
            </Button>
          </div>
        )}
        <div className="familia-cartao">
          <h3 className="header-small">Como está a sua vida</h3>
          {ultimaEscala ? (
            <>
              <span className="familia-status label-small-medium" data-estado="feito">
                <GlifoCheckCircle size={20} color="var(--colors-status-success-500)" />
                Concluído em {diaMes(ultimaEscala)}
              </span>
              <div className="familia-exercicio-acoes">
                <Button variante="secondary" tamanho="small" href="/familia/programa/escala?origem=painel&etapa=meta">
                  Ver e editar
                </Button>
                <Button variante="secondary" tamanho="small" href="/familia/programa/escala?origem=painel">
                  Fazer de novo
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="familia-status label-small-medium">Ainda não</span>
              <Button tamanho="small" href="/familia/programa/escala?origem=painel">
                Dar notas para a minha vida
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="familia-secao">
        <h2 className="header-medium">Os 8 módulos</h2>
        <ul className="painel-modulos">
          {modulos.map((modulo) => {
            const feitoEm = progresso[modulo.numero]?.concluido_em;
            const iniciado = Boolean(progresso[modulo.numero]);
            const conteudo = (
              <>
                <span className="label-small-medium familia-texto-suave">Módulo {modulo.numero}</span>
                <span className="header-small painel-modulo-titulo">{modulo.titulo}</span>
                {feitoEm && (
                  <span className="familia-status label-small-medium" data-estado="feito">
                    <GlifoCheckCircle size={20} color="var(--colors-status-success-500)" />
                    Concluído em {diaMes(feitoEm)}
                  </span>
                )}
                {!feitoEm && iniciado && aberto(modulo) && <span className="familia-status label-small-medium">Em andamento</span>}
                {!aberto(modulo) &&
                  (chegaEm(modulo) ? (
                    <span className="familia-status label-small-medium">Chega em {chegaEm(modulo)}</span>
                  ) : (
                    <span className="familia-status label-small-medium" role="img" aria-label="Bloqueado">
                      <GlifoLock size={20} />
                    </span>
                  ))}
              </>
            );
            return (
              <li key={modulo.numero}>
                {aberto(modulo) ? (
                  <Link className="painel-modulo" data-atual={atual?.numero === modulo.numero} href={`/familia/programa/modulo/${modulo.numero}`}>
                    {conteudo}
                  </Link>
                ) : levaAOferta(modulo) ? (
                  <Link className="painel-modulo" data-bloqueado="true" href={`/familia/programa/modulo/${modulo.numero}`}>
                    {conteudo}
                  </Link>
                ) : (
                  <div className="painel-modulo" data-bloqueado="true">
                    {conteudo}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {algumGuardado && (
          <p className="text-medium-regular familia-texto-suave">Algumas partes ficam guardadas até você conversar com um profissional, para tudo acontecer com segurança.</p>
        )}
      </section>

      {/* Briefing M56: o carrossel no lugar do botão, com título que diz que a sessão é pro familiar. */}
      <CardProfissionais
        profissionais={todosProfissionais}
        variante="home"
        id="familia-profissionais"
        origem="programa-painel"
        titulo="Profissionais que podem atender você"
      />

      {mostrarReembolso && (
        <section className="familia-secao">
          <Button variante="transparent" tamanho="medium" larguraTotal href={LINK_WHATSAPP} alvoExterno onClick={() => track("reembolso_pedido", { plano: perfil.compra?.plano ?? null })}>
            Desistir e pedir reembolso
          </Button>
        </section>
      )}
    </>
  );
}
