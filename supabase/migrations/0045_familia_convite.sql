-- Programa Família, briefing M5 (10/11/2026): o convite do módulo 5 (C6). Uma linha por pessoa; editar
-- substitui. Mesmo modelo da 0040 a 0044: RLS sem policy (só o servidor acessa, depois de conferir o
-- token) e tudo apaga junto com a conta. A frase escrita pela pessoa nunca vai pra IA nem pro Mixpanel.

create table familia_convite (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Último passo concluído (0 a 5). Dá pra sair e voltar: a tela abre no passo seguinte.
  passo int not null default 0 check (passo between 0 and 5),
  -- Até 2: id do profissional parceiro, ou "servico:caps_ad" | "servico:ubs" | "servico:meu_sus" quando
  -- não há horário rápido e a pessoa salva um serviço no lugar.
  profissionais_salvos text[] not null default '{}' check (cardinality(profissionais_salvos) <= 2),
  frase text check (char_length(frase) <= 280),
  plano_b text check (plano_b in ('convidar_de_novo', 'focar_metas')),
  -- Só com "focar nas suas metas": a data pra pensar de novo (o aviso por e-mail ainda não existe).
  data_retorno date,
  -- "Contar como foi". Nulo enquanto a pessoa não contou (ou respondeu "Ainda não convidei").
  resultado text check (resultado in ('sim', 'pensar', 'nao')),
  data_resultado timestamptz,
  atualizado_em timestamptz not null default now()
);

alter table familia_convite enable row level security;
