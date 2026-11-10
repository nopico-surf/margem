-- Programa para familiares (/familia), Fase 1. Briefing em docs/familia-briefing.md.
--
-- É a única parte da Margem com conta: login social (Google, Apple, Facebook) pelo Supabase Auth.
-- Tudo aqui é dado sensível de saúde de uma terceira pessoa. Por isso:
--  - RLS ligado e nenhuma policy: só o servidor (service role) lê e grava, depois de conferir o
--    token da pessoa no route handler. O navegador nunca consulta essas tabelas direto.
--  - Tudo apaga em cascata quando a conta some (auth.users), pro "Apagar meus dados" da Fase 3.
--  - O simulador não guarda a conversa: só cenário, turnos e o feedback.
--  - Nada daqui cruza com `sessoes` nem com pagamento (decisão de 20/10/2026).

create table familia_perfis (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Vem do provedor. Quando o Facebook não manda (conta criada com telefone), a pessoa informa depois.
  email text,
  -- Só o primeiro nome que o provedor mandar, pra saudação. Nunca o nome do ente querido.
  nome text,
  consentimento_dados_em timestamptz not null,
  consentimento_dados_texto text not null,
  -- Mala direta: separada, opcional e desmarcada por padrão.
  consentimento_comunicacoes boolean not null default false,
  consentimento_comunicacoes_em timestamptz,
  consentimento_comunicacoes_texto text,
  -- Risco de violência sinalizado no diagnóstico (Q8/Q9) ou no check-in. Enquanto true, nada de
  -- marketing, mesmo com consentimento, e os módulos 5 e 7 ficam bloqueados.
  safety_mode boolean not null default false,
  -- Fase 2: preenchido pelo webhook do Pix. Nulo = não comprou.
  acesso_liberado_em timestamptz,
  -- Preparado pras turmas com psicóloga (fase posterior). Sem tabela ainda.
  turma_id uuid,
  criado_em timestamptz not null default now()
);

create table familia_diagnosticos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- As 12 respostas, nos ids de lib/familia/diagnostico.ts. O apelido vai junto (máx. 20 caracteres).
  respostas jsonb not null,
  safety_mode boolean not null,
  criado_em timestamptz not null default now()
);
create index familia_diagnosticos_user_idx on familia_diagnosticos (user_id, criado_em desc);

create table familia_simulacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cenario text not null,
  turnos int not null default 0,
  -- JSON do feedback (o_que_funcionou, o_que_tentar_diferente, frase_para_levar). Nulo enquanto não termina.
  feedback jsonb,
  -- A conversa parou por palavra de risco ou porque a IA saiu do personagem.
  parou_por_seguranca boolean not null default false,
  criado_em timestamptz not null default now(),
  concluido_em timestamptz
);
create index familia_simulacoes_user_idx on familia_simulacoes (user_id, criado_em desc);

create table familia_progresso (
  user_id uuid not null references auth.users (id) on delete cascade,
  modulo int not null,
  iniciado_em timestamptz not null default now(),
  concluido_em timestamptz,
  primary key (user_id, modulo)
);

alter table familia_perfis enable row level security;
alter table familia_diagnosticos enable row level security;
alter table familia_simulacoes enable row level security;
alter table familia_progresso enable row level security;
