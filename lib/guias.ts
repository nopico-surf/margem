// Conteúdo dos guias de SEO (/guias/[slug]). O texto veio aprovado do briefing de 31/10/2026 e vai
// exatamente como está: as regras de copy da seção 7 do CLAUDE.md não valem aqui (H2 em pergunta e
// termos de busca como "dependência química" são de propósito).
//
// Links internos ficam no próprio texto, no formato markdown `[texto](/rota)` (ver TextoComLinks em
// app/guias/[slug]/page.tsx). Este arquivo é lido só no servidor.

export type EspecialidadeGuia = "psicologo" | "psiquiatra";

// Mesmas URLs de urlDaEspecialidade (components/conversa/FiltroEspecialidade.tsx). Copiadas porque
// aquele arquivo é "use client" e a função não pode ser chamada no servidor.
export const URL_PROFISSIONAIS: Record<EspecialidadeGuia, string> = {
  psicologo: "/profissionais?especialidade=psicologo",
  psiquiatra: "/profissionais?especialidade=medicos-psiquiatras",
};

export const TEXTO_VER_TODOS: Record<EspecialidadeGuia, string> = {
  psicologo: "Ver todos os psicólogos a valor social",
  psiquiatra: "Ver todos os psiquiatras a valor social",
};

export type BlocoGuia =
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "lista-numerada"; itens: string[] }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "botoes"; botoes: { texto: string; href: string }[] };

export type SecaoGuia = { titulo: string; blocos: BlocoGuia[] };

export type Guia = {
  slug: string;
  title: string;
  descricao: string;
  h1: string;
  abertura: string;
  // Quem aparece no carrossel do topo e do fim. Vazio: a página não tem carrossel.
  carrossel: EspecialidadeGuia[];
  secoes: SecaoGuia[];
  perguntas: { pergunta: string; resposta: string }[];
  // A imagem do topo fica em /public/guias/<slug>.webp. Enquanto o arquivo não existir, `imagem` fica
  // false e o espaço aparece só com o fundo neutro. Ao subir a imagem, virar pra true e preencher o alt:
  // ela passa a ser também a imagem de Open Graph da página.
  imagem: boolean;
  imagemAlt: string;
};

const p = (texto: string): BlocoGuia => ({ tipo: "paragrafo", texto });

