-- Programa Família, briefings M3 e M4 (10/11/2026): frases reescritas (módulo 3) e as ferramentas do
-- módulo 4 (o que a pessoa gosta de fazer, plano de valorizar e "o combinado fica para outro dia").
-- Mesmo modelo da 0040 a 0042: RLS sem policy (só o servidor acessa, depois de conferir o token) e
-- tudo apaga junto com a conta. Texto escrito pela pessoa nunca vai pra IA nem pro Mixpanel.

-- Frases que viram briga, reescritas (módulo 3). Uma linha por frase.
create table familia_frase_reescrita (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- F1 a F10 quando a pessoa escolheu uma das frases prontas; vazio quando escreveu a própria.
  frase_antes_id text check (frase_antes_id in ('F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10')),
  frase_antes_texto text not null check (char_length(frase_antes_texto) between 1 and 280),
  frase_nova text not null check (char_length(frase_nova) between 1 and 280),
  -- Itens marcados na conferência (1 a 6). Nenhum é obrigatório.
  conferencia int[] not null default '{}' check (conferencia <@ array[1, 2, 3, 4, 5, 6]),
  criada_em timestamptz not null default now()
);
create index familia_frase_reescrita_user_idx on familia_frase_reescrita (user_id, criada_em desc);

-- Do que a pessoa gosta de fazer sem usar (módulo 4, exercício 1). Uma lista por pessoa; editar substitui.
create table familia_lista_gosta (
  user_id uuid primary key references auth.users (id) on delete cascade,
  itens text[] not null check (cardinality(itens) between 1 and 2),
  -- Busca do diário que abriu as ideias (relaxar, se divertir...), quando havia dado.
  busca_relacionada text,
  atualizado_em timestamptz not null default now()
);

-- Plano de valorizar a semana (módulo 4, exercício 2). Um plano por pessoa; editar na mesma semana
-- mantém os dias feitos, e um plano de outra semana começa sem eles.
create table familia_plano_valorizar (
  user_id uuid primary key references auth.users (id) on delete cascade,
  formas text[] not null check (cardinality(formas) = 2),
  dias text[] not null default '{}' check (dias <@ array['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']),
  periodos text[] not null default '{}' check (periodos <@ array['manha', 'tarde', 'noite']),
  -- Segunda-feira da semana do plano e os dias em que a pessoa marcou que valorizou.
  semana_inicio date not null,
  feitos date[] not null default '{}',
  atualizado_em timestamptz not null default now()
);

-- Quando o combinado fica para outro dia (módulo 4, exercício 3).
create table familia_adiar (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Resposta à pergunta de segurança. Com "sim" ou "nao_sei" o exercício fica "Deixado para depois".
  clima text not null check (clima in ('sim', 'nao', 'nao_sei')),
  situacao text check (char_length(situacao) <= 120),
  na_hora text check (char_length(na_hora) <= 280),
  depois text check (char_length(depois) <= 280),
  atualizado_em timestamptz not null default now()
);

alter table familia_frase_reescrita enable row level security;
alter table familia_lista_gosta enable row level security;
alter table familia_plano_valorizar enable row level security;
alter table familia_adiar enable row level security;
