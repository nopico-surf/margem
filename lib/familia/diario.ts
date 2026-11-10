// Diário do programa para familiares (briefing, módulo 2; disponível desde o módulo 1 pelo ajuste de
// 10/11/2026). Todos os campos são opcionais e curtos. Este arquivo não importa nada de runtime.

export type TipoAnotacao = "uso" | "momento_bom";

export type Anotacao = {
  id: string;
  tipo: TipoAnotacao;
  quando: string;
  antes: string | null;
  percebeu: string | null;
  reagiu: string | null;
  depois: string | null;
};

export const CAMPOS_DIARIO: Array<{ chave: "antes" | "percebeu" | "reagiu" | "depois"; rotulo: string }> = [
  { chave: "antes", rotulo: "O que aconteceu logo antes" },
  { chave: "percebeu", rotulo: "O que você percebeu em {{apelido}}" },
  { chave: "reagiu", rotulo: "Como você reagiu nesse momento" },
  { chave: "depois", rotulo: "Como ficaram as coisas depois" },
];

export const TAMANHO_MAXIMO_CAMPO = 280;

// O item "Anotar os momentos difíceis" do módulo 1 fica feito quando a pessoa salva a primeira anotação.
export const ITEM_DO_DIARIO = { modulo: 1, item: "observe" };

// O cenário "primeira-conversa" concluído marca o item "conversa" do módulo 1.
export const ITEM_DO_SIMULADOR: Record<string, { modulo: number; item: string }> = {
  "primeira-conversa": { modulo: 1, item: "conversa" },
};

export function sanitizarAnotacao(entrada: unknown) {
  if (!entrada || typeof entrada !== "object") return null;
  const bruto = entrada as Record<string, unknown>;
  const tipo: TipoAnotacao = bruto.tipo === "momento_bom" ? "momento_bom" : "uso";
  const quando = typeof bruto.quando === "string" && !Number.isNaN(Date.parse(bruto.quando)) ? new Date(bruto.quando).toISOString() : new Date().toISOString();
  const campo = (valor: unknown) => (typeof valor === "string" && valor.trim() ? valor.trim().slice(0, TAMANHO_MAXIMO_CAMPO) : null);
  return { tipo, quando, antes: campo(bruto.antes), percebeu: campo(bruto.percebeu), reagiu: campo(bruto.reagiu), depois: campo(bruto.depois) };
}
