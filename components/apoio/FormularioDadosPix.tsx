"use client";

import { CardHeader } from "@/components/conversa/CardHeader";
import { ContainerConteudo } from "@/components/conversa/ContainerConteudo";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import type { Campo } from "@/lib/apoio/pix-cliente";

// Figma: Experiência do produto, dados para o Pix (1537:36437). A tela de dados do /plano, usada também
// no checkout do programa para familiares, que não pede e-mail (vem da conta).
//
// No mobile só o link "Por que pedimos esses dados?" aparece aqui (valor e botão ficam na barra fixa,
// o PainelInferior variante "pix", que a página põe); no desktop a linha leva o link à esquerda e o
// valor com o Gerar Pix à direita (1545:40734).
type FormularioDadosPixProps = {
  id: string;
  campos: Campo[];
  valores: Record<Campo, string>;
  erros: Partial<Record<Campo, string>>;
  erroGeral: string;
  textoDoValor: string;
  onMudar: (campo: Campo, valor: string) => void;
  onConferir: (campo: Campo) => void;
  onGerar: () => void;
  onPorQue: () => void;
  // Linha junto do Gerar Pix (o checkout do programa põe ali o prazo pra pedir o dinheiro de volta).
  nota?: string;
};

export function FormularioDadosPix({ id, campos, valores, erros, erroGeral, textoDoValor, onMudar, onConferir, onGerar, onPorQue, nota }: FormularioDadosPixProps) {
  return (
    <ContainerConteudo id={id}>
      <CardHeader as="h1" title="Seus dados para o Pix" />
      {campos.includes("nome") && (
        <InputText
          id={`${id}-nome`}
          rotulo="Nome completo"
          value={valores.nome}
          onChange={(valor) => onMudar("nome", valor)}
          onBlur={() => onConferir("nome")}
          erro={erros.nome}
          autoComplete="name"
          maxLength={100}
        />
      )}
      {campos.includes("cpfCnpj") && (
        <InputText
          id={`${id}-cpf-cnpj`}
          rotulo="CPF ou CNPJ"
          value={valores.cpfCnpj}
          onChange={(valor) => onMudar("cpfCnpj", valor)}
          onBlur={() => onConferir("cpfCnpj")}
          erro={erros.cpfCnpj}
          descricao="Digite apenas números"
          inputMode="numeric"
          autoComplete="off"
          maxLength={14}
        />
      )}
      {campos.includes("email") && (
        <InputText
          id={`${id}-email`}
          rotulo="E-mail"
          value={valores.email}
          onChange={(valor) => onMudar("email", valor)}
          onBlur={() => onConferir("email")}
          erro={erros.email}
          tipo="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
        />
      )}
      {erroGeral && (
        <p className="plano-erro" role="alert">
          {erroGeral}
        </p>
      )}
      {nota && <p className="plano-nota">{nota}</p>}
      <div className="plano-dados-acoes">
        <Button variante="transparent" tamanho="medium" onClick={onPorQue}>
          Por que pedimos esses dados?
        </Button>
        <div className="plano-dados-gerar">
          <p>{textoDoValor}</p>
          <Button tamanho="medium" larguraTotal onClick={onGerar}>
            Gerar Pix
          </Button>
        </div>
      </div>
    </ContainerConteudo>
  );
}