export const GUIAS: Guia[] = [
  {
    slug: "terapia-barata",
    title: "Terapia barata: psicólogo online a partir de R$ 60 | Margem",
    descricao:
      "Sessão com psicólogo registrado no CRP a valor social, de R$ 60 a 200. Você escolhe quanto paga dentro da faixa. Veja como funciona.",
    h1: "Terapia barata com psicólogo registrado: como funciona o valor social",
    abertura:
      "Cuidar da cabeça não deveria ser luxo. Mesmo assim, o preço da terapia é um dos motivos mais comuns pra muita gente adiar esse cuidado. Não é falta de vontade, é conta que não fecha. Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e quem decide quanto paga dentro dessa faixa é você.",
    carrossel: ["psicologo"],
    secoes: [
      {
        titulo: "O que é terapia a valor social?",
        blocos: [
          p("Valor social é um preço reduzido que o profissional escolhe oferecer pra que mais gente consiga fazer terapia. O atendimento não muda: mesma formação, mesmo registro no Conselho Regional de Psicologia, mesmo sigilo. O que muda é quanto você paga."),
        ],
      },
      {
        titulo: "Quanto custa uma sessão de terapia na Margem?",
        blocos: [
          p("De R$ 60 a R$ 200 por sessão. Você olha pro seu mês e escolhe um valor dentro dessa faixa. Se o orçamento apertar mais pra frente, dá pra conversar com o profissional sobre isso."),
          p("Você não precisa explicar por que escolheu esse valor. A Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas, e a faixa de preço é pensada pra isso."),
        ],
      },
      {
        titulo: "Terapia barata é pior?",
        blocos: [
          p("Não por ser mais barata. O que pesa no resultado é a formação de quem atende e o vínculo que vocês constroem. Antes de entrar na Margem, cada profissional passa por uma aprovação. E você pode conferir o registro de qualquer psicólogo sozinho, em poucos minutos. [Ver como conferir o registro de um psicólogo](/guias/como-saber-se-o-psicologo-e-registrado)"),
        ],
      },
      {
        titulo: "Terapia online funciona?",
        blocos: [
          p("Funciona. Estudos que juntaram dezenas de pesquisas encontraram resultados muito parecidos entre terapia por vídeo e terapia presencial, principalmente em ansiedade e depressão. No Brasil, o atendimento psicológico online é regulamentado pelo Conselho Federal de Psicologia, e o profissional precisa ter registro ativo no CRP."),
          p("Uma dica prática: se em casa não tem um canto com privacidade, muita gente faz a sessão no carro, numa praça mais vazia ou andando com fone de ouvido. O importante é você conseguir falar sem medo de ser ouvido."),
        ],
      },
      {
        titulo: "Com que frequência eu faria terapia?",
        blocos: [
          p("Muita gente começa com uma sessão por semana. Isso se combina com o profissional, de acordo com o que você está vivendo e com o que cabe no bolso. Não existe um número certo de sessões que valha pra todo mundo."),
        ],
      },
      {
        titulo: "E se eu também precisar de psiquiatra?",
        blocos: [
          p("Às vezes faz sentido ter os dois juntos: o psicólogo cuida da conversa e do que está por baixo do que você sente, o psiquiatra avalia se um remédio pode ajudar. A Margem também tem psiquiatras a valor social. [Ver psiquiatras a valor social](/guias/psiquiatra-barato)"),
        ],
      },
      {
        titulo: "E se nem o valor social couber agora?",
        blocos: [
          p("Acontece, e não diz nada sobre você. Pelo SUS, a porta de entrada é a Unidade Básica de Saúde do seu bairro, e o CAPS atende sem precisar de encaminhamento. Muitas faculdades de psicologia também têm clínicas-escola, com atendimento feito por estudantes supervisionados por professores. A fila costuma ser longa, mas é um caminho real."),
          p("Se você está num momento muito difícil e precisa conversar agora, o CVV atende 24 horas pelo 188."),
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Quanto custa terapia barata na Margem?",
        resposta: "De R$ 60 a R$ 200 por sessão, e você escolhe o valor dentro dessa faixa.",
      },
      {
        pergunta: "Psicólogo a valor social tem registro no CRP?",
        resposta:
          "Tem. Valor social muda o preço, não a formação nem o registro. Você pode conferir o registro de qualquer psicólogo no Cadastro Nacional do Conselho Federal de Psicologia.",
      },
      {
        pergunta: "Terapia online é confiável?",
        resposta:
          "É regulamentada pelo Conselho Federal de Psicologia e, segundo pesquisas, tem resultados parecidos com a presencial em muitas situações, como ansiedade e depressão.",
      },
      {
        pergunta: "Dá pra fazer terapia pelo SUS?",
        resposta:
          "Dá, mas fora da Margem: a Margem não faz parte do SUS nem tem parceria com o governo. No SUS, a porta de entrada é a Unidade Básica de Saúde, e o CAPS atende sem encaminhamento. A espera costuma ser maior.",
      },
    ],
    imagem: false,
    imagemAlt: "",
  },
  {
    slug: "psiquiatra-barato",
    title: "Psiquiatra barato: consulta online a partir de R$ 110 | Margem",
    descricao:
      "Consulta com psiquiatra a valor social, de R$ 110 a 290, online e com receita digital. Veja como funciona e como conferir o CRM do médico.",
    h1: "Psiquiatra barato: consulta a valor social com médico registrado no CRM",
    abertura:
      "Uma consulta com psiquiatra particular pesa no bolso de muita gente, e a espera pelo SUS pode demorar. No meio disso, muita gente fica sem cuidado justamente quando mais precisa. Na Margem, a consulta com psiquiatra custa de R$ 110 a R$ 290. Você escolhe o valor dentro dessa faixa e não precisa explicar por quê: a Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas.",
    carrossel: ["psiquiatra"],
    secoes: [
      {
        titulo: "O que faz um psiquiatra?",
        blocos: [
          p("O psiquiatra é um médico especializado em saúde mental. Ele avalia o que você está vivendo, pode fazer um diagnóstico e, se fizer sentido, receitar e acompanhar um remédio. O psicólogo não receita remédio, e por isso os dois costumam trabalhar bem juntos."),
        ],
      },
      {
        titulo: "Quando vale procurar um psiquiatra?",
        blocos: [
          p("Quando o que você sente está atrapalhando o sono, o trabalho, os estudos ou as relações há semanas. Quando a terapia sozinha não está dando conta. Quando o uso de álcool ou outras drogas ficou difícil de controlar. Ou quando você já toma um remédio e precisa de alguém acompanhando. Não precisa esperar chegar no limite."),
        ],
      },
      {
        titulo: "Preciso de encaminhamento pra consultar com psiquiatra?",
        blocos: [
          p("No atendimento particular, não. Você pode marcar direto. Encaminhamento é o caminho do SUS, que explicamos mais abaixo."),
        ],
      },
      {
        titulo: "Consulta online com psiquiatra funciona?",
        blocos: [
          p("Funciona e é permitida pelo Conselho Federal de Medicina, inclusive na primeira consulta. Em alguns casos o médico pode indicar um encontro presencial ao longo do tratamento."),
        ],
      },
      {
        titulo: "Psiquiatra online pode passar receita?",
        blocos: [
          p("Pode. A receita digital tem a mesma validade da receita em papel e vem com assinatura eletrônica. Pra alguns remédios controlados, vale confirmar com a farmácia como ela recebe a receita antes de ir."),
        ],
      },
      {
        titulo: "Como é a primeira consulta?",
        blocos: [
          p("A primeira costuma ser a mais longa. O médico vai querer entender sua história, como você está dormindo, comendo, trabalhando, se usa álcool ou outras drogas, e o que já tentou. Não existe resposta errada. Quanto mais sincera a conversa, melhor ele consegue te ajudar. Depois, os retornos dependem do tratamento."),
        ],
      },
      {
        titulo: "E o custo do remédio?",
        blocos: [
          p("Se o remédio pesar no bolso, fale isso na consulta. Muitas vezes existe uma opção mais barata ou disponível na farmácia da Unidade Básica de Saúde. E nunca pare um remédio de uma vez sem conversar com o médico, porque alguns precisam ser reduzidos aos poucos."),
          p("Remédio não muda quem você é. Quando bem indicado, ele pode abrir espaço pra você voltar a se reconhecer."),
        ],
      },
      {
        titulo: "Psiquiatra e psicólogo juntos",
        blocos: [
          p("Em muitas situações, o melhor resultado vem dos dois juntos: o remédio ajuda a estabilizar, a terapia ajuda a entender e mudar o que está por baixo. [Ver psicólogos a valor social](/guias/terapia-barata)"),
        ],
      },
      {
        titulo: "Como saber se o psiquiatra é especialista?",
        blocos: [
          p("Todo médico tem registro no CRM. Quem é especialista em psiquiatria também tem um número de RQE, que aparece na busca pública do Conselho Federal de Medicina. [Ver como conferir o CRM de um psiquiatra](/guias/como-saber-se-o-psicologo-e-registrado)"),
        ],
      },
      {
        titulo: "Dá pra consultar com psiquiatra pelo SUS?",
        blocos: [
          p("Dá, mas fora da Margem: a Margem não faz parte do SUS nem tem parceria com o governo. No SUS, o caminho começa na Unidade Básica de Saúde: o médico da unidade avalia e, se precisar, encaminha pra psiquiatra ou pro CAPS. O CAPS também atende sem encaminhamento, indo direto na unidade. A espera costuma ser maior."),
          p("Em crise, procure uma UPA ou ligue para o SAMU no 192. Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Quanto custa uma consulta com psiquiatra barato na Margem?",
        resposta: "De R$ 110 a R$ 290 por consulta.",
      },
      {
        pergunta: "Precisa de encaminhamento pra ir ao psiquiatra?",
        resposta: "No particular, não. No SUS, o caminho começa na Unidade Básica de Saúde ou no CAPS.",
      },
      {
        pergunta: "Psiquiatra online pode receitar remédio?",
        resposta: "Pode. A receita digital tem a mesma validade da receita em papel.",
      },
      {
        pergunta: "Qual a diferença entre psiquiatra e psicólogo?",
        resposta: "O psiquiatra é médico e pode receitar remédio. O psicólogo conduz a terapia e não receita.",
      },
      {
        pergunta: "Como saber se o psiquiatra é especialista?",
        resposta: "Pela busca pública do Conselho Federal de Medicina, que mostra o CRM e o RQE de especialista.",
      },
    ],
    imagem: false,
    imagemAlt: "",
  },
  {
    slug: "psicologo-alcool-e-drogas",
    title: "Dependência química e álcool: terapia a valor social | Margem",
    descricao:
      "Psicólogo e psiquiatra pra quem quer mudar a relação com álcool e outras drogas, a valor social e com sigilo. Sem julgamento e sem internação.",
    h1: "Psicólogo e psiquiatra para álcool e drogas, a valor social",
    abertura:
      "Se você está aqui, alguma coisa no seu uso de álcool ou de outras drogas, ou no de alguém que você ama, está pedindo atenção. Isso não faz de ninguém uma pessoa fraca. Muita gente usa pra aliviar algo que dói, cansa ou falta, e funciona por um tempo, até começar a cobrar caro. Na Margem, você encontra psicólogos e psiquiatras a valor social que conversam sobre isso sem julgamento.",
    // O banco não tem campo que diga quem atende álcool e outras drogas (só tags livres), então
    // aparecem todos, como o briefing pede.
    carrossel: ["psicologo", "psiquiatra"],
    secoes: [
      {
        titulo: "Psicólogo ajuda quem tem dependência química?",
        blocos: [
          p("Ajuda. A terapia não começa perguntando como parar, e sim o que o uso está resolvendo na sua vida. Quando isso fica claro, dá pra buscar outros jeitos de cuidar daquilo que está por baixo. Parar sem mexer no que está por baixo costuma levar de volta ao mesmo lugar."),
        ],
      },
      {
        titulo: "Preciso parar de usar pra começar?",
        blocos: [
          p("Não. Você pode começar do jeito que está. Pra algumas pessoas, o caminho é parar de vez. Pra outras, é usar menos e com menos risco, o que se chama redução de danos. Os dois são caminhos de cuidado, e quem escolhe é você, junto com o profissional."),
        ],
      },
      {
        titulo: "Quando procurar um psiquiatra?",
        blocos: [
          p("Quando o uso vem junto com ansiedade, tristeza ou insônia que não passam. Quando você já tentou diminuir e não conseguiu. E principalmente se você bebe muito há bastante tempo e quer parar: parar o álcool de uma vez, nessa situação, pode ser perigoso pro corpo. Com acompanhamento médico, isso fica mais seguro."),
        ],
      },
      {
        titulo: "Vou ser internado se procurar ajuda?",
        blocos: [
          p("Não. Conversar com psicólogo ou psiquiatra não leva a internação. A lei brasileira trata internação como exceção, e na grande maioria das vezes o cuidado acontece com você seguindo a sua vida, trabalhando, morando onde mora."),
        ],
      },
      {
        titulo: "O que eu contar fica entre a gente?",
        blocos: [
          p("Fica. Psicólogos e médicos têm sigilo profissional garantido pelos seus códigos de ética. Eles não avisam polícia, família nem trabalho sobre o que você conta. As exceções são raras e envolvem risco sério à vida."),
        ],
      },
      {
        titulo: "Quanto custa?",
        blocos: [
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Tudo online."),
          p("Você escolhe o valor dentro da faixa e não precisa explicar por quê. A Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas, e a faixa de preço é pensada pra isso."),
        ],
      },
      {
        titulo: "Estou aqui por alguém que eu amo. E agora?",
        blocos: [
          p("Acompanhar alguém que faz uso cansa e assusta. Você também merece cuidado, e não precisa esperar a outra pessoa aceitar ajuda pra buscar o seu. Uma terapia pra você pode ajudar a entender o que está ao seu alcance e o que não está."),
        ],
      },
      {
        titulo: "Grupos de apoio também ajudam",
        blocos: [
          p("Alcoólicos Anônimos e Narcóticos Anônimos têm reuniões presenciais e online, sem custo. Pra familiares, existem o Al-Anon e o Nar-Anon. Muita gente combina grupo e terapia. Pelo SUS, o CAPS AD é especializado em álcool e outras drogas e atende sem encaminhamento."),
          p("Ninguém precisa ter a resposta inteira pra dar o primeiro passo."),
          p("Em emergência, como sinais de intoxicação grave, ligue para o SAMU no 192. Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          // A /conversa sem texto volta pra /inicio: é na /inicio que fica o campo pra contar.
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Psicólogo trata dependência química?",
        resposta: "Trata. A terapia ajuda a entender o que o uso resolve na sua vida e a buscar outros jeitos de lidar com isso.",
      },
      {
        pergunta: "Preciso parar de beber ou usar pra começar a terapia?",
        resposta: "Não. Dá pra começar do jeito que você está, buscando parar ou usar com menos risco.",
      },
      {
        pergunta: "Procurar psiquiatra para alcoolismo leva a internação?",
        resposta: "Não. Internação é exceção, e a maior parte do cuidado acontece sem sair da sua rotina.",
      },
      {
        pergunta: "O psicólogo conta pra alguém sobre o meu uso de drogas?",
        resposta: "Não. Psicólogos e médicos têm sigilo profissional. As exceções são raras e envolvem risco sério à vida.",
      },
      {
        pergunta: "Quanto custa terapia para dependência química na Margem?",
        resposta: "De R$ 60 a R$ 200 por sessão com psicólogo e de R$ 110 a R$ 290 por consulta com psiquiatra.",
      },
    ],
    imagem: false,
    imagemAlt: "",
  },
  {
    slug: "como-saber-se-o-psicologo-e-registrado",
    title: "Como consultar o CRP do psicólogo e o CRM do psiquiatra | Margem",
    descricao:
      "Antes de começar terapia ou consulta online, confira se o profissional é registrado. Leva poucos minutos e é de graça no site dos conselhos.",
    h1: "Como saber se o psicólogo ou o psiquiatra é registrado",
    abertura:
      "Quando o atendimento é barato e online, é normal bater a dúvida: será que essa pessoa é profissional mesmo? Desconfiar é um jeito de se cuidar. A boa notícia é que dá pra conferir sozinho, de graça, em poucos minutos.",
    carrossel: [],
    secoes: [
      {
        titulo: "Como consultar o CRP de um psicólogo",
        blocos: [
          {
            tipo: "lista-numerada",
            itens: [
              "Entrar no Cadastro Nacional de Profissionais de Psicologia, do Conselho Federal de Psicologia, em cadastro.cfp.org.br",
              "Buscar pelo nome completo, pelo número do CRP ou pelo CPF",
              "Conferir se o nome aparece com a inscrição ativa",
            ],
          },
          p("O número do CRP tem a região antes da barra, como CRP 06/12345. Se quiser, dá pra conferir também no site do Conselho Regional do estado onde a pessoa é registrada."),
        ],
      },
      {
        titulo: "Como consultar o CRM de um psiquiatra",
        blocos: [
          {
            tipo: "lista-numerada",
            itens: [
              "Entrar no site do Conselho Federal de Medicina e abrir a Busca por médicos",
              "Buscar pelo nome ou pelo número do CRM e o estado",
              "Conferir se o registro está ativo e se aparece a especialidade em psiquiatria com número de RQE",
            ],
          },
          p("Todo médico precisa de CRM. O RQE é o registro de especialista. Um médico só pode se apresentar como psiquiatra se tiver o RQE em psiquiatria."),
        ],
      },
      {
        titulo: "Psicólogo online precisa de autorização especial?",
        blocos: [
          p("Não mais. Desde 2024, a regra do Conselho Federal de Psicologia acabou com o cadastro separado pra atender online, chamado e-Psi. Hoje basta o psicólogo ter inscrição ativa no CRP."),
        ],
      },
      {
        titulo: "Psiquiatra pode atender online?",
        blocos: [
          p("Pode. O Conselho Federal de Medicina permite a consulta online, inclusive a primeira, e a receita digital tem a mesma validade da de papel."),
        ],
      },
      {
        titulo: "Coach, terapeuta e psicanalista são a mesma coisa que psicólogo?",
        blocos: [
          p("Não. Coach e terapeuta holístico não são profissões de saúde regulamentadas como a psicologia e a medicina. A psicanálise também não é uma profissão regulamentada por conselho próprio: um psicanalista pode ou não ser psicólogo ou médico. Se alguém se apresenta como psicólogo, precisa ter CRP. Se diz que é psiquiatra, precisa ter CRM e RQE."),
        ],
      },
      {
        titulo: "Sinais de alerta",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Não informa o número de registro ou fica desconfortável quando você pergunta",
              "Promete cura rápida ou resultado garantido",
              "Pede que você fale da sua vida num lugar sem privacidade, como grupo de mensagem",
              "Receita remédio sem ser médico",
            ],
          },
        ],
      },
      {
        titulo: "E na Margem?",
        blocos: [
          p("Antes de entrar na Margem, cada profissional passa por aprovação. Mesmo assim, você tem todo o direito de conferir o registro de quem vai te atender, e a gente incentiva isso."),
          {
            tipo: "botoes",
            botoes: [
              { texto: "Ver psicólogos a valor social", href: URL_PROFISSIONAIS.psicologo },
              { texto: "Ver psiquiatras a valor social", href: URL_PROFISSIONAIS.psiquiatra },
            ],
          },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Como saber se um psicólogo é registrado?",
        resposta: "Pelo Cadastro Nacional do Conselho Federal de Psicologia, buscando pelo nome, pelo número do CRP ou pelo CPF.",
      },
      {
        pergunta: "Como consultar o CRM de um médico?",
        resposta: "Na Busca por médicos do site do Conselho Federal de Medicina, pelo nome ou pelo número do CRM.",
      },
      {
        pergunta: "O que é RQE?",
        resposta: "É o registro que mostra que o médico é especialista, como em psiquiatria.",
      },
      {
        pergunta: "Psicólogo precisa de e-Psi pra atender online?",
        resposta: "Não. Desde 2024, basta inscrição ativa no CRP.",
      },
      {
        pergunta: "Coach é psicólogo?",
        resposta: "Não. Coach não é uma profissão de saúde regulamentada.",
      },
    ],
    imagem: false,
    imagemAlt: "",
  },
];

export function buscarGuia(slug: string) {
  return GUIAS.find((guia) => guia.slug === slug) ?? null;
}
