-- O que as pessoas buscam no blog (/blog), pra saber que texto falta escrever.
--
-- Anônimo de propósito, pra todo mundo, sem depender do aceite: só o termo, quantos textos apareceram e
-- quando. Sem sessao_id, sem IP, sem nada que ligue a busca a alguém. A rota (/api/blog/busca) não
-- grava termo com e-mail ou com sequência longa de números (telefone, CPF).
create table buscas_blog (
  id bigint generated always as identity primary key,
  termo text not null check (char_length(termo) between 2 and 100),
  resultados int not null check (resultados >= 0),
  criado_em timestamptz not null default now()
);

create index buscas_blog_criado_em on buscas_blog (criado_em desc);

-- Só a service role grava e lê. Sem policy, anon e authenticated não enxergam a tabela.
alter table buscas_blog enable row level security;
