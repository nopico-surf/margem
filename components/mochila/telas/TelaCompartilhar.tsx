"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlifoVisibilityOff } from "@/components/icons/glifos";
import { ITENS, NIVEIS, type Nivel } from "@/lib/mochila/conteudo";
import { baixar, copiar, link } from "@/lib/mochila/acoes";
import { desenharCard, paraBlob, type Formato } from "@/lib/mochila/card";
import { PreviaCard } from "../PreviaCard";
import { useLiberada, usePartida } from "../Partida";
import { TelaCarregando } from "../TelaCarregando";

export function TelaCompartilhar() {
  const liberada = useLiberada((p) => p.itens.length > 0);
  const { cenarioId, itens, rotulo, visiveis, escondidos, nivel, setNivel, fontes, setAviso } = usePartida();
  const [confirmando, setConfirmando] = useState(false);
  const [formato, setFormato] = useState<Formato>("stories");
  const [previa, setPrevia] = useState<{ url: string; blob: Blob } | null>(null);
  const [erroImagem, setErroImagem] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  // A prévia é a própria imagem que vai ser compartilhada, refeita a cada troca de nível ou formato.
  useEffect(() => {
    if (!liberada) return;
    let cancelado = false;
    let url: string | null = null;
    setErroImagem(false);
    desenharCard({ cenario: cenarioId, itens: visiveis, rotulo, formato, fontes: fontes() })
      .then(paraBlob)
      .then((blob) => {
        if (cancelado) return;
        url = URL.createObjectURL(blob);
        setPrevia({ url, blob });
      })
      .catch((e) => {
        console.error("[mochila] card não foi gerado", e);
        if (!cancelado) setErroImagem(true);
      });
    return () => {
      cancelado = true;
      if (url) URL.revokeObjectURL(url);
    };
    // visiveis muda junto com nivel e itens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liberada, nivel, formato, cenarioId, rotulo, itens, fontes, tentativa]);

  if (!liberada) return <TelaCarregando />;

  function escolherNivel(n: Nivel) {
    if (n === 2) {
      setConfirmando(true);
      return;
    }
    setConfirmando(false);
    setNivel(n);
  }

  async function compartilharCard() {
    if (!previa) return;
    const url = link("", "stories", cenarioId);
    const texto = `Montei minha mochila pro rolê e saiu "${rotulo.nome}". Monta a sua: ${url}`;
    const arquivo = new File([previa.blob], "mochila-do-role.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [arquivo] })) {
      try {
        await navigator.share({ files: [arquivo], text: texto });
      } catch {}
      return;
    }
    baixar(previa.blob, "mochila-do-role.png");
    await copiar(link("", "copia", cenarioId));
    setAviso("Imagem baixada e link copiado.");
  }

  const alt = `Mochila em pixel art com ${visiveis.map((id) => ITENS[id].curto.toLowerCase()).join(", ")}. Escrito: ${rotulo.nome}. ${rotulo.frase}`;
  return (
    <>
      <header className="mochila-cabeca mochila-cabeca-previa">
        <h1 className="mochila-titulo mochila-titulo-menor">É assim que seu card vai aparecer</h1>
        <PreviaCard src={previa?.url ?? null} formato={formato} alt={alt} />
      </header>
      <div className="mochila-painel mochila-painel-montagem">
        <div role="group" aria-label="Formato" className="mochila-formato">
          {(["stories", "feed"] as const).map((f) => (
            <button key={f} type="button" aria-pressed={formato === f} onClick={() => setFormato(f)}>
              {f === "stories" ? "Stories" : "Feed"}
            </button>
          ))}
        </div>

        <fieldset className="mochila-niveis">
          <legend>O que aparece no card</legend>
          {NIVEIS.map((n) => {
            const marcado = confirmando ? n.nivel === 2 : nivel === n.nivel;
            return (
              <label key={n.nivel} className="mochila-nivel" data-marcado={marcado}>
                <input type="radio" name="nivel" checked={marcado} onChange={() => escolherNivel(n.nivel)} />
                <span className="mochila-nivel-texto">
                  <span>{n.nome}</span>
                  <span className="mochila-nivel-apoio">{n.apoio}</span>
                </span>
              </label>
            );
          })}
        </fieldset>

        {confirmando && (
          <div role="alertdialog" aria-labelledby="mochila-conf" className="mochila-caixa mochila-caixa-forte mochila-confirmacao">
            <p id="mochila-conf" className="mochila-confirmacao-texto">
              Quem vir seu post vai ver tudo o que você levou, inclusive os itens mais pessoais. Quer mostrar mesmo assim?
            </p>
            <div className="mochila-acoes">
              <Button variante="primary" tamanho="medium" redondo larguraTotal onClick={() => escolherNivel(0)}>
                Voltar pro básico
              </Button>
              <Button
                variante="secondary"
                tamanho="medium"
                redondo
                larguraTotal
                onClick={() => {
                  setConfirmando(false);
                  setNivel(2);
                }}
              >
                Mostrar tudo
              </Button>
            </div>
          </div>
        )}

        {!confirmando && escondidos > 0 && (
          <p className="mochila-escondidos">
            <GlifoVisibilityOff size={18} />
            <span>{escondidos === 1 ? "1 item da sua mochila não aparece no card." : `${escondidos} itens da sua mochila não aparecem no card.`}</span>
          </p>
        )}

        {erroImagem ? (
          <div className="mochila-caixa mochila-caixa-forte mochila-erro-imagem">
            <p role="status" className="mochila-abre">Não deu pra gerar a imagem agora.</p>
            <div className="mochila-acoes-lado">
              <Button variante="primary" tamanho="medium" redondo larguraTotal onClick={() => setTentativa((t) => t + 1)}>
                Tentar de novo
              </Button>
              <Button variante="secondary" tamanho="medium" redondo larguraTotal onClick={() => copiar(link("", "copia", cenarioId))}>
                Copiar link
              </Button>
            </div>
          </div>
        ) : (
          <div className="mochila-acoes mochila-acoes-compartilhar">
            <Button variante="primary" tamanho="medium" redondo larguraTotal disabled={confirmando || !previa} onClick={compartilharCard}>
              Compartilhar card
            </Button>
            <Button
              variante="secondary"
              tamanho="medium"
              redondo
              larguraTotal
              disabled={confirmando || !previa}
              onClick={() => {
                if (!previa) return;
                baixar(previa.blob, "mochila-do-role.png");
                setAviso("Imagem baixada.");
              }}
            >
              Baixar imagem
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
