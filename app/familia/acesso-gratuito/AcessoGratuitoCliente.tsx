"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardHeader } from "@/components/conversa/CardHeader";
import { GlifoCheckCircle } from "@/components/icons/glifos";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Loader } from "@/components/ui/Loader";
import { chamarApi } from "@/lib/familia/auth-cliente";
import { guardarDestinoDepoisDoLogin } from "@/lib/familia/fluxo-cliente";
import { PRAZO_GRATUIDADE } from "@/lib/familia/oferta";
import { track } from "@/lib/mixpanel";

// "Pedir acesso gratuito" (briefing 01): tela curta, campo opcional, sem comprovante de renda. O pedido
// vai pra familia_pedidos_gratuidade e o fundador libera à mão. O texto nunca vai pro Mixpanel: só a
// origem (lp, resultado, modulo1, bloqueado, checkout) e se a pessoa escreveu algo.

const MAXIMO = 500;

export function AcessoGratuitoCliente() {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(false);
  const [origem, setOrigem] = useState("direto");

  useEffect(() => {
    setOrigem(new URLSearchParams(window.location.search).get("origem") ?? "direto");
    (async () => {
      const resposta = await chamarApi("/api/familia/perfil");
      if (!resposta || resposta.status === 401) {
        guardarDestinoDepoisDoLogin(`/familia/acesso-gratuito${window.location.search}`);
        return router.replace("/familia/entrar");
      }
      if (resposta.ok && ((await resposta.json()) as { acessoLiberado: boolean }).acessoLiberado) return router.replace("/familia/programa");
      setPronto(true);
    })();
  }, [router]);

  async function enviar() {
    setEnviando(true);
    setErro(false);
    const resposta = await chamarApi("/api/familia/gratuidade", { method: "POST", body: JSON.stringify({ texto: texto.trim() }) });
    setEnviando(false);
    if (!resposta?.ok) return setErro(true);
    setEnviado(true);
    track("acesso_gratuito_pedido", { origem, com_texto: texto.trim().length > 0 });
  }

  if (!pronto) {
    return (
      <div className="familia-secao" aria-busy="true">
        <Loader />
      </div>
    );
  }

  const descricao = [
    "Ninguém precisa ficar de fora por causa de dinheiro. Conte em uma frase, se quiser, o que está acontecendo.",
    PRAZO_GRATUIDADE ? `A gente responde em até ${PRAZO_GRATUIDADE}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="familia-secao">
      <CardHeader as="h1" title="Pedir acesso gratuito" description={descricao} />
      {enviado ? (
        <>
          <span className="familia-status label-small-medium" data-estado="feito" role="status">
            <GlifoCheckCircle size={20} color="var(--colors-status-success-500)" />
            Pedido enviado
          </span>
          <Button variante="transparent" tamanho="medium" larguraTotal href="/familia/programa">
            Voltar ao painel
          </Button>
        </>
      ) : (
        <>
          <InputText id="familia-gratuidade" rotulo="O que está acontecendo (opcional)" value={texto} onChange={setTexto} maxLength={MAXIMO} />
          {erro && (
            <p className="text-medium-regular familia-erro" role="alert">
              Não foi possível enviar o pedido agora. Tente novamente.
            </p>
          )}
          <Button tamanho="medium" larguraTotal carregando={enviando} onClick={() => void enviar()}>
            Pedir acesso gratuito
          </Button>
        </>
      )}
    </section>
  );
}
