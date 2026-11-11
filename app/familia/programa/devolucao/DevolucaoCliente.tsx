"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardHeader } from "@/components/conversa/CardHeader";
import { GlifoCheckCircle } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { fimDoPrazo, podeDesistir, PRAZO_DEVOLUCAO } from "@/lib/familia/oferta";
import { track } from "@/lib/mixpanel";

// "Pedir o dinheiro de volta" (briefing 01b, item 4): no mesmo desenho do "Pedir acesso gratuito"
// (CardHeader, campo opcional, botão). Fora do prazo, ou sem compra, volta pro painel. O pedido não
// bloqueia nada. O texto nunca vai pro Mixpanel: só o plano e se a pessoa escreveu algo.

const MAXIMO = 500;

export function DevolucaoCliente() {
  const router = useRouter();
  const [ate, setAte] = useState<string | null>(null);
  const [plano, setPlano] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    (async () => {
      const resposta = await chamarApi("/api/familia/perfil");
      if (!resposta || resposta.status === 401) return router.replace("/familia/entrar");
      const perfil = resposta.ok ? ((await resposta.json()) as { compra: { plano: string; pagoEm: string } | null }) : null;
      if (!perfil?.compra || !podeDesistir(perfil.compra.pagoEm)) return router.replace("/familia/programa");
      setPlano(perfil.compra.plano);
      setAte(fimDoPrazo(perfil.compra.pagoEm));
    })();
  }, [router]);

  async function enviar() {
    setEnviando(true);
    setErro(false);
    const resposta = await chamarApi("/api/familia/devolucao", { method: "POST", body: JSON.stringify({ texto: texto.trim() }) });
    setEnviando(false);
    if (resposta?.status === 403) return router.replace("/familia/programa");
    if (!resposta?.ok) return setErro(true);
    setEnviado(true);
    track("reembolso_pedido", { plano, com_texto: texto.trim().length > 0 });
  }

  if (!ate) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  return (
    <section className="familia-secao">
      <CardHeader
        as="h1"
        title="Pedir o dinheiro de volta"
        description={`Você tem até ${ate}. Não precisa explicar o motivo. Se quiser contar o que não funcionou, ajuda a melhorar o programa, mas é opcional.`}
      />
      {enviado ? (
        <>
          <span className="familia-status label-small-medium" data-estado="feito" role="status">
            <GlifoCheckCircle size={20} color="var(--colors-status-success-500)" />
            {PRAZO_DEVOLUCAO ? `Pedido recebido. O valor volta pelo mesmo Pix em até ${PRAZO_DEVOLUCAO}.` : "Pedido recebido. O valor volta pelo mesmo Pix."}
          </span>
          <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
            Voltar ao painel
          </Button>
        </>
      ) : (
        <>
          <InputText id="familia-devolucao" rotulo="O que não funcionou (opcional)" value={texto} onChange={setTexto} maxLength={MAXIMO} />
          {erro && (
            <p className="text-medium-regular familia-erro" role="alert">
              Não foi possível enviar o pedido agora. Tente novamente.
            </p>
          )}
          <Button tamanho="medium" larguraTotal carregando={enviando} onClick={() => void enviar()}>
            Pedir o dinheiro de volta
          </Button>
        </>
      )}
    </section>
  );
}
