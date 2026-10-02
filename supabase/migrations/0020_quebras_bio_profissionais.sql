-- Quebras de parágrafo no "Sobre mim" de quem tinha o bio em um bloco só.
-- O texto não muda, só ganha linhas em branco entre os parágrafos (a tela respeita com white-space: pre-line).
-- O filtro "bio not like '%' || chr(10) || '%'" evita sobrescrever um bio que já tenha sido editado à mão no dashboard.

update profissionais_cadastrados
set bio = 'Atualmente atuo como Psicóloga clínica e institucional, onde ofereço suporte psicológico com foco no bem-estar emocional e desenvolvimento pessoal. Além disso, sou Educadora de Habilidades Socioemocionais e Biblioterapeuta, desenvolvendo atividades que integram literatura e competências socioemocionais.

Mantenho atuação como psicóloga clínica baseada na abordagem psicanalítica, possuo formação em Acompanhamento Terapêutico e e especialização em Biblioterapia e Mediação da Leitura Literária pela Unochapecó e em Neuropsicologia pela Universidade Anhembi Morumbi.

Minha trajetória combina saúde mental, educação e literatura, com experiências que incluem a produção de livros e publicações acadêmicas voltados para intervenções terapêuticas e promoção de saúde emocional em contextos de vulnerabilidade.'
where nome = 'Ariany Lis Rossi'
  and bio not like '%' || chr(10) || '%';

update profissionais_cadastrados
set bio = 'Psicóloga, com atuação clínica voltada ao cuidado em saúde mental de adolescentes, adultos e idosos na abordagem TCC.

Meu trabalho é pautado na escuta acolhedora, no respeito à singularidade de cada pessoa e na construção conjunta de estratégias para lidar com diferentes demandas emocionais e relacionais. Busco oferecer um espaço seguro e ético, que favoreça o autoconhecimento, o desenvolvimento pessoal e a promoção de qualidade de vida.'
where nome = 'Cecília Magalhães'
  and bio not like '%' || chr(10) || '%';

update profissionais_cadastrados
set bio = 'Sou psicólogo, formado em 2003, com experiência em atendimento clínico de adolescentes, adultos e idosos, em modalidades presencial e on-line. Minha orientação teórica é a Psicanálise, com experiência também em psicoterapia focal e breve.

No acompanhamento de pessoas em uso de substâncias, busco oferecer uma escuta acolhedora e sem julgamentos, considerando a singularidade de cada pessoa, sua história e o contexto em que o uso ocorre.

O trabalho é construído de forma individualizada, favorecendo a reflexão sobre o uso, o fortalecimento de recursos pessoais e a construção de estratégias possíveis para o cuidado e a mudança.'
where nome = 'Mauro Cesar Morais dos Santos'
  and bio not like '%' || chr(10) || '%';
