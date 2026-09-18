-- Natureza do serviço público, no lugar da heurística por palavra-chave que vivia no route handler.
-- A ordem de declaração do enum é a ordem de exibição: enum do Postgres ordena por ela.
-- `ordem` é a prioridade manual dentro de cada natureza, provisória até existir regra por relato.
-- Idempotente: pode rodar de novo sem quebrar se uma execução anterior parou no meio.

do $$ begin
  create type natureza_servico as enum (
    'saude_drogas',
    'saude_mental',
    'saude_geral',
    'assistencia_social',
    'seguranca'
  );
exception when duplicate_object then null;
end $$;

-- `ativo` foi criada direto no dashboard antes desta migration; fica registrada aqui pro repo bater com o banco.
alter table servicos_publicos add column if not exists ativo boolean default true;
alter table instituicoes_apoio add column if not exists ativo boolean default true;

alter table servicos_publicos add column if not exists natureza natureza_servico;
alter table servicos_publicos add column if not exists ordem int not null default 0;
alter table instituicoes_apoio add column if not exists ordem int not null default 0;

update servicos_publicos set natureza = 'saude_drogas'
  where nome ilike 'CAPS AD%' or nome ilike 'Ligue 132%';

update servicos_publicos set natureza = 'saude_mental'
  where nome ilike '188%' and nome ilike '%CVV%';

update servicos_publicos set natureza = 'saude_geral'
  where nome ilike 'UBS%' or nome ilike 'Disque Saúde 136%' or (nome ilike '192%' and nome ilike '%SAMU%');

update servicos_publicos set natureza = 'assistencia_social'
  where nome ilike 'CRAS%' or nome ilike 'Disque 100%';

update servicos_publicos set natureza = 'seguranca'
  where nome ilike '190%Polícia Militar%' or nome ilike 'Disque denúncia 181%';

-- Se algum serviço não bateu nos updates acima, o not null falha aqui de propósito:
-- melhor a migration parar do que classificar um serviço em silêncio.
alter table servicos_publicos alter column natureza set not null;

alter table servicos_publicos drop column if exists tipo;
drop type if exists tipo_servico_publico;
