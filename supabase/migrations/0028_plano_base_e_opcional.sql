-- Planos de profissional (Figma, Experiência do produto, 1534:28280): um plano base, que define as
-- vagas (pessoas em acompanhamento simultâneo), mais no máximo um opcional para turbinar a presença.
-- O valor cobrado é a soma dos dois, calculada no servidor (lib/apoio/planos.ts).
--
-- Substitui o plano único da 0027. Rodada quando nenhum apoio nem cadastro usava o plano antigo.

create type plano_base as enum ('prata', 'ouro', 'diamante');
create type plano_opcional as enum ('destaque', 'divulgacao', 'divulgacao_plus');

-- Escolha feita no cadastro, que o link pessoal de pagamento traz já marcada.
alter table profissionais_cadastrados
  drop column plano_escolhido,
  add column plano_base_escolhido plano_base,
  add column opcional_escolhido plano_opcional;

-- O que foi efetivamente pago em cada apoio.
alter table apoios
  drop constraint apoios_plano_check,
  drop column plano,
  add column plano_base plano_base,
  add column plano_opcional plano_opcional,
  -- Profissional sempre tem plano base; pessoa em geral nunca. Opcional só junto de um plano base.
  add constraint apoios_plano_base_check check ((publico = 'geral') = (plano_base is null)),
  add constraint apoios_plano_opcional_check check (plano_opcional is null or plano_base is not null);

drop type plano_profissional;
