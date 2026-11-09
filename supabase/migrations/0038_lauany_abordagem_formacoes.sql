-- Lauany Silva: abordagem e formação conforme o texto que ela enviou.
update profissionais_cadastrados
set
  abordagem = 'Psicanálise.',
  formacoes = '[{"curso":"Psicologia","nivel":"Bacharelado","conclusao":2026,"instituicao":"Centro Universitário UNIFG"}]'::jsonb
where id = '13433c7d-1ba6-4b8b-be83-18d15d200836'; -- Lauany Silva
