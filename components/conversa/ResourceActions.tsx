"use client";

import { ActionRow } from "./ActionRow";
import { ActionButton } from "@/components/ui/ActionButton";
import { track } from "@/lib/mixpanel";
import type { CardResource, TipoRecurso } from "./types";
import type { IconeAcao } from "@/components/icons";

// ícone da ação -> kind salvo no banco (inverso de ICONE_POR_KIND em app/api/orientacao/route.ts)
const KIND_POR_ICONE: Partial<Record<IconeAcao, string>> = { place: "nearby", link: "site" };

type ResourceActionsProps = { resource: CardResource; tipoRecurso: TipoRecurso };

export function ResourceActions({ resource, tipoRecurso }: ResourceActionsProps) {
  return (
    <ActionRow>
      {resource.actions.map((action, index) => (
        <ActionButton
          key={`${resource.id}-${index}`}
          {...action}
          onClick={() =>
            track("contato_clicado", {
              tipo_recurso: tipoRecurso,
              recurso_nome: resource.title,
              acao_tipo: action.icon ? KIND_POR_ICONE[action.icon] ?? action.icon : null,
              acao_label: action.label,
              posicao: index + 1,
            })
          }
        />
      ))}
      <ActionButton
        label="Saiba mais"
        onClick={() => track("saiba_mais_clicado", { tipo_recurso: tipoRecurso, recurso_nome: resource.title })}
      />
    </ActionRow>
  );
}
