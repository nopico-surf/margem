"use client";

import { ModalHeader } from "@/components/protecao-de-dados/ModalHeader";
import { ModalSection } from "@/components/protecao-de-dados/ModalSection";
import { ModalFooter } from "@/components/protecao-de-dados/ModalFooter";

// Figma: Experiência do produto, "Dados e privacidade" (1538:39092), aberto pelo "Por que pedimos esses
// dados?" da tela do Pix. É o mesmo desenho do modal da /privacidade (logo e X em cima, título e
// seções), então compõe as mesmas peças; o Fechar fica preso embaixo, no cartão do painel inferior.
export function DadosPixModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="dados-modal dados-pix-modal" role="dialog" aria-modal="true" aria-labelledby="dados-pix-modal-titulo">
      <ModalHeader onClose={onClose} />
      <div className="dados-modal-body">
        <h1 id="dados-pix-modal-titulo">Por que pedimos esses dados</h1>
        <ModalSection titulo="Nome completo">
          <p>A nota fiscal sai nesse nome</p>
        </ModalSection>
        <ModalSection titulo="CPF ou CNPJ">
          <p>O Pix exige o CPF ou CNPJ de quem paga. O dado não fica guardado na Margem.</p>
        </ModalSection>
        <ModalSection titulo="E-mail">
          <p>Para onde vai a nota fiscal mensalmente. Vem preenchido com o e-mail cadastrado.</p>
        </ModalSection>
        <ModalSection titulo="Nome no banco">
          <p>
            No app do banco, o Pix aparece no nome de VITOR GAUDIO DESENVOLVIMENTO DE SOFTWARE LTDA, a empresa
            responsável pela Margem.
          </p>
        </ModalSection>
      </div>
      <div className="dados-pix-modal-rodape painel-inferior-cartao">
        <ModalFooter onClose={onClose} />
      </div>
    </div>
  );
}
