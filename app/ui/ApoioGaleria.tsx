"use client";

import { useState } from "react";
import { InputText } from "@/components/ui/InputText";
import { CardPlano } from "@/components/apoio/CardPlano";
import { ContadorPix } from "@/components/apoio/ContadorPix";

// A galeria é componente de servidor e não passa função: o InputText e o CardPlano precisam de handler,
// então moram neste cliente. Mesmo esquema do CardHomeGaleria.

function Estado({ nome, children }: { nome: string; children: React.ReactNode }) {
  return (
    <div className="galeria-estado">
      <div className="galeria-palco">{children}</div>
      <span className="label-xx-small galeria-nome">{nome}</span>
    </div>
  );
}

export function InputTextGaleria() {
  const [livre, setLivre] = useState("");
  const nada = () => {};

  return (
    <div className="galeria-estados">
      <Estado nome="default (digite aqui)">
        <InputText id="galeria-input-livre" rotulo="Nome completo" value={livre} onChange={setLivre} />
      </Estado>
      <Estado nome="hover">
        <InputText id="galeria-input-hover" rotulo="Nome completo" value="" onChange={nada} estadoForcado="hover" />
      </Estado>
      <Estado nome="focus">
        <InputText id="galeria-input-foco" rotulo="Nome completo" value="" onChange={nada} estadoForcado="focus" />
      </Estado>
      <Estado nome="filled">
        <InputText id="galeria-input-cheio" rotulo="E-mail" value="pessoa@exemplo.com.br" onChange={nada} />
      </Estado>
      <Estado nome="error">
        <InputText
          id="galeria-input-erro"
          rotulo="CPF ou CNPJ"
          value="123.456.789-00"
          onChange={nada}
          erro="Não conseguimos conferir esse CPF ou CNPJ. Confira os números e tente de novo."
        />
      </Estado>
      <Estado nome="success">
        <InputText id="galeria-input-sucesso" rotulo="E-mail" value="pessoa@exemplo.com.br" onChange={nada} sucesso descricao="Description" />
      </Estado>
      <Estado nome="default com descrição">
        <InputText id="galeria-input-descricao" rotulo="Nome completo" value="" onChange={nada} descricao="Description" />
      </Estado>
    </div>
  );
}

export function CardPlanoGaleria() {
  const nada = () => {};

  return (
    <div className="galeria-estados">
      <Estado nome="base, Prata">
        <CardPlano arranjo="base" nome="Prata" descricao="3 vagas abertas" centavos={1999} onSelecionar={nada} />
      </Estado>
      <Estado nome="base, Ouro (destaque)">
        <CardPlano arranjo="base" nome="Ouro" descricao="8 vagas abertas" centavos={3999} destaque onSelecionar={nada} />
      </Estado>
      <Estado nome="base, Prata (plano atual, na troca)">
        <CardPlano arranjo="base" nome="Prata" descricao="3 vagas abertas" centavos={1999} atual onSelecionar={nada} />
      </Estado>
      <Estado nome="opcional, Destaque">
        <CardPlano
          arranjo="opcional"
          nome="Destaque"
          descricao="Um story fixo nos destaques do Instagram da Margem, com link para o seu perfil, e presença no carrossel mensal de quem atende pela Margem"
          centavos={15999}
          onSelecionar={nada}
        />
      </Estado>
      <Estado nome="opcional, Divulgação (destaque)">
        <CardPlano
          arranjo="opcional"
          nome="Divulgação"
          descricao="Tudo do destaque, mais:"
          complemento="1 conteúdo seu por mês no Instagram da Margem, em collab, impulsionado com anúncio pago e direcionando ao seu perfil"
          centavos={36999}
          destaque
          onSelecionar={nada}
        />
      </Estado>
    </div>
  );
}

export function ContadorPixGaleria() {
  return (
    <div className="galeria-estados">
      <Estado nome="30:00">
        <ContadorPix segundos={1800} />
      </Estado>
      <Estado nome="00:00 (vencido)">
        <ContadorPix segundos={0} />
      </Estado>
    </div>
  );
}
