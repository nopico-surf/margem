"use client";

import { Button } from "@/components/ui/Button";
import { IconeFavorito } from "@/components/icons";
import { LINK_WHATSAPP_SUGESTAO_REDE } from "@/lib/contatos";
import { CardHeader } from "./CardHeader";

// Figma: Experiência do produto, frame "Frame 222" (1478:43751) na /redes-de-apoio. Ainda sem nome
// como componente lá. Fundo neutral-100, `card-header` com título e texto, e um botão primary small.
//
// O mesmo banner fecha as duas abas (públicas e independentes). Quem sabe de qual aba veio o clique é
// a página, por isso o tracking chega por `onClick`.
type BannerSugestaoRedeProps = { onClick?: () => void };

export function BannerSugestaoRede({ onClick }: BannerSugestaoRedeProps) {
  return (
    <section className="banner-sugestao-rede">
      <CardHeader
        title="Sugira uma rede de apoio"
        description="Conhece algum serviço ou iniciativa que deveria estar aqui? Compartilhe com a gente para fortalecer essa rede."
      />
      <Button tamanho="small" href={LINK_WHATSAPP_SUGESTAO_REDE} alvoExterno onClick={onClick}>
        Sugerir por WhatsApp
        <IconeFavorito />
      </Button>
    </section>
  );
}
