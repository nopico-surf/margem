"use client";

import { useState } from "react";
import { InputText } from "@/components/ui/InputText";
import { IconeBusca, IconeLimparBusca } from "@/components/icons";
import { CardPlano } from "@/components/apoio/CardPlano";
import { ContadorPix } from "@/components/apoio/ContadorPix";
import { TelaPix } from "@/components/apoio/TelaPix";
import { QR_DA_PREVIA, type Pix } from "@/lib/apoio/pix-cliente";

// Pix de exemplo sem relógio (Date.now() no render quebra o prerender): a TelaPix não lê a validade.
const PIX_DE_EXEMPLO: Pix = {
  apoioId: "previa",
  payload: "00020101021226810014br.gov.bcb.pix2559pix-h.asaas.com/qr/cobv/exemplo-da-previa6304ABCD",
  imagemBase64: QR_DA_PREVIA,
  expiraEm: 0,
};

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
      <Estado nome="ícones, vazio (busca do blog)">
        <InputText id="galeria-input-icone" rotulo="Buscar no blog" value="" onChange={nada} tipo="search" iconeInicio={<IconeBusca />} />
      </Estado>
      <Estado nome="ícones, foco">
        <InputText id="galeria-input-icone-foco" rotulo="Buscar no blog" value="" onChange={nada} tipo="search" iconeInicio={<IconeBusca />} estadoForcado="focus" />
      </Estado>
      <Estado nome="ícones, filled com o X">
        <InputText
          id="galeria-input-icone-cheio"
          rotulo="Buscar no blog"
          value="maconha"
          onChange={nada}
          tipo="search"
          iconeInicio={<IconeBusca />}
          iconeFim={
            <button type="button" className="blog-busca-limpar" aria-label="Limpar busca">
              <IconeLimparBusca />
            </button>
          }
        />
      </Estado>
    </div>
  );
}

export function CardPlanoGaleria() {
  const nada = () => {};

  return (
    <div className="galeria-estados">
      <Estado nome="base, Bronze (gratuito)">
        <CardPlano arranjo="base" nome="Bronze" descricao="1 vaga aberta" centavos={0} onSelecionar={nada} />
      </Estado>
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

// Checkout do programa para familiares: o mesmo CardPlano, com selo, lista do que inclui e sem preço.
export function CardPlanoFamiliaGaleria() {
  const nada = () => {};
  return (
    <div className="galeria-estados">
      <Estado nome="Programa (pré-selecionado)">
        <CardPlano
          arranjo="opcional"
          nome="Programa"
          itens={["8 módulos, um por semana, também em áudio", "Diário e escala da sua vida"]}
          descricao="Você escolhe quanto pagar, de R$ 47 a R$ 147."
          selecionado
          onSelecionar={nada}
        />
      </Estado>
      <Estado nome="Com acompanhamento (selo Recomendado)">
        <CardPlano
          arranjo="opcional"
          nome="Programa com acompanhamento"
          selo="Recomendado"
          descricao="Nos estudos, os melhores resultados aparecem quando o familiar tem apoio de um profissional."
          complemento="Programa por R$ 47 + a primeira sessão com um profissional parceiro."
          onSelecionar={nada}
        />
      </Estado>
    </div>
  );
}

// Tela do QR compartilhada pelo /plano e pelo checkout da família: aguardando, código copiado e vencido.
export function TelaPixGaleria() {
  const nada = () => {};
  const pix = PIX_DE_EXEMPLO;
  return (
    <div className="galeria-estados">
      <Estado nome="aguardando o pagamento">
        <TelaPix id="galeria-pix" pix={pix} titulo="Pague com Pix" descricao="Abra o app do seu banco, escolha pagar com Pix e escaneie o código ou cole o código copiado." segundosRestantes={600} codigoCopiado={false} onCopiar={nada} onGerarOutro={nada} />
      </Estado>
      <Estado nome="código copiado">
        <TelaPix id="galeria-pix-copiado" pix={pix} titulo="Pague com Pix" segundosRestantes={420} codigoCopiado onCopiar={nada} onGerarOutro={nada} />
      </Estado>
      <Estado nome="vencido">
        <TelaPix id="galeria-pix-vencido" pix={pix} titulo="Pague com Pix" segundosRestantes={0} vencido={{ titulo: "O código expirou", botao: "Gerar um novo" }} codigoCopiado={false} onCopiar={nada} onGerarOutro={nada} />
      </Estado>
      <Estado nome="gerando de novo">
        <TelaPix id="galeria-pix-gerando" pix={pix} titulo="Pague com Pix" segundosRestantes={0} vencido={{ titulo: "O código expirou", botao: "Gerar um novo" }} codigoCopiado={false} onCopiar={nada} onGerarOutro={nada} gerando />
      </Estado>
    </div>
  );
}
