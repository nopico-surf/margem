-- "Pedir o dinheiro de volta" (briefing 01b): 14 dias contados da liberação do acesso, sem precisar
-- explicar o motivo, o texto é opcional. O pedido não bloqueia nada: o acesso continua até a devolução.
-- Quem devolve é o fundador, à mão, no painel do Asaas (o estorno chega pelo webhook e tira o acesso).
-- Depois de devolver, marcar o pedido:
--   update familia_pedidos_devolucao set atendido_em = now() where id = '<id>';
create table familia_pedidos_devolucao (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  texto text check (char_length(texto) <= 500),
  criado_em timestamptz not null default now(),
  atendido_em timestamptz
);

create index familia_pedidos_devolucao_user_idx on familia_pedidos_devolucao (user_id);

-- Como as outras tabelas familia_*: RLS ligado e nenhuma policy, só o servidor lê e grava.
alter table familia_pedidos_devolucao enable row level security;
