-- Programa Família: escala "Como está a sua vida" e meta da semana (componentes-parte1, C1).
-- Mesmo modelo da 0040 e da 0041: RLS sem policy (só o servidor acessa, depois de conferir o token)
-- e tudo apaga junto com a conta.

create table familia_escala_vida (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- modulo1: primeira vez; modulo7: refazer e comparar; painel: "Escolher outra área" no check-in.
  origem text not null check (origem in ('modulo1', 'modulo7', 'painel')),
  -- { "SONO": 1..10, ..., "SENTIDO": 1..10 }. TRABALHO pode ser null ("Não se aplica agora").
  notas jsonb not null,
  criado_em timestamptz not null default now()
);
create index familia_escala_vida_user_idx on familia_escala_vida (user_id, criado_em desc);

create table familia_meta_semana (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  area text not null check (area in ('SONO', 'FAMILIA', 'AMIZADES', 'LAZER', 'TRABALHO', 'DINHEIRO', 'EMOCIONAL', 'SENTIDO')),
  -- Texto do familiar (até 120 caracteres): nunca vai pra IA nem pro Mixpanel.
  texto text not null check (char_length(texto) between 1 and 120),
  -- Dias marcados, de seg a dom. Pelo menos um.
  dias text[] not null check (cardinality(dias) >= 1 and dias <@ array['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']),
  momento text check (momento in ('manha', 'tarde', 'noite')),
  confianca int check (confianca between 0 and 10),
  obstaculo_plano text check (char_length(obstaculo_plano) <= 280),
  -- Segunda-feira da semana da meta.
  semana_inicio date not null,
  -- ativa até o check-in; depois concluida (Fiz), parcial (Fiz em parte) ou nao_deu.
  status text not null default 'ativa' check (status in ('ativa', 'concluida', 'parcial', 'nao_deu')),
  dias_feitos date[] not null default '{}',
  motivo_nao_deu text check (motivo_nao_deu in ('tempo', 'energia', 'aconteceu_algo', 'esqueci', 'grande_demais', 'outro')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index familia_meta_semana_user_idx on familia_meta_semana (user_id, criado_em desc);
-- Uma meta ativa por pessoa.
create unique index familia_meta_semana_ativa_idx on familia_meta_semana (user_id) where status = 'ativa';

alter table familia_escala_vida enable row level security;
alter table familia_meta_semana enable row level security;
