-- Profissional temporário para validar a exibição da seção de profissionais.
-- Remover este registro quando os profissionais reais forem cadastrados.
insert into profissionais_cadastrados (
  nome,
  especialidade,
  crp,
  anos_experiencia,
  bio,
  tags,
  status,
  categoria_resposta_relevante
)
select
  'Profissional de teste',
  'psicologo',
  'TESTE',
  5,
  'Perfil temporário usado para validar a exibição dos profissionais parceiros. Todas as outras funcionalidades desta plataforma funcionam normalmente.',
  '["Redução de danos", "Recaídas", "Abstinência"]'::jsonb,
  'gratuito',
  'geral'
where not exists (
  select 1
  from profissionais_cadastrados
  where nome = 'Profissional de teste'
);