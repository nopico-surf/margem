-- Seed: profissionais reais cadastrados via formulário (planilha de profissionais).
-- Fotos ficam para depois: baixar de cada link do Google Drive e subir em /public ou
-- no storage do Supabase, depois atualizar foto_url por profissional.
-- status = 'gratuito' e categoria_resposta_relevante = 'geral' pra todos (decisão do usuário,
-- planilha não trazia essas colunas). anos_experiencia truncado pra baixo a partir do texto livre.
-- registro_profissional sem prefixo do conselho, normalizado pro padrão UF/número.

insert into profissionais_cadastrados (
  nome, especialidade, registro_profissional, anos_experiencia,
  whatsapp_link, email, localizacao, bio, tags, status, categoria_resposta_relevante
) values
(
  'Mauro Cesar Morais dos Santos',
  'psicologo',
  '06/117351',
  13,
  'https://wa.me/5511957996023',
  'maurocmorais@hotmail.com',
  'Rua Doutor Cesário Mota Júnior, 526, apto 806 - Vila Buarque, São Paulo/SP - CEP 01221020',
  'Sou psicólogo, formado em 2003, com experiência em atendimento clínico de adolescentes, adultos e idosos, em modalidades presencial e on-line. Minha orientação teórica é a Psicanálise, com experiência também em psicoterapia focal e breve. No acompanhamento de pessoas em uso de substâncias, busco oferecer uma escuta acolhedora e sem julgamentos, considerando a singularidade de cada pessoa, sua história e o contexto em que o uso ocorre. O trabalho é construído de forma individualizada, favorecendo a reflexão sobre o uso, o fortalecimento de recursos pessoais e a construção de estratégias possíveis para o cuidado e a mudança.',
  '["Gênero e sexualidade","População LGBTQIA+","Saúde mental e sofrimento psíquico","Ansiedade e depressão","Relacionamentos e conflitos interpessoais","Psicoterapia focal e breve"]'::jsonb,
  'gratuito',
  'geral'
),
(
  'Mychele Capellini',
  'psicologo',
  '06/85867',
  20,
  'https://wa.me/5516981772400',
  'mychele_c@hotmail.com',
  'Rua Nicarágua, 97 - Parque Boa Esperança, Indaiatuba/SP - CEP 13339250',
  'Sou psicóloga há 20 anos na saúde pública e há 10 anos atuo na clínica álcool e outras drogas tanto na frente assistencial como na gestão. Minha abordagem profissional é psicanalítica.',
  '["Redução de danos","violências","jogos patológicos","construção de projetos terapêuticos","manejos de crises","população em situação de vulnerabilidades","psicologia social crítica","psicologia clínica","psicoterapias"]'::jsonb,
  'gratuito',
  'geral'
),
(
  'Viviane de Melo Ciza',
  'psicologo',
  '08/49351',
  2,
  'https://wa.me/5541999566953',
  'viviane980@hotmail.com',
  'Rua: João Bettega, 649, Sala A - Portão, Curitiba - PR - CEP 81070-000',
  'Sou Viviane de Melo Ciza, psicóloga clínica (CRP-08/49351) e neuropsicóloga. No acompanhamento de pessoas que enfrentam dificuldades com o uso de substâncias, meu olhar é inteiramente focado no paciente. Acredito que cada indivíduo traz uma história única, por isso acolho o sofrimento sem julgamentos e adapto o formato do atendimento à realidade, ao ritmo e às necessidades de quem está buscando ajuda.

Minha atuação é totalmente guiada pela Prática Baseada em Evidências (PBE), utilizando o que há de mais seguro e comprovado na ciência para oferecer um suporte eficiente. Como base metodológica, trabalho com a Terapia Cognitivo-Comportamental (TCC) e estratégias de redução de danos, ajudando o paciente a identificar gatilhos, transformar padrões de comportamento e construir ferramentas práticas para os desafios do dia a dia.

Além disso, trago uma bagagem de mais de 15 anos na área da saúde que faz muita diferença: sou graduada em Psicologia, Farmácia e Ciências Biológicas, com especialização em Psicopatologia e Saúde Mental. Essa visão multidisciplinar me permite compreender a fundo os impactos biológicos das substâncias no organismo e o funcionamento dos medicamentos. Dessa forma, consigo alinhar o processo terapêutico à conduta médica de maneira clara, promovendo um cuidado integrado que respeita a autonomia, a regulação emocional e o desenvolvimento pessoal do paciente.',
  '["Redução de Danos","Manejo de Recaídas","Psicofarmacologia e Neurobiologia","Manejo de Ansiedade e Depressão","Avaliação Neuropsicológica","Acolhimento Familiar"]'::jsonb,
  'gratuito',
  'geral'
),
(
  'Sarah Todaro',
  'psicologo',
  '06/169190',
  5,
  'https://wa.me/5511968513751',
  'sarah_todaro@hotmail.com',
  'Av Antônio Frederico Ozanam, 2111 - Ponte de São João, Jundiai - CEP 13218000',
  'Sou psicóloga, especialista em Terapia Cognitivo-Comportamental pela PUCRS, com atuação clínica desde 2021. Ofereço um espaço de escuta acolhedora, ética e sem julgamentos, respeitando a história e o momento de cada pessoa.

No acompanhamento de pessoas em uso de álcool e outras substâncias, busco unir fatores emocionais, comportamentais e contextuais relacionados ao uso, trabalhando de forma colaborativa na identificação de padrões, no desenvolvimento de estratégias de enfrentamento e na construção de mudanças possíveis. O processo é individualizado e respeita o ritmo, as necessidades e os objetivos de cada pessoa.',
  '["Ansiedade","Depressão","Manejo de Recaídas","Luto e Relacionamentos"]'::jsonb,
  'gratuito',
  'geral'
),
(
  'Ariany Lis Rossi',
  'psicologo',
  '06/216403',
  1,
  'https://wa.me/5517991243130',
  'psi.arianylis@gmail.com',
  'Avenida Miguel Damha, 3001, QY L7 - DAMHA IV, São Paulo - CEP 15061850',
  'Atualmente atuo como Psicóloga clínica e institucional, onde ofereço suporte psicológico com foco no bem-estar emocional e desenvolvimento pessoal. Além disso, sou Educadora de Habilidades Socioemocionais e Biblioterapeuta, desenvolvendo atividades que integram literatura e competências socioemocionais. Mantenho atuação como psicóloga clínica baseada na abordagem psicanalítica, possuo formação em Acompanhamento Terapêutico e e especialização em Biblioterapia e Mediação da Leitura Literária pela Unochapecó e em Neuropsicologia pela Universidade Anhembi Morumbi. Minha trajetória combina saúde mental, educação e literatura, com experiências que incluem a produção de livros e publicações acadêmicas voltados para intervenções terapêuticas e promoção de saúde emocional em contextos de vulnerabilidade.',
  '["Redução de danos","população vulnerável","acolhimento familiar","adolescentes"]'::jsonb,
  'gratuito',
  'geral'
),
(
  'Vanessa Pondé',
  'psicologo',
  '03/32216',
  1,
  'https://wa.me/5571992055181',
  'psicologavanessaponde@gmail.com',
  'Almirante Amintas Jorge, 39 - Acupe, Salvador - Bahia - CEP 40290300',
  'Sou psicóloga clínica, pós-graduada em Terapia Cognitivo-Comportamental e com capacitação contínua nessa abordagem. Atualmente, estou em formação em Neuropsicologia, ampliando o olhar sobre os processos cognitivos, emocionais e comportamentais.

O trabalho que realizo é orientado pela Terapia Cognitivo-Comportamental, com condução flexível e adaptada à singularidade de cada pessoa. O processo terapêutico comigo é construído de forma personalizada, considerando contexto, ritmo e necessidades de quem está em acompanhamento.

A escuta clínica que ofereço também é atravessada por referências da Abordagem Centrada na Pessoa, com ênfase na empatia, escuta ativa e fortalecimento da autonomia. Há ainda inspiração em contribuições da psicologia analítica, especialmente na atenção aos símbolos, imagens e significados que emergem na experiência como possíveis caminhos de compreensão.

A minha prática é guiada pela ética, respeito à diversidade e compromisso com uma escuta acolhedora e inclusiva. O espaço terapêutico que me proponho a construir com você é pensado para que possa se expressar com liberdade, sem julgamentos, favorecendo o desenvolvimento de recursos para lidar com desafios, ampliar percepções e promover saúde emocional.

Se fizer sentido para você, entre em contato para conversarmos e avaliarmos em conjunto a possibilidade de iniciar esse processo.',
  '["Fobia Social","Alterações de Humor","Transtorno de Ansiedade Generalizada","Depressão","Dependências Químicas e Tecnológicas","Regulação Emocional","Desafios Relacionais","Vivências LGBTQPIAN+"]'::jsonb,
  'gratuito',
  'geral'
),
(
  'Cecília Magalhães',
  'psicologo',
  '24/05803',
  1,
  'https://wa.me/5569992398088',
  'ceciliamagalhaes.psi@gmail.com',
  'Vicente Rondon, 4695 - Rio Madeira, RO - CEP 76821490',
  'Psicóloga, com atuação clínica voltada ao cuidado em saúde mental de adolescentes, adultos e idosos na abordagem TCC. Meu trabalho é pautado na escuta acolhedora, no respeito à singularidade de cada pessoa e na construção conjunta de estratégias para lidar com diferentes demandas emocionais e relacionais. Busco oferecer um espaço seguro e ético, que favoreça o autoconhecimento, o desenvolvimento pessoal e a promoção de qualidade de vida.',
  '["LGBTQIAPN+","pessoas trans","agressividade","insegurança","depressão","relacionamentos"]'::jsonb,
  'gratuito',
  'geral'
),
(
  'Lauany Silva',
  'psicologo',
  '03/36294',
  1,
  'https://wa.me/5577992097754',
  'psilauanysilva@gmail.com',
  'Rua Otacílio Gomes, Número 364, Casa - Ovídio Teixeira, Caetité- Bahia - CEP 46405-200',
  'Meu trabalho é orientado pela psicanálise e parte de uma escuta ética, acolhedora e atenta à subjetividade de cada pessoa. A clínica é um espaço para falar sobre aquilo que atravessa a vida, inclusive o que ainda não conseguimos nomear. É pela fala e pela escuta que algumas questões podem ganhar outros sentidos, permitindo olhar para o que causa sofrimento, para aquilo que se repete e para o que, muitas vezes, permanece sem resposta. Cada processo se constrói de uma maneira própria, respeitando o tempo e a história de quem chega.

Realizo atendimentos psicológicos online com adolescentes e adultos.',
  '["Ansiedade","Depressão","Estresse","Conflitos familiares","Compulsões","LGBTQIA+","Adolescência","Sexualidade","Insônia","Procrastinação"]'::jsonb,
  'gratuito',
  'geral'
),
(
  'Paulo Victor Melo Lucena',
  'psicologo',
  '10/08563',
  5,
  'https://wa.me/5541999244480',
  'paulovictorlucena@gmail.com',
  'Rua Lothário Boutin, 553, Bloco 6 apto 104 - Pinheirinho, Paraná - CEP 81110522',
  'Sou formado a 5 anos, atuo na clínica desde então, atudo através da abordagem da gestalt terapia. Realizando uma escuta empática e humanizada.',
  '["Adolescente","adultos","idosos","redução de danos","população lgbtqiapn+"]'::jsonb,
  'gratuito',
  'geral'
);
