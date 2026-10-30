"use client";

import type { ReactNode } from "react";
import { MochilaGrade } from "@/components/mochila/MochilaGrade";
import { ItemPrateleira } from "@/components/mochila/ItemPrateleira";
import { ItemRevelacao } from "@/components/mochila/ItemRevelacao";
import { ComparacaoDesafio } from "@/components/mochila/ComparacaoDesafio";
import { PreviaCard } from "@/components/mochila/PreviaCard";
import { TelaCarregando } from "@/components/mochila/TelaCarregando";
import { Button } from "@/components/ui/Button";

function Estado({ nome, children }: { nome: string; children: ReactNode }) {
  return (
    <div className="mochila-caixa" style={{ alignItems: "flex-start" }}>
      <p className="mochila-abre">{nome}</p>
      {children}
    </div>
  );
}

const nada = () => {};

export function GaleriaMochila() {
  return (
    <div className="mochila">
      <main className="mochila-tela" style={{ maxWidth: "none" }}>
        <div className="mochila-cabeca">
          <h1 className="mochila-titulo">Mochila do Rolê: componentes</h1>
        </div>
        <div className="mochila-painel">
          <h2 className="mochila-titulo-bloco">MochilaGrade</h2>
          <Estado nome="vazia, com contador">
            <MochilaGrade itens={[]} contador aoTirar={nada} />
          </Estado>
          <Estado nome="no meio">
            <MochilaGrade itens={["garrafa", "telefone", "dinheiro", "fone"]} contador aoTirar={nada} />
          </Estado>
          <Estado nome="cheia, três itens de 2 (reorganizada)">
            <MochilaGrade itens={["telefone", "garrafa", "dinheiro", "carregador", "caixa-de-som"]} contador aoTirar={nada} />
          </Estado>
          <Estado nome="resultado, só leitura">
            <MochilaGrade itens={["garrafa", "telefone", "dinheiro", "carregador", "camisinha", "canudo", "fone"]} />
          </Estado>
          <Estado nome="resultado em fileiras, 3 espaços">
            <MochilaGrade itens={["garrafa", "telefone", "fone"]} fileiras />
          </Estado>
          <Estado nome="resultado em fileiras, 5 espaços">
            <MochilaGrade itens={["garrafa", "telefone", "dinheiro", "carregador"]} fileiras />
          </Estado>
          <Estado nome="resultado em fileiras, cheia">
            <MochilaGrade itens={["telefone", "garrafa", "dinheiro", "carregador", "caixa-de-som"]} fileiras />
          </Estado>

          <h2 className="mochila-titulo-bloco">ItemPrateleira</h2>
          <Estado nome="fora, na mochila, não cabe, item de 2">
            <div className="mochila-prateleira-grade">
              <ItemPrateleira id="lanche" naMochila={false} aoTocar={nada} />
              <ItemPrateleira id="telefone" naMochila aoTocar={nada} />
              <ItemPrateleira id="documento" naMochila={false} naoCabe aoTocar={nada} />
              <ItemPrateleira id="carregador" naMochila={false} aoTocar={nada} />
            </div>
          </Estado>

          <h2 className="mochila-titulo-bloco">ItemRevelacao</h2>
          <ul className="mochila-lista">
            <ItemRevelacao id="telefone" />
            <ItemRevelacao id="garrafa" atraso={0.35} />
          </ul>

          <h2 className="mochila-titulo-bloco">ComparacaoDesafio</h2>
          <ComparacaoDesafio minha={["garrafa", "telefone", "carregador"]} outra={["garrafa", "telefone", "lanche"]} aoDevolver={nada} />
          <ComparacaoDesafio minha={["fone"]} outra={["lanche"]} aoDevolver={nada} />

          <h2 className="mochila-titulo-bloco">Avisos de retorno</h2>
          <Estado nome="sucesso (toast fixo no rodapé, aqui em linha)">
            <p className="mochila-toast">
              <svg className="mochila-toast-check" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 6l3 3 5-6" />
              </svg>
              <span>Checklist copiado. É só colar no grupo.</span>
            </p>
          </Estado>
          <div className="mochila-caixa mochila-caixa-forte mochila-erro-imagem">
            <p className="mochila-abre">Não deu pra gerar a imagem agora.</p>
            <div className="mochila-acoes-lado">
              <Button variante="primary" tamanho="medium" redondo larguraTotal onClick={nada}>
                Tentar de novo
              </Button>
              <Button variante="secondary" tamanho="medium" redondo larguraTotal onClick={nada}>
                Copiar link
              </Button>
            </div>
          </div>

          <h2 className="mochila-titulo-bloco">PreviaCard</h2>
          <Estado nome="carregando (sem imagem), stories e feed">
            <div style={{ display: "flex", gap: "var(--spacing-16)", alignItems: "flex-start" }}>
              <PreviaCard src={null} formato="stories" alt="" />
              <PreviaCard src={null} formato="feed" alt="" />
            </div>
          </Estado>

          <h2 className="mochila-titulo-bloco">TelaCarregando</h2>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "calc(var(--size-96) * 5)", background: "var(--colors-brand-secondary-300)" }}>
            <TelaCarregando />
          </div>
        </div>
      </main>
    </div>
  );
}
