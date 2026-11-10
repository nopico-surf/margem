"use client";

import { ActionRow } from "@/components/conversa/ActionRow";
import { ActionButton } from "@/components/ui/ActionButton";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/mixpanel";

// Contatos de emergência do programa para familiares (briefing, seção 5) [REVISÃO CLÍNICA].
// Mesmo card dos serviços públicos e espaços de apoio da /conversa (Figma: cards-instituicoes-completo),
// com o nome no formato do banco ("188 • CVV") e o botão de telefone. Sem o "Saiba mais", que aqui
// não levaria a lugar nenhum.
export const CONTATOS_EMERGENCIA = [
  { numero: "190", nome: "Polícia Militar", quando: "Perigo imediato." },
  { numero: "180", nome: "Central de Atendimento à Mulher", quando: "Violência contra a mulher." },
  { numero: "100", nome: "Disque Direitos Humanos", quando: "Violência contra criança, adolescente, pessoa idosa ou pessoa com deficiência." },
  // Os sinais de emergência saíram do card de outras drogas do resultado e ficam aqui (10/11/2026).
  {
    numero: "192",
    nome: "SAMU",
    quando:
      "Intoxicação, overdose ou emergência médica. Ligue se houver dificuldade para respirar, se a pessoa não acordar, convulsão, confusão intensa, dor no peito ou agitação extrema.",
  },
  { numero: "188", nome: "CVV", quando: "Se você ou a pessoa estiver pensando em se machucar ou em suicídio." },
];

export function ContatosEmergencia() {
  return (
    <div className="familia-contatos">
      <div className="figma-resource-list">
      {CONTATOS_EMERGENCIA.map((contato) => (
        <article key={contato.numero} className="figma-resource-card">
          <div className="figma-resource-heading">
            <div>
              <h3>{`${contato.numero} • ${contato.nome}`}</h3>
              <p>{contato.quando}</p>
            </div>
          </div>
          <ActionRow origem="acoes">
            <ActionButton
              label="Telefone"
              icon="phone"
              href={`tel:${contato.numero}`}
              onClick={() => track("contato_clicado", { tipo_recurso: "emergencia_familia", recurso_nome: contato.nome, acao_tipo: "phone" })}
            />
          </ActionRow>
        </article>
      ))}
      </div>
      <Button variante="transparent" tamanho="medium" larguraTotal href="/profissionais">
        Falar com um profissional da Margem
      </Button>
    </div>
  );
}
