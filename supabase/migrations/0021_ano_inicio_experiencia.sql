-- Troca anos_experiencia (número fixo, ficava velho a cada ano) por ano_inicio_experiencia.
-- O front calcula "ano atual - ano de início" (lib/anos-experiencia.ts), então todo mundo sobe
-- junto em 1º de janeiro sem ninguém editar o banco.
-- De-para: ano de início = 2026 - anos_experiencia (valores de 28/09/2026, data do cadastro).

alter table profissionais_cadastrados add column ano_inicio_experiencia int;

update profissionais_cadastrados
set ano_inicio_experiencia = 2026 - anos_experiencia
where anos_experiencia is not null;

alter table profissionais_cadastrados drop column anos_experiencia;
