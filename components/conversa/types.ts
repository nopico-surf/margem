import type { ProfissionalCadastrado } from "@/lib/supabase";
import type { IconeAcao } from "@/components/icons";

export type CardAction = { label: string; icon?: IconeAcao; href?: string };
export type CardResource = { id: string; title: string; description: string; actions: CardAction[] };

export type TipoRecurso = "servico_publico" | "instituicao";

export type OrientationResult = {
  acolhimento: string;
  orientacao: string;
  pilula_espiritual: string | null;
  checklist_agora: string[];
  checklist_proximo: string[];
  perguntas_aprofundamento: Array<{ pergunta: string; opcoes: string[] }>;
  profissionais?: ProfissionalCadastrado[];
  servicos_publicos?: CardResource[];
  instituicoes?: CardResource[];
};
