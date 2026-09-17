import type { AcaoContato, InstituicaoApoio, ProfissionalCadastrado, ServicoPublico } from "./supabase";

export const profissionalDeTeste: ProfissionalCadastrado = {
  id: "00000000-0000-0000-0000-000000000005",
  nome: "Profissional de teste",
  especialidade: "psicologo",
  crp: "TESTE",
  anos_experiencia: 5,
  foto_url: null,
  bio: "Perfil temporário usado para validar a exibição dos profissionais parceiros. Todas as outras funcionalidades desta plataforma funcionam normalmente.",
  tags: ["Redução de danos", "Recaídas", "Abstinência"],
  whatsapp_link: null,
  telefone: null,
  email: null,
  localizacao: null,
  status: "gratuito",
  categoria_resposta_relevante: "geral",
};

const acoes = (items: AcaoContato[]): AcaoContato[] => items;

export const servicosPublicosPadrao: ServicoPublico[] = [
  { id: "00000000-0000-0000-0000-000000000101", nome: "188 • CVV • Centro de Valorização da Vida", descricao: "Serviço de apoio emocional, escuta e prevenção do suicídio. O atendimento pode ser feito por telefone, chat ou e-mail, de forma gratuita e sigilosa", tipo: "outro", endereco: null, categoria_resposta_relevante: "geral", acoes: acoes([{ kind: "phone", label: "Telefone", value: "188" }, { kind: "chat", label: "Chat", value: "https://cvv.org.br/chat/" }, { kind: "email", label: "E-mail", value: "https://cvv.org.br/e-mail/" }, { kind: "nearby", label: "Perto de mim", value: "https://www.google.com/maps/search/?api=1&query=CVV" }, { kind: "site", label: "Site", value: "https://www.cvv.org.br/" }]) },
  { id: "00000000-0000-0000-0000-000000000102", nome: "CAPS AD • Centro de Atenção Psicossocial (Álcool e Outras Drogas)", descricao: "Serviço público do SUS que oferece atendimento especializado com equipe multidisciplinar para acolhimento, cuidado e apoio no uso de substâncias", tipo: "CAPS", endereco: null, categoria_resposta_relevante: "geral", acoes: acoes([{ kind: "phone", label: "Telefone", value: "136" }, { kind: "nearby", label: "Perto de mim", value: "https://www.google.com/maps/search/?api=1&query=CAPS+AD" }]) },
  { id: "00000000-0000-0000-0000-000000000103", nome: "Disque 100 • Disque Direitos Humanos", descricao: "Canal anônimo de denúncia e proteção aos direitos humanos, acolhendo crianças, idosos, populações vulneráveis e pessoas em situação de violência", tipo: "outro", endereco: null, categoria_resposta_relevante: "geral", acoes: acoes([{ kind: "phone", label: "Telefone", value: "100" }, { kind: "whatsapp", label: "WhatsApp", value: "61996110100" }, { kind: "telegram", label: "Telegram", value: "https://t.me/Direitoshumanosbrasilbot" }, { kind: "libras", label: "Libras", value: "https://atendelibras.mdh.gov.br/acesso" }, { kind: "site", label: "Site", value: "https://www.gov.br/pt-br/servicos/denunciar-violacao-de-direitos-humanos" }]) },
  { id: "00000000-0000-0000-0000-000000000104", nome: "Ligue 132 • Orientação sobre drogas", descricao: "Espaço sigiloso para tirar dúvidas e conversar sobre álcool e outras drogas, apoiando quem usa e familiares na busca por caminhos de cuidado", tipo: "outro", endereco: null, categoria_resposta_relevante: "geral", acoes: acoes([{ kind: "phone", label: "Telefone", value: "132" }]) },
  { id: "00000000-0000-0000-0000-000000000105", nome: "UBS • Unidade Básica de Saúde (Posto de Saúde)", descricao: "Porta de entrada do SUS para cuidados gerais, escuta inicial, orientações e encaminhamentos para serviços especializados", tipo: "UBS", endereco: null, categoria_resposta_relevante: "geral", acoes: acoes([{ kind: "phone", label: "Telefone", value: "136" }, { kind: "nearby", label: "Perto de mim", value: "https://www.google.com/maps/search/?api=1&query=UBS" }, { kind: "site", label: "Meu SUS", value: "https://meususdigital.saude.gov.br/publico/rede-saude" }]) },
  { id: "00000000-0000-0000-0000-000000000106", nome: "Disque Saúde 136 • SUS • Sistema Único de Saúde", descricao: "Canal do SUS para entender seus direitos de saúde, tirando dúvidas e direcionando você ao tratamento e acompanhamento adequado no seu território", tipo: "outro", endereco: null, categoria_resposta_relevante: "geral", acoes: acoes([{ kind: "phone", label: "Telefone", value: "136" }, { kind: "site", label: "Rede de saúde", value: "https://meususdigital.saude.gov.br/publico/rede-saude" }]) },
  { id: "00000000-0000-0000-0000-000000000107", nome: "CRAS • Centro de Referência de Assistência Social", descricao: "Serviço público de assistência social que apoia famílias em situação de vulnerabilidade, incluindo casos em que o uso de substâncias afeta moradia, renda, convivência e segurança", tipo: "outro", endereco: null, categoria_resposta_relevante: "geral", acoes: acoes([{ kind: "phone", label: "Telefone", value: "156" }, { kind: "nearby", label: "Perto de mim", value: "https://www.google.com/maps/search/?api=1&query=CRAS" }, { kind: "site", label: "Agendar", value: "https://agendamentocras.com.br/" }]) },
];

export const instituicoesPadrao: InstituicaoApoio[] = [
  { id: "00000000-0000-0000-0000-000000000201", nome: "NA • Narcóticos anônimos", descricao: "Grupo de apoio mútuo e escuta para pessoas que buscam a abstinência de álcool e outras drogas, com encontros presenciais e online para troca de experiências", tipo: "NA", categoria_resposta_relevante: "geral", contatos: acoes([{ kind: "phone", label: "Telefone", value: "30035222" }, { kind: "phone", label: "0800", value: "08002210221" }, { kind: "whatsapp", label: "WhatsApp", value: "1932556688" }, { kind: "chat", label: "Salas virtuais", value: "https://www.na.org.br/virtual/" }, { kind: "chat", label: "Reuniões presenciais", value: "https://www.na.org.br/grupos/" }, { kind: "nearby", label: "Perto de mim", value: "https://www.google.com/maps/search/?api=1&query=Narc%C3%B3ticos+An%C3%B4nimos" }, { kind: "site", label: "Site", value: "https://www.na.org.br/" }]) },
  { id: "00000000-0000-0000-0000-000000000202", nome: "AA • Alcoólicos anônimos", descricao: "Grupo de apoio e escuta voltada para a recuperação do uso de álcool, oferecendo reuniões presenciais e online para a troca de experiências", tipo: "AA", categoria_resposta_relevante: "geral", contatos: acoes([{ kind: "phone", label: "Telefone", value: "1133159333" }, { kind: "whatsapp", label: "WhatsApp", value: "11947196531" }, { kind: "chat", label: "Grupos on-line", value: "https://www.aa.org.br/virtual/" }, { kind: "nearby", label: "Perto de mim", value: "https://www.google.com/maps/search/?api=1&query=Alco%C3%B3licos+An%C3%B4nimos" }, { kind: "site", label: "Site", value: "https://www.aa.org.br/" }]) },
];
