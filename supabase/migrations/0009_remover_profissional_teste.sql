-- Remove o registro temporário usado para validar a seção de profissionais.
delete from profissionais_cadastrados
where nome = 'Profissional de teste'
  and registro_profissional = 'TESTE';
