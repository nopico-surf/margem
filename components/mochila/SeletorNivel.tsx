"use client";

import { Button } from "@/components/ui/Button";
import { GlifoVisibilityOff } from "@/components/icons/glifos";
import { NIVEIS, type Nivel } from "@/lib/mochila/conteudo";
import { track } from "@/lib/mixpanel";
import { usePartida } from "./Partida";

// Escolha do que vai na imagem (card do Instagram e desafio do WhatsApp). O estado do nível é um só,
// então mudar numa tela vale na outra. `confirmando` fica com a tela pra ela travar os botões de envio.
export function SeletorNivel({
  origem,
  confirmando,
  aoConfirmar,
  legenda,
  avisoEscondidos,
}: {
  origem: "compartilhar" | "desafio";
  confirmando: boolean;
  aoConfirmar: (confirmando: boolean) => void;
  legenda: string;
  avisoEscondidos: (escondidos: number) => string;
}) {
  const { cenarioId, nivel, setNivel, escondidos } = usePartida();

  function escolherNivel(n: Nivel) {
    if (n === 2) {
      track("mochila_confirmacao_tudo_aberta", { cenario: cenarioId, nivel_anterior: nivel, origem });
      aoConfirmar(true);
      return;
    }
    track("mochila_nivel_escolhido", { cenario: cenarioId, nivel: n, de_confirmacao: confirmando, origem });
    aoConfirmar(false);
    setNivel(n);
  }

  return (
    <>
      <fieldset className="mochila-niveis">
        <legend>{legenda}</legend>
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
            {origem === "desafio"
              ? "Quem receber seu desafio vai ver tudo o que você levou, inclusive os itens mais pessoais. Quer mostrar mesmo assim?"
              : "Quem ver seu post vai ver tudo o que você levou, inclusive os itens mais pessoais. Quer mostrar mesmo assim?"}
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
                track("mochila_nivel_escolhido", { cenario: cenarioId, nivel: 2, de_confirmacao: true, origem });
                aoConfirmar(false);
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
          <span>{avisoEscondidos(escondidos)}</span>
        </p>
      )}
    </>
  );
}
