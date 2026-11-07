// Conteúdo dos textos do blog (/blog e /blog/[slug]). Os quatro primeiros vieram aprovados do briefing de
// 31/10/2026 e ganharam acréscimos na revisão de 06/11/2026: as regras de copy da seção 7 do CLAUDE.md não
// valem aqui (H2 em pergunta e termos de busca como "dependência química" são de propósito).
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
  // Os quatro primeiros guias foram revisados em 06/11/2026 com a pesquisa dos 10 primeiros do Google
  // (docs/pesquisas-blog/<slug>.md). Títulos em pergunta.
  {
    slug: "terapia-barata",
    publicadoEm: "2026-10-31",
    atualizadoEm: "2026-11-06",
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
        titulo: "Como pedir valor social a um psicólogo?",
        blocos: [
          p("Fora da Margem, dá pra perguntar direto, já no primeiro contato: muitos psicólogos têm algumas vagas com valor reduzido. Diga quanto cabe no seu mês, sem precisar se justificar. Se não houver vaga, vale pedir indicação de colegas. Na Margem, o valor social já vem combinado: você escolhe dentro da faixa."),
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
          p("Acontece, e não diz nada sobre você. Pelo SUS, a porta de entrada é a Unidade Básica de Saúde do seu bairro, e o CAPS atende sem precisar de encaminhamento. Muitas faculdades de psicologia também têm clínicas-escola, com atendimento feito por estudantes supervisionados por professores. Algumas atendem online. A fila costuma ser longa, mas é um caminho real. Projetos sociais e ONGs da sua cidade também podem ter atendimento gratuito. [Ver serviços públicos presenciais e online](/redes-de-apoio)"),
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
      {
        pergunta: "Existe terapia online grátis?",
        resposta:
          "Algumas clínicas-escola de faculdades de psicologia e alguns projetos sociais atendem online sem custo, geralmente com fila. O CVV, no 188, não é terapia, mas atende 24 horas quem precisa conversar.",
      },
      {
        pergunta: "Como pedir valor social a um psicólogo?",
        resposta:
          "Pergunte direto no primeiro contato e diga quanto cabe no seu mês, sem precisar se justificar. Na Margem, o valor social já vem combinado.",
      },
      {
        pergunta: "Preciso comprovar renda pra pagar valor social na Margem?",
        resposta: "Não. Você escolhe o valor dentro da faixa, de R$ 60 a R$ 200, sem precisar comprovar nada nem explicar por quê.",
      },
      {
        pergunta: "Como saber se uma terapia barata é confiável?",
        resposta:
          "Confira o registro do psicólogo no Cadastro Nacional do Conselho Federal de Psicologia, pergunte o que está incluído, como a duração da sessão e se é por vídeo, e desconfie de quem promete resultado garantido.",
      },
    ],
    imagem: true,
    imagemAlt: "Psicóloga sorrindo diante de um notebook, em videochamada com um paciente.",
    imagemCard: true,
  },
  {
    slug: "psiquiatra-barato",
    publicadoEm: "2026-10-31",
    atualizadoEm: "2026-11-06",
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
        titulo: "Quando a consulta online não é o melhor caminho?",
        blocos: [
          p("Em crise, com risco à vida ou quando alguém não está conseguindo se proteger, o caminho é o atendimento de urgência: UPA, pronto-socorro ou SAMU no 192. A consulta online também tem limite quando o médico precisa de um exame físico. Nesses casos, ele pode pedir um encontro presencial ou exames."),
        ],
      },
      {
        titulo: "Psiquiatra online pode passar receita?",
        blocos: [
          p("Pode. A receita digital tem a mesma validade da receita em papel e vem com assinatura eletrônica. Pra alguns remédios controlados, vale confirmar com a farmácia como ela recebe a receita antes de ir."),
        ],
      },
      {
        titulo: "Psiquiatra online pode dar atestado?",
        blocos: [
          p("Pode, quando há indicação médica. Atestado, laudo e receita emitidos na consulta online têm a mesma validade dos emitidos na presencial. Quem decide se cabe um atestado é o médico, a partir do que avaliou na consulta."),
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
        pergunta: "Quanto custa em média um psiquiatra?",
        resposta:
          "No particular, o valor varia muito de cidade pra cidade e costuma ficar acima da faixa da Margem, que vai de R$ 110 a R$ 290. Pelo SUS, a consulta é gratuita, com espera maior.",
      },
      {
        pergunta: "Onde achar psiquiatra gratuito?",
        resposta:
          "Pelo SUS: na Unidade Básica de Saúde, que encaminha quando precisa, ou direto no CAPS, que atende sem encaminhamento. Em crise, procure uma UPA ou ligue para o SAMU no 192.",
      },
      {
        pergunta: "Tem psiquiatra online gratuito?",
        resposta:
          "O atendimento gratuito com psiquiatra é pelo SUS, em geral presencial, na Unidade Básica de Saúde ou no CAPS. Na Margem, a consulta online custa de R$ 110 a R$ 290, e você escolhe o valor dentro da faixa.",
      },
      {
        pergunta: "Atestado de psiquiatra online é válido?",
        resposta: "É. Atestado, laudo e receita da consulta online têm a mesma validade dos da presencial, quando há indicação médica.",
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
  // Revisado em 06/11/2026 com a pesquisa dos 10 primeiros do Google pra "psicólogo para dependência química"
  // (docs/pesquisas-blog/psicologo-alcool-e-drogas.md). O h1 passou a ter o termo da busca. Títulos em pergunta.
  {
    slug: "psicologo-alcool-e-drogas",
    publicadoEm: "2026-10-31",
    atualizadoEm: "2026-11-06",
    title: "Dependência química e álcool: terapia a valor social | Margem",
    descricao:
      "Psicólogo e psiquiatra pra quem quer mudar a relação com álcool e outras drogas, a valor social e com sigilo. Sem julgamento e sem internação.",
    h1: "Psicólogo e psiquiatra para dependência química, álcool e drogas",
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
          p("Na prática, o psicólogo ajuda a reconhecer o que costuma vir antes da vontade de usar, a montar um plano pra atravessar a fissura, a lidar com ansiedade, tristeza e conflitos sem depender da substância e a pensar no que fazer se acontecer uma recaída."),
        ],
      },
      {
        titulo: "Qual a melhor terapia pra dependência química?",
        blocos: [
          p("Não existe uma única melhor pra todo mundo. Algumas abordagens têm bastante pesquisa no cuidado com álcool e outras drogas:"),
          {
            tipo: "lista",
            itens: [
              "Terapia cognitivo-comportamental (TCC), que trabalha os pensamentos e as situações ligadas ao uso",
              "Entrevista motivacional, que ajuda a pessoa a encontrar os próprios motivos pra mudar, sem pressão",
              "Prevenção de recaída, que prepara pros momentos de maior risco",
              "Terapia familiar, que inclui quem convive com a pessoa",
            ],
          },
          p("Muitos profissionais combinam essas abordagens. Tão importante quanto a técnica é você se sentir à vontade com quem atende. Se não rolar com um profissional, tudo bem procurar outro."),
        ],
      },
      {
        titulo: "Terapeuta em dependência química é psicólogo?",
        blocos: [
          p("Nem sempre. \"Terapeuta em dependência química\" é nome de curso, não de profissão regulamentada. Quem se apresenta como psicólogo precisa ter registro no CRP, e quem se apresenta como psiquiatra precisa ter CRM e RQE. [Ver como conferir o registro de um psicólogo](/blog/como-saber-se-o-psicologo-e-registrado)"),
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
          p("Se a pessoa não quer ajuda agora, cobrança e ultimato costumam afastar. Costuma funcionar melhor dizer o que você está vendo, sem acusar, deixar claro que você está por perto e mostrar os caminhos quando ela estiver pronta. Grupos como Al-Anon e Nar-Anon reúnem familiares que passam pela mesma coisa."),
        ],
      },
      {
        titulo: "Dá pra internar alguém contra a vontade?",
        blocos: [
          p("A lei brasileira permite a internação involuntária só em situações específicas: um médico precisa avaliar e autorizar, ela só acontece quando outros tratamentos não deram conta e dura o tempo necessário pra desintoxicação. A internação precisa ser comunicada ao Ministério Público."),
          p("Na maior parte das vezes, o cuidado funciona melhor quando a pessoa participa da decisão. Antes de pensar em internação, o CAPS AD pode ajudar a família a entender o momento e os caminhos possíveis, e uma terapia pra você ajuda a atravessar esse período."),
        ],
      },
      {
        titulo: "E se acontecer uma recaída?",
        blocos: [
          p("Recaída não quer dizer que o tratamento falhou nem que você voltou à estaca zero. Ela acontece com muita gente e pode mostrar o que precisa de mais apoio. Contar pro profissional que te acompanha ajuda a ajustar o caminho."),
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
        pergunta: "Qual a melhor terapia para dependência química?",
        resposta:
          "Não existe uma única melhor pra todo mundo. Terapia cognitivo-comportamental, entrevista motivacional e prevenção de recaída têm bastante pesquisa, e muitos profissionais combinam essas abordagens.",
      },
      {
        pergunta: "Qual o melhor profissional para tratar o alcoolismo?",
        resposta:
          "Psicólogo e psiquiatra costumam trabalhar juntos: o psicólogo conduz a terapia, e o psiquiatra avalia se um remédio ajuda e acompanha a abstinência quando ela pode ser perigosa.",
      },
      {
        pergunta: "Terapeuta em dependência química é psicólogo?",
        resposta: "Nem sempre. É nome de curso, não de profissão regulamentada. Psicólogo precisa ter registro no CRP.",
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
    atualizadoEm: "2026-11-07",
    title: "Como consultar o CRP do psicólogo e o CRM do psiquiatra | Margem",
    descricao:
      "Não: psicólogo tem CRP, e CRM é de médico, como o psiquiatra. Veja como conferir os dois registros de graça e como saber se estão ativos.",
    h1: "Como saber se o psicólogo ou o psiquiatra é registrado",
    abertura:
      "Quando o atendimento é barato e online, é normal bater a dúvida: será que essa pessoa é profissional mesmo? Desconfiar é um jeito de se cuidar. A boa notícia é que dá pra conferir sozinho, de graça, em poucos minutos.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: false,
    secoes: [
      {
        titulo: "Psicólogo tem CRM?",
        blocos: [
          p("Não. Psicólogo tem CRP, o registro no Conselho Regional de Psicologia. CRM é o registro dos médicos, como o psiquiatra."),
        ],
      },
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
          p("Atender como psicólogo sem registro ativo no CRP é exercício ilegal da profissão. Se isso acontecer, dá pra denunciar ao Conselho Regional de Psicologia do estado."),
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
      {
        pergunta: "Psicólogo tem CRP ou CRM?",
        resposta: "CRP, o registro no Conselho Regional de Psicologia. CRM é o registro dos médicos, como o psiquiatra.",
      },
      {
        pergunta: "Como é o número do CRP?",
        resposta:
          "Tem duas partes separadas por uma barra: o número da região do conselho, como 06 em São Paulo, e o número de inscrição do psicólogo. Por exemplo, CRP 06/12345.",
      },
      {
        pergunta: "Psicólogo precisa ter carimbo?",
        resposta:
          "Não precisa ser carimbo. Todo documento assinado por psicólogo precisa trazer o nome completo e o número do CRP, que podem vir impressos ou digitados. Em documento digital, vale a assinatura eletrônica.",
      },
      {
        pergunta: "O que fazer se o psicólogo não tem registro?",
        resposta:
          "Atender como psicólogo sem registro ativo é exercício ilegal da profissão. Dá pra denunciar ao Conselho Regional de Psicologia do estado.",
      },
    ],
    imagem: true,
    imagemAlt: "Jovem de cabelo ruivo sentada num sofá, olhando para o celular.",
    imagemCard: true,
  },
  // Textos de redução de danos e de como parar (01/11/2026). Um texto central de redução de danos, ligado
  // aos quatro por substância e de volta. Mesma exceção de copy do briefing, autorizada de novo pelo Vitor.
  // Revisado em 06/11/2026 com a pesquisa dos 10 primeiros do Google (docs/pesquisas-blog/reducao-de-danos.md).
  {
    slug: "reducao-de-danos",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-06",
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
        titulo: "Quais são os princípios da redução de danos?",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Começar de onde a pessoa está, e não de onde alguém acha que ela deveria estar",
              "Cuidar sem julgamento e sem exigir que a pessoa pare",
              "Reconhecer que quem decide sobre o próprio uso é a pessoa",
              "Valorizar qualquer mudança que diminua riscos, mesmo pequena",
              "Lembrar que moradia, trabalho, preconceito e acesso à saúde também pesam nos danos",
              "Ouvir quem usa na hora de pensar serviços e políticas",
            ],
          },
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
        titulo: "O que faz um redutor de danos?",
        blocos: [
          p("Redutores de danos são pessoas que vão até onde quem usa está: na rua, em festas, em comunidades. Muitas vezes trabalham com o CAPS AD ou com o Consultório na Rua. Elas conversam sem julgamento, levam informação e materiais como camisinha e ajudam a pessoa a chegar aos serviços de saúde quando ela quiser. Algumas têm experiência própria com o uso, o que ajuda a criar confiança."),
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
      {
        pergunta: "O que faz um redutor de danos?",
        resposta:
          "Vai até onde quem usa está, conversa sem julgamento, leva informação e materiais como camisinha e ajuda a pessoa a chegar aos serviços de saúde quando ela quiser.",
      },
      {
        pergunta: "Quais são os princípios da redução de danos?",
        resposta:
          "Começar de onde a pessoa está, cuidar sem julgamento e sem exigir que ela pare, respeitar a decisão de quem usa e valorizar qualquer mudança que diminua riscos.",
      },
    ],
    imagem: true,
    imagemAlt: "Homem tatuado, de óculos escuros, bebendo água num copo, sentado ao balcão de um bar.",
    imagemCard: true,
  },
  // Revisado em 06/11/2026 com a pesquisa dos 10 primeiros do Google (docs/pesquisas-blog/como-parar-de-beber.md).
  // Títulos em pergunta.
  {
    slug: "como-parar-de-beber",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-06",
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
          p("Costumam começar de 6 a 12 horas depois da última dose, ficam mais fortes entre o primeiro e o terceiro dia e, na maioria das vezes, duram de 3 a 7 dias. Alguns podem levar mais tempo pra passar. Os mais comuns são:"),
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
          p("A Organização Mundial da Saúde considera que não existe quantidade de álcool sem risco. Isso não quer dizer que só parar vale a pena: cada dose a menos já diminui o risco."),
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
              "Tirar a bebida de casa, ou deixar só o que você decidiu beber",
              "Ter à mão uma bebida sem álcool de que você goste. Pra algumas pessoas a cerveja sem álcool ajuda, pra outras lembra demais a bebida: vale reparar como é com você",
              "Colocar outra coisa na hora que era da bebida",
            ],
          },
          p("A vontade costuma vir em ondas. Pode ajudar esperar um pouco, sair de onde você está e reparar no que veio antes: fome, cansaço, uma briga, um dia ruim. Se uma tentativa não der certo, isso não diz nada sobre você. Também é informação sobre o que precisa de mais apoio."),
        ],
      },
      {
        titulo: "Dá pra parar de beber sozinho?",
        blocos: [
          p("Muita gente consegue diminuir ou parar sem tratamento. Mas sozinho não precisa querer dizer sem ninguém: contar pra uma pessoa de confiança, ir a um grupo ou conversar com um profissional costuma deixar o caminho mais leve."),
          p("Tem uma exceção importante: se você sente tremor, suor, enjoo ou ansiedade quando fica sem beber, parar sem acompanhamento pode ser perigoso. Nesse caso, fale com um médico antes."),
        ],
      },
      {
        titulo: "O que acontece quando eu paro de beber?",
        blocos: [
          p("Nos primeiros dias, quem bebia com frequência pode ter os sintomas de abstinência descritos acima. O sono costuma ficar bagunçado no começo e melhorar depois de algumas semanas. A ansiedade e o humor também podem oscilar nesse período."),
          p("Com algumas semanas sem beber, muita gente nota mais disposição, sono melhor e mais dinheiro sobrando no fim do mês. O fígado começa a se recuperar, principalmente se ainda não tem uma lesão avançada, e a pressão pode baixar. Cada corpo tem o seu tempo, e um mês sem beber já pode mostrar bastante coisa sobre a sua relação com a bebida."),
        ],
      },
      {
        titulo: "Existe remédio pra parar de beber?",
        blocos: [
          p("Existe. Naltrexona, acamprosato e dissulfiram são alguns dos remédios usados pra reduzir a vontade de beber ou ajudar a evitar uma recaída. Todos pedem receita, e o médico avalia se algum faz sentido no seu caso. Tomar por conta própria pode ser perigoso: o dissulfiram, por exemplo, provoca uma reação forte se a pessoa beber."),
          p("Remédio caseiro, bicarbonato e chás não têm evidência de que ajudem a parar de beber. Desconfie de produto que promete resultado em poucos dias."),
        ],
      },
      {
        titulo: "Existe pó pra parar de beber? Dá pra dar escondido?",
        blocos: [
          p("O pó que muita gente procura costuma ser o dissulfiram. Ele não tira a vontade de beber: faz a pessoa passar muito mal se beber depois de tomar. Os sintomas incluem vermelhidão no rosto, enjoo, vômito, coração acelerado, queda de pressão e falta de ar, e a reação pode ser grave."),
          p("Por isso ele só pode ser usado com a pessoa sabendo e com acompanhamento médico. Dar escondido, na comida ou na bebida, coloca a vida dela em risco. Produtos vendidos sem receita que prometem tirar a vontade de beber também não têm evidência."),
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
        pergunta: "Existe pó pra parar de beber?",
        resposta:
          "O pó que muita gente procura costuma ser o dissulfiram, que faz a pessoa passar muito mal se beber. Ele só pode ser usado com a pessoa sabendo e com acompanhamento médico. Dar escondido coloca a vida dela em risco.",
      },
      {
        pergunta: "Qual o pior dia da abstinência de álcool?",
        resposta:
          "Os sintomas costumam ficar mais fortes entre o primeiro e o terceiro dia depois da última dose. Convulsão, confusão e ver coisas que não estão ali são sinais de emergência: ligue para o SAMU no 192.",
      },
      {
        pergunta: "Remédio caseiro ajuda a parar de beber?",
        resposta: "Não há evidência de que remédio caseiro, bicarbonato ou chá ajudem a parar de beber. Os remédios que ajudam pedem receita e acompanhamento médico.",
      },
      {
        pergunta: "Dá pra parar de beber sozinho?",
        resposta:
          "Muita gente consegue, e ter apoio costuma deixar o caminho mais leve. Se você sente tremor, suor, enjoo ou ansiedade quando fica sem beber, fale com um médico antes de parar.",
      },
      {
        pergunta: "O que acontece depois de 30 dias sem beber?",
        resposta:
          "Muita gente nota sono melhor, mais disposição e o humor mais estável. O fígado começa a se recuperar, principalmente se ainda não tem uma lesão avançada. Cada corpo tem o seu tempo.",
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
  // Revisado em 06/11/2026 com a pesquisa dos 10 primeiros do Google (docs/pesquisas-blog/como-parar-de-fumar.md).
  // Títulos em pergunta.
  {
    slug: "como-parar-de-fumar",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-06",
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
          p("Uma revisão de dezenas de estudos encontrou resultados parecidos entre quem parou de uma vez e quem reduziu antes de parar. Então vale escolher o caminho que parece mais possível pra você agora."),
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
        titulo: "Quais são os benefícios de parar de fumar?",
        blocos: [
          p("O corpo começa a responder rápido, mesmo enquanto a vontade ainda incomoda:"),
          {
            tipo: "lista",
            itens: [
              "Em 20 minutos, a pressão e os batimentos começam a voltar ao normal",
              "Em cerca de 12 horas, o monóxido de carbono no sangue volta ao nível normal",
              "Em 2 ou 3 dias, o olfato e o paladar começam a melhorar",
              "Em algumas semanas, a respiração fica mais fácil e a circulação melhora",
              "Em 1 ano, o risco de infarto cai pela metade",
            ],
          },
          p("Os primeiros três dias costumam ser os mais difíceis pra vontade, justamente quando o corpo já está melhorando. Também sobra dinheiro: vale fazer a conta do que ia pro cigarro."),
        ],
      },
      {
        titulo: "Como lidar com a vontade de fumar?",
        blocos: [
          p("A vontade forte costuma durar poucos minutos. Com algumas semanas sem fumar, ela aparece cada vez menos, mas pode voltar por meses em situações ligadas ao cigarro, como uma festa ou um dia de nervoso. Nem sempre é fácil atravessar esses minutos, e pode ajudar ter um plano:"),
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
        titulo: "Existe remédio pra parar de fumar?",
        blocos: [
          p("Existe. Os mais usados são:"),
          {
            tipo: "lista",
            itens: [
              "Reposição de nicotina, em adesivo, goma ou pastilha, que diminui os sintomas da falta do cigarro",
              "Bupropiona, que ajuda na vontade de fumar e no humor",
              "Vareniclina, que diminui a vontade e o prazer de fumar",
            ],
          },
          p("Bupropiona e vareniclina precisam de receita. A reposição de nicotina é vendida em farmácia, mas com orientação de um profissional fica mais fácil acertar a dose e o tempo de uso. Remédio caseiro não tem evidência de que ajude a parar de fumar."),
        ],
      },
      {
        titulo: "Cigarro eletrônico ajuda a parar de fumar?",
        blocos: [
          p("O cigarro eletrônico não faz parte do tratamento oferecido pelo SUS, e a venda é proibida no Brasil pela Anvisa. Muitos têm nicotina, então a dependência pode continuar. Se você usa vape ou quer parar com ele, pode falar disso na consulta do mesmo jeito."),
          p("Pra parar com o pod valem os mesmos passos do cigarro: escolher uma data, não deixar o aparelho e o refil à mão e ter um plano pra vontade. Muitos pods têm bastante nicotina, então a abstinência pode ser forte nos primeiros dias, e o tratamento do SUS também serve pra quem usa vape."),
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
        titulo: "Como ajudar alguém a parar de fumar?",
        blocos: [
          p("A decisão é da outra pessoa, mas apoio faz diferença. Pergunte como você pode ajudar, não fume perto dela, tenha paciência com a irritação dos primeiros dias e não trate uma recaída como fracasso. Contar onde tem tratamento gratuito também ajuda."),
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
      {
        pergunta: "Existe remédio pra parar de fumar?",
        resposta:
          "Existe. Os mais usados são a reposição de nicotina, em adesivo, goma ou pastilha, a bupropiona e a vareniclina. Bupropiona e vareniclina precisam de receita, e o SUS oferece reposição de nicotina e bupropiona de graça.",
      },
      {
        pergunta: "O que acontece em 3 dias sem fumar?",
        resposta:
          "O olfato e o paladar começam a melhorar, e o monóxido de carbono no sangue já voltou ao nível normal. Também costumam ser os dias em que a vontade de fumar está mais forte.",
      },
      {
        pergunta: "Quanto tempo leva pra passar a vontade de fumar?",
        resposta:
          "Cada vontade forte costuma durar poucos minutos. Com algumas semanas sem fumar, ela aparece cada vez menos, mas pode voltar por meses em situações ligadas ao cigarro.",
      },
      {
        pergunta: "Como parar de usar pod?",
        resposta:
          "Com os mesmos passos do cigarro: escolher uma data, não deixar o aparelho à mão e ter um plano pra vontade. O tratamento gratuito do SUS também serve pra quem usa vape.",
      },
    ],
    imagem: true,
    imagemAlt: "Mão soltando uma bituca de cigarro sobre uma lixeira.",
    imagemCard: true,
  },
  // Revisado em 06/11/2026 com a pesquisa dos 10 primeiros do Google (docs/pesquisas-blog/como-parar-de-fumar-maconha.md).
  // Títulos em pergunta.
  {
    slug: "como-parar-de-fumar-maconha",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-06",
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
        titulo: "O que melhora quando eu paro de fumar maconha?",
        blocos: [
          p("Depois das primeiras semanas, muita gente percebe o sono mais regular, a memória e a concentração melhores e mais disposição de manhã. Os sonhos podem ficar intensos no começo, e isso tende a passar."),
          p("A fumaça da maconha irrita os pulmões e pode causar tosse e catarro. Parar de fumar costuma melhorar esses sintomas, ainda mais se você misturava com tabaco."),
        ],
      },
      {
        titulo: "Terapia ajuda a parar de fumar maconha? Existe remédio?",
        blocos: [
          p("A conversa e a orientação são o primeiro caminho recomendado. Não existe um remédio aprovado especificamente pra abstinência de maconha, mas um psiquiatra pode avaliar sintomas como ansiedade e insônia. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
          p("O canabidiol (CBD) vem sendo estudado pra ajudar quem quer parar, mas ainda não é um tratamento estabelecido. Se você pensa em usar, converse antes com um médico."),
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
        titulo: "Como ajudar um filho ou alguém próximo a parar de fumar maconha?",
        blocos: [
          p("Ameaça e briga costumam afastar. Ajuda mais escolher um momento calmo, dizer o que você está vendo sem acusar e perguntar o que a maconha está resolvendo pra pessoa. Se for um adolescente, os riscos são maiores e vale buscar orientação: o CAPS AD e o CAPS infantojuvenil atendem pelo SUS, e uma terapia pra você ajuda a atravessar esse momento. Pra familiares, existe também o Nar-Anon."),
        ],
      },
      {
        titulo: "E se eu voltar a fumar maconha?",
        blocos: [
          p("Acontece com muita gente e não apaga o que você já mudou. Vale reparar no que veio antes: um dia ruim, uma companhia, uma noite sem sono. Isso mostra onde você vai precisar de mais apoio se decidir tentar de novo."),
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
        pergunta: "Canabidiol ajuda a parar de fumar maconha?",
        resposta:
          "O canabidiol (CBD) vem sendo estudado pra isso, mas ainda não é um tratamento estabelecido. Se você pensa em usar, converse antes com um médico.",
      },
      {
        pergunta: "Parar de fumar maconha melhora o pulmão?",
        resposta:
          "A fumaça da maconha irrita os pulmões e pode causar tosse e catarro. Parar costuma melhorar esses sintomas, ainda mais se você misturava com tabaco.",
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
  // Revisado em 06/11/2026 com a pesquisa dos 10 primeiros do Google (docs/pesquisas-blog/como-parar-de-usar-cocaina.md).
  // Títulos em pergunta.
  {
    slug: "como-parar-de-usar-cocaina",
    publicadoEm: "2026-11-01",
    atualizadoEm: "2026-11-06",
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
        titulo: "Dá pra parar de usar cocaína sozinho?",
        blocos: [
          p("Tem gente que consegue. Mas a queda de humor e a fissura das primeiras semanas costumam ser mais leves com alguém do lado: uma pessoa de confiança, um grupo ou um profissional. Sozinho não precisa querer dizer sem ninguém."),
          p("Se junto com a cocaína você usa muito álcool ou calmantes, fale com um médico antes de parar: parar essas substâncias de repente pode ser perigoso."),
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
          p("Trocar a cocaína por outra droga ou por remédio tomado por conta própria costuma só mudar o problema de lugar. O que ajuda a ocupar o espaço é o que dá algum alívio de verdade: dormir, comer, gente por perto, uma atividade que prenda a atenção."),
          p("Se você voltar a usar, isso não apaga o que você já construiu. Pode ser uma forma de entender onde você precisa de mais apoio."),
        ],
      },
      {
        titulo: "Quanto tempo a cocaína fica no corpo?",
        blocos: [
          p("O efeito passa em menos de uma hora, mas o que o corpo produz ao processar a cocaína fica mais tempo. No exame de urina, costuma aparecer por 2 a 4 dias depois do último uso. Em quem usa muito e com frequência, pode aparecer por mais tempo. No exame de cabelo, aparece por meses."),
          p("Sair do corpo não é o mesmo que passar a fissura: a vontade pode continuar aparecendo depois que o exame já não mostra nada."),
        ],
      },
      {
        titulo: "Existe remédio pra parar de usar cocaína?",
        blocos: [
          p("Até aqui, não existe um remédio aprovado especificamente pra isso, e vale desconfiar de quem promete cura rápida. Remédio natural, chá e simpatia também não têm evidência. Um psiquiatra pode tratar o que vem junto, como depressão, ansiedade e insônia. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
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
        titulo: "E se o uso é de crack?",
        blocos: [
          p("Crack é cocaína em forma de pedra, fumada. O efeito chega mais rápido e passa mais rápido, então a fissura costuma ser mais forte e o uso em sequência mais comum. Os caminhos de cuidado são os mesmos deste texto: o CAPS AD atende sem encaminhamento, o Consultório na Rua vai até quem está em situação de rua e os Narcóticos Anônimos têm reuniões sem custo."),
          p("Pra quem vai usar, ter o próprio cachimbo, não compartilhar e cuidar dos lábios e das mãos contra queimaduras diminui riscos. Comer, beber água e dormir entre um uso e outro também faz diferença."),
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
        pergunta: "Dá pra parar de usar cocaína sozinho?",
        resposta:
          "Tem gente que consegue, e ter apoio costuma deixar as primeiras semanas mais leves. Se você também usa muito álcool ou calmantes, fale com um médico antes de parar.",
      },
      {
        pergunta: "Quanto tempo a cocaína fica no corpo?",
        resposta:
          "No exame de urina, costuma aparecer por 2 a 4 dias depois do último uso, e por mais tempo em quem usa muito e com frequência. No exame de cabelo, aparece por meses.",
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
        pergunta: "Como parar de usar crack?",
        resposta:
          "Os caminhos são os mesmos da cocaína: apoio de alguém da saúde, um plano pra fissura e menos acesso fácil. O CAPS AD atende sem encaminhamento, e o Consultório na Rua vai até quem está em situação de rua.",
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
  // Revisado em 06/11/2026 com a pesquisa do Google (docs/pesquisas-blog/lei-de-drogas.md): só uma pergunta frequente.
  {
    slug: "lei-de-drogas",
    publicadoEm: "2026-11-03",
    atualizadoEm: "2026-11-06",
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
        pergunta: "A maconha foi legalizada no Brasil?",
        resposta:
          "Não. O STF decidiu que ter maconha pra consumo pessoal não é crime, mas continua proibido: a droga é apreendida e o caso vai pra Justiça fora da área criminal. Vender continua sendo tráfico.",
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
    imagem: true,
    imagemAlt: "Juiz batendo o martelo em frente a um cigarro de maconha embalado sobre a mesa.",
    imagemCard: true,
  },
  // Guia geral (06/11/2026), escrito depois da pesquisa dos 10 primeiros do Google (docs/pesquisas-blog/
  // como-parar-de-usar-drogas.md). Mesma exceção de copy dos outros guias.
  {
    slug: "como-parar-de-usar-drogas",
    publicadoEm: "2026-11-06",
    atualizadoEm: "2026-11-06",
    title: "Como parar de usar drogas: primeiros passos e apoio | Margem",
    descricao:
      "Quer parar ou diminuir o uso de drogas? Veja os primeiros passos, como lidar com a vontade, quando parar de vez é arriscado e onde buscar apoio sem julgamento.",
    h1: "Como parar de usar drogas: primeiros passos, fissura e onde buscar apoio",
    abertura:
      "Talvez você já tenha prometido pra si mesmo que ia parar, e não deu. Talvez o uso esteja pesando no corpo, no bolso, no trabalho ou em casa. Ou talvez você só queira entender o que está acontecendo. Nada disso é falta de caráter ou de força de vontade: tem a ver com o efeito da substância e com o que está acontecendo na sua vida. Existem caminhos pra quem quer parar, pra quem quer diminuir e pra quem ainda não sabe.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "Como parar de usar drogas?",
        blocos: [
          p("Não existe uma receita que sirva pra todo mundo. O que funciona depende da substância, de há quanto tempo e com que frequência você usa, e do que o uso está resolvendo na sua vida. Alguns passos que muita gente usa pra começar:"),
          {
            tipo: "lista",
            itens: [
              "Reparar nos gatilhos: horários, lugares, pessoas, emoções e situações em que a vontade aparece",
              "Dificultar o acesso, como apagar o contato de quem vende e andar com menos dinheiro nos dias mais difíceis",
              "Contar pra uma pessoa de confiança o que você está tentando fazer",
              "Ter um plano pros momentos de vontade: com quem falar, pra onde ir, o que fazer até passar",
              "Cuidar do básico: dormir, comer e ter algo pra fazer nas horas que eram do uso",
              "Conversar com um profissional de saúde, principalmente antes de parar álcool, calmantes ou opioides",
            ],
          },
          p("Se você usa mais de uma substância, vale olhar pra elas juntas. Muitas vezes uma puxa a outra, como a bebida que abre caminho pra cocaína."),
          p("Cada substância tem seus próprios riscos e cuidados. Se você quer entender uma delas mais a fundo: [Ler sobre como parar de beber](/blog/como-parar-de-beber) [Ler sobre como parar de fumar maconha](/blog/como-parar-de-fumar-maconha) [Ler sobre como parar de usar cocaína](/blog/como-parar-de-usar-cocaina) [Ler sobre como parar de fumar cigarro](/blog/como-parar-de-fumar) [Ler sobre opioides](/blog/opioides)"),
        ],
      },
      {
        titulo: "Dá pra parar de usar drogas sozinho?",
        blocos: [
          p("Algumas pessoas conseguem diminuir ou parar sem tratamento formal. Mas sozinho não precisa significar isolado. Ter com quem contar costuma fazer diferença, seja um amigo, um grupo de apoio ou um profissional de saúde."),
          p("Também não é preciso esperar chegar no fundo do poço pra buscar cuidado. Dá pra conversar com alguém agora, do jeito que você está, mesmo sem ter decidido se quer parar."),
        ],
      },
      {
        titulo: "É perigoso parar de usar de uma vez?",
        blocos: [
          p("Depende da substância. Pra algumas, parar de repente pode ser arriscado e pede acompanhamento médico:"),
          {
            tipo: "lista",
            itens: [
              "Álcool, quando o uso é diário ou quase diário há bastante tempo: a abstinência pode causar convulsão e confusão mental",
              "Calmantes e remédios pra dormir, como clonazepam e diazepam: também podem causar convulsão e, por isso, costumam ser retirados aos poucos, com orientação médica",
              "Opioides, como morfina, codeína, tramadol e outros analgésicos fortes: a abstinência é muito desconfortável, e o médico pode indicar remédios que ajudam",
            ],
          },
          p("Pra cocaína, crack e maconha, parar de uma vez não costuma trazer esse risco físico, mas a abstinência pode pesar no humor e no sono. Em qualquer caso, se aparecer uma tristeza muito forte ou pensamentos de morte, vale buscar um profissional o quanto antes. Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
        ],
      },
      {
        titulo: "O que diminui a vontade de usar drogas?",
        blocos: [
          p("A vontade forte de usar, a fissura, costuma vir em ondas: sobe, chega num pico e baixa. Ela pode aparecer mesmo depois de bastante tempo sem usar, e isso não significa que você fracassou. Na hora em que ela vem, pode ajudar:"),
          {
            tipo: "lista",
            itens: [
              "Sair do lugar em que você está",
              "Ligar ou mandar mensagem pra alguém que saiba o que você está tentando fazer",
              "Comer, beber água e ocupar as mãos e a cabeça até a onda baixar",
              "Fazer alguma atividade física, mesmo uma caminhada curta",
              "Ficar longe da bebida nesse momento, se o álcool costuma puxar o uso",
              "Ler os motivos que fizeram você querer mudar, anotados antes no celular pra essas horas",
            ],
          },
          p("Com o tempo, a terapia ajuda a entender o que está por trás da vontade e a montar outros jeitos de lidar com ela. [Ver como funciona a terapia a valor social](/blog/terapia-barata)"),
        ],
      },
      {
        titulo: "Existe remédio pra parar de usar drogas?",
        blocos: [
          p("Depende da droga. Pra álcool, cigarro e opioides, existem remédios que ajudam a reduzir a vontade ou a evitar recaídas. Pra cocaína, crack e maconha, até aqui não existe um remédio aprovado especificamente pra isso, mas um psiquiatra pode tratar o que vem junto, como ansiedade, depressão e insônia. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
          p("Remédio pra isso precisa de avaliação médica: tomar por conta própria pode ser perigoso. Vale desconfiar de quem promete cura rápida, remédio milagroso ou um remédio pra colocar escondido na comida de alguém. Se a fé faz parte da sua vida, ela pode ser um apoio importante, junto com o cuidado de saúde, não no lugar dele."),
        ],
      },
      {
        titulo: "Preciso me internar pra parar de usar drogas?",
        blocos: [
          p("Na maior parte das vezes, não. Muita gente faz o cuidado sem sair de casa, com consultas, terapia, CAPS AD e grupos de apoio. A internação costuma ser indicada em situações mais graves, como abstinência perigosa, risco à vida ou crise de saúde mental, ou quando o cuidado sem internação já foi tentado várias vezes sem funcionar."),
          p("Conversar com psicólogo ou psiquiatra sobre o seu uso não leva a internação, e o que você conta fica em sigilo. [Entender como funciona o atendimento pra álcool e outras drogas](/blog/psicologo-alcool-e-drogas)"),
        ],
      },
      {
        titulo: "E se eu não quero parar de usar agora?",
        blocos: [
          p("Nem toda pessoa que usa quer ou precisa parar, e dá pra buscar cuidado do jeito que você está. Usar menos e com menos risco também é um caminho, e se chama [redução de danos](/blog/reducao-de-danos). Risco menor não é risco zero, mas alguns cuidados valem pra quase toda substância:"),
          {
            tipo: "lista",
            itens: [
              "Não misturar drogas entre si, nem com álcool ou remédios",
              "Começar com pouco e esperar, porque a força e a composição variam muito",
              "Não usar sozinho e estar com alguém de confiança que possa ajudar numa emergência",
              "Não compartilhar canudo, cachimbo ou seringa",
              "Definir antes um limite de quantidade e de dinheiro",
              "Beber água, comer e descansar",
              "Não dirigir depois de usar",
            ],
          },
        ],
      },
      {
        titulo: "E se eu voltar a usar?",
        blocos: [
          p("Voltar a usar é comum em quem está tentando parar e não apaga o que você já construiu. Pode ser uma forma de entender onde você precisa de mais apoio: o que veio antes, que situação pesou, o que faltou."),
          p("Um cuidado importante: depois de um tempo sem usar, o corpo perde a tolerância. Se você voltar a usar, a quantidade de antes pode ser demais, principalmente com álcool, calmantes e opioides. Começar com menos e não estar sozinho reduz esse risco."),
        ],
      },
      {
        titulo: "Quais são os sinais de emergência?",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "A pessoa não acorda ou não responde",
              "Respiração muito lenta, fraca ou com um ronco estranho",
              "Lábios ou unhas arroxeados",
              "Dor ou aperto no peito, ou coração muito acelerado",
              "Convulsão",
              "Corpo muito quente",
              "Confusão, pânico ou paranoia muito fortes",
            ],
          },
          p("Nesses casos, ligue para o SAMU no 192 e, se puder, diga o que foi usado: isso ajuda no atendimento. Enquanto espera, não deixe a pessoa sozinha. Se ela estiver desacordada e respirando, deixar de lado ajuda a evitar que engasgue com vômito."),
        ],
      },
      {
        titulo: "Como ajudar alguém que quer parar de usar drogas?",
        blocos: [
          p("Você não controla a decisão da outra pessoa, mas pode fazer diferença. Ajuda falar do que você está vendo, sem acusação, escutar mais do que aconselhar e mostrar os caminhos de apoio quando ela estiver aberta. Brigas, ameaças e humilhação costumam afastar, não aproximar."),
          p("Cuidar de você também conta. O Nar-Anon reúne familiares e amigos de pessoas que usam drogas, sem custo, e uma terapia pra você também é cuidado, mesmo que a outra pessoa não queira buscar ajuda agora."),
        ],
      },
      {
        titulo: "Onde encontrar apoio pra parar de usar drogas?",
        blocos: [
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Tudo online, e você escolhe o valor dentro da faixa."),
          p("Fora da Margem, o CAPS AD atende pelo SUS sem encaminhamento, a Unidade Básica de Saúde pode fazer o primeiro acolhimento, e os Narcóticos Anônimos têm reuniões presenciais e online, sem custo. Muita gente combina mais de um desses caminhos. [Ver serviços públicos presenciais e online](/redes-de-apoio) [Ver grupos de apoio presenciais e online](/redes-de-apoio?tipo=independentes)"),
          p("Se precisa conversar agora, o CVV atende 24 horas pelo 188. Numa emergência de saúde, o SAMU atende no 192."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Dá pra parar de usar drogas sozinho?",
        resposta:
          "Algumas pessoas conseguem diminuir ou parar sem tratamento formal, mas ter com quem contar costuma fazer diferença. Pra álcool, calmantes e opioides, parar de repente pode ser perigoso e pede acompanhamento médico.",
      },
      {
        pergunta: "O que diminui a vontade de usar drogas?",
        resposta:
          "A vontade costuma vir em ondas. Sair do lugar, falar com alguém de confiança, comer, beber água e ocupar a cabeça ajudam a esperar a onda baixar. A terapia ajuda a lidar com o que está por trás dela.",
      },
      {
        pergunta: "Existe remédio pra parar de usar drogas?",
        resposta:
          "Pra álcool, cigarro e opioides, existem remédios que ajudam. Pra cocaína, crack e maconha, ainda não existe um aprovado especificamente pra isso, mas um psiquiatra pode tratar o que vem junto. Remédio pra isso sempre precisa de avaliação médica.",
      },
      {
        pergunta: "Preciso me internar pra parar de usar drogas?",
        resposta:
          "Na maior parte das vezes, não. A internação costuma ser indicada em situações mais graves, como abstinência perigosa, risco à vida ou crise de saúde mental.",
      },
      {
        pergunta: "Onde conseguir ajuda pra parar de usar drogas sem pagar?",
        resposta:
          "No CAPS AD, que atende pelo SUS sem encaminhamento, na Unidade Básica de Saúde e nos Narcóticos Anônimos, que têm reuniões presenciais e online.",
      },
    ],
    imagem: true,
    imagemAlt: "Mão aberta erguida em sinal de pare, com árvores desfocadas ao fundo.",
    imagemCard: true,
  },
  // Guia de entrada sobre terapia (06/11/2026), escrito depois da pesquisa dos 10 primeiros do Google
  // (docs/pesquisas-blog/o-que-e-terapia.md). A pedido do Vitor, os títulos das seções são afirmativos e as
  // perguntas ficam só nas perguntas frequentes. Mesma exceção de copy dos outros guias.
  {
    slug: "o-que-e-terapia",
    publicadoEm: "2026-11-06",
    atualizadoEm: "2026-11-06",
    title: "O que é terapia, como funciona e quando procurar | Margem",
    descricao:
      "Entenda o que é terapia, como é uma sessão, os principais tipos, o que fica em sigilo e onde fazer, inclusive a valor social. Sem precisar estar em crise.",
    h1: "O que é terapia, como funciona e quando procurar",
    abertura:
      "Muita gente pensa em fazer terapia e adia porque não sabe direito como é. Não sabe o que vai acontecer na primeira sessão, o que falar, quanto custa ou se o que está vivendo é sério o bastante. Aqui você encontra o básico pra decidir com mais calma: o que é terapia, como ela funciona na prática e onde dá pra começar.",
    carrossel: ["psicologo"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "Terapia é uma conversa com método",
        blocos: [
          p("Terapia, ou psicoterapia, é um acompanhamento feito por um profissional preparado pra isso, em geral um psicólogo, em que você fala sobre o que está sentindo, pensando e vivendo. Parece uma conversa, mas não é uma conversa qualquer: o profissional tem formação, segue uma abordagem estudada, guarda sigilo sobre o que você conta e não está ali pra te julgar."),
          p("Também não é o lugar de receber conselho pronto. O psicólogo escuta, faz perguntas, aponta repetições que você talvez não tenha percebido e ajuda você a encontrar os seus próprios jeitos de lidar com o que está difícil. O ritmo e os assuntos são construídos junto com você."),
        ],
      },
      {
        titulo: "Pra que serve a terapia",
        blocos: [
          p("A terapia pode ajudar em situações bem diferentes. Algumas das mais comuns:"),
          {
            tipo: "lista",
            itens: [
              "Ansiedade, tristeza que não passa, irritação ou cansaço constante",
              "Luto, separação, demissão e outras mudanças grandes",
              "Brigas e dificuldades em casa, no relacionamento ou no trabalho",
              "Uso de álcool ou outras drogas que está pesando, ou que você só quer entender melhor",
              "Conviver com alguém que usa álcool ou outras drogas",
              "Situações de violência, traumas e lembranças que continuam doendo",
              "Vontade de se entender melhor e tomar decisões com mais clareza",
            ],
          },
          p("Ninguém consegue garantir o resultado de uma terapia. O que ela oferece é um espaço regular, com alguém preparado, pra olhar pro que está acontecendo com mais calma do que o dia a dia permite."),
        ],
      },
      {
        titulo: "Não precisa estar em crise pra começar",
        blocos: [
          p("Muita gente espera a situação ficar insustentável pra procurar ajuda. Não precisa. Terapia não é só pra quem tem um diagnóstico ou está no limite: dá pra começar com uma dúvida, um incômodo ou uma fase mais pesada. E começar mais cedo costuma ser mais leve do que começar no meio de uma crise."),
          p("Alguns sinais de que pode valer a pena: o mesmo assunto ocupa sua cabeça há semanas, o sono ou o apetite mudaram, você está se afastando das pessoas, ou alguém próximo comentou que está preocupado com você."),
        ],
      },
      {
        titulo: "Como é uma sessão de terapia",
        blocos: [
          p("Uma sessão costuma durar entre 40 e 60 minutos e, no começo, é comum ser uma vez por semana. A frequência e o valor são combinados com o profissional, de acordo com o que você está vivendo e com o que cabe no seu mês."),
          p("A primeira sessão serve pra vocês se conhecerem. O psicólogo vai perguntar o que te trouxe até ali, um pouco da sua história e o que você espera. Você não precisa contar tudo de uma vez nem chegar com nada preparado. Também pode perguntar como ele trabalha, como funciona o sigilo e o que fazer se precisar faltar."),
          p("Se você não souber o que dizer, pode começar exatamente por aí. Silêncio, confusão e \"não sei por onde começar\" também são assunto de terapia, e faz parte do trabalho do psicólogo ajudar você a encontrar o fio."),
        ],
      },
      {
        titulo: "Os principais tipos de terapia",
        blocos: [
          p("Existem várias abordagens, que são os jeitos diferentes de entender o sofrimento e de conduzir as sessões. As mais conhecidas no Brasil:"),
          {
            tipo: "lista",
            itens: [
              "Terapia cognitivo-comportamental (TCC): olha pra relação entre pensamentos, emoções e comportamentos, com foco no presente e, às vezes, com tarefas entre as sessões",
              "Psicanálise: trabalha com a sua história, os desejos e o que fica fora da consciência, a partir do que você fala livremente",
              "Abordagens humanistas, como a Gestalt-terapia: dão ênfase à sua experiência no momento presente e às suas escolhas",
              "Terapia sistêmica: olha pra família, o casal e os padrões das relações, e pode ser feita com mais de uma pessoa na sala",
            ],
          },
          p("Nenhuma abordagem é a certa pra todo mundo. Mais do que a teoria, costuma pesar a confiança que você sente no profissional. Se quiser, pergunte na primeira sessão qual abordagem ele usa e como isso aparece no dia a dia."),
        ],
      },
      {
        titulo: "Psicólogo, terapeuta e psiquiatra não são a mesma coisa",
        blocos: [
          {
            tipo: "tabela",
            legenda: "Diferença entre psicólogo, terapeuta e psiquiatra",
            colunas: ["Quem", "Formação", "O que faz"],
            linhas: [
              ["Psicólogo", "Graduação em psicologia e registro no Conselho Regional de Psicologia (CRP)", "Faz psicoterapia e avaliação psicológica. Não receita remédio"],
              ["Psiquiatra", "Medicina, especialização em psiquiatria e registro no Conselho Regional de Medicina (CRM)", "Avalia, diagnostica e pode receitar remédio. Alguns também fazem psicoterapia"],
              ["Terapeuta", "Depende de quem usa o nome", "É um nome amplo, que qualquer pessoa pode usar, com ou sem formação reconhecida"],
            ],
          },
          p("Por isso vale conferir o registro de quem vai te atender. Leva poucos minutos. [Ver como conferir o registro de um psicólogo](/blog/como-saber-se-o-psicologo-e-registrado)"),
          p("Às vezes faz sentido ter psicólogo e psiquiatra juntos: um cuida da conversa e do que está por baixo do que você sente, o outro avalia se um remédio pode ajudar. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
          p("Terapia ocupacional é outra profissão, com conselho próprio. O terapeuta ocupacional trabalha a autonomia nas atividades do dia a dia, como cuidar de si, estudar e trabalhar, e não é o mesmo que fazer psicoterapia."),
        ],
      },
      {
        titulo: "O que você fala na terapia fica entre vocês",
        blocos: [
          p("O sigilo é um dever do psicólogo, previsto no Código de Ética da profissão. O que você conta não vai pra sua família, pro seu trabalho nem pra polícia. Ele só pode ser quebrado em situações muito específicas, como um risco sério à sua vida ou à de outra pessoa, e mesmo assim só no que for estritamente necessário."),
          p("Com quem tem menos de 18 anos, o psicólogo pode conversar com os responsáveis sobre o que for essencial pro cuidado. Isso costuma ser combinado logo no começo, e dá pra perguntar como vai funcionar no seu caso."),
        ],
      },
      {
        titulo: "Dá pra falar de álcool e outras drogas na terapia",
        blocos: [
          p("Dá, e você não precisa ter parado de usar pra começar. A terapia pode ajudar a entender o que o uso está resolvendo na sua vida, o que vem antes da vontade e o que você quer fazer com isso: parar, diminuir ou só usar com menos risco, que é o que se chama de [redução de danos](/blog/reducao-de-danos). Abordagens como a entrevista motivacional foram pensadas justamente pra quem ainda está em dúvida sobre mudar."),
          p("Contar sobre o seu uso não leva a internação nem a denúncia. Se você convive com alguém que usa, a terapia também é um espaço pra você, mesmo que a outra pessoa não queira buscar ajuda agora. [Entender como funciona o atendimento pra álcool e outras drogas](/blog/psicologo-alcool-e-drogas)"),
        ],
      },
      {
        titulo: "Online ou presencial",
        blocos: [
          p("Os dois formatos funcionam. Pesquisas que compararam terapia por vídeo e presencial encontraram resultados parecidos em muitas situações, como ansiedade e depressão, e no Brasil o atendimento online é regulamentado pelo Conselho Federal de Psicologia."),
          p("O online facilita pra quem mora longe, tem pouco tempo ou não tem dinheiro pro transporte. O que importa é ter um lugar em que você consiga falar sem medo de ser ouvido: muita gente faz a sessão no carro, numa praça mais vazia ou andando com fone de ouvido."),
        ],
      },
      {
        titulo: "Quanto tempo dura e como perceber se está ajudando",
        blocos: [
          p("Não existe um número certo de sessões. Algumas pessoas fazem por alguns meses pra atravessar uma fase específica, outras ficam anos. Isso é revisto com o profissional ao longo do caminho."),
          p("A mudança costuma ser gradual. Alguns sinais de que a terapia está ajudando: você entende melhor o que sente, reage de um jeito um pouco diferente a situações que antes te derrubavam, ou consegue falar de assuntos que antes evitava. Também é normal algumas sessões serem pesadas: mexer em coisas difíceis pode incomodar antes de aliviar."),
          p("Se você não se sentir à vontade com o profissional, pode falar isso com ele ou procurar outro. Trocar de psicólogo é comum e não significa que a terapia não é pra você."),
        ],
      },
      {
        titulo: "Onde fazer terapia",
        blocos: [
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, online, e você escolhe o valor dentro dessa faixa, sem precisar justificar. Todo profissional passa por uma aprovação antes de entrar. [Ver como funciona a terapia a valor social](/blog/terapia-barata)"),
          p("Fora da Margem, a porta de entrada do SUS é a Unidade Básica de Saúde do seu bairro, e o CAPS atende sem precisar de encaminhamento. Muitas faculdades de psicologia têm clínicas-escola, com atendimento feito por estudantes supervisionados por professores. A espera costuma ser maior, mas é um caminho real. [Ver serviços públicos presenciais e online](/redes-de-apoio)"),
          p("Se você está num momento muito difícil e precisa conversar agora, o CVV atende 24 horas pelo 188."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "O que é terapia?",
        resposta:
          "É um acompanhamento feito por um profissional preparado, em geral um psicólogo, em que você fala sobre o que sente, pensa e vive. Tem método, sigilo e não é o lugar de receber julgamento nem conselho pronto.",
      },
      {
        pergunta: "Como é feita uma terapia?",
        resposta:
          "Em sessões de 40 a 60 minutos, presenciais ou online, em geral uma vez por semana no começo. Na primeira, vocês se conhecem e o psicólogo pergunta o que te trouxe até ali. Você não precisa chegar com nada preparado.",
      },
      {
        pergunta: "Qual a diferença entre psicólogo e terapeuta?",
        resposta:
          "Psicólogo é formado em psicologia e tem registro no CRP. Terapeuta é um nome amplo, que qualquer pessoa pode usar. Por isso vale conferir o registro de quem vai te atender.",
      },
      {
        pergunta: "Quais são os tipos de terapia?",
        resposta:
          "As abordagens mais conhecidas no Brasil são a terapia cognitivo-comportamental, a psicanálise, as abordagens humanistas, como a Gestalt-terapia, e a terapia sistêmica. Nenhuma é a certa pra todo mundo.",
      },
      {
        pergunta: "O que eu falo na terapia fica em sigilo?",
        resposta:
          "Fica. O sigilo é um dever do psicólogo, previsto no Código de Ética da profissão. Ele só pode ser quebrado em situações muito específicas, como risco sério à vida, e só no que for estritamente necessário.",
      },
      {
        pergunta: "Quanto custa fazer terapia?",
        resposta:
          "Depende do profissional. Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e você escolhe o valor dentro da faixa. Pelo SUS e em clínicas-escola de faculdades, o atendimento é gratuito, com espera maior.",
      },
    ],
    imagem: true,
    imagemAlt: "Mulher sentada à mesa em videochamada com um terapeuta pelo notebook.",
    imagemCard: true,
  },
  // Guia de abstinência (06/11/2026), escrito depois da pesquisa dos 10 primeiros do Google (docs/pesquisas-blog/
  // sintomas-de-abstinencia.md). Formato dos títulos: perguntas (os guias alternam com o afirmativo pra comparar,
  // ver .claude/skills/pesquisa-serp-blog). Prazos e sintomas batem com os guias de cada substância.
  // Mesma exceção de copy dos outros guias.
  {
    slug: "sintomas-de-abstinencia",
    publicadoEm: "2026-11-06",
    atualizadoEm: "2026-11-06",
    title: "Sintomas de abstinência: quanto duram e quando é perigoso | Margem",
    descricao:
      "Entenda os sintomas de abstinência de álcool, cigarro, maconha, cocaína, calmantes e opioides, quanto tempo duram, quando é emergência e onde buscar apoio.",
    h1: "Sintomas de abstinência: o que são, quanto tempo duram e quando é perigoso",
    abertura:
      "Talvez você tenha parado ou diminuído o uso e o corpo esteja reclamando: tremor, suor, insônia, irritação, uma vontade que não larga. Talvez seja alguém próximo de você. Isso tem nome, abstinência, e não é fraqueza nem falta de força de vontade: é o corpo se reajustando sem uma substância com que ele já estava acostumado. Na maior parte das vezes, passa. Em alguns casos, pede cuidado médico.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "O que é abstinência?",
        blocos: [
          p("É o conjunto de sintomas que aparece quando alguém para ou diminui de repente uma substância que vinha usando com frequência. Com o uso repetido, o corpo e o cérebro se adaptam a funcionar com ela. Quando ela falta, leva um tempo pra se reorganizar, e é nesse tempo que vêm os sintomas."),
          p("Isso pode acontecer com álcool, cigarro, vape, maconha, cocaína, crack e outras drogas, e também com remédios de uso contínuo, como calmantes e alguns analgésicos fortes. Quando alguém diz que uma pessoa está com abstinência, é disso que está falando."),
          p("Abstinência e fissura andam juntas, mas não são a mesma coisa. A abstinência é o mal-estar do corpo e do humor nos dias ou semanas depois de parar. A fissura é a vontade forte de usar, que pode vir durante a abstinência e também voltar meses depois, diante de um lugar, uma pessoa ou uma emoção que lembram o uso."),
        ],
      },
      {
        titulo: "Quais são os sintomas de abstinência?",
        blocos: [
          p("Eles mudam de acordo com a substância, a quantidade, o tempo de uso e a saúde de cada pessoa. Os mais comuns no corpo são:"),
          {
            tipo: "lista",
            itens: [
              "Tremor, principalmente nas mãos",
              "Suor e calafrio",
              "Enjoo, vômito e diarreia",
              "Dor de cabeça e dor no corpo",
              "Coração acelerado",
              "Cansaço ou sono demais, ou dificuldade pra dormir",
              "Mudança no apetite",
            ],
          },
          p("E no humor e na cabeça:"),
          {
            tipo: "lista",
            itens: [
              "Ansiedade e inquietação",
              "Irritação e raiva",
              "Tristeza e desânimo",
              "Dificuldade de concentração",
              "Vontade forte de usar",
            ],
          },
          p("Se aparecer uma tristeza muito pesada ou pensamentos de morte, vale buscar um profissional o quanto antes. Se precisa conversar agora, o CVV atende 24 horas pelo 188."),
        ],
      },
      {
        titulo: "Como é a abstinência de cada substância?",
        blocos: [
          p("Os prazos abaixo são uma média. Cada corpo tem seu tempo, e quem usa mais de uma substância pode sentir uma mistura de sintomas."),
          {
            tipo: "tabela",
            legenda: "Quando a abstinência costuma começar, quanto tempo dura e se parar de repente pede acompanhamento médico, por substância",
            colunas: ["Substância", "Quando começa", "Quanto tempo costuma durar", "Parar de repente pede acompanhamento médico?"],
            linhas: [
              ["Álcool", "De 6 a 12 horas depois da última dose", "De 3 a 7 dias, e alguns sintomas podem levar mais tempo", "Sim, quando o uso é diário ou quase diário há bastante tempo"],
              ["Calmantes e remédios pra dormir", "Depende do remédio, de algumas horas a alguns dias", "Pode levar semanas", "Sim. Costumam ser retirados aos poucos, com orientação médica"],
              ["Opioides, como morfina, codeína e tramadol", "Algumas horas depois da última dose", "Os sintomas mais fortes costumam passar em cerca de uma semana", "Sim. O médico pode indicar remédios que aliviam"],
              ["Cigarro, vape e pod", "Nas primeiras horas", "Mais forte nos primeiros dias, melhora em algumas semanas", "Não costuma ser perigoso, mas o tratamento ajuda a passar"],
              ["Maconha", "De 24 a 48 horas depois do último uso", "De duas a três semanas quando o uso era intenso, e o sono pode levar mais", "Não costuma ser perigoso"],
              ["Cocaína e crack", "Pouco depois do último uso", "De várias semanas a alguns meses", "Não costuma trazer risco físico, mas a queda no humor merece atenção"],
            ],
          },
          p("Se você quer entender uma delas mais a fundo: [Ler sobre como parar de beber](/blog/como-parar-de-beber) [Ler sobre como parar de fumar cigarro](/blog/como-parar-de-fumar) [Ler sobre como parar de fumar maconha](/blog/como-parar-de-fumar-maconha) [Ler sobre como parar de usar cocaína](/blog/como-parar-de-usar-cocaina)"),
        ],
      },
      {
        titulo: "Qual a pior fase da abstinência?",
        blocos: [
          p("Pra maioria das substâncias, os primeiros dias são os mais difíceis. No álcool, os sintomas costumam ficar mais fortes entre o primeiro e o terceiro dia. No cigarro e na maconha, também nos primeiros dias. Depois disso, o corpo tende a melhorar aos poucos."),
          p("O humor e o sono podem demorar mais do que o corpo pra voltar ao normal, principalmente depois de cocaína e crack. E a fissura pode aparecer de novo bem depois de os outros sintomas terem passado. Isso não quer dizer que você voltou pra estaca zero."),
        ],
      },
      {
        titulo: "Quanto tempo dura a abstinência de remédio?",
        blocos: [
          p("Depende do remédio, da dose e de há quanto tempo você toma. A abstinência de calmantes e remédios pra dormir, como clonazepam e diazepam, pode durar semanas, e parar de repente pode causar convulsão. Por isso eles costumam ser retirados aos poucos."),
          p("Antidepressivos e outros remédios de uso contínuo também podem causar sintomas quando são interrompidos de uma vez, como tontura, enjoo e irritação. Se você quer parar ou diminuir um remédio receitado, converse antes com quem receitou. Se não tem mais contato com essa pessoa, um psiquiatra ou o médico da Unidade Básica de Saúde pode montar o plano com você."),
        ],
      },
      {
        titulo: "A abstinência pode ser perigosa?",
        blocos: [
          p("Na maioria das vezes, ela é muito desconfortável, mas não coloca a vida em risco. As exceções são o álcool, quando o uso é diário ou quase diário há bastante tempo, e os calmantes e remédios pra dormir: parar de repente pode causar convulsão e um estado de confusão grave. Nesses casos, o ideal é conversar com um profissional de saúde antes de parar, ou logo no começo."),
          p("A abstinência de opioides não costuma ser perigosa pro corpo, mas vômito e diarreia fortes podem desidratar, e o médico pode indicar remédios que aliviam. Na abstinência de cocaína e crack, o maior cuidado é com a queda no humor."),
          p("Também merece atenção quem tem problema no coração, convulsão em outra época, outra doença séria, está grávida ou já teve abstinência forte antes."),
        ],
      },
      {
        titulo: "O que ajuda a passar a abstinência?",
        blocos: [
          p("Quando não há sinal de risco, alguns cuidados aliviam os dias mais difíceis:"),
          {
            tipo: "lista",
            itens: [
              "Beber água ao longo do dia e comer alguma coisa leve, mesmo sem fome",
              "Manter horários pra dormir e acordar, mesmo que o sono demore a vir",
              "Ficar num lugar calmo e com alguém por perto, principalmente nos primeiros dias",
              "Fazer alguma atividade leve, como uma caminhada curta",
              "Contar pra uma pessoa de confiança o que você está passando",
              "Ter um plano pra quando a vontade apertar: com quem falar, pra onde ir, o que fazer até a onda baixar",
              "Evitar trocar uma substância por outra, como beber pra conseguir dormir",
            ],
          },
          p("Um profissional pode deixar esse caminho mais leve. Pra algumas substâncias, existem remédios que aliviam os sintomas, e eles sempre precisam de avaliação médica. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
        ],
      },
      {
        titulo: "Quais sinais de abstinência são emergência?",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "Convulsão",
              "Confusão, sem saber onde está ou sem reconhecer as pessoas",
              "Ver ou ouvir coisas que não estão ali",
              "Febre ou corpo muito quente",
              "Tremor muito forte com agitação intensa",
              "Dor ou aperto no peito, ou coração muito acelerado",
              "Vômito ou diarreia que não param",
              "Pensamentos de morte ou de se machucar",
            ],
          },
          p("Nesses casos, ligue para o SAMU no 192 ou procure uma UPA ou um pronto-socorro. Se puder, diga o que a pessoa usava e quando parou: isso ajuda no atendimento. Enquanto espera, não deixe a pessoa sozinha."),
        ],
      },
      {
        titulo: "Como ajudar alguém que está em abstinência?",
        blocos: [
          p("Ficar perto já ajuda muito. Ofereça água e comida leve, deixe o ambiente calmo e fique atento aos sinais de emergência, principalmente se a pessoa bebia todos os dias ou tomava calmantes."),
          p("A irritação e a tristeza fazem parte da abstinência. Sermão, briga e cobrança nesse momento costumam pesar mais do que ajudar. Escutar, lembrar que vai passar e mostrar os caminhos de apoio quando ela estiver aberta costuma fazer mais diferença."),
          p("Cuidar de você também conta. O Al-Anon e o Nar-Anon reúnem familiares e amigos de pessoas que usam álcool e outras drogas, sem custo, e uma terapia pra você também é cuidado."),
        ],
      },
      {
        titulo: "E se eu voltar a usar?",
        blocos: [
          p("Voltar a usar pra aliviar a abstinência é comum e não apaga o que você já construiu. Pode ser um sinal de que você precisa de mais apoio nessa fase, e não de que não consegue."),
          p("Um cuidado importante: depois de alguns dias sem usar, o corpo perde a tolerância. A quantidade de antes pode ser demais, principalmente com álcool, calmantes e opioides. Começar com menos, não misturar substâncias e não usar sozinho reduz esse risco. [Ler sobre redução de danos](/blog/reducao-de-danos)"),
        ],
      },
      {
        titulo: "Onde encontrar apoio na abstinência?",
        blocos: [
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Tudo online, e você escolhe o valor dentro da faixa. O que você conta fica em sigilo, e conversar sobre o seu uso não leva a internação. [Entender como funciona o atendimento pra álcool e outras drogas](/blog/psicologo-alcool-e-drogas)"),
          p("Fora da Margem, o CAPS AD atende pelo SUS sem encaminhamento, a Unidade Básica de Saúde pode fazer o primeiro acolhimento e ajudar a parar de fumar, e os Alcoólicos Anônimos e os Narcóticos Anônimos têm reuniões presenciais e online, sem custo. [Ver serviços públicos presenciais e online](/redes-de-apoio) [Ver grupos de apoio presenciais e online](/redes-de-apoio?tipo=independentes)"),
          p("Se precisa conversar agora, o CVV atende 24 horas pelo 188. Numa emergência de saúde, o SAMU atende no 192."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Quanto tempo dura a abstinência?",
        resposta:
          "Depende da substância. No álcool, costuma durar de 3 a 7 dias. No cigarro e na maconha, melhora em algumas semanas. Na cocaína e no crack, pode durar de várias semanas a alguns meses. A vontade de usar pode voltar mesmo depois disso.",
      },
      {
        pergunta: "Qual a pior fase da abstinência?",
        resposta:
          "Pra maioria das substâncias, os primeiros dias. Depois o corpo tende a melhorar aos poucos, mas o humor e o sono podem demorar mais pra voltar ao normal.",
      },
      {
        pergunta: "Quanto tempo dura a abstinência de remédio?",
        resposta:
          "Depende do remédio, da dose e do tempo de uso. A de calmantes e remédios pra dormir pode durar semanas, e parar de repente pode causar convulsão. Converse com quem receitou antes de parar ou diminuir.",
      },
      {
        pergunta: "A abstinência pode matar?",
        resposta:
          "A de álcool, quando o uso é diário ou quase diário há bastante tempo, e a de calmantes podem ser graves e pedem acompanhamento médico. Na maioria das outras substâncias, a abstinência é muito desconfortável, mas não costuma colocar a vida em risco.",
      },
      {
        pergunta: "O que fazer para passar a abstinência?",
        resposta:
          "Beber água, comer algo leve, manter horários de sono, ficar num lugar calmo e com alguém por perto. Um profissional pode indicar remédios que aliviam, e convulsão, confusão ou febre são emergência: ligue para o SAMU no 192.",
      },
    ],
    imagem: true,
    imagemAlt: "Homem sentado a uma mesa, com a mão na testa e os olhos fechados, diante de um prato com sanduíche e batata chips e uma garrafa de água.",
    imagemCard: true,
  },
  // Guia de opioides (06/11/2026), escrito depois da pesquisa dos 10 primeiros do Google (docs/pesquisas-blog/
  // opioides.md). Formato dos títulos: afirmativo (o anterior, sintomas-de-abstinencia, usou perguntas).
  // Prazos e cuidados da abstinência batem com os guias de abstinência e de como parar de usar drogas.
  // Mesma exceção de copy dos outros guias.
  {
    slug: "opioides",
    publicadoEm: "2026-11-06",
    atualizadoEm: "2026-11-06",
    title: "Opioides: o que são, efeitos, riscos e abstinência | Margem",
    descricao:
      "Entenda o que são opioides, quais são os mais comuns, os efeitos, a abstinência, os sinais de overdose e onde buscar apoio sem julgamento.",
    h1: "Opioides: o que são, quais são os mais comuns, riscos e onde buscar apoio",
    abertura:
      "Talvez um médico tenha receitado um opioide e você queira entender o que está tomando. Talvez você esteja usando mais do que devia, ou sem receita, e já sinta falta quando atrasa uma dose. Ou talvez seja alguém próximo de você. Opioides são remédios importantes contra a dor e, ao mesmo tempo, pedem cuidado. Nada disso é falta de caráter: tem a ver com o efeito da substância no corpo, e existem caminhos pra cada uma dessas situações.",
    carrossel: ["psicologo", "psiquiatra"],
    carrosselTopo: true,
    secoes: [
      {
        titulo: "O que são opioides",
        blocos: [
          p("Opioides são substâncias que agem no cérebro e na medula diminuindo a sensação de dor. Também dão sono, relaxamento e, em algumas pessoas, uma sensação forte de bem-estar."),
          p("Alguns vêm da papoula, como a morfina e a codeína. Outros são modificados em laboratório a partir deles, como a oxicodona e a heroína. E outros são feitos inteiramente em laboratório, como o tramadol, a metadona e o fentanil. Opiáceo é o nome dos que vêm direto da papoula. Opioide é o nome do grupo todo."),
          p("A maioria é remédio, vendido só com receita especial, que fica retida na farmácia. A heroína não tem uso médico no Brasil."),
        ],
      },
      {
        titulo: "Os opioides mais comuns, dos mais fracos aos mais fortes",
        blocos: [
          {
            tipo: "tabela",
            legenda: "Opioides mais comuns, do mais fraco ao mais forte, e onde costumam aparecer",
            colunas: ["Opioide", "Força", "Onde costuma aparecer"],
            linhas: [
              ["Codeína", "Mais fraco", "Remédios pra dor e pra tosse, muitas vezes junto com paracetamol"],
              ["Tramadol", "Mais fraco", "Remédios pra dor moderada"],
              ["Morfina", "Forte", "Dor intensa, como depois de cirurgia, em câncer e em cuidados paliativos"],
              ["Oxicodona", "Forte", "Dor intensa ou que dura muito tempo"],
              ["Metadona", "Forte", "Dor intensa que dura muito tempo e tratamento de quem quer parar outros opioides"],
              ["Fentanil", "Muito forte, muitas vezes mais que a morfina", "Anestesia e dor intensa, em injeção ou adesivo"],
              ["Heroína", "Muito forte", "Não tem uso médico no Brasil"],
            ],
          },
          p("Mais fraco não quer dizer sem risco. Codeína e tramadol também podem causar dependência e abstinência, principalmente em doses altas ou por muito tempo."),
        ],
      },
      {
        titulo: "A diferença entre um analgésico comum e um opioide",
        blocos: [
          p("Todo opioide é um analgésico, mas nem todo analgésico é um opioide. Dipirona, paracetamol e ibuprofeno são analgésicos comuns: aliviam a dor de outro jeito, não dão a sensação de bem-estar dos opioides e não causam esse tipo de dependência. Isso não quer dizer que não tenham riscos. Em dose alta, o paracetamol pode fazer mal ao fígado, por exemplo."),
          p("Alguns remédios juntam os dois num comprimido só, como paracetamol com codeína. Se você não sabe se o seu remédio tem opioide, a bula e o farmacêutico respondem. Uma pista: os que têm costumam exigir receita especial."),
        ],
      },
      {
        titulo: "Pra que servem os opioides",
        blocos: [
          p("Pra dor moderada e intensa: depois de cirurgia, fratura ou queimadura, em câncer, em cuidados paliativos e em algumas dores que duram muito tempo. Também são usados na anestesia e, em alguns casos, contra tosse."),
          p("Usados com acompanhamento médico, são seguros e muito importantes. O medo de opioide também faz mal: tem gente que deixa de tratar uma dor forte por receio de ficar dependente. Se esse é o seu caso, vale conversar sobre isso com quem receitou."),
        ],
      },
      {
        titulo: "Os efeitos e os efeitos colaterais dos opioides",
        blocos: [
          p("Além de aliviar a dor, os opioides costumam causar:"),
          {
            tipo: "lista",
            itens: [
              "Sono e moleza",
              "Prisão de ventre",
              "Enjoo e vômito",
              "Coceira",
              "Pupilas pequenas",
              "Confusão, principalmente em pessoas mais velhas",
            ],
          },
          p("O efeito mais perigoso é a respiração ficar lenta demais. Esse risco aumenta com doses altas, com opioides mais fortes e quando eles são misturados com álcool, calmantes como clonazepam e diazepam, remédios pra dormir ou outros opioides."),
        ],
      },
      {
        titulo: "Tomar opioide com receita e o risco de dependência",
        blocos: [
          p("Usar opioide por alguns dias pra uma dor forte, com acompanhamento médico, raramente leva à dependência. O risco cresce com o uso por semanas ou meses, com doses altas e quando o remédio passa a ser usado pra outras coisas além da dor."),
          p("Com o uso contínuo, o corpo se acostuma e o mesmo efeito pede uma dose maior. Isso se chama tolerância, e pode acontecer com qualquer pessoa que usa por um tempo. Ter tolerância não quer dizer, sozinho, que o uso virou um problema. Alguns sinais de que vale conversar com alguém:"),
          {
            tipo: "lista",
            itens: [
              "Tomar mais do que foi receitado, ou por mais tempo",
              "Usar pra dormir, pra acalmar a ansiedade ou pra aguentar o dia, e não só pra dor",
              "Ficar mal quando atrasa uma dose",
              "Procurar receita com mais de um médico ou usar remédio de outra pessoa",
              "Esconder quanto está usando",
              "Querer diminuir e não conseguir",
            ],
          },
        ],
      },
      {
        titulo: "A abstinência de opioides e o cuidado ao parar",
        blocos: [
          p("Quando alguém que usa opioide com frequência para ou diminui de repente, o corpo reage. Os sintomas costumam começar algumas horas depois da última dose, e os mais fortes passam em cerca de uma semana. O sono e a vontade de usar podem levar mais tempo."),
          {
            tipo: "lista",
            itens: [
              "Dor no corpo e nos ossos",
              "Diarreia, cólica, enjoo e vômito",
              "Nariz escorrendo, olhos lacrimejando e muitos bocejos",
              "Suor, arrepios e calafrio",
              "Ansiedade, irritação e insônia",
              "Vontade forte de usar",
            ],
          },
          p("A abstinência de opioides é muito desconfortável, mas não costuma ser perigosa pro corpo. Vômito e diarreia fortes podem desidratar, e o médico pode indicar remédios que aliviam. Se você toma opioide receitado, não pare nem mude a dose por conta própria: quem receitou pode diminuir aos poucos com você. Se você está grávida, converse com um profissional antes de mudar qualquer coisa, porque parar de repente também afeta o bebê."),
          p("Se aparecer uma tristeza muito pesada ou pensamentos de morte, vale buscar um profissional o quanto antes. Se precisa conversar agora, o CVV atende 24 horas pelo 188. [Ler sobre sintomas de abstinência](/blog/sintomas-de-abstinencia)"),
        ],
      },
      {
        titulo: "Os sinais de overdose de opioide e o que fazer",
        blocos: [
          {
            tipo: "lista",
            itens: [
              "A pessoa não acorda ou não responde, mesmo chamando alto",
              "Respiração muito lenta, fraca, parada ou com um ronco estranho",
              "Lábios ou unhas arroxeados",
              "Pupilas muito pequenas",
              "Pele fria ou pálida",
            ],
          },
          p("Nesses casos, ligue para o SAMU no 192 na hora e, se puder, diga o que foi usado. Os serviços de emergência têm um remédio, a naloxona, que pode reverter a overdose de opioide, por isso ligar rápido faz diferença. Enquanto espera, chame a pessoa pelo nome e não deixe ela sozinha. Se ela estiver desacordada e respirando, deixar de lado ajuda a evitar que engasgue com vômito."),
          p("Mesmo que a pessoa melhore, ela precisa ser avaliada: o efeito de alguns opioides dura mais do que o do remédio que reverte a overdose."),
        ],
      },
      {
        titulo: "Como usar opioides com menos risco",
        blocos: [
          p("Nem toda pessoa que usa quer ou consegue parar agora, e dá pra buscar cuidado do jeito que você está. Usar com menos risco também é um caminho, e se chama [redução de danos](/blog/reducao-de-danos). Risco menor não é risco zero, mas alguns cuidados fazem diferença:"),
          {
            tipo: "lista",
            itens: [
              "Não misturar com álcool, calmantes, remédios pra dormir ou outros opioides",
              "Não usar sozinho e estar com alguém de confiança que saiba o que fazer numa emergência",
              "Começar com pouco e esperar, principalmente com uma substância ou um remédio novo",
              "Depois de alguns dias sem usar, começar com bem menos: o corpo perde a tolerância, e a quantidade de antes pode ser demais",
              "Desconfiar de comprimido comprado sem receita: a dose e a composição podem não ser as que dizem",
              "Não compartilhar seringa nem agulha",
              "Guardar o remédio longe de crianças e de outras pessoas da casa",
              "Não dirigir depois de usar",
            ],
          },
        ],
      },
      {
        titulo: "O tratamento pro uso de opioides",
        blocos: [
          p("Existe tratamento, e ele não começa necessariamente com internação. Na maior parte das vezes, o cuidado acontece com consultas, terapia, CAPS AD e grupos de apoio. A internação costuma ser indicada em situações mais graves, como risco à vida ou crise de saúde mental."),
          p("Pra opioides, existem remédios que ajudam a passar a abstinência e a evitar recaídas. Alguns, como a metadona e a buprenorfina, ocupam o lugar do opioide de forma controlada e são diminuídos aos poucos ou mantidos por um tempo. No Brasil, esse tratamento ainda não está disponível em todo lugar, e quem avalia se faz sentido é o médico. [Ver como funciona a consulta com psiquiatra a valor social](/blog/psiquiatra-barato)"),
          p("Se o uso começou por causa de uma dor, a dor também precisa de cuidado. Parar o remédio sem tratar o que dói costuma não se sustentar. A terapia ajuda com o que vem junto, como ansiedade, insônia e o que o uso estava aliviando. Conversar com psicólogo ou psiquiatra sobre o seu uso não leva a internação, e o que você conta fica em sigilo. [Entender como funciona o atendimento pra álcool e outras drogas](/blog/psicologo-alcool-e-drogas)"),
        ],
      },
      {
        titulo: "Como ajudar alguém que usa opioides",
        blocos: [
          p("Você não controla a decisão da outra pessoa, mas pode fazer diferença. Ajuda falar do que você está vendo, sem acusação, escutar mais do que aconselhar e mostrar os caminhos de apoio quando ela estiver aberta. Brigas, ameaças e humilhação costumam afastar, não aproximar."),
          p("Vale também conhecer os sinais de overdose e o que fazer, principalmente se a pessoa mistura opioide com álcool ou calmantes. Cuidar de você também conta. O Nar-Anon reúne familiares e amigos de pessoas que usam drogas, sem custo, e uma terapia pra você também é cuidado, mesmo que a outra pessoa não queira buscar ajuda agora."),
        ],
      },
      {
        titulo: "Onde encontrar apoio",
        blocos: [
          p("Na Margem, a sessão com psicólogo custa de R$ 60 a R$ 200, e a consulta com psiquiatra, de R$ 110 a R$ 290. Tudo online, e você escolhe o valor dentro da faixa."),
          p("Fora da Margem, o CAPS AD atende pelo SUS sem encaminhamento, a Unidade Básica de Saúde pode fazer o primeiro acolhimento, e os Narcóticos Anônimos têm reuniões presenciais e online, sem custo. [Ver serviços públicos presenciais e online](/redes-de-apoio) [Ver grupos de apoio presenciais e online](/redes-de-apoio?tipo=independentes)"),
          p("Se precisa conversar agora, o CVV atende 24 horas pelo 188. Numa emergência de saúde, o SAMU atende no 192."),
          p("Se quiser entender melhor o seu momento antes de falar com alguém, dá pra contar o que está acontecendo na Margem."),
          { tipo: "botoes", botoes: [{ texto: "Contar o que está acontecendo", href: "/inicio" }] },
        ],
      },
    ],
    perguntas: [
      {
        pergunta: "Quais são as drogas opioides?",
        resposta:
          "Os mais comuns são codeína, tramadol, morfina, oxicodona, metadona e fentanil, que são remédios vendidos com receita especial, e a heroína, que não tem uso médico no Brasil.",
      },
      {
        pergunta: "Quais são os opioides mais fortes?",
        resposta:
          "Entre os mais usados, o fentanil é o mais forte, muitas vezes mais que a morfina. Morfina, oxicodona e metadona também são fortes. Codeína e tramadol são os mais fracos, mas também podem causar dependência.",
      },
      {
        pergunta: "Qual a diferença entre analgésico e opioide?",
        resposta:
          "Todo opioide é um analgésico, mas nem todo analgésico é opioide. Dipirona, paracetamol e ibuprofeno são analgésicos comuns e não causam o mesmo tipo de dependência. Os opioides são mais fortes e pedem receita especial.",
      },
      {
        pergunta: "O Tramal é morfina?",
        resposta:
          "Não. Tramal é um dos nomes comerciais do tramadol, que é um opioide mais fraco que a morfina. Mesmo assim, pode causar dependência e abstinência, e a dose deve ser a que o médico receitou.",
      },
      {
        pergunta: "Opioide pode matar?",
        resposta:
          "Pode, principalmente em dose alta ou misturado com álcool e calmantes, porque a respiração fica lenta demais. Se a pessoa não acorda, respira muito devagar ou está com os lábios arroxeados, ligue para o SAMU no 192.",
      },
    ],
    imagem: true,
    imagemAlt: "Mão segurando um pequeno frasco de vidro com líquido transparente, com um quarto claro e plantas desfocados ao fundo.",
    imagemCard: true,
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
