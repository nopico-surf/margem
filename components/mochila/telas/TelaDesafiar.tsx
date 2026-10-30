"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlifoLink, GlifoWhatsapp } from "@/components/icons/glifos";
import { triboPorId } from "@/lib/mochila/conteudo";
import { baixar, copiar, link, sistemaAvisa, textoDesafio } from "@/lib/mochila/acoes";
import { altDoCard, desenharCard, paraBlob } from "@/lib/mochila/card";
import { track } from "@/lib/mixpanel";
import { PreviaCard } from "../PreviaCard";
import { SeletorNivel } from "../SeletorNivel";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaDesafiar() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenario, cenarioId, itens, tribo, eixos, rotulo, codigoDesafio, visiveis, nivel, fontes, setAviso } = usePartida();
  const [previa, setPrevia] = useState<{ url: string; blob: Blob } | null>(null);
  const [erroImagem, setErroImagem] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  // A imagem fica pronta antes do toque: gerar depois do clique faz o Safari recusar o compartilhar.
  // No WhatsApp vai o formato feed, o stories fica estreito demais na conversa.
  useEffect(() => {
    if (!liberada) return;
    let cancelado = false;
    let url: string | null = null;
    desenharCard({ cenario: cenarioId, itens: visiveis, rotulo, eixos, tribo: triboPorId(tribo), formato: "feed", fontes: fontes() })
      .then(paraBlob)
      .then((blob) => {
        if (cancelado) return;
        url = URL.createObjectURL(blob);
        setPrevia({ url, blob });
      })
      .catch((e) => {
        console.error("[mochila] card do desafio não foi gerado", e);
        if (cancelado) return;
        setErroImagem(true);
        track("mochila_card_falhou", { cenario: cenarioId, formato: "feed", nivel, origem: "desafio", detalhe: e instanceof Error ? e.message : String(e) });
      });
    return () => {
      cancelado = true;
      if (url) URL.revokeObjectURL(url);
    };
    // visiveis muda junto com nivel e itens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liberada, nivel, cenarioId, rotulo, eixos, tribo, itens, fontes]);

  if (!liberada) return <TelaCarregando />;
  const doDesafio = { cenario: cenarioId, nivel, itens_no_desafio: visiveis };
  const suaTribo = triboPorId(tribo);

  // Sem a imagem (falhou ao gerar), o desafio segue só com o texto.
  async function desafiar() {
    const texto = textoDesafio({ cenario, rotulo, tribo: suaTribo, qtdItens: visiveis.length, url: link(`/d/${codigoDesafio}`, "desafio", cenarioId) });
    const arquivo = previa ? new File([previa.blob], "mochila-do-role.png", { type: "image/png" }) : null;
    const dados: ShareData = arquivo ? { files: [arquivo], text: texto } : { text: texto };
    if (navigator.canShare?.(dados)) {
      // `concluido` falso é a pessoa fechando a folha de compartilhar sem escolher app.
      let concluido = true;
      try {
        await navigator.share(dados);
      } catch {
        concluido = false;
      }
      track("mochila_desafio_enviado", { ...doDesafio, canal: "share", com_imagem: arquivo !== null, concluido });
      return;
    }
    if (previa) baixar(previa.blob, "mochila-do-role.png");
    const copiou = await copiar(link(`/d/${codigoDesafio}`, "copia", cenarioId));
    track("mochila_desafio_enviado", { ...doDesafio, canal: "download", com_imagem: previa !== null, concluido: copiou });
    if (!sistemaAvisa()) setAviso(previa ? "Imagem baixada e link copiado." : "Link copiado.");
  }

  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-previa">
        <h1 className="mochila-titulo">Quem você quer desafiar?</h1>
        <p className="mochila-instrucao">Seu amigo vê a sua mochila e monta a dele pro mesmo rolê. No fim, vocês comparam.</p>
        <PreviaCard src={previa?.url ?? null} formato="feed" alt={altDoCard(visiveis, rotulo, eixos, suaTribo)} />
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <SeletorNivel
          origem="desafio"
          confirmando={confirmando}
          aoConfirmar={setConfirmando}
          legenda="O que aparece no desafio"
          avisoEscondidos={(n) => (n === 1 ? "1 item da sua mochila não aparece no desafio." : `${n} itens da sua mochila não aparecem no desafio.`)}
        />
        <div className="mochila-acoes">
          <Button variante="primary" tamanho="medium" redondo larguraTotal disabled={confirmando || (!previa && !erroImagem)} onClick={desafiar}>
            <GlifoWhatsapp size={20} />
            <span>Desafiar por WhatsApp</span>
          </Button>
          <Button
            variante="secondary"
            tamanho="medium"
            redondo
            larguraTotal
            disabled={confirmando}
            onClick={async () => {
              const copiou = await copiar(link(`/d/${codigoDesafio}`, "copia", cenarioId));
              track("mochila_desafio_enviado", { ...doDesafio, canal: "copia", copiou });
              if (copiou && !sistemaAvisa()) setAviso("Link copiado.");
            }}
          >
            <GlifoLink size={20} />
            <span>Copiar link do desafio</span>
          </Button>
        </div>
      </div>
    </>
  );
}
