-- Atualiza o profissional temporário com as três tags usadas no card de validação.
update profissionais_cadastrados
set tags = '["Redução de danos", "Recaídas", "Abstinência"]'::jsonb
where nome = 'Profissional de teste';
