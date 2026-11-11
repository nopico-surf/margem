"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { BotaoAgendar } from "@/components/ui/BotaoAgendar";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { alvoDoAgendar, OPCOES_DO_PAINEL, RESPOSTAS_DO_CONVITE, TEXTOS_CONVITE, type Convite, type ProfissionalDoConvite, type ResultadoConvite } from "@/lib/familia/convite";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { track } from "@/lib/mixpanel";

// "Contar como foi o convite" (briefing M5). No módulo: Aceitou · Disse que vai pensar · Disse não. No
// painel (?origem=painel): Sim · Vou pensar · Não · Ainda não convidei. Tocar numa resposta já grava (o
// briefing não traz botão de salvar) e mostra o retorno e a frase do passo 5; "Aceitou" mostra
// "Agendar com {{profissional_salvo}}". "Ainda não convidei" limpa o resultado e volta ao painel.
// Com ?ver=1 ("Ver o que você contou") a resposta salva já aparece marcada.
//
// [PENDÊNCIA DO FUNDADOR] Texto de erro ao salvar: não está na especificação. Por ora a resposta só não
// fica marcada.

type Lido = { apelido: string };

export function ContarConviteCliente({ profissionais }: { profissionais: ProfissionalDoConvite[] }) {
  const router = useRouter();
  const parametros = useSearchParams();
  const doPainel = parametros.get("origem") === "painel";
  const [dados, setDados] = useState<Lido | null>(null);
  const [salvos, setSalvos] = useState<string[]>([]);
  const [escolhida, setEscolhida] = useState<ResultadoConvite | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/diagnostico");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      if (resposta.status === 404) return router.replace("/familia/diagnostico");
      if (!resposta.ok) return;
      const lido = (await resposta.json()) as Lido;
      const guardado = await chamarApi("/api/familia/convite").then(async (r) => (r?.ok ? ((await r.json()) as { convite: Convite | null }).convite : null));
      setSalvos(guardado?.profissionais_salvos ?? []);
      if (parametros.get("ver") === "1") setEscolhida(guardado?.resultado ?? null);
      setDados(lido);
    })();
  }, [router, parametros]);

  if (!dados) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const t = (texto: string) => aplicarApelido(texto, dados.apelido);
  const destino = doPainel ? "/familia/programa" : "/familia/programa/modulo/5";
  const agendar = alvoDoAgendar(salvos, profissionais);
  const opcoes = doPainel ? OPCOES_DO_PAINEL : RESPOSTAS_DO_CONVITE.map((resposta) => ({ id: resposta.id, rotulo: resposta.opcao }));
  const retorno = RESPOSTAS_DO_CONVITE.find((resposta) => resposta.id === escolhida);

  async function contar(id: ResultadoConvite | "ainda_nao") {
    setSalvando(true);
    const resultado = id === "ainda_nao" ? null : id;
    const resposta = await chamarApi("/api/familia/convite", { method: "POST", body: JSON.stringify({ tipo: "resultado", resultado }) });
    setSalvando(false);
    if (!resposta?.ok) return;
    track("convite_contado", { resultado: id, origem: doPainel ? "painel" : "modulo" });
    if (!resultado) return router.push(destino);
    setEscolhida(resultado);
  }

  return (
    <section className="familia-pergunta">
      <div className="familia-pergunta-topo">
        <button className="familia-voltar" type="button" aria-label="Voltar" onClick={() => router.push(destino)}>
          <GlifoArrowBack size={24} />
        </button>
      </div>
      <header className="familia-titulo">
        <h1 className="header-large">{TEXTOS_CONVITE.contarTitulo}</h1>
        <p className="text-large">{t(TEXTOS_CONVITE.contarInstrucao)}</p>
      </header>
      <div className="familia-chips escala-chips" role="radiogroup" aria-label={TEXTOS_CONVITE.contarTitulo}>
        {opcoes.map((opcao) => (
          <Button key={opcao.id} tamanho="small" redondo disabled={salvando} variante={escolhida === opcao.id ? "primary" : "secondary"} onClick={() => void contar(opcao.id)}>
            {opcao.rotulo}
          </Button>
        ))}
      </div>
      {retorno && (
        <div className="familia-cartao" role="status">
          <p className="text-large">{t(retorno.texto)}</p>
          {retorno.frase && <p className="text-large">{`"${retorno.frase}"`}</p>}
          {retorno.id === "sim" && agendar && (
            <BotaoAgendar
              tamanho="small"
              label={TEXTOS_CONVITE.agendarCom.replace("{{profissional}}", agendar.nome)}
              href={agendar.href}
              onClick={() => {
                track("agendar_whatsapp_clicado", { rota: "/familia/programa/convite/contar", tipo_recurso: agendar.profissional ? "profissional" : "servico", profissional_id: agendar.profissional ? agendar.id : null, origem: "convite" });
                if (!agendar.profissional) return;
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ event: "agendar_whatsapp" });
              }}
            />
          )}
        </div>
      )}
      {retorno && (
        <Button variante="secondary" tamanho="medium" larguraTotal href={destino}>
          {doPainel ? "Voltar ao painel" : "Voltar ao módulo"}
        </Button>
      )}
    </section>
  );
}
