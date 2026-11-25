-- Programa para familiares: e-mails com acesso pré-liberado.
--
-- Quem tem o e-mail aqui entra na /familia sem passar pela etapa de pagamento: ao criar o perfil
-- (ou na próxima passagem pela rota, se o perfil já existir), o servidor grava acesso_liberado_em.
-- Pra liberar mais alguém: insert into familia_emails_liberados (email) values ('pessoa@exemplo.com');

create table familia_emails_liberados (
  email text primary key check (email = lower(email)),
  observacao text,
  criado_em timestamptz not null default now()
);

-- Como as outras tabelas familia_*: RLS ligado e nenhuma policy, só o servidor lê e grava.
alter table familia_emails_liberados enable row level security;

insert into familia_emails_liberados (email) values
  ('psilauanysilva@gmail.com'),
  ('vitorgaudio@gmail.com');
