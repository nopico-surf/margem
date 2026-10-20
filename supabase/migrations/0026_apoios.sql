-- Apoiar a Margem: estado de cada apoio (doação ou taxa de profissional) pago por Pix no Asaas.
--
-- Nome, CPF e e-mail de quem apoia ficam só no Asaas. Aqui ficam os ids do Asaas, o plano, o valor e o
-- status, pra o site saber o que está ativo. De propósito, nenhuma coluna liga o apoio a uma sessão:
-- quem apoia pode ser alguém que usou a Margem pra pedir ajuda, e as duas coisas não podem se cruzar.

create type publico_apoio as enum ('psicologo', 'medico', 'geral');
create type frequencia_apoio as enum ('unico', 'mensal');

-- aguardando: QR code gerado, ainda não pago
-- pago: doação única recebida
-- ativo: Pix Automático autorizado, cobrando todo mês
-- inadimplente: autorização ativa, mas a cobrança do mês foi recusada (sem saldo, por exemplo)
-- recusado / expirado / cancelado: autorização ou QR code que não vingou ou foi encerrado
-- falhou: o Asaas recusou a criação, nenhum QR code chegou a ser mostrado
create type status_apoio as enum ('aguardando', 'pago', 'ativo', 'inadimplente', 'recusado', 'expirado', 'cancelado', 'falhou');

create table apoios (
  id uuid primary key default gen_random_uuid(),
  publico publico_apoio not null,
  frequencia frequencia_apoio not null,
  valor numeric(10, 2) not null check (valor > 0),
  status status_apoio not null default 'aguardando',
  asaas_cliente_id text,
  asaas_cobranca_id text unique,
  asaas_autorizacao_id text unique,
  asaas_assinatura_id text unique,
  ultimo_pagamento_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  -- Profissional é sempre mensal.
  check (publico = 'geral' or frequencia = 'mensal')
);

create index apoios_status_idx on apoios (status);

-- Um registro por evento de webhook recebido, pra o mesmo evento não ser processado duas vezes (o
-- Asaas entrega "pelo menos uma vez"). Guarda só o id e o tipo, nunca o corpo do evento.
create table eventos_asaas (
  id text primary key,
  tipo text not null,
  apoio_id uuid references apoios (id) on delete set null,
  recebido_em timestamptz not null default now()
);

-- RLS ligado e nenhuma policy, como no resto do banco: só a service role (servidor) lê e escreve.
alter table apoios enable row level security;
alter table eventos_asaas enable row level security;
