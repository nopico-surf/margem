-- Cecília Magalhães: abordagem e formação conforme o texto que ela enviou.
update profissionais_cadastrados
set
  abordagem = 'Terapia Cognitivo Comportamental',
  formacoes = '[{"curso":"Psicologia","nivel":"Bacharelado","conclusao":2024,"instituicao":"Faculdade Católica de Rondônia"}]'::jsonb
where id = '91f47c86-60bc-470b-98fc-ff8669274e1a'; -- Cecília Magalhães
