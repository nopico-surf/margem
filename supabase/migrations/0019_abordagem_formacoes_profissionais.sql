-- Cards "Minha abordagem" e "Minhas formações" da página do profissional.
-- formacoes: [{ "curso": "", "instituicao": "", "nivel": "", "conclusao": 2025 }]
alter table profissionais_cadastrados
  add column abordagem text,
  add column formacoes jsonb not null default '[]'::jsonb;
