-- Link curto de pagamento: /plano#{primeiro-nome}-{ultimo-nome}-{4 aleatórios}, por exemplo
-- queila-duarte-k7m2. O nome só diz de quem é o link; quem protege são os 4 caracteres aleatórios, de
-- um alfabeto de 32 sem os que confundem (0, o, 1, l), tirados do gerador seguro do pgcrypto. O link
-- longo (token_apoio) continua valendo.
--
-- link_pagamento fica pronto na tabela, para copiar do editor do Supabase.

create or replace function gerar_codigo_link(nome text) returns text
language plpgsql volatile as $$
declare
  alfabeto constant text := 'abcdefghijkmnpqrstuvwxyz23456789';
  palavras text[];
  base text;
  sufixo text;
  bytes bytea;
  i int;
begin
  palavras := regexp_split_to_array(
    trim(regexp_replace(
      translate(lower(coalesce(nome, '')), 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn'),
      '[^a-z ]', '', 'g')),
    '\s+');
  base := palavras[1];
  if array_length(palavras, 1) > 1 then
    base := base || '-' || palavras[array_length(palavras, 1)];
  end if;
  if base is null or base = '' then
    base := 'profissional';
  end if;

  loop
    bytes := extensions.gen_random_bytes(4);
    sufixo := '';
    for i in 0..3 loop
      sufixo := sufixo || substr(alfabeto, (get_byte(bytes, i) % 32) + 1, 1);
    end loop;
    exit when not exists (select 1 from profissionais_cadastrados where codigo_link = base || '-' || sufixo);
  end loop;
  return base || '-' || sufixo;
end;
$$;

alter table profissionais_cadastrados add column codigo_link text unique;

update profissionais_cadastrados set codigo_link = gerar_codigo_link(nome) where codigo_link is null;

alter table profissionais_cadastrados alter column codigo_link set not null;

-- Cadastro novo ganha o código sozinho.
create or replace function preencher_codigo_link() returns trigger
language plpgsql as $$
begin
  if new.codigo_link is null then
    new.codigo_link := gerar_codigo_link(new.nome);
  end if;
  return new;
end;
$$;

create trigger profissionais_codigo_link
  before insert on profissionais_cadastrados
  for each row execute function preencher_codigo_link();

alter table profissionais_cadastrados
  add column link_pagamento text generated always as ('https://www.somosmargem.com.br/plano#' || codigo_link) stored;

-- As duas funções só servem ao banco: ninguém de fora chama pela API.
revoke execute on function gerar_codigo_link(text) from public, anon, authenticated;
revoke execute on function preencher_codigo_link() from public, anon, authenticated;
-- A rota de cadastro grava com a service role, e o gatilho chama o gerador em nome dela.
grant execute on function gerar_codigo_link(text) to service_role;
grant execute on function preencher_codigo_link() to service_role;
