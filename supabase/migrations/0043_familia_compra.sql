-- Programa para familiares: compra pelo Pix e pedido de acesso gratuito (briefing 01, oferta e pagamento).
--
-- A compra é um apoio como os outros (mesma tabela, mesmo webhook, mesma tela de status), com público
-- 'familia' e o user_id da conta. É o único jeito de o webhook saber de quem liberar o acesso. Continua
-- valendo o resto da 0026: nome e CPF ficam só no Asaas, e nada aqui liga a compra a uma sessão da
-- conversa anônima.
--
-- O valor novo do enum não pode ser usado na mesma transação em que nasce: por isso as restrições
-- abaixo comparam o público como texto.

alter type publico_apoio add value if not exists 'familia';

alter table apoios
  -- Conta que comprou. Se a conta for apagada, o registro do pagamento fica, sem dono.
  add column familia_user_id uuid references auth.users (id) on delete set null,
  add column familia_plano text check (familia_plano in ('programa', 'acompanhamento')),
  -- Só no plano com acompanhamento: a parte do valor que é da primeira sessão com o profissional.
  add column valor_sessao numeric(10, 2) check (valor_sessao > 0);

alter table apoios drop constraint apoios_check;
alter table apoios add constraint apoios_check check (publico::text in ('geral', 'familia') or frequencia = 'mensal');

alter table apoios drop constraint apoios_plano_base_check;
alter table apoios add constraint apoios_plano_base_check check ((publico::text in ('geral', 'familia')) = (plano_base is null));

alter table apoios drop constraint apoios_profissional_check;
alter table apoios add constraint apoios_profissional_check check ((publico::text in ('geral', 'familia')) = (profissional_id is null));

-- Compra da família sempre tem plano; sessão só no plano com acompanhamento.
alter table apoios add constraint apoios_familia_publico_check check ((publico::text = 'familia') = (familia_plano is not null));
alter table apoios add constraint apoios_sessao_so_acompanhamento_check check ((familia_plano = 'acompanhamento') = (valor_sessao is not null));

create index apoios_familia_user_idx on apoios (familia_user_id) where familia_user_id is not null;

-- "Pedir acesso gratuito": sem comprovante de renda, o texto é opcional. Quem libera é o fundador, à
-- mão, no painel do Supabase:
--   update familia_perfis set acesso_liberado_em = now() where user_id = '<user_id>';
--   update familia_pedidos_gratuidade set atendido_em = now() where id = '<id>';
create table familia_pedidos_gratuidade (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  texto text check (char_length(texto) <= 500),
  criado_em timestamptz not null default now(),
  atendido_em timestamptz
);

create index familia_pedidos_gratuidade_user_idx on familia_pedidos_gratuidade (user_id);

-- Como as outras tabelas familia_*: RLS ligado e nenhuma policy, só o servidor lê e grava.
alter table familia_pedidos_gratuidade enable row level security;
