"use client";

import { ActionRow } from "@/components/conversa/ActionRow";
import { ActionButton } from "@/components/ui/ActionButton";
import { Button } from "@/components/ui/Button";
import { paraCardResource } from "@/lib/recursos";
import type { AcaoContato } from "@/lib/supabase";
import { track } from "@/lib/mixpanel";

// Contatos de emergência do programa para familiares [REVISÃO CLÍNICA]. Textos do conteúdo v2
// (10/11/2026). Mesmo card dos serviços públicos e espaços de apoio da /conversa (Figma:
// cards-instituicoes-completo), com o nome no formato do banco ("188 • CVV") e as mesmas ações que
// esses serviços têm hoje em servicos_publicos (telefone, WhatsApp, chat, site...). O 180 não está no
// banco: telefone e WhatsApp oficial do Ministério das Mulheres. Sem o "Saiba mais", que aqui não
// levaria a lugar nenhum.
type Contato = { numero: string; nome: string; descricao: string[]; acoes: AcaoContato[] };

const telefone = (numero: string): AcaoContato => ({ kind: "phone", label: "Telefone", value: numero });

export const CONTATOS_EMERGENCIA: Contato[] = [
  { numero: "190", nome: "Polícia Militar", descricao: ["Perigo agora."], acoes: [telefone("190")] },
  {
    numero: "180",
    nome: "Central de Atendimento à Mulher",
    descricao: ["Violência contra a mulher. Também orienta sobre medida protetiva."],
    acoes: [telefone("180"), { kind: "whatsapp", label: "WhatsApp", value: "61996100180" }],
  },
  {
    numero: "100",
    nome: "Disque Direitos Humanos",
    descricao: ["Violência contra criança, adolescente, pessoa idosa ou pessoa com deficiência."],
    acoes: [
      telefone("100"),
      { kind: "whatsapp", label: "WhatsApp", value: "61996110100" },
      { kind: "telegram", label: "Telegram", value: "https://t.me/Direitoshumanosbrasilbot" },
      { kind: "libras", label: "Libras", value: "https://atendelibras.mdh.gov.br/acesso" },
      { kind: "site", label: "Site", value: "https://www.gov.br/pt-br/servicos/denunciar-violacao-de-direitos-humanos" },
    ],
  },
  {
    numero: "192",
    nome: "SAMU",
    descricao: [
      "Intoxicação, overdose ou outra emergência médica. Ligue se houver dificuldade para respirar, se a pessoa não acordar, convulsão, confusão forte, dor no peito ou agitação extrema.",
      "Enquanto a ajuda não chega: não deixe a pessoa sem companhia, se houver muita sonolência deite a pessoa de lado e não dê nada para comer ou beber.",
    ],
    acoes: [telefone("192")],
  },
  {
    numero: "188",
    nome: "CVV",
    descricao: ["Para conversar quando estiver difícil, a qualquer hora. Também se você ou a pessoa estiver pensando em se machucar."],
    acoes: [
      telefone("188"),
      { kind: "chat", label: "Chat", value: "https://cvv.org.br/chat/" },
      { kind: "email", label: "E-mail", value: "https://cvv.org.br/e-mail/" },
      { kind: "nearby", label: "Ver unidades perto de mim", value: "https://www.google.com/maps/search/?api=1&query=CVV" },
      { kind: "site", label: "Site", value: "https://www.cvv.org.br/" },
    ],
  },
];

export function ContatosEmergencia() {
  return (
    <div className="familia-contatos">
      <div className="figma-resource-list">
        {CONTATOS_EMERGENCIA.map((contato) => {
          const titulo = `${contato.numero} • ${contato.nome}`;
          const { actions } = paraCardResource(contato.numero, titulo, null, contato.acoes);
          return (
            <article key={contato.numero} className="figma-resource-card">
              <div className="figma-resource-heading">
                <div>
                  <h3>{titulo}</h3>
                  {contato.descricao.map((paragrafo) => (
                    <p key={paragrafo}>{paragrafo}</p>
                  ))}
                </div>
              </div>
              <ActionRow origem="acoes">
                {actions.map((acao, indice) => (
                  <ActionButton
                    key={acao.label}
                    {...acao}
                    onClick={() =>
                      track("contato_clicado", {
                        tipo_recurso: "emergencia_familia",
                        recurso_nome: contato.nome,
                        acao_tipo: contato.acoes[indice].kind,
                        acao_label: acao.label,
                        posicao: indice + 1,
                      })
                    }
                  />
                ))}
              </ActionRow>
            </article>
          );
        })}
      </div>
      <Button variante="transparent" tamanho="medium" larguraTotal href="/profissionais">
        Ver psicólogo parceiro
      </Button>
    </div>
  );
}
