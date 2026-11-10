-- Programa Família: itens do exercício da semana marcados como feitos e o diário (ajustes do
-- fundador de 10/11/2026). Mesmo modelo da 0040: RLS sem policy (só o servidor acessa, depois de
-- conferir o token) e tudo apaga junto com a conta.

create table familia_exercicios (
  user_id uuid not null references auth.users (id) on delete cascade,
  modulo int not null,
  -- id do item no markdown do módulo (":::exercicio id=..."), ex.: tempo_so_seu, observe, conversa.
  item text not null,
  feito_em timestamptz not null default now(),
  primary key (user_id, modulo, item)
);

create table familia_diario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- "uso": uso ou aposta; "momento_bom": momento bom (o briefing pede os dois).
  tipo text not null check (tipo in ('uso', 'momento_bom')),
  -- Quando aconteceu (a pessoa pode ajustar); criado_em é quando foi anotado.
  quando timestamptz not null default now(),
  -- Todos opcionais e curtos (briefing, módulo 2). Texto livre do familiar: nunca vai pra IA nem pro Mixpanel.
  antes text,
  percebeu text,
  reagiu text,
  depois text,
  criado_em timestamptz not null default now()
);
create index familia_diario_user_idx on familia_diario (user_id, quando desc);

alter table familia_exercicios enable row level security;
alter table familia_diario enable row level security;
