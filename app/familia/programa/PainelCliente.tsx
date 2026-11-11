"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlifoCheckCircle, GlifoLock } from "@/components/icons/glifos";
import { DiasDaMeta } from "@/components/familia/DiasDaMeta";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { dataLocal, diaMes, nomeDaArea, segundaDaSemana, TEXTOS_META, type Escala, type Meta } from "@/lib/familia/escala";
import { alternarDiaDaMeta } from "@/lib/familia/meta-cliente";
import { MOSTRAR_REVISAO_CLINICA } from "@/lib/familia/config";
import { vendaSimulada } from "@/lib/familia/dev";
import { dataDoModulo, moduloChegou, podeDesistir } from "@/lib/familia/oferta";
import { CONTATOS } from "@/lib/contatos";
import { track } from "@/lib/mixpanel";

// Painel do programa (componentes-parte2, "Painel do programa"). Ordem dos blocos, só os que têm
// conteúdo: alertas fixos, "Esta semana" (módulo atual + sua meta), ferramentas, os 8 módulos e
// profissionais. Ficam de fora até a ferramenta existir: card de check-in, "Anotar", "Minhas frases"
// e os cards de valorizar, devolver, convite, problema e dinheiro. Também fora, até haver decisão:
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
type Dados = { safetyMode: boolean; progresso: Progresso; meta: Meta | null; ultimaEscala: string | null; perfil: Perfil; travar: boolean };

const LINK_WHATSAPP = CONTATOS.find((contato) => contato.tipo === "whatsapp")!.href;

async function lerJson<T>(caminho: string, padrao: T): Promise<T> {
  const resposta = await chamarApi(caminho);
  return resposta?.ok ? ((await resposta.json()) as T) : padrao;
}

export function PainelCliente({ modulos }: { modulos: ModuloDoPainel[] }) {
  const router = useRouter();
  const [dados, setDados] = useState<Dados | null>(null);
  const [retornoMeta, setRetornoMeta] = useState(false);

  useEffect(() => {
    (async () => {
      const diagnostico = await chamarApi("/api/familia/diagnostico");
      if (!diagnostico || diagnostico.status === 401) return router.replace("/familia/entrar");
      if (diagnostico.status === 404) return router.replace("/familia/diagnostico");
      if (!diagnostico.ok) return;
      const { resultado } = (await diagnostico.json()) as { resultado: { safetyMode: boolean } };
      const [progresso, meta, escalas, perfil] = await Promise.all([
        lerJson<{ modulos: Progresso }>("/api/familia/progresso", { modulos: {} }),
        lerJson<{ meta: Meta | null }>("/api/familia/meta", { meta: null }),
        lerJson<{ escalas: Escala[] }>("/api/familia/escala", { escalas: [] }),
        lerJson<Perfil>("/api/familia/perfil", { acessoLiberado: false, compra: null }),
      ]);
      setDados({
        safetyMode: resultado.safetyMode,
        progresso: progresso.modulos,
        meta: meta.meta,
        ultimaEscala: escalas.escalas[0]?.criado_em ?? null,
        perfil,
        travar: !MOSTRAR_REVISAO_CLINICA || vendaSimulada(),
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

  const { safetyMode, progresso, meta, ultimaEscala, perfil, travar } = dados;
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

      {(atual || meta) && (
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
        </section>
      )}

      <section className="familia-secao">
        <h2 className="header-medium">Ferramentas</h2>
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

      <section className="familia-secao">
        <h2 className="header-medium">Profissionais</h2>
        <Button variante="secondary" tamanho="medium" larguraTotal href="/profissionais">
          Ver psicólogo parceiro
        </Button>
      </section>

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
