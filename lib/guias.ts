// Conteúdo dos textos do blog (/blog e /blog/[slug]). Os quatro primeiros vieram aprovados do briefing de
// 31/10/2026 e vão exatamente como estão: as regras de copy da seção 7 do CLAUDE.md não valem aqui (H2 em
// pergunta e termos de busca como "dependência química" são de propósito).
//
// Links internos ficam no próprio texto, no formato markdown `[texto](/rota)` (ver TextoComLinks em
// app/blog/[slug]/page.tsx). Este arquivo é lido só no servidor.

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
  // A primeira célula de cada linha é o título da linha.
  | { tipo: "tabela"; legenda: string; colunas: string[]; linhas: string[][] }
  | { tipo: "botoes"; botoes: { texto: string; href: string }[] };

export type SecaoGuia = { titulo: string; blocos: BlocoGuia[] };

export type Guia = {
  slug: string;
  // Datas em AAAA-MM-DD, preenchidas à mão. Trocar `atualizadoEm` só quando o texto mudar de verdade:
  // troca de imagem não conta. Ela aparece na página e vai pro JSON-LD, Open Graph e sitemap.
  publicadoEm: string;
  atualizadoEm: string;
  title: string;
  descricao: string;
  h1: string;
  abertura: string;
  // Quem aparece no carrossel do topo e do fim. Vazio: a página não tem carrossel.
  carrossel: EspecialidadeGuia[];
  // false: o carrossel aparece só no fim da página (o guia do registro é de consulta, e quem lê
  // chega aos profissionais depois de entender como conferir o registro).
  carrosselTopo: boolean;
  secoes: SecaoGuia[];
  perguntas: { pergunta: string; resposta: string }[];
  // A imagem do topo fica em /public/blog/<slug>.webp. Enquanto o arquivo não existir, `imagem` fica
  // false e o espaço aparece só com o fundo neutro. Ao subir a imagem, virar pra true e preencher o alt:
  // ela passa a ser também a imagem de Open Graph da página.
  imagem: boolean;
  imagemAlt: string;
  // Recorte mais aproximado pro card da lista, em /public/blog/<slug>-card.webp (proporção próxima de 2:1).
  // Sem ele, o card usa a imagem do topo.
  imagemCard?: boolean;
};

const p = (texto: string): BlocoGuia => ({ tipo: "paragrafo", texto });

