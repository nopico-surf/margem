"use client";

import type { ReactNode } from "react";
import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { Button } from "@/components/ui/Button";
import { ContadorPix } from "./ContadorPix";
import type { Pix } from "@/lib/apoio/pix-cliente";

// Figma: Experiência do produto, Pix (1537:36169) e código vencido (1542:40036). A tela do QR do /plano,
// usada também no checkout do programa para familiares, que troca só os textos (briefing 01, etapa 3).
//
// `vencido` troca os cartões do código e do QR pelo cartão de código vencido (o /plano também usa esse
// cartão quando o banco recusa o Pix Automático, sem o contador). `children` entra entre o QR e o
// "Nome no banco" (no /plano, o lembrete de autorizar o Pix Automático).
type TelaPixProps = {
  id: string;
  pix: Pix;
  titulo: string;
  descricao?: string;
  segundosRestantes: number;
  mostrarContador?: boolean;
  vencido?: { titulo: string; texto?: string; botao: string } | null;
  codigoCopiado: boolean;
  onCopiar: () => void;
  onGerarOutro: () => void;
  gerando?: boolean;
  children?: ReactNode;
};

export function TelaPix({
  id,
  pix,
  titulo,
  descricao,
  segundosRestantes,
  mostrarContador = true,
  vencido = null,
  codigoCopiado,
  onCopiar,
  onGerarOutro,
  gerando = false,
  children,
}: TelaPixProps) {
  return (
    <ContainerConteudo id={id}>
      {mostrarContador && <ContadorPix segundos={vencido ? 0 : segundosRestantes} />}
      <CardHeader as="h1" title={titulo} description={descricao} />

      {vencido ? (
        <section className="cartao-pix">
          <h2>{vencido.titulo}</h2>
          {vencido.texto && <p className="cartao-pix-texto">{vencido.texto}</p>}
          <Button tamanho="small" larguraTotal onClick={onGerarOutro} carregando={gerando}>
            {vencido.botao}
          </Button>
        </section>
      ) : (
        <>
          <section className="cartao-pix cartao-pix-copiar">
            <h2>Copie este código para pagar</h2>
            <div className="cartao-pix-codigo">
              <p>{pix.payload}</p>
              <Button tamanho="small" larguraTotal onClick={onCopiar}>
                {codigoCopiado ? "Código copiado" : "Copiar código pix"}
              </Button>
            </div>
            <p className="cartao-pix-texto">
              Escolha pagar via Pix pelo seu aplicativo bancário ou de pagamentos. Depois, cole o código copiado
            </p>
          </section>

          <section className="cartao-pix cartao-pix-qr">
            <div className="cartao-pix-qr-texto">
              <h2>Escaneie o QR code para pagar</h2>
              <ol>
                <li>Acesse seu app de pagamentos.</li>
                <li>Escolha pagar via Pix.</li>
                <li>Escaneie o seguinte código:</li>
              </ol>
            </div>
            <div className="cartao-pix-qr-imagem">
              {/* eslint-disable-next-line @next/next/no-img-element -- imagem em base64 que vem do Asaas */}
              <img src={`data:image/png;base64,${pix.imagemBase64}`} alt="QR code do Pix" />
            </div>
          </section>

          {children}

          <section className="cartao-pix">
            <CardHeader
              title="Nome no banco"
              description="No app do banco, o Pix aparece no nome de VITOR GAUDIO DESENVOLVIMENTO DE SOFTWARE LTDA, a empresa responsável pela Margem."
            />
          </section>
        </>
      )}
    </ContainerConteudo>
  );
}
