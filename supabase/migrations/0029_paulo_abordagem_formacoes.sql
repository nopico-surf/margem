-- Paulo Victor Melo Lucena: bio, abordagem, formações e ano de início (2022) conforme o texto que ele enviou.
-- As tags não mudam. A previsão de 09/2027 do curso de TDAH não tem coluna, fica "em curso".
update profissionais_cadastrados
set
  bio = $bio$Psicólogo clínico com atuação desde 2022, com prática fundamentada na Gestalt-terapia. Possuo sólida experiência em psicoterapia individual e grupal, avaliação inicial, planejamento de intervenções e acompanhamento psicológico humanizado, com histórico de atuação interdisciplinar. Atendo adolescentes, adultos, idosos, pessoas neurodivergentes e pacientes com demandas voltadas à ansiedade e à depressão. Atualmente presto atendimento psicoterapêutico online e possuo certificados em Análise do Comportamento Aplicada (ABA), capacitação em Psicoterapia Breve.$bio$,
  abordagem = 'Gestalt-terapia, com interface complementar em Análise do Comportamento Aplicada (ABA) e Psicoterapia Breve.',
  formacoes = '[{"curso":"Diagnóstico e tratamento do TDAH","nivel":"Curso de Capacitação em curso","conclusao":null,"instituicao":"Universidade de São Paulo (USP)"},
    {"curso":"Análise do Comportamento Aplicada (ABA)","nivel":"Pós-graduação","conclusao":2026,"instituicao":"Faculdade Líbano"},
    {"curso":"Psicoterapia Breve","nivel":"Curso de Capacitação","conclusao":2026,"instituicao":"Instituto Ser Psicólogo"},
    {"curso":"Psicologia aplicada à reabilitação","nivel":"Curso de Capacitação","conclusao":2023,"instituicao":"Instituto Federal do Rio Grande do Sul (IFRS)"},
    {"curso":"Psicologia","nivel":"Bacharelado","conclusao":2021,"instituicao":"Escola Superior da Amazônia (Esamaz)"}]'::jsonb,
  ano_inicio_experiencia = 2022
where id = '00049e86-105d-4e54-a380-ea9c24027165'; -- Paulo Victor Melo Lucena
