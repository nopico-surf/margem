-- Margem v0 — schema inicial
-- Rodar no Supabase SQL Editor (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create type tipo_interacao as enum ('campo_aberto', 'card', 'pergunta_aprofundamento');
create type origem_resposta as enum ('gerada_gemini', 'escrita_manual');
create type especialidade_profissional as enum ('psicologo', 'psiquiatra', 'assistente_social');
create type status_profissional as enum ('ativo', 'pago', 'gratuito');
create type tipo_instituicao as enum ('NA', 'AA', 'grupo_apoio', 'outro');
create type tipo_servico_publico as enum ('UBS', 'CAPS', 'outro');
create type tipo_telefone_util as enum ('CAPS', 'UBS', 'CVV', 'SAMU', 'PM', 'disque_social', 'outro');
create type tipo_emergencia as enum ('suicidio', 'overdose', 'ferimento', 'convulsao');
create type acao_auditoria as enum ('criada', 'recebeu_orientacao', 'encerrada');

create table sessoes (
  id uuid primary key default gen_random_uuid(),
  timestamp_criacao timestamptz not null default now(),
  localizacao_usuario text,
  consentimento_lgpd boolean not null default false,
  timestamp_encerramento timestamptz
);

create table respostas (
  id uuid primary key default gen_random_uuid(),
  origem origem_resposta not null,
  chave_busca text,
  acolhimento text not null,
  orientacao text not null,
  pilula_espiritual text,
  checklist_agora jsonb not null default '[]',
  checklist_proximo jsonb not null default '[]',
  perguntas_aprofundamento jsonb not null default '[]',
  revisado_por_clinica boolean not null default false,
  criado_em timestamptz not null default now()
);

create unique index respostas_chave_busca_key on respostas (chave_busca) where chave_busca is not null;

create table historico_interacoes (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid not null references sessoes (id) on delete cascade,
  tipo tipo_interacao not null,
  texto_original text,
  resposta_id uuid references respostas (id),
  foi_cache_hit boolean not null default false,
  timestamp timestamptz not null default now()
);

create index historico_interacoes_sessao_id_idx on historico_interacoes (sessao_id);

create table profissionais_cadastrados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  especialidade especialidade_profissional not null,
  telefone text,
  email text,
  localizacao text,
  status status_profissional not null default 'ativo',
  categoria_resposta_relevante text
);

create table instituicoes_apoio (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  tipo tipo_instituicao not null,
  contatos jsonb not null default '[]',
  categoria_resposta_relevante text
);

create table servicos_publicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  tipo tipo_servico_publico not null,
  endereco text,
  telefone text,
  google_maps_link text,
  categoria_resposta_relevante text
);

create table telefones_uteis (
  id uuid primary key default gen_random_uuid(),
  tipo tipo_telefone_util not null,
  numero text not null,
  descricao text,
  categoria_resposta_relevante text
);

create table termos_risco (
  id uuid primary key default gen_random_uuid(),
  termo text not null,
  tipo_emergencia tipo_emergencia not null,
  numero_contato text not null,
  mensagem_escalacao text not null
);

create table cards_predefinidos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  resposta_id uuid references respostas (id),
  ordem int not null default 0
);

create table auditoria_sessoes (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid not null references sessoes (id) on delete cascade,
  acao acao_auditoria not null,
  timestamp timestamptz not null default now()
);

create index auditoria_sessoes_sessao_id_idx on auditoria_sessoes (sessao_id);

-- RLS ligado em tudo. Nenhuma policy criada: anon/authenticated não leem nem escrevem nada.
-- A service role (usada só no servidor) ignora RLS por padrão no Supabase.
alter table sessoes enable row level security;
alter table respostas enable row level security;
alter table historico_interacoes enable row level security;
alter table profissionais_cadastrados enable row level security;
alter table instituicoes_apoio enable row level security;
alter table servicos_publicos enable row level security;
alter table telefones_uteis enable row level security;
alter table termos_risco enable row level security;
alter table cards_predefinidos enable row level security;
alter table auditoria_sessoes enable row level security;
