// Configurações do programa para familiares (briefing em docs/familia-briefing.md).

// Nome provisório. Trocar só aqui [PENDÊNCIA DO FUNDADOR].
export const PRODUCT_NAME = "Junto";

// Onde o login é exigido (briefing, seção 4.1):
// - "antes_do_resultado" (padrão): responde o diagnóstico sem conta e entra pra ver o resultado.
// - "inicio": entra antes da primeira pergunta.
export type LoginGate = "antes_do_resultado" | "inicio";
export const LOGIN_GATE: LoginGate = process.env.NEXT_PUBLIC_FAMILIA_LOGIN_GATE === "inicio" ? "inicio" : "antes_do_resultado";

export type Provedor = "google" | "apple" | "facebook";
export const PROVEDORES: Array<{ id: Provedor; rotulo: string }> = [
  { id: "google", rotulo: "Entrar com Google" },
  { id: "apple", rotulo: "Entrar com Apple" },
  { id: "facebook", rotulo: "Entrar com Facebook" },
];

// Textos aceitos ficam gravados junto com a data (familia_perfis). Mudar o texto aqui não muda o que
// já foi aceito. [PENDÊNCIA DO FUNDADOR: validar com assessoria jurídica]
export const TEXTO_CONSENTIMENTO_DADOS =
  "Concordo que a Margem armazene minhas respostas para personalizar o programa. Não informei dados que identifiquem a pessoa que eu amo.";
export const TEXTO_CONSENTIMENTO_COMUNICACOES = "Quero receber conteúdos e novidades da Margem por e-mail.";

// Simulador (briefing, seção 8).
export const SIMULADOR_MAX_MENSAGENS = 8;
export const SIMULADOR_LIMITE_POR_DIA = 5;
export const SIMULADOR_GRATIS = 1;
export const SIMULADOR_MAX_CARACTERES = 500;
// Modelo do simulador. O resto da Margem usa o flash-lite; o treino de conversa precisa de mais
// nuance pra reagir à forma como o familiar fala.
export const SIMULADOR_MODELO = process.env.FAMILIA_GEMINI_MODELO ?? "gemini-flash-latest";

// "Sair rápido": troca a página por um site comum e não deixa o "voltar" trazer o programa de volta.
export const URL_SAIR_RAPIDO = "https://www.climatempo.com.br";

// Chaves do localStorage. As respostas ficam aqui até o login e são apagadas depois de gravadas.
export const CHAVE_RESPOSTAS = "margem-familia-respostas";
export const CHAVE_CONSENTIMENTO_PENDENTE = "margem-familia-consentimento";
export const CHAVE_POSICAO_AUDIO = "margem-familia-audio";
