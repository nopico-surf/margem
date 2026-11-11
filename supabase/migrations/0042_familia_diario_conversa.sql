-- Programa Família, briefings M1 e M2 (10/11/2026): diário com chips de múltipla escolha e o registro
-- "Como foi a conversa". Mesmo modelo da 0040 e da 0041: RLS sem policy (só o servidor acessa, depois
-- de conferir o token) e tudo apaga junto com a conta.

-- Diário: tipo passa a ser dificil | bom, e cada campo vira uma lista de escolhas.
alter table familia_diario drop constraint familia_diario_tipo_check;
update familia_diario set tipo = case tipo when 'uso' then 'dificil' else 'bom' end;
alter table familia_diario add constraint familia_diario_tipo_check check (tipo in ('dificil', 'bom'));

alter table familia_diario
  alter column antes type text[] using case when antes is null then null else array[antes] end,
  alter column percebeu type text[] using case when percebeu is null then null else array[percebeu] end,
  alter column reagiu type text[] using case when reagiu is null then null else array[reagiu] end,
  alter column depois type text[] using case when depois is null then null else array[depois] end;

alter table familia_diario
  add column buscou text[],
  add column bom_o_que text[],
  add column bom_sentiu text[],
  -- Opcional e curto. Nunca vai pra IA, pro Mixpanel nem pro resumo do profissional sem marcação do familiar.
  add column texto_livre text;

-- "Como foi a conversa": uma linha por registro (módulos 1, 3 e 5).
create table familia_conversa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  modulo int not null check (modulo in (1, 3, 5)),
  -- Frase usada (do roteiro, de "Minhas frases" ou escrita pela pessoa); vazia em "Não lembro".
  frase text,
  como_foi text not null check (como_foi in ('com_calma', 'coracao_acelerado', 'esquentou', 'travei')),
  reacao text check (reacao in ('ouviu', 'abertura', 'negou', 'mudou_assunto', 'irritou')),
  criado_em timestamptz not null default now()
);
create index familia_conversa_user_idx on familia_conversa (user_id, criado_em desc);

alter table familia_conversa enable row level security;