export const GUIAS: Guia[] = [
  {
    slug: "terapia-barata",
    publicadoEm: "2026-10-31",
    atualizadoEm: "2026-11-01",
    title: "Terapia barata: psicólogo online a partir de R$ 60 | Margem",
    descricao:
      "Sessão com psicólogo registrado no CRP, de R$ 60 a 200, a valor social. Você escolhe quanto paga dentro da faixa. Veja como funciona.",
    h1: "Terapia barata com psicólogo registrado: como funciona o valor social",
    abertura:
      "Cuidar da saúde mental não deveria ser luxo. Mesmo assim, o valor das sessões é um dos motivos mais comuns pra muita gente adiar esse cuidado. Não é falta de vontade, é conta que não fecha. Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e quem decide quanto paga dentro dessa faixa é você.",
    carrossel: ["psicologo"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "O que é terapia a valor social?",
        blocos: [
          p("Valor social é um valor reduzido que o profissional escolhe oferecer pra que mais gente consiga fazer terapia. O atendimento não muda: mesma formação, mesmo registro no Conselho Regional de Psicologia, mesmo sigilo. O que muda é quanto você paga."),
        ],
      },
      {
        titulo: "Quanto custa uma sessão de terapia na Margem?",
        blocos: [
          p("De R$ 60 a R$ 200 por sessão. Você olha pro seu mês e escolhe um valor dentro dessa faixa. Se o orçamento apertar mais pra frente, dá pra conversar com o profissional sobre isso."),
          p("Você não precisa explicar por que escolheu esse valor. A Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas, e a faixa de valores é pensada pra isso."),
        ],
      },
      {
        titulo: "Terapia barata é pior?",
        blocos: [
          p("Não por ser mais barata. O que pesa no resultado é a formação de quem atende e o vínculo que vocês constroem. Antes de entrar na Margem, cada profissional passa por uma aprovação. E você pode conferir o registro de qualquer psicólogo sozinho, em poucos minutos. [Ver como conferir o registro de um psicólogo](/blog/como-saber-se-o-psicologo-e-registrado)"),
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
          p("Às vezes faz sentido ter os dois juntos: o psicólogo cuida da conversa e do que está por baixo do que você sente, o psiquiatra avalia se um remédio pode ajudar. A Margem também tem psiquiatras a valor social. [Ver psiquiatras a valor social](/blog/psiquiatra-barato)"),
        ],
      },
      {
        titulo: "E se nem o valor social couber agora?",
        blocos: [
          p("Acontece, e não diz nada sobre você. Pelo SUS, a porta de entrada é a Unidade Básica de Saúde do seu bairro, e o CAPS atende sem precisar de encaminhamento. Muitas faculdades de psicologia também têm clínicas-escola, com atendimento feito por estudantes supervisionados por professores. A fila costuma ser longa, mas é um caminho real. [Ver serviços públicos presenciais e online](/redes-de-apoio)"),
          p("Se você está num momento muito difícil e precisa conversar agora, o CVV atende 24 horas pelo 188."),
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Quanto custa terapia barata na Margem?",
        resposta:
          "De R$ 60 a R$ 200 por sessão, e você escolhe o valor dentro dessa faixa. Não precisa justificar a escolha: a Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas.",
      },
      {
        pergunta: "Psicólogo a valor social tem registro no CRP?",
        resposta:
          "Tem. Valor social muda o valor da sessão, não a formação nem o registro. Você pode conferir o registro de qualquer psicólogo no Cadastro Nacional do Conselho Federal de Psicologia.",
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
    imagem: true,
    imagemAlt: "Psicóloga sorrindo diante de um notebook, em videochamada com um paciente.",
    imagemCard: true,
  },
  {
    slug: "psiquiatra-barato",
    publicadoEm: "2026-10-31",
    atualizadoEm: "2026-11-01",
    title: "Psiquiatra barato: consulta online a partir de R$ 110 | Margem",
    descricao:
      "Consulta com psiquiatra, de R$ 110 a 290, online e com receita digital, a valor social. Veja como funciona e como conferir o CRM do médico.",
    h1: "Psiquiatra barato: consulta com médico registrado no CRM, a valor social",
    abertura:
      "Uma consulta com psiquiatra particular pesa no bolso de muita gente, e a espera pelo SUS pode demorar. No meio disso, muita gente fica sem cuidado justamente quando mais precisa. Na Margem, a consulta com psiquiatra custa de R$ 110 a R$ 290. Você escolhe o valor dentro dessa faixa e não precisa explicar por quê: a Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas.",
    carrossel: ["psiquiatra"],
    carrosselTopo: true,
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
          p("Quando o que você sente está atrapalhando o sono, o trabalho, os estudos ou as relações há semanas. Quando a terapia sozinha não está dando conta. Quando o uso de [álcool ou outras drogas](/blog/psicologo-alcool-e-drogas) ficou difícil de controlar. Ou quando você já toma um remédio e precisa de alguém acompanhando. Não precisa esperar chegar no limite."),
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
          p("Em muitas situações, o melhor resultado vem dos dois juntos: o remédio ajuda a estabilizar, a terapia ajuda a entender e mudar o que está por baixo. [Ver psicólogos a valor social](/blog/terapia-barata)"),
        ],
      },
      {
        titulo: "Como saber se o psiquiatra é especialista?",
        blocos: [
          p("Todo médico tem registro no CRM. Quem é especialista em psiquiatria também tem um número de RQE, que aparece na busca pública do Conselho Federal de Medicina. [Ver como conferir o CRM de um psiquiatra](/blog/como-saber-se-o-psicologo-e-registrado)"),
        ],
      },
      {
        titulo: "Dá pra consultar com psiquiatra pelo SUS?",
        blocos: [
          p("Dá, mas fora da Margem: a Margem não faz parte do SUS nem tem parceria com o governo. No SUS, o caminho começa na Unidade Básica de Saúde: o médico da unidade avalia e, se precisar, encaminha pra psiquiatra ou pro CAPS. O CAPS também atende sem encaminhamento, indo direto na unidade. A espera costuma ser maior. [Ver serviços públicos presenciais e online](/redes-de-apoio)"),
          p("Em crise, procure uma UPA ou ligue para o SAMU no 192. Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Quanto custa uma consulta com psiquiatra barato na Margem?",
        resposta:
          "De R$ 110 a R$ 290 por consulta, e você escolhe o valor dentro dessa faixa. Não precisa justificar a escolha: a Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas.",
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
    imagem: true,
    imagemAlt: "Psiquiatra de jaleco diante de um notebook, em videochamada com um paciente, num consultório.",
    imagemCard: true,
  },
  {
    slug: "psicologo-alcool-e-drogas",
    publicadoEm: "2026-10-31",
    atualizadoEm: "2026-11-01",
    title: "Dependência química e álcool: terapia a valor social | Margem",
    descricao:
      "Psicólogo e psiquiatra pra quem quer mudar a relação com álcool e outras drogas, a valor social e com sigilo. Sem julgamento e sem internação.",
    h1: "Psicólogo e psiquiatra para álcool e drogas, a valor social",
    abertura:
      "Se você está aqui, alguma coisa no seu uso de álcool ou de outras drogas, ou no de alguém que você ama, está pedindo atenção. Isso não faz de ninguém uma pessoa fraca. Muita gente usa pra aliviar algo que dói, cansa ou falta, e funciona por um tempo, até começar a cobrar caro. Na Margem, você encontra psicólogos e psiquiatras a valor social que conversam sobre isso sem julgamento.",
    // O banco não tem campo que diga quem atende álcool e outras drogas (só tags livres), então
    // aparecem todos, como o briefing pede.
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
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
          p("Não. Você pode começar do jeito que está. Pra algumas pessoas, o caminho é parar de vez. Pra outras, é usar menos e com menos risco, o que se chama [redução de danos](/blog/reducao-de-danos). Os dois são caminhos de cuidado, e quem escolhe é você, junto com o profissional."),
          p("Se você quer entender esse caminho por substância, a gente tem textos sobre [como parar de beber](/blog/como-parar-de-beber), [como parar de fumar](/blog/como-parar-de-fumar), [como parar de fumar maconha](/blog/como-parar-de-fumar-maconha) e [como parar de usar cocaína](/blog/como-parar-de-usar-cocaina)."),
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
          p("Você escolhe o valor dentro da faixa e não precisa explicar por quê. A Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas, e a faixa de valores é pensada pra isso."),
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
          p("Alcoólicos Anônimos e Narcóticos Anônimos têm reuniões presenciais e online, sem custo. Pra familiares, existem o Al-Anon e o Nar-Anon. Muita gente combina grupo e terapia. Pelo SUS, o CAPS AD é especializado em álcool e outras drogas e atende sem encaminhamento. [Ver serviços públicos presenciais e online](/redes-de-apoio) [Ver grupos de apoio presenciais e online](/redes-de-apoio?tipo=independentes)"),
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
        resposta:
          "De R$ 60 a R$ 200 por sessão com psicólogo e de R$ 110 a R$ 290 por consulta com psiquiatra. Você escolhe o valor dentro da faixa, sem precisar justificar a escolha: a Margem existe pra que pessoas em situação de vulnerabilidade consigam ser atendidas.",
      },
    ],
    imagem: true,
    imagemAlt: "Psiquiatra de jaleco e psicóloga conversando frente a frente, sentados a uma mesa, num consultório.",
    imagemCard: true,
  },
  {
    slug: "como-saber-se-o-psicologo-e-registrado",
    publicadoEm: "2026-10-31",
    atualizadoEm: "2026-10-31",
    title: "Como consultar o CRP do psicólogo e o CRM do psiquiatra | Margem",
    descricao:
      "Antes de começar terapia ou consulta online, confira se o profissional é registrado. Leva poucos minutos e é de graça no site dos conselhos.",
    h1: "Como saber se o psicólogo ou o psiquiatra é registrado",
    abertura:
      "Quando o atendimento é barato e online, é normal bater a dúvida: será que essa pessoa é profissional mesmo? Desconfiar é um jeito de se cuidar. A boa notícia é que dá pra conferir sozinho, de graça, em poucos minutos.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: false,
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
    imagem: true,
    imagemAlt: "Jovem de cabelo ruivo sentada num sofá, olhando para o celular.",
    imagemCard: true,
  },
  // Textos de redução de danos e de como parar (01/11/2026). Um texto central de redução de danos, ligado
  // aos quatro por substância e de volta. Mesma exceção de copy do briefing, autorizada de novo pelo Vitor.
  {
    slug: "reducao-de-danos",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-01",
    title: "Redução de danos: o que é e como funciona na prática | Margem",
    descricao:
      "Redução de danos é cuidar de quem usa álcool ou outras drogas sem exigir que a pessoa pare. Entenda o que é, para quem serve e como começar.",
    h1: "O que é redução de danos e como ela funciona na prática",
    abertura:
      "Nem toda pessoa que usa álcool ou outras drogas quer ou consegue parar agora. Isso não significa que não exista nada a fazer. Redução de danos é um jeito de cuidar que parte do momento em que você está: o que dá pra mudar hoje pra que o uso traga menos risco pra sua saúde e pra sua vida. Na Margem, você encontra psicólogos e psiquiatras a valor social que conversam sobre isso sem julgamento.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "O que é redução de danos?",
        blocos: [
          p("É um conjunto de práticas, serviços e políticas que buscam diminuir os problemas ligados ao uso de álcool e outras drogas, sem colocar a abstinência como condição pra cuidar de alguém. Esses problemas podem ser de saúde, mas também sociais e legais: perder o trabalho, ficar sem ter onde morar, ter medo de ir ao posto de saúde."),
          p("A lógica é parecida com a do cinto de segurança. Ele não elimina o risco de andar de carro, mas reduz o estrago se algo der errado."),
        ],
      },
      {
        titulo: "Redução de danos incentiva o uso de drogas?",
        blocos: [
          p("Não. Ela parte de um fato: tem gente usando hoje, e essas pessoas merecem informação e cuidado hoje, não só no dia em que pararem. Reduzir risco também não quer dizer que o uso ficou seguro. Risco menor não é risco zero."),
        ],
      },
      {
        titulo: "Redução de danos é o contrário de parar?",
        blocos: [
          p("Não. Parar pode ser um dos caminhos, e a redução de danos não fecha essa porta. Tem gente que começa reduzindo riscos e depois decide diminuir ou parar. Tem gente que muda só algumas coisas e segue assim. Quem decide é você, e essa decisão pode mudar com o tempo."),
        ],
      },
      {
        titulo: "Redução de danos existe no Brasil?",
        blocos: [
          p("Existe. Uma das primeiras iniciativas foi um programa de troca de seringas em Santos, em 1989, durante a epidemia de HIV. Em 2003, a redução de danos entrou na política do Ministério da Saúde para álcool e outras drogas. Hoje ela faz parte das diretrizes dos CAPS AD, os serviços do SUS especializados em álcool e outras drogas."),
        ],
      },
      {
        titulo: "Como praticar redução de danos no dia a dia?",
        blocos: [
          p("Nem tudo cabe em toda situação. Vale olhar pra lista e pensar no que faz sentido pra você:"),
          {
            tipo: "lista",
            itens: [
              "Evitar misturar substâncias, inclusive álcool e remédios",
              "Decidir antes quanto usar, quanto gastar e a hora de parar",
              "Não dirigir depois de usar e combinar a volta antes de sair",
              "Não compartilhar canudo, cachimbo, seringa ou outro material",
              "Comer, beber água e dormir entre um uso e outro",
              "Estar com alguém de confiança que saiba o que fazer numa emergência",
              "Ter camisinha à mão, porque o uso pode mudar as decisões sobre sexo",
              "Fazer teste de HIV e de hepatites, que é gratuito no SUS, se você compartilhou material",
            ],
          },
          p("Se quiser pensar nisso de um jeito mais leve antes de sair de casa, a gente criou um jogo sobre os cuidados do rolê. [Jogar a Mochila do Rolê](/mochila)"),
        ],
      },
      {
        titulo: "Como reduzir danos com álcool, cigarro, maconha e cocaína?",
        blocos: [
          p("Cada substância pede cuidados diferentes, e cada texto abaixo traz os dois caminhos: reduzir riscos e parar."),
          p("Com álcool, ajuda comer antes, intercalar com água e não misturar com remédios. E quem bebe muito há bastante tempo precisa de um cuidado a mais antes de parar de repente. [Ler sobre redução de danos e como parar de beber](/blog/como-parar-de-beber)"),
          p("Com cigarro, não existe quantidade sem risco, mas manter a casa e o carro sem fumaça e usar o tratamento gratuito do SUS são passos concretos. [Ler sobre como parar de fumar](/blog/como-parar-de-fumar)"),
          p("Com maconha, evitar o uso diário, não prender a fumaça e não dirigir depois de usar diminuem riscos importantes. [Ler sobre redução de danos e como parar de fumar maconha](/blog/como-parar-de-fumar-maconha)"),
          p("Com cocaína, os cuidados centrais são não misturar com álcool, não compartilhar canudo e conhecer os sinais de emergência. [Ler sobre redução de danos e como parar de usar cocaína](/blog/como-parar-de-usar-cocaina)"),
        ],
      },
      {
        titulo: "Preciso de um profissional pra fazer redução de danos?",
        blocos: [
          p("Pra começar, não. Mas ter com quem conversar pode ajudar a entender o que o uso está resolvendo na sua vida e quais mudanças cabem na sua realidade. Você não precisa prometer que vai parar pra ser atendido, e o que você conta fica em sigilo. [Entender como funciona o atendimento com psicólogo e psiquiatra](/blog/psicologo-alcool-e-drogas)"),
          p("Fora da Margem, pelo SUS, o CAPS AD atende sem encaminhamento e sem custo. [Ver serviços públicos presenciais e online](/redes-de-apoio)"),
        ],
      },
      {
        titulo: "Quando é emergência?",
        blocos: [
          p("Se alguém está desacordado, com dificuldade pra respirar, tem uma convulsão, dor forte no peito ou fica muito confuso, ligue para o SAMU no 192 e, se puder, diga o que foi usado: isso ajuda no atendimento. Enquanto espera, não deixe a pessoa sozinha. Se ela estiver desacordada e respirando, deixar de lado ajuda a evitar que engasgue com vômito."),
          p("Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "O que é redução de danos?",
        resposta:
          "É um jeito de cuidar de quem usa álcool ou outras drogas que busca diminuir os riscos e os problemas ligados ao uso, sem exigir que a pessoa pare.",
      },
      {
        pergunta: "Redução de danos incentiva o uso de drogas?",
        resposta: "Não. Ela oferece informação e cuidado pra quem já usa. Reduzir risco não quer dizer que o uso ficou seguro.",
      },
      {
        pergunta: "Preciso parar de usar pra receber cuidado?",
        resposta: "Não. Você pode buscar apoio do jeito que está, com o objetivo de parar, de usar menos ou de usar com menos risco.",
      },
      {
        pergunta: "Redução de danos é contra a abstinência?",
        resposta: "Não. Parar é um dos caminhos possíveis, e muita gente chega nele depois de começar reduzindo riscos.",
      },
      {
        pergunta: "Onde encontrar redução de danos pelo SUS?",
        resposta: "No CAPS AD, serviço do SUS especializado em álcool e outras drogas, que atende sem encaminhamento.",
      },
    ],
    imagem: true,
    imagemAlt: "Homem tatuado, de óculos escuros, bebendo água num copo, sentado ao balcão de um bar.",
    imagemCard: true,
  },
  {
    slug: "como-parar-de-beber",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-01",
    title: "Como parar de beber: sinais, riscos e onde buscar apoio | Margem",
    descricao:
      "Quer parar ou diminuir a bebida? Veja quando parar de uma vez pode ser perigoso, o que acontece no corpo e onde encontrar apoio sem julgamento.",
    h1: "Como parar de beber com mais segurança",
    abertura:
      "Se você chegou até aqui, talvez a bebida esteja ocupando mais espaço do que você gostaria. Pode ser o corpo reclamando, a conta, uma briga em casa ou só uma sensação difícil de explicar. Isso não é uma questão de força de vontade, e não existe um único jeito de mudar. Pra algumas pessoas o caminho é parar, pra outras é diminuir. Este texto fala dos dois, e de um cuidado importante antes de começar.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "É perigoso parar de beber de uma vez?",
        blocos: [
          p("Pode ser, principalmente pra quem bebe muito há bastante tempo, todos os dias ou quase todos. Quando o corpo está acostumado com o álcool, parar de uma hora pra outra pode provocar abstinência, e em alguns casos ela é grave."),
          p("Se você costuma sentir tremor, suor, enjoo ou ansiedade quando fica sem beber, vale falar com um médico antes de parar. Com acompanhamento, isso fica mais seguro. Pode ser um psiquiatra, a Unidade Básica de Saúde ou o CAPS AD. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
        ],
      },
      {
        titulo: "Quais são os sintomas de abstinência de álcool?",
        blocos: [
          p("Costumam começar de 6 a 12 horas depois da última dose e, na maioria das vezes, duram de 3 a 7 dias. Alguns podem levar mais tempo pra passar. Os mais comuns são:"),
          {
            tipo: "lista",
            itens: [
              "Tremor, principalmente nas mãos",
              "Suor, enjoo e vômito",
              "Ansiedade e irritação",
              "Dificuldade pra dormir",
              "Coração acelerado",
            ],
          },
          p("Convulsão, confusão, ver ou ouvir coisas que não estão ali, febre e agitação intensa são sinais de emergência. Nesses casos, ligue para o SAMU no 192 ou procure uma UPA ou um pronto-socorro."),
        ],
      },
      {
        titulo: "Como saber se o meu jeito de beber virou um problema?",
        blocos: [
          p("Alcoolismo é como muita gente chama o que os profissionais de saúde chamam de transtorno por uso de álcool. Mais útil do que procurar um rótulo é olhar pra alguns sinais:"),
          {
            tipo: "lista",
            itens: [
              "Você bebe mais ou por mais tempo do que tinha planejado",
              "Já tentou diminuir e não conseguiu",
              "Precisa beber mais pra sentir o mesmo efeito",
              "Sente mal-estar quando fica sem beber",
              "A bebida atrapalha o sono, o trabalho ou as suas relações",
              "Continua bebendo mesmo com esses prejuízos",
            ],
          },
          p("Nada disso define quem você é. Mas, se você se reconheceu em algum ponto, pode valer conversar com um profissional."),
        ],
      },
      {
        titulo: "Dá pra diminuir a bebida em vez de parar?",
        blocos: [
          p("Pra muita gente, dá. Dependendo da sua saúde e de como foram as tentativas anteriores, um profissional pode sugerir parar em vez de diminuir. E, se você tem sintomas de abstinência, mesmo uma redução grande e repentina pede orientação médica."),
        ],
      },
      {
        titulo: "O que ajuda a beber menos ou parar?",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Anotar por alguns dias quanto você bebe, no caderno ou no celular",
              "Decidir antes em que dias vai beber e quanto",
              "Intercalar com água ou refrigerante, ou escolher bebidas com menos álcool",
              "Contar pra alguém de confiança o que você está tentando fazer",
              "Evitar, por um tempo, lugares e horários em que a vontade costuma aparecer",
              "Colocar outra coisa na hora que era da bebida",
            ],
          },
          p("A vontade costuma vir em ondas. Pode ajudar esperar um pouco, sair de onde você está e reparar no que veio antes: fome, cansaço, uma briga, um dia ruim. Se uma tentativa não der certo, isso não diz nada sobre você. Também é informação sobre o que precisa de mais apoio."),
        ],
      },
      {
        titulo: "Existe remédio pra parar de beber?",
        blocos: [
          p("Existe. Alguns remédios ajudam a reduzir a vontade de beber ou a evitar uma recaída, e o médico avalia se eles fazem sentido no seu caso. Tomar por conta própria pode ser perigoso."),
        ],
      },
      {
        titulo: "E se eu não quero parar de beber agora?",
        blocos: [
          p("Você ainda pode diminuir riscos. É o que se chama de [redução de danos](/blog/reducao-de-danos). Alguns cuidados:"),
          {
            tipo: "lista",
            itens: [
              "Comer antes e enquanto bebe",
              "Intercalar com água",
              "Não misturar com remédios, principalmente calmantes e remédios pra dormir",
              "Não dirigir e combinar a volta antes de sair",
              "Definir antes um limite de doses e de dinheiro",
              "Ficar perto de gente de confiança",
            ],
          },
          p("Beber junto com outras drogas aumenta os riscos. [Ler sobre os riscos de misturar álcool e cocaína](/blog/como-parar-de-usar-cocaina)"),
          p("Se alguém bebeu muito e não acorda, vomita sem parar ou respira devagar, ligue para o SAMU no 192. Enquanto espera, não deixe a pessoa sozinha e, se ela estiver desacordada e respirando, deixe de lado pra evitar que engasgue com vômito."),
        ],
      },
      {
        titulo: "E se quem bebe é alguém que eu amo?",
        blocos: [
          p("Você não controla a decisão da outra pessoa, mas pode dizer o que está vendo, sem acusação, e mostrar os caminhos de apoio. O Al-Anon reúne familiares e amigos de pessoas que bebem, sem custo. E uma terapia pra você também é cuidado, mesmo que a outra pessoa não queira buscar ajuda agora."),
          p("Nunca coloque remédio escondido na comida ou na bebida de alguém. Além de desrespeitar a pessoa, pode ser perigoso."),
        ],
      },
      {
        titulo: "Onde encontrar apoio pra parar de beber?",
        blocos: [
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Procurar esse cuidado não leva a internação, e o que você conta fica em sigilo. [Entender como funciona o atendimento pra álcool e outras drogas](/blog/psicologo-alcool-e-drogas)"),
          p("Fora da Margem, o CAPS AD atende pelo SUS sem encaminhamento, e os Alcoólicos Anônimos têm reuniões presenciais e online, sem custo. Muita gente combina mais de um desses caminhos. [Ver serviços públicos presenciais e online](/redes-de-apoio) [Ver grupos de apoio presenciais e online](/redes-de-apoio?tipo=independentes)"),
          p("Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "É perigoso parar de beber de uma vez?",
        resposta:
          "Pode ser, principalmente pra quem bebe muito há bastante tempo. Se você sente tremor, suor, enjoo ou ansiedade quando fica sem beber, vale falar com um médico antes de parar.",
      },
      {
        pergunta: "Quanto tempo dura a abstinência de álcool?",
        resposta:
          "Os sintomas costumam começar de 6 a 12 horas depois da última dose e, na maioria das vezes, duram de 3 a 7 dias. Alguns podem levar mais tempo pra passar.",
      },
      {
        pergunta: "Quais sintomas de abstinência de álcool são emergência?",
        resposta:
          "Convulsão, confusão, ver ou ouvir coisas que não estão ali, febre e agitação intensa. Nesses casos, ligue para o SAMU no 192 ou procure uma UPA ou um pronto-socorro.",
      },
      {
        pergunta: "Existe remédio pra parar de beber?",
        resposta: "Existe. Alguns ajudam a reduzir a vontade de beber ou a evitar uma recaída, e quem avalia é o médico.",
      },
      {
        pergunta: "Onde conseguir ajuda pra parar de beber sem pagar?",
        resposta: "No CAPS AD, que atende pelo SUS sem encaminhamento, e nos Alcoólicos Anônimos, que têm reuniões presenciais e online.",
      },
    ],
    imagem: true,
    imagemAlt: "Garrafa de cerveja vazia sendo solta por uma mão sobre uma lixeira.",
    imagemCard: true,
  },
  {
    slug: "como-parar-de-fumar",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-01",
    title: "Como parar de fumar: abstinência, SUS e apoio | Margem",
    descricao:
      "Parar de fumar pode levar mais de uma tentativa. Veja o que sentir nos primeiros dias, como lidar com a vontade e como buscar tratamento gratuito.",
    h1: "Como parar de fumar: o que esperar e onde buscar apoio",
    abertura:
      "Cigarro raramente é só cigarro. Ele está na pausa do trabalho, no café, depois da comida, na hora do nervoso. Por isso parar costuma ser difícil, e muita gente precisa de mais de uma tentativa. Isso não é falta de força de vontade: a nicotina causa dependência, e o hábito está amarrado à sua rotina. Existe tratamento gratuito no SUS e profissionais que podem ajudar, então você não precisa passar por isso sem apoio.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "Qual é a melhor forma de parar de fumar?",
        blocos: [
          p("O Instituto Nacional de Câncer (INCA) apresenta dois caminhos. O primeiro, e mais recomendado, é a parada imediata: você escolhe uma data e, a partir dela, deixa de fumar. Vale afastar os cigarros e planejar algo pra se distrair nesse dia."),
          p("O segundo é a parada gradual: ir reduzindo a quantidade de cigarros por dia ou atrasando o horário do primeiro. Nesse caso, a orientação é não levar mais de duas semanas no processo."),
        ],
      },
      {
        titulo: "O que acontece quando eu paro de fumar?",
        blocos: [
          p("Os sintomas de abstinência de nicotina costumam começar nas primeiras horas, ficam mais fortes nos primeiros dias e tendem a melhorar em algumas semanas. A intensidade varia de pessoa pra pessoa. A vontade de fumar pode voltar mesmo depois disso. Os sintomas mais comuns são:"),
          {
            tipo: "lista",
            itens: [
              "Vontade forte de fumar",
              "Irritação e ansiedade",
              "Dificuldade de concentração",
              "Mudanças no sono",
              "Dor de cabeça, tontura e tosse",
            ],
          },
          p("Se vier uma tristeza que não passa ou se você já trata depressão ou ansiedade, vale avisar o profissional que acompanha você."),
        ],
      },
      {
        titulo: "Como lidar com a vontade de fumar?",
        blocos: [
          p("A vontade forte costuma durar poucos minutos. Nem sempre é fácil atravessar esses minutos, e pode ajudar ter um plano:"),
          {
            tipo: "lista",
            itens: [
              "Esperar alguns minutos antes de decidir",
              "Beber água e respirar fundo",
              "Sair do lugar em que você costuma fumar",
              "Deixar as mãos e a boca ocupadas, com um chiclete sem açúcar, por exemplo",
              "Mudar por um tempo os rituais do cigarro, como o café ou a pausa",
              "Chamar alguém pra conversar",
            ],
          },
          p("Se o cigarro costuma vir junto com a bebida, cuidar das duas coisas ao mesmo tempo pode ajudar. [Ler sobre como parar de beber](/blog/como-parar-de-beber)"),
        ],
      },
      {
        titulo: "O SUS tem tratamento pra parar de fumar?",
        blocos: [
          p("Tem, e é gratuito. O programa é coordenado pelo INCA e inclui consultas, grupos de apoio e acompanhamento. Quando a equipe indica, também oferece adesivo, goma e pastilha de nicotina e bupropiona, um remédio que ajuda a reduzir os sintomas."),
          p("A porta de entrada é a Unidade Básica de Saúde. O Disque Saúde, no 136, pode ajudar a descobrir onde o tratamento é oferecido na sua cidade. [Ver serviços públicos presenciais e online](/redes-de-apoio)"),
        ],
      },
      {
        titulo: "Cigarro eletrônico ajuda a parar de fumar?",
        blocos: [
          p("O cigarro eletrônico não faz parte do tratamento oferecido pelo SUS, e a venda é proibida no Brasil pela Anvisa. Muitos têm nicotina, então a dependência pode continuar. Se você usa vape ou quer parar com ele, pode falar disso na consulta do mesmo jeito."),
        ],
      },
      {
        titulo: "Terapia ajuda a parar de fumar?",
        blocos: [
          p("Pode ajudar, principalmente quando o cigarro é o jeito de lidar com ansiedade, cansaço ou tristeza. A terapia ajuda a entender o que o cigarro resolve na sua vida e a encontrar outras formas de lidar com isso. [Ver como funciona a terapia a valor social](/blog/terapia-barata)"),
          p("Um psiquiatra também pode avaliar se um remédio faz sentido no seu caso. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
        ],
      },
      {
        titulo: "E se eu não quero parar de fumar agora?",
        blocos: [
          p("Não existe quantidade de cigarro sem risco, mas ainda dá pra cuidar de você e de quem está por perto. É o que se chama de [redução de danos](/blog/reducao-de-danos):"),
          {
            tipo: "lista",
            itens: [
              "Manter a casa e o carro sem fumaça",
              "Fumar menos pode ser um passo, mesmo sem ser o último",
              "Não trocar por cigarro de palha ou narguilé achando que é mais seguro",
              "Fazer os exames de rotina e contar pro médico que você fuma",
              "Conversar com um profissional sobre adesivo ou goma de nicotina",
            ],
          },
          p("Se você também fuma maconha com tabaco, a nicotina entra nessa conta. [Ler sobre como parar de fumar maconha](/blog/como-parar-de-fumar-maconha)"),
        ],
      },
      {
        titulo: "Voltei a fumar. Perdi tudo?",
        blocos: [
          p("Não. Muita gente tenta mais de uma vez. Voltar a fumar não apaga o que você aprendeu na tentativa anterior. Reparar no que veio antes da recaída pode mostrar onde você vai precisar de mais apoio da próxima vez, se você decidir tentar de novo."),
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Qual é a melhor forma de parar de fumar?",
        resposta:
          "O INCA apresenta como primeira opção a parada imediata, com uma data escolhida. A parada gradual também é um caminho, sem levar mais de duas semanas no processo.",
      },
      {
        pergunta: "Quanto tempo dura a abstinência de cigarro?",
        resposta:
          "Os sintomas costumam ser mais fortes nos primeiros dias e tendem a melhorar em algumas semanas. A intensidade varia de pessoa pra pessoa, e a vontade de fumar pode voltar depois disso.",
      },
      {
        pergunta: "Dá pra parar de fumar pelo SUS?",
        resposta:
          "Dá, de graça. A porta de entrada é a Unidade Básica de Saúde, e o tratamento pode incluir grupos, consultas, adesivo, goma e pastilha de nicotina e bupropiona.",
      },
      {
        pergunta: "Cigarro eletrônico ajuda a parar de fumar?",
        resposta: "Ele não faz parte do tratamento oferecido pelo SUS, e a venda é proibida no Brasil pela Anvisa. Muitos têm nicotina, então a dependência pode continuar.",
      },
    ],
    imagem: true,
    imagemAlt: "Mão soltando uma bituca de cigarro sobre uma lixeira.",
    imagemCard: true,
  },
  {
    slug: "como-parar-de-fumar-maconha",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-01",
    title: "Como parar de fumar maconha: abstinência e apoio | Margem",
    descricao:
      "Quer parar ou diminuir a maconha? Veja quanto tempo dura a abstinência, o que ajuda no sono e na irritação e onde encontrar apoio sem julgamento.",
    h1: "Como parar de fumar maconha: abstinência, dicas e apoio",
    abertura:
      "Tem gente que usa maconha sem grande problema, e tem gente que percebe que ela começou a ocupar lugar demais: o dia só engrena depois de fumar, o sono depende dela, ou o que era escolha virou automático. Perceber isso não precisa vir com culpa. Aqui a gente fala do que costuma acontecer quando a pessoa para, do que ajuda nesse período e dos cuidados pra quem não quer parar agora.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "Maconha causa dependência?",
        blocos: [
          p("Pode causar, mas nem toda pessoa que usa vai ter esse problema. Alguns sinais de que vale prestar atenção:"),
          {
            tipo: "lista",
            itens: [
              "Você usa mais do que tinha planejado",
              "Já tentou diminuir e não conseguiu",
              "Precisa de mais pra sentir o mesmo efeito",
              "Fica mal quando não usa",
              "O uso atrapalha o trabalho, os estudos ou as suas relações",
            ],
          },
        ],
      },
      {
        titulo: "Existe abstinência de maconha? Quanto tempo dura?",
        blocos: [
          p("Existe. Cerca de metade das pessoas que fazem uso regular relatam sintomas ao parar ou diminuir muito. Eles costumam começar de 24 a 48 horas depois do último uso e ficam mais fortes entre o segundo e o sexto dia. Quando o uso era intenso, podem durar de duas a três semanas ou mais, e o sono pode levar várias semanas pra voltar ao normal. Os mais comuns são:"),
          {
            tipo: "lista",
            itens: [
              "Irritação e raiva",
              "Ansiedade",
              "Insônia e sonhos intensos",
              "Tristeza",
              "Falta de apetite",
            ],
          },
          p("Em menos casos, também aparecem dor de cabeça, suor, calafrio e dor de barriga. Se a tristeza pesar muito, ou se você tem outro problema de saúde mental ou usa outras substâncias, vale buscar acompanhamento."),
        ],
      },
      {
        titulo: "É melhor parar de vez ou diminuir aos poucos?",
        blocos: [
          p("Depende de quanto você usa e do que quer mudar. Tem quem prefira escolher uma data e parar. Tem quem comece reduzindo os dias de uso, deixando de fumar de manhã ou empurrando o primeiro uso pra mais tarde. Parar de repente depois de um uso intenso pode trazer sintomas mais fortes, e um profissional pode ajudar a planejar."),
          p("Se você fuma maconha com tabaco, os sintomas da falta de nicotina podem aparecer junto. [Ler sobre como parar de fumar](/blog/como-parar-de-fumar)"),
          p("Se você usa cannabis com prescrição, vale conversar com quem prescreveu antes de mudar o tratamento."),
        ],
      },
      {
        titulo: "O que ajuda quando a vontade aparece?",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Guardar longe ou se desfazer do que você usa pra fumar",
              "Manter um horário regular pra dormir e diminuir o café no fim do dia",
              "Se mexer: caminhar também ajuda a passar a irritação",
              "Fazer refeições menores, se a fome estiver baixa",
              "Evitar, por um tempo, os momentos e as companhias ligados ao uso",
              "Contar pra alguém de confiança o que você está tentando fazer",
            ],
          },
          p("Trocar a maconha por bebida ou por remédio pra dormir sem orientação pode criar outro problema. [Ler sobre como parar de beber](/blog/como-parar-de-beber)"),
        ],
      },
      {
        titulo: "Terapia ajuda a parar de fumar maconha? Existe remédio?",
        blocos: [
          p("A conversa e a orientação são o primeiro caminho recomendado. Não existe um remédio aprovado especificamente pra abstinência de maconha, mas um psiquiatra pode avaliar sintomas como ansiedade e insônia. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
          p("A terapia ajuda a entender o que a maconha resolve na sua vida e a encontrar outras formas de lidar com isso. [Ver como funciona a terapia a valor social](/blog/terapia-barata)"),
        ],
      },
      {
        titulo: "E se eu não quero parar de fumar maconha agora?",
        blocos: [
          p("Você ainda pode diminuir riscos. É o que se chama de [redução de danos](/blog/reducao-de-danos). Alguns cuidados:"),
          {
            tipo: "lista",
            itens: [
              "Evitar o uso diário ou quase diário",
              "Não prender a fumaça nem tragar fundo",
              "Não dirigir depois de usar, e esperar pelo menos seis horas",
              "Evitar misturar com álcool ou tabaco",
              "Não usar maconha sintética, que pode ser muito mais perigosa",
              "Adiar o uso o máximo possível na adolescência, quando os riscos são maiores",
              "Evitar o uso na gravidez ou se você ou sua família têm histórico de psicose",
            ],
          },
          p("Maconha também pode provocar pânico ou paranoia. Costuma ajudar ir pra um lugar calmo com alguém de confiança. Se vier confusão intensa, dor no peito ou se os sintomas não passarem, ligue para o SAMU no 192."),
        ],
      },
      {
        titulo: "Onde encontrar apoio pra parar de fumar maconha?",
        blocos: [
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Procurar esse cuidado não leva a internação, e o que você conta fica em sigilo. [Entender como funciona o atendimento pra álcool e outras drogas](/blog/psicologo-alcool-e-drogas)"),
          p("Fora da Margem, o CAPS AD atende pelo SUS sem encaminhamento, e os Narcóticos Anônimos têm reuniões presenciais e online, sem custo. Pra familiares, existe o Nar-Anon. [Ver serviços públicos presenciais e online](/redes-de-apoio) [Ver grupos de apoio presenciais e online](/redes-de-apoio?tipo=independentes)"),
          p("Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Quanto tempo dura a abstinência de maconha?",
        resposta:
          "Os sintomas costumam começar de 24 a 48 horas depois do último uso e ficam mais fortes entre o segundo e o sexto dia. Com uso intenso, podem durar de duas a três semanas ou mais.",
      },
      {
        pergunta: "Quais são os sintomas de abstinência de maconha?",
        resposta: "Os mais comuns são irritação, ansiedade, insônia, sonhos intensos, tristeza e falta de apetite.",
      },
      {
        pergunta: "Existe remédio pra parar de fumar maconha?",
        resposta:
          "Não existe um remédio aprovado especificamente pra abstinência de maconha, mas um psiquiatra pode avaliar sintomas como ansiedade e insônia.",
      },
      {
        pergunta: "Dá pra usar maconha com menos risco?",
        resposta:
          "Dá pra diminuir alguns riscos: evitar o uso diário, não prender a fumaça, não misturar com álcool ou tabaco e não dirigir depois de usar. Risco menor não é risco zero.",
      },
    ],
    imagem: true,
    imagemAlt: "Mão soltando um baseado sobre uma lixeira.",
    imagemCard: true,
  },
  {
    slug: "como-parar-de-usar-cocaina",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-01",
    title: "Como parar de usar cocaína: abstinência e apoio | Margem",
    descricao:
      "Quer parar ou diminuir o uso de cocaína? Entenda a abstinência, a fissura, os sinais de emergência e onde encontrar apoio com sigilo e sem julgamento.",
    h1: "Como parar de usar cocaína: abstinência, fissura e apoio",
    abertura:
      "Muita gente que usa cocaína se reconhece em algum destes momentos: prometeu que seria só hoje, gastou mais do que podia, virou a noite e passou o dia seguinte se sentindo mal, ou começou a ter medo do próprio uso. Nada disso faz de você uma pessoa fraca. Tem a ver com o efeito da substância e também com o que está acontecendo na sua vida. Existem caminhos pra quem quer parar e cuidados pra quem ainda não quer.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "Como parar de usar cocaína?",
        blocos: [
          p("Não existe uma receita única. Costuma ajudar ter apoio de alguém da área da saúde, entender o que leva ao uso e mudar o que torna o acesso mais fácil. Alguns passos que muita gente usa:"),
          {
            tipo: "lista",
            itens: [
              "Apagar o contato de quem vende",
              "Andar com menos dinheiro e deixar o cartão com alguém de confiança nos dias mais difíceis",
              "Reparar nos gatilhos, como dia de pagamento, sexta à noite, bebida ou um dia ruim",
              "Ter um plano pra esses momentos: com quem falar, pra onde ir",
              "Contar pra uma pessoa de confiança o que você está tentando fazer",
            ],
          },
          p("Se a cocaína costuma vir junto com a bebida, cuidar das duas coisas pode ajudar. Se você bebe muito há bastante tempo, vale falar com um médico antes de parar o álcool de repente. [Ler sobre como parar de beber](/blog/como-parar-de-beber)"),
        ],
      },
      {
        titulo: "Quais são os sintomas de abstinência de cocaína?",
        blocos: [
          p("Eles aparecem pouco depois do último uso e podem durar de várias semanas a alguns meses. Os mais comuns são:"),
          {
            tipo: "lista",
            itens: [
              "Tristeza e desânimo",
              "Cansaço e sono",
              "Dificuldade de concentração",
              "Mais fome",
              "Vontade intensa de usar",
            ],
          },
          p("A queda no humor merece atenção. Se a tristeza ficar pesada ou vierem pensamentos de morte, vale buscar um profissional o quanto antes. Se precisa conversar agora, o CVV atende 24 horas pelo 188. Em risco imediato, ligue para o SAMU no 192."),
        ],
      },
      {
        titulo: "Como lidar com a fissura?",
        blocos: [
          p("Fissura é aquela vontade muito forte de usar. Ela pode aparecer mesmo depois de bastante tempo sem usar e não significa que você fracassou. Na hora em que ela vem, pode ajudar:"),
          {
            tipo: "lista",
            itens: [
              "Sair do lugar em que você está",
              "Ligar pra alguém que saiba o que você está tentando fazer",
              "Comer, beber água e ocupar a cabeça até a onda baixar",
              "Ficar longe de bebida nesse momento, se o álcool costuma puxar o uso",
              "Não ficar com dinheiro à mão",
            ],
          },
          p("Se você voltar a usar, isso não apaga o que você já construiu. Pode ser uma forma de entender onde você precisa de mais apoio."),
        ],
      },
      {
        titulo: "Existe remédio pra parar de usar cocaína?",
        blocos: [
          p("Até aqui, não existe um remédio aprovado especificamente pra isso, e vale desconfiar de quem promete cura rápida. Um psiquiatra pode tratar o que vem junto, como depressão, ansiedade e insônia. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
          p("A terapia ajuda a entender o que o uso está resolvendo na sua vida e a montar outros jeitos de lidar com isso. [Ver como funciona a terapia a valor social](/blog/terapia-barata)"),
        ],
      },
      {
        titulo: "Preciso me internar pra parar de usar cocaína?",
        blocos: [
          p("Na maior parte das vezes, não. A internação costuma ser indicada em situações mais graves de saúde, física ou mental, ou quando o cuidado sem internação já foi tentado várias vezes sem funcionar. E conversar com psicólogo ou psiquiatra sobre o seu uso não leva a internação. O que você conta fica em sigilo. [Entender como funciona o atendimento pra álcool e outras drogas](/blog/psicologo-alcool-e-drogas)"),
        ],
      },
      {
        titulo: "E se eu não quero parar de usar cocaína agora?",
        blocos: [
          p("Você ainda pode diminuir riscos. É o que se chama de [redução de danos](/blog/reducao-de-danos). Risco menor não é risco zero, mas estes cuidados fazem diferença:"),
          {
            tipo: "lista",
            itens: [
              "Não misturar com álcool: juntos, eles formam uma substância mais tóxica pro coração e pro fígado, que fica mais tempo no corpo",
              "Não misturar com remédios ou outras drogas",
              "Não compartilhar canudo ou nota, que podem transmitir hepatite B, hepatite C e HIV",
              "Usar uma superfície limpa, longe de chaves, celular ou banheiro sujo",
              "Definir antes um limite de quantidade e de dinheiro",
              "Começar com pouco e esperar, porque a força e a mistura da cocaína variam muito",
              "Fazer pausas, beber água e descansar",
              "Lavar o nariz depois de usar",
              "Estar com alguém de confiança que possa ajudar numa emergência",
              "Não dirigir depois de usar",
              "Ter ainda mais cuidado se você tem algum problema no coração",
            ],
          },
          p("Se você compartilhou material, vale fazer os testes de HIV e de hepatites, gratuitos no SUS. Se o uso é de crack ou injetável, ter o próprio cachimbo ou a própria seringa também reduz riscos, e o CAPS AD pode ajudar. [Ver serviços públicos presenciais e online](/redes-de-apoio)"),
        ],
      },
      {
        titulo: "Quais são os sinais de emergência?",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Dor ou aperto no peito",
              "Coração muito acelerado",
              "Corpo muito quente",
              "Falta de ar",
              "Convulsão ou desmaio",
              "Fala enrolada ou fraqueza de um lado do corpo",
              "Pânico ou paranoia muito fortes",
            ],
          },
          p("Nesses casos, ligue para o SAMU no 192 e, se puder, diga o que foi usado: isso ajuda no atendimento. Enquanto espera, não deixe a pessoa sozinha. Se ela estiver desacordada e respirando, deixar de lado ajuda a evitar que engasgue com vômito."),
        ],
      },
      {
        titulo: "Onde encontrar apoio pra parar de usar cocaína?",
        blocos: [
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Tudo online."),
          p("Fora da Margem, o CAPS AD atende pelo SUS sem encaminhamento, e os Narcóticos Anônimos têm reuniões presenciais e online, sem custo. Se quem usa é alguém que você ama, o Nar-Anon reúne familiares, e você também pode buscar uma terapia pra você. [Ver serviços públicos presenciais e online](/redes-de-apoio) [Ver grupos de apoio presenciais e online](/redes-de-apoio?tipo=independentes)"),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Quanto tempo dura a abstinência de cocaína?",
        resposta: "Os sintomas aparecem pouco depois do último uso e podem durar de várias semanas a alguns meses.",
      },
      {
        pergunta: "Existe remédio pra parar de usar cocaína?",
        resposta:
          "Até aqui, não existe um remédio aprovado especificamente pra isso. Um psiquiatra pode tratar o que vem junto, como depressão, ansiedade e insônia, e a terapia ajuda a lidar com o que está por trás do uso.",
      },
      {
        pergunta: "Preciso me internar pra parar de usar cocaína?",
        resposta:
          "Na maior parte das vezes, não. A internação costuma ser indicada em situações mais graves de saúde ou quando o cuidado sem internação já foi tentado várias vezes sem funcionar.",
      },
      {
        pergunta: "Por que é perigoso misturar cocaína e álcool?",
        resposta: "Juntos, eles formam uma substância mais tóxica pro coração e pro fígado, que fica mais tempo no corpo.",
      },
      {
        pergunta: "Quais são os sinais de emergência no uso de cocaína?",
        resposta:
          "Dor no peito, coração muito acelerado, corpo muito quente, falta de ar, convulsão, desmaio, fala enrolada, fraqueza de um lado do corpo, pânico ou paranoia muito fortes. Nesses casos, ligue para o SAMU no 192.",
      },
    ],
    imagem: true,
    imagemAlt: "Mão soltando um saquinho com pó branco sobre uma lixeira.",
    imagemCard: true,
  },
  // Texto sobre a Lei de Drogas (03/11/2026). Mesma exceção de copy, autorizada pelo Vitor pra SEO. Conferido
  // na tese do Tema 506 e na lei, sem revisão de advogado. Se o CNJ regulamentar ou a PEC 45 andar, atualizar.
  {
    slug: "lei-de-drogas",
    publicadoEm: "2026-11-03",
    atualizadoEm: "2026-11-03",
    title: "Lei de Drogas: artigo 28, 40 g de maconha e STF | Margem",
    descricao:
      "Entenda a Lei de Drogas: artigos 28 e 33, o limite de 40 g de maconha definido pelo STF, seus direitos numa abordagem e onde encontrar apoio sem julgamento.",
    h1: "Lei de Drogas: o que diz o artigo 28, o que mudou com o STF e onde buscar apoio",
    abertura:
      "Muita gente procura a Lei de Drogas com medo: depois de uma abordagem, por causa de alguém que ama, ou pra saber se o próprio uso pode dar problema com a polícia. A lei é confusa, e a decisão do Supremo Tribunal Federal (STF) sobre maconha mudou parte dela, não tudo. Aqui a gente explica o que vale hoje e onde encontrar apoio. Este texto informa, mas não substitui a orientação de um advogado ou da Defensoria Pública sobre o seu caso.",
    carrossel: ["psicologo", "psiquiatra"],
    // No topo, logo depois de falar da lei, "Profissionais que podem ajudar" parecia oferecer advogado.
    carrosselTopo: false,
    secoes: [
      {
        titulo: "O que é a Lei de Drogas?",
        blocos: [
          p("É a Lei nº 11.343, de 2006. Ela reúne as regras sobre prevenção, cuidado e repressão ao tráfico no Brasil. Os dois artigos mais procurados são o 28, sobre uso pessoal, e o 33, sobre tráfico."),
          p("O que conta como droga pra essa lei é definido por uma lista do Ministério da Saúde, a Portaria SVS/MS nº 344, de 1998. Álcool e tabaco ficam fora dessa regra, mesmo podendo causar dependência e pedir cuidado."),
        ],
      },
      {
        titulo: "O que diz o artigo 28 da Lei de Drogas?",
        blocos: [
          p("O artigo 28 trata de quem compra, guarda, transporta ou leva droga consigo pra consumo pessoal, e também de quem cultiva uma pequena quantidade pra uso próprio. A lei não prevê prisão nesses casos. As medidas previstas no texto são:"),
          {
            tipo: "lista",
            itens: [
              "Advertência sobre os efeitos da droga",
              "Prestação de serviços à comunidade",
              "Comparecimento a programa ou curso educativo",
            ],
          },
          p("Pra decidir se a droga era pra uso pessoal, o juiz olha a substância e a quantidade, o local e as condições da apreensão, as circunstâncias sociais e pessoais e os antecedentes da pessoa."),
          p("O texto da lei nunca definiu uma quantidade. Na prática, isso deixou a diferença entre uso e tráfico nas mãos da polícia e da Justiça, e diferentes estudos mostram que o peso caiu mais sobre pessoas negras e pobres."),
        ],
      },
      {
        titulo: "O que diz o artigo 33 da Lei de Drogas?",
        blocos: [
          p("O artigo 33 trata do tráfico, e vai além de vender: inclui também oferecer, transportar, guardar ou entregar droga a alguém, mesmo de graça. A pena é de 5 a 15 anos de reclusão, mais multa. O tráfico é equiparado a crime hediondo, o que torna mais duras as regras de cumprimento da pena."),
          p("Existe uma exceção importante, chamada tráfico privilegiado. A pena pode cair de um sexto a dois terços quando a pessoa é primária, tem bons antecedentes, não se dedica a atividades criminosas e não integra organização criminosa. O STF definiu, na Súmula Vinculante 63, que esse caso não é crime hediondo."),
          p("Desde março de 2026, a Lei nº 15.358 também prevê pena em dobro quando o crime é cometido por integrante de organização criminosa ultraviolenta, grupo paramilitar ou milícia privada."),
        ],
      },
      {
        titulo: "O que o STF decidiu sobre o porte de maconha?",
        blocos: [
          p("Em junho de 2024, no julgamento conhecido como Tema 506 (Recurso Extraordinário 635.659), o STF decidiu que ter maconha pra consumo pessoal não é crime. Em fevereiro de 2025, o tribunal rejeitou por unanimidade os recursos contra essa decisão. O que vale hoje:"),
          {
            tipo: "lista",
            itens: [
              "Comprar, guardar, transportar ou levar maconha pra consumo pessoal não é infração penal",
              "Continua sendo proibido: a droga é apreendida e a conduta segue ilícita, só que fora da área criminal",
              "A polícia apreende a maconha e notifica a pessoa pra comparecer à Justiça",
              "O juiz pode aplicar advertência e curso educativo, sem nenhum efeito criminal. Serviços à comunidade ficam de fora",
              "O STF mandou o Conselho Nacional de Justiça (CNJ) regulamentar esse procedimento. Até isso acontecer, os casos ficam nos Juizados Especiais Criminais, sem efeito penal na sentença",
            ],
          },
          p("A decisão não legalizou a maconha. Vender continua sendo tráfico, e fumar em local público continua proibido."),
        ],
      },
      {
        titulo: "Quantas gramas de maconha é considerado uso pessoal?",
        blocos: [
          p("Até 40 gramas ou seis plantas fêmeas. Quem está nesse limite é presumido usuário, e a regra vale até o Congresso aprovar uma lei sobre isso. Só que esse número não funciona como garantia, e também não define tráfico sozinho."),
          p("Com menos de 40 gramas, a polícia ainda pode prender por tráfico se houver elementos que indiquem venda, como:"),
          {
            tipo: "lista",
            itens: [
              "A forma como a droga está embalada",
              "As circunstâncias da apreensão",
              "A variedade de substâncias",
              "Balança",
              "Registros de vendas",
              "Celular com contatos de pessoas que compram ou vendem",
            ],
          },
          p("Nesses casos, o delegado precisa justificar em detalhes, sem critérios subjetivos arbitrários, e o juiz avalia essas razões na audiência de custódia."),
          p("Com mais de 40 gramas, o juiz ainda pode concluir que era uso pessoal, se houver prova suficiente. Ao julgar os recursos, o relator do caso, ministro Gilmar Mendes, reforçou que a quantidade é só um dos critérios."),
        ],
      },
      {
        titulo: "A decisão do STF vale pra cocaína e outras drogas?",
        blocos: [
          p("Não. Ela vale só pra maconha. Ao julgar os recursos, o relator também afirmou que o entendimento não se estende a haxixe nem a skunk."),
          p("Pra cocaína, crack, MDMA e as outras substâncias da lista, continua valendo o artigo 28 como está na lei. Ter essas drogas pra uso pessoal segue sendo crime, mas sem pena de prisão e sem prisão em flagrante: a pessoa vai ao juiz ou assina um compromisso de comparecer, e é feito um termo circunstanciado, o registro da ocorrência. Pra essas drogas não existe quantidade definida, e o juiz decide pelos critérios do artigo 28."),
        ],
      },
      {
        titulo: "Qual a diferença entre usuário e traficante na Lei de Drogas?",
        blocos: [
          p("A diferença está na finalidade, não só na quantidade: o artigo 28 trata de quem tem droga pra consumo pessoal, e o artigo 33, de quem vende ou fornece. Esta tabela resume como cada situação é tratada hoje:"),
          {
            tipo: "tabela",
            legenda: "Como a lei trata a maconha pra uso pessoal, as outras drogas pra uso pessoal e o tráfico",
            colunas: ["Ponto", "Maconha pra uso pessoal", "Outras drogas pra uso pessoal", "Tráfico"],
            linhas: [
              ["Artigo da lei", "Artigo 28, com a decisão do STF", "Artigo 28", "Artigo 33"],
              ["É crime?", "Não. É um ilícito fora da área criminal", "Sim, de menor potencial ofensivo", "Sim. É equiparado a hediondo, menos no tráfico privilegiado"],
              ["Quantidade", "Até 40 g ou 6 plantas fêmeas é presumido uso pessoal, mas essa presunção pode ser afastada", "Não há quantidade definida. O juiz decide pelos critérios do artigo 28", "Não há quantidade definida. Conta o que indica venda ou fornecimento"],
              ["O que a lei prevê", "Advertência e curso educativo, sem efeito criminal", "Advertência, serviços à comunidade ou curso educativo", "De 5 a 15 anos de reclusão e multa"],
              ["O que a polícia faz", "Apreende a droga e notifica a pessoa pra comparecer à Justiça", "Faz o termo circunstanciado, sem prisão em flagrante", "Pode prender em flagrante e abrir inquérito"],
              ["Ficha", "Sem registro de antecedentes criminais", "Não gera reincidência, segundo o STJ, e há decisões afastando os maus antecedentes", "Gera antecedentes criminais e pode gerar reincidência"],
            ],
          },
          p("A tabela mostra a regra geral. A polícia pode entender uma situação de um jeito e a Justiça decidir de outro, e cada caso depende das circunstâncias. Responder a um processo não impede de buscar cuidado."),
        ],
      },
      {
        titulo: "O que acontece se eu for pego com maconha?",
        blocos: [
          p("Se a polícia entender que é uso pessoal, ela apreende a maconha e notifica você pra comparecer à Justiça. Ainda assim, a polícia pode levar a pessoa à delegacia, principalmente se suspeitar de tráfico, e a ocorrência pode ficar registrada. A aplicação da decisão também ainda varia de um lugar pra outro."),
          p("Se a polícia entender que há indícios de venda, pode haver prisão em flagrante por tráfico, e aí valem as regras do artigo 33. Nesse caso, ter um advogado ou defensor desde o começo faz muita diferença."),
        ],
      },
      {
        titulo: "Quais são os meus direitos numa abordagem policial?",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "A revista sem mandado depende de fundada suspeita, baseada em algo concreto. O STJ tem decidido que nervosismo isolado ou denúncia anônima sem outros elementos não bastam",
              "Você tem direito de ficar em silêncio e não precisa produzir prova contra si",
              "Ninguém pode sofrer tortura nem tratamento desumano ou degradante",
              "Se houver prisão, você tem direito a advogado ou defensor, a avisar a família e a saber quem está prendendo",
            ],
          },
          p("Se você achar que seus direitos não foram respeitados, costuma ser mais seguro questionar depois do que durante a abordagem. Vale anotar local, horário e o que conseguir identificar dos policiais e da viatura. Em alguns casos, a Justiça anula provas de uma revista ilegal."),
          p("Se você não tem como pagar advogado, a Defensoria Pública do seu estado atende de graça quem não tem condições."),
        ],
      },
      {
        titulo: "Porte de drogas deixa ficha suja?",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Maconha pra uso pessoal: o STF afastou o registro na ficha de antecedentes criminais",
              "Outras drogas pra uso pessoal: o Superior Tribunal de Justiça (STJ) entende que a condenação pelo artigo 28 não gera reincidência, e há decisões afastando também os maus antecedentes. O processo, porém, continua existindo",
              "Tráfico: a condenação gera antecedentes criminais e pode gerar reincidência",
            ],
          },
        ],
      },
      {
        titulo: "O que é a PEC das Drogas e em que pé ela está?",
        blocos: [
          p("É a Proposta de Emenda à Constituição nº 45, de 2023, apresentada pelo senador Rodrigo Pacheco durante o julgamento do STF. Ela quer colocar na Constituição que a posse e o porte de droga sem autorização são crime, em qualquer quantidade, mantendo a distinção entre traficante e usuário."),
          p("O Senado aprovou o texto em abril de 2024, e a Comissão de Constituição e Justiça da Câmara aprovou a admissibilidade em junho do mesmo ano. A partir daí, a proposta parou. Em novembro de 2026, a ficha da Câmara mostra que ela ainda aguarda a formação da comissão especial. Enquanto não for aprovada pelos deputados e promulgada, a PEC não muda nada, e segue valendo a decisão do STF."),
        ],
      },
      {
        titulo: "Contar sobre o uso pra um profissional pode me complicar?",
        blocos: [
          p("Psicólogos e médicos têm sigilo profissional garantido pelos seus códigos de ética. Eles não avisam polícia, família nem trabalho sobre o que você conta. As exceções são raras e envolvem risco sério à vida. Conversar com esses profissionais também não leva a internação. [Entender como funciona o atendimento pra álcool e outras drogas](/blog/psicologo-alcool-e-drogas)"),
        ],
      },
      {
        titulo: "Preciso parar de usar pra procurar ajuda?",
        blocos: [
          p("Não. Nem toda pessoa que usa quer ou precisa parar, e dá pra buscar cuidado do jeito que você está. Pra algumas pessoas, o caminho é parar de vez. Pra outras, é usar menos e com menos risco. [Ler sobre redução de danos](/blog/reducao-de-danos)"),
          p("Vale prestar atenção se você precisa de mais pra sentir o mesmo efeito, já tentou diminuir e não conseguiu, ou o uso começou a atrapalhar o trabalho, os estudos ou as suas relações. [Ler sobre como parar de fumar maconha](/blog/como-parar-de-fumar-maconha) [Ler sobre como parar de usar cocaína](/blog/como-parar-de-usar-cocaina)"),
        ],
      },
      {
        titulo: "Onde encontrar apoio?",
        blocos: [
          p("Na Margem, você escolhe o valor dentro da faixa e não precisa explicar por quê. A sessão com psicólogo registrado no CRP custa de R$ 60 a R$ 200, e a consulta online com psiquiatra registrado no CRM, de R$ 110 a R$ 290. [Ver como conferir o registro de um profissional](/blog/como-saber-se-o-psicologo-e-registrado)"),
          p("Fora da Margem, o CAPS AD atende pelo SUS sem encaminhamento, e os Narcóticos Anônimos e Alcoólicos Anônimos têm reuniões presenciais e online, sem custo. Pra familiares, existe o Nar-Anon. [Ver serviços públicos presenciais e online](/redes-de-apoio) [Ver grupos de apoio presenciais e online](/redes-de-apoio?tipo=independentes)"),
          p("Se precisa conversar agora, o CVV atende 24 horas pelo 188. Numa emergência de saúde, o SAMU atende no 192."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Porte de maconha é crime?",
        resposta:
          "Pra consumo pessoal, não. Em 2024, o STF decidiu que não é infração penal, mas continua proibido: a droga é apreendida e o juiz pode aplicar advertência e curso educativo, sem efeito criminal. Vender continua sendo tráfico.",
      },
      {
        pergunta: "Qual a diferença entre usuário e traficante?",
        resposta:
          "A diferença está na finalidade: o artigo 28 trata de quem tem droga pra consumo pessoal, e o artigo 33, de quem vende ou fornece, mesmo de graça. Pra maconha, até 40 gramas ou seis plantas fêmeas é presumido uso pessoal, mas essa presunção pode ser afastada.",
      },
      {
        pergunta: "Posso ser preso com menos de 40 gramas de maconha?",
        resposta:
          "Pode, se houver elementos que indiquem venda, como balança, registros de vendas ou a forma de embalar. Nesse caso, o delegado precisa justificar em detalhes, e o juiz avalia as razões na audiência de custódia.",
      },
      {
        pergunta: "Mais de 40 gramas de maconha é tráfico?",
        resposta:
          "Não automaticamente. O juiz pode concluir que era uso pessoal, se houver prova suficiente. A quantidade é só um dos critérios.",
      },
      {
        pergunta: "Fumar maconha na rua é permitido?",
        resposta: "Não. A decisão do STF não legalizou a maconha, e fumar em local público continua proibido.",
      },
      {
        pergunta: "A decisão do STF vale pra cocaína?",
        resposta:
          "Não, ela vale só pra maconha. Ter cocaína pra uso pessoal segue sendo crime pelo artigo 28, mas sem pena de prisão.",
      },
      {
        pergunta: "Porte de drogas gera antecedentes criminais?",
        resposta:
          "Pra maconha de uso pessoal, o STF afastou o registro na ficha de antecedentes. Pra outras drogas, o STJ entende que a condenação pelo artigo 28 não gera reincidência, e há decisões afastando também os maus antecedentes. Já a condenação por tráfico gera antecedentes criminais.",
      },
      {
        pergunta: "Tenho uma condenação antiga por maconha. A decisão do STF me ajuda?",
        resposta:
          "Pode ajudar. O STF não limitou a decisão no tempo e mandou fazer mutirões pra revisar prisões fora dos novos parâmetros. Cada caso depende do processo, e a Defensoria Pública pode orientar.",
      },
      {
        pergunta: "A PEC das Drogas já está valendo?",
        resposta:
          "Não. O Senado aprovou o texto em 2024, mas em novembro de 2026 ele ainda aguardava a formação de uma comissão especial na Câmara.",
      },
      {
        pergunta: "Preciso parar de usar pra fazer terapia na Margem?",
        resposta:
          "Não. Você pode começar do jeito que está e, junto com o profissional, escolher o caminho: parar de vez ou usar menos e com menos risco.",
      },
    ],
    // Sem imagem por enquanto. Ao subir /public/blog/lei-de-drogas.webp, virar pra true e preencher o alt.
    imagem: false,
    imagemAlt: "",
  },
];

export function caminhoDaImagem(guia: Guia) {
  return `/blog/${guia.slug}.webp`;
}

export function caminhoDaImagemDoCard(guia: Guia) {
  return guia.imagemCard ? `/blog/${guia.slug}-card.webp` : caminhoDaImagem(guia);
}

// De AAAA-MM-DD pra DD/MM/AAAA, sem passar por Date: assim o fuso do servidor não muda o dia.
export function formatarDataDoGuia(data: string) {
  return data.split("-").reverse().join("/");
}

export function buscarGuia(slug: string) {
  return GUIAS.find((guia) => guia.slug === slug) ?? null;
}
