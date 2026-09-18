-- A coluna "crp" guardava o número de registro de qualquer profissional, mas o nome
-- amarrava o dado ao conselho de psicologia. Psiquiatra tem CRM, assistente social
-- tem CRESS. Renomeia pra um nome neutro: o número em si, sem o prefixo do conselho.
-- Qual conselho mostrar (CRP/CRM/CRESS) já é derivável de "especialidade" e é decidido
-- na renderização, não gravado aqui.
alter table profissionais_cadastrados
  rename column crp to registro_profissional;
