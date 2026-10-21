import { ehPlano, type PlanoProfissional } from "./planos";

// Cadastro de profissional ("Quero fazer parte", docs/apoio-telas.md). As listas são as da tela; o
// servidor confere contra elas, e "Outra" exige o texto digitado. Os nomes batem com os que já estão
// em profissionais_cadastrados (abordagem e especialidade_rotulo).

export const ABORDAGENS = [
  "Terapia Cognitivo Comportamental",
  "Psicanálise",
  "Análise do Comportamento",
  "Terapia de Aceitação e Compromisso (ACT)",
  "Terapia Comportamental Dialética (DBT)",
  "Gestalt-terapia",
  "Abordagem Centrada na Pessoa",
  "Fenomenológico-existencial",
  "Psicologia Analítica (junguiana)",
  "Terapia Sistêmica",
  "Psicodrama",
] as const;

// Sem especialidade não há RQE, e o perfil usa o rótulo fixo da aba de médicos.
export const SEM_ESPECIALIDADE = "Clínico geral, sem especialidade registrada";

export const ESPECIALIDADES_MEDICAS = [
  "Psiquiatria",
  "Medicina de Família e Comunidade",
  "Clínica Médica",
  "Neurologia",
  "Medicina Preventiva e Social",
  SEM_ESPECIALIDADE,
] as const;

export const OUTRA = "Outra";

export type CadastroProfissional = {
  nome: string;
  especialidade: "psicologo" | "psiquiatra";
  plano_escolhido: PlanoProfissional;
  registro_profissional: string;
  abordagem: string | null;
  especialidade_rotulo: string | null;
  rqe: string | null;
  telefone: string;
  email: string;
};

export type ResultadoCadastro = { ok: true; cadastro: CadastroProfissional } | { ok: false; motivo: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textoLimpo(valor: unknown, maximo: number) {
  if (typeof valor !== "string") return null;
  const limpo = valor.trim().replace(/\s+/g, " ");
  return limpo && limpo.length <= maximo ? limpo : null;
}

// Item da lista, ou o texto digitado quando a escolha é "Outra".
function escolhaDaLista(escolha: unknown, outra: unknown, lista: readonly string[]) {
  if (escolha === OUTRA) return textoLimpo(outra, 80);
  return typeof escolha === "string" && lista.includes(escolha) ? escolha : null;
}

// WhatsApp brasileiro: DDD + número (10 ou 11 dígitos), com ou sem o 55 na frente. Grava com o 55.
function whatsapp(valor: unknown) {
  if (typeof valor !== "string") return null;
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length === 10 || digitos.length === 11) return `55${digitos}`;
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) return digitos;
  return null;
}

export function validarCadastro(entrada: unknown): ResultadoCadastro {
  if (!entrada || typeof entrada !== "object") return { ok: false, motivo: "pedido_invalido" };
  const corpo = entrada as Record<string, unknown>;

  if (corpo.profissao !== "psicologo" && corpo.profissao !== "medico") return { ok: false, motivo: "profissao_invalida" };
  const medico = corpo.profissao === "medico";

  if (!ehPlano(corpo.plano)) return { ok: false, motivo: "plano_invalido" };

  const nome = textoLimpo(corpo.nome, 100);
  if (!nome || nome.length < 3) return { ok: false, motivo: "nome_invalido" };

  const registro = textoLimpo(corpo.registro, 30);
  if (!registro || registro.length < 3) return { ok: false, motivo: "registro_invalido" };

  let abordagem: string | null = null;
  let especialidadeRotulo: string | null = null;
  let rqe: string | null = null;
  if (medico) {
    const especialidade = escolhaDaLista(corpo.especialidade, corpo.especialidadeOutra, ESPECIALIDADES_MEDICAS);
    if (!especialidade) return { ok: false, motivo: "especialidade_invalida" };
    // Pela Resolução CFM 2.336/2023, especialidade só aparece no perfil com o RQE dela.
    if (especialidade !== SEM_ESPECIALIDADE) {
      rqe = textoLimpo(corpo.rqe, 20);
      if (!rqe) return { ok: false, motivo: "rqe_invalido" };
      especialidadeRotulo = especialidade;
    }
  } else {
    abordagem = escolhaDaLista(corpo.abordagem, corpo.abordagemOutra, ABORDAGENS);
    if (!abordagem) return { ok: false, motivo: "abordagem_invalida" };
  }

  const telefone = whatsapp(corpo.whatsapp);
  if (!telefone) return { ok: false, motivo: "whatsapp_invalido" };

  const email = typeof corpo.email === "string" ? corpo.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL.test(email)) return { ok: false, motivo: "email_invalido" };

  return {
    ok: true,
    cadastro: {
      nome,
      especialidade: medico ? "psiquiatra" : "psicologo",
      plano_escolhido: corpo.plano,
      registro_profissional: registro,
      abordagem,
      especialidade_rotulo: especialidadeRotulo,
      rqe,
      telefone,
      email,
    },
  };
}
