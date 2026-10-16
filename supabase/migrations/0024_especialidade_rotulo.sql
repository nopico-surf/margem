-- A especialidade exibida no card e no perfil passa a ser o que a pessoa escreveu no formulário.
-- "especialidade" continua sendo a categoria (aba de Psicólogos ou de Médicos/Psiquiatras, conselho
-- do registro); quando especialidade_rotulo está vazio, a tela usa o rótulo fixo da categoria.

alter table profissionais_cadastrados add column especialidade_rotulo text;

update profissionais_cadastrados set especialidade_rotulo = 'Cannabis Medicinal e Saúde mental' where nome = 'Ana Paula Lima';
update profissionais_cadastrados set especialidade_rotulo = 'Psiquiatria'                       where nome = 'Queila de França Duarte';
