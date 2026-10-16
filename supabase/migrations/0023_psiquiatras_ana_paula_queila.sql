-- Primeiros cadastros na aba de psiquiatras: Ana Paula Lima (formulário de 08/10/2026) e Queila
-- de França Duarte (09/10/2026). A Ana Paula é médica generalista (pós em Psiquiatria até 2027),
-- mas entra em 'psiquiatra' por decisão de 16/10/2026; o botão da aba passou a se chamar
-- "Médicos/Psiquiatras". A bio da Queila é o texto de experiência que ela mandou no formulário.
-- Fotos em /public/assets, com a versão -192.webp gerada por scripts/fotos-pequenas.mjs.

insert into profissionais_cadastrados
  (nome, especialidade, telefone, email, localizacao, status, categoria_resposta_relevante,
   registro_profissional, foto_url, bio, tags, whatsapp_link, ativo, abordagem, formacoes, ano_inicio_experiencia)
values
(
  'Ana Paula Lima', 'psiquiatra', '11947419160', 'draanapaulalima@outlook.com.br', 'São Paulo/SP',
  'gratuito', 'geral', 'SP 291257', '/assets/professional-ana-paula-lima.webp',
  $bio$Sou médica generalista, natural da Zona Leste de São Paulo, onde voltei a morar há um ano. Me formei em Medicina no Paraguai, onde vivi por seis anos, fui voluntária na Cruz Vermelha e tive meus primeiros contatos com associações e cultivadores de cannabis.

Hoje, minha principal área de atuação é a cannabis medicinal, com prescrição e acompanhamento de tratamentos com óleos, extratos e flores, conforme as normas vigentes. Também tenho grande interesse em Redução de Danos e nos estudos sobre psicodélicos. Atualmente, participo do NEPP (Núcleo de Estudos em Psicodélicos e Psicoterapia), com aulas semanais às segundas-feiras.

Frequento eventos da cena canábica e psicodélica em São Paulo, buscando sempre me atualizar, trocar experiências e ampliar meus conhecimentos. Acredito em uma medicina acessível, acolhedora e sem julgamentos, que respeite a autonomia e a individualidade de cada pessoa.$bio$,
  '["Cannabis Medicinal","Redução de Danos","Saúde Mental","Manejo de Ansiedade e Insônia","Dor Crônica","Acompanhamento Clínico Individualizado"]',
  'https://wa.me/5511968996977', true, null,
  '[{"curso":"Medicina","nivel":"Graduação","conclusao":2026,"instituicao":"UCP-PY, revalidação UNILA"},
    {"curso":"Direito","nivel":"Graduação","conclusao":2013,"instituicao":"UNIP"},
    {"curso":"Prescrição de Cannabis","nivel":"Curso","conclusao":2024,"instituicao":"LCP/UNILA"},
    {"curso":"Uso terapêutico da Cannabis sativa L.","nivel":"Curso","conclusao":2025,"instituicao":"UNIFESP"},
    {"curso":"Saúde Pública","nivel":"Especialização","conclusao":2024,"instituicao":"USP/SP"},
    {"curso":"Psiquiatria","nivel":"Pós-graduação em curso","conclusao":null,"instituicao":"SANAR"}]',
  2025
),
(
  'Queila de França Duarte', 'psiquiatra', '55999560351', 'queiladuarte53@gmail.com', 'Rio de Janeiro/RJ',
  'gratuito', 'geral', '5201084569', '/assets/professional-queila-de-franca-duarte.webp',
  'CAPS III AD Paulo da Portela, 2023. CAPSi Pequeno Hans, 2024 até hoje. Ambulatório de psiquiatria AP 5.1, Clínica da Família Waldir Franco, 2025 até hoje. Preceptoria de residência médica em psiquiatria, 2025 até hoje.',
  '["Depressão","Ansiedade","TEA","TDAH","Bipolaridade","Esquizofrenia","Redução de danos","Abstinência e uso de drogas"]',
  'https://wa.me/5511968996977', true, null,
  '[{"curso":"Medicina","nivel":"Graduação","conclusao":null,"instituicao":"UNIGRANRIO"},
    {"curso":"Psiquiatria","nivel":"Especialização","conclusao":2023,"instituicao":"Hospital Albert Einstein"},
    {"curso":"Psiquiatria da Infância e Adolescência","nivel":"Pós-graduação","conclusao":2025,"instituicao":"Hospital Albert Einstein"}]',
  2016
);
