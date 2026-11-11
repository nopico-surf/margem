"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlifoArrowBack } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { aplicarApelido } from "@/lib/familia/diagnostico";
import { campoOutro, CAMPOS_DO_TIPO, OUTRO, PERGUNTAS_BOM, PERGUNTAS_DIFICIL, TEXTOS_DIARIO, type Anotacao } from "@/lib/familia/diario";

// Todas as anotações do diário, da mais recente pra mais antiga. Cada uma tem "Editar" (abre o diário
// preenchido) e "Apagar" (em dois toques, pra não apagar sem querer).

const PERGUNTAS = [...PERGUNTAS_DIFICIL, ...PERGUNTAS_BOM];

function dataHora(valor: string) {
  const data = new Date(valor);
  const dois = (n: number) => String(n).padStart(2, "0");
  return `${dois(data.getDate())}/${dois(data.getMonth() + 1)}, ${dois(data.getHours())}:${dois(data.getMinutes())}`;
}

export function AnotacoesCliente() {
  const router = useRouter();
  const [apelido, setApelido] = useState<string | null>(null);
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  // Anotação em confirmação de "Apagar".
  const [apagando, setApagando] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const diagnostico = await chamarApi("/api/familia/diagnostico");
      if (!diagnostico || diagnostico.status === 401) return router.replace("/familia/entrar");
      if (diagnostico.status === 404) return router.replace("/familia/diagnostico");
      if (!diagnostico.ok) return;
      const lista = await chamarApi("/api/familia/diario").then(async (r) => (r?.ok ? ((await r.json()) as { anotacoes: Anotacao[] }).anotacoes : []));
      setAnotacoes(lista);
      setApelido(((await diagnostico.json()) as { apelido: string }).apelido);
    })();
  }, [router]);

  if (apelido === null) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const t = (texto: string) => aplicarApelido(texto, apelido);

  async function apagar(id: string) {
    const resposta = await chamarApi(`/api/familia/diario?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!resposta?.ok) return;
    setAnotacoes((atuais) => atuais.filter((anotacao) => anotacao.id !== id));
    setApagando(null);
  }

  return (
    <section className="familia-pergunta">
      <div className="familia-pergunta-topo">
        <button className="familia-voltar" type="button" aria-label="Voltar ao painel" onClick={() => router.push("/familia/programa")}>
          <GlifoArrowBack size={24} />
        </button>
      </div>
      <h1 className="header-large">Minhas anotações</h1>

      {anotacoes.length === 0 && (
        <Button tamanho="medium" larguraTotal href="/familia/programa/diario?tipo=dificil">
          Anotar um momento difícil
        </Button>
      )}

      {anotacoes.map((anotacao) => (
        <div key={anotacao.id} className="familia-cartao" data-tipo={anotacao.tipo}>
          <span className="label-small-medium familia-texto-suave">
            {anotacao.tipo === "bom" ? TEXTOS_DIARIO.tipoBom : TEXTOS_DIARIO.tipoDificil} · {dataHora(anotacao.quando)}
          </span>
          {CAMPOS_DO_TIPO[anotacao.tipo].map((campo) => {
            const valores = anotacao[campo];
            if (valores.length === 0) return null;
            const pergunta = PERGUNTAS.find((item) => item.campo === campo);
            return (
              <div key={campo} className="diario-resposta">
                <p className="label-small-medium">{t(pergunta?.pergunta ?? "")}</p>
                <p className="text-large">{valores.map((valor) => (valor === OUTRO && anotacao[campoOutro(campo)] ? anotacao[campoOutro(campo)] : t(valor))).join(", ")}</p>
              </div>
            );
          })}
          {anotacao.texto_livre && (
            <div className="diario-resposta">
              <p className="label-small-medium">{TEXTOS_DIARIO.livrePergunta}</p>
              <p className="text-large">{anotacao.texto_livre}</p>
            </div>
          )}
          <div className="familia-exercicio-acoes">
            {apagando === anotacao.id ? (
              <>
                <Button variante="primary" tamanho="small" onClick={() => void apagar(anotacao.id)}>
                  Apagar esta anotação
                </Button>
                <Button variante="transparent" tamanho="small" onClick={() => setApagando(null)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button variante="secondary" tamanho="small" href={`/familia/programa/diario?editar=${encodeURIComponent(anotacao.id)}`}>
                  Editar
                </Button>
                <Button variante="transparent" tamanho="small" onClick={() => setApagando(anotacao.id)}>
                  Apagar
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
