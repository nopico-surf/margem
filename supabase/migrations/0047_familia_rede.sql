-- Programa Família, briefing M7 (11/11/2026): a rede de apoio do módulo 7 (C10). Uma linha por pessoa.
-- Mesmo modelo da 0040 a 0045: RLS sem policy (só o servidor acessa, depois de conferir o token) e tudo
-- apaga junto com a conta. Os nomes são só pra pessoa ver: nunca vão pra IA nem pro Mixpanel.

create table familia_rede (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Até 2 nomes ou apelidos de quem pode estar com a pessoa.
  nomes text[] not null default '{}' check (cardinality(nomes) <= 2),
  -- "Contar que mandei": [{ "mensagem": 0..3 (qual das 4 mensagens prontas, ou null), "quando": iso }].
  -- Guarda o número da mensagem, nunca o texto.
  mensagens jsonb not null default '[]'::jsonb,
  -- "Contar que fui": [{ "grupo": "al_anon" | "nar_anon" | ..., "quando": iso }].
  grupos jsonb not null default '[]'::jsonb,
  atualizado_em timestamptz not null default now()
);

alter table familia_rede enable row level security;
