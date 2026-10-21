-- Profissional entra na Margem pagando um plano: cadastro, aprovação manual, lista de espera, link de
-- pagamento, primeiro Pix e perfil no ar. O status passa a dizer em que ponto desse caminho a pessoa
-- está, e é ele (junto da pausa manual em "ativo") que decide quem aparece no site.

-- 1. Status do profissional
create type status_profissional_novo as enum (
  'em_analise',           -- enviou o cadastro
  'recusado',             -- Vitor não aprovou
  'lista_espera',         -- aprovado, sem vaga ainda
  'aguardando_pagamento', -- recebeu o link de pagamento
  'ativo',                -- primeiro pagamento caiu: aparece no site
  'gratuito',             -- já estava na Margem antes da cobrança: aparece no site
  'inadimplente',         -- mensalidade falhou: aparece por 7 dias desde inadimplente_desde
  'cancelado'             -- cancelou ou foi estornado
);

alter table profissionais_cadastrados alter column status drop default;
alter table profissionais_cadastrados
  alter column status type status_profissional_novo
  using (case status::text when 'pago' then 'ativo' else status::text end)::status_profissional_novo;
drop type status_profissional;
alter type status_profissional_novo rename to status_profissional;
alter table profissionais_cadastrados alter column status set default 'em_analise';

-- Estava como "ativo" e fora do ar; no modelo novo, "ativo" quer dizer que pagou.
update profissionais_cadastrados set status = 'cancelado' where nome = 'Mychele Capellini' and status = 'ativo';

-- 2. Plano e caminho do cadastro
create type plano_profissional as enum ('perfil', 'destaque', 'divulgacao', 'divulgacao_plus');

alter table profissionais_cadastrados
  add column rqe text,
  add column plano_escolhido plano_profissional,
  -- Código do link pessoal de pagamento: 64 caracteres aleatórios, nunca vai pro navegador fora do link.
  add column token_apoio text not null unique default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  add column cadastrado_em timestamptz not null default now(),
  add column aprovado_em timestamptz,
  add column ativado_em timestamptz,         -- primeiro pagamento: conta os 14 dias de cancelamento com estorno
  add column inadimplente_desde timestamptz, -- conta os 7 dias de tolerância
  add column cancelado_em timestamptz,
  add column observacao_interna text;

-- 3. Apoio ligado ao profissional
alter type status_apoio add value 'estornado';

alter table apoios
  add column profissional_id uuid references profissionais_cadastrados (id),
  add column plano plano_profissional,
  add column estornado_em timestamptz,
  -- Profissional sempre tem cadastro e plano; pessoa em geral nunca.
  add constraint apoios_profissional_check check ((publico = 'geral') = (profissional_id is null)),
  add constraint apoios_plano_check check ((publico = 'geral') = (plano is null));

create index apoios_profissional_id_idx on apoios (profissional_id);
