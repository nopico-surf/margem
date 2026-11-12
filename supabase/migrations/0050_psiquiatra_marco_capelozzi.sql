-- Marco Antonio Capelozzi na aba de Médicos/Psiquiatras (formulário recebido em 08/10/2026).
-- Médico (CRM 60785, formado em 1987), psiquiatra, psicoterapeuta psicodramático, doutor pela FMUSP.
-- Não prescreve cannabis medicinal, então a tag fica de fora.
-- Ficam de fora por não terem coluna: o Lattes e o LinkedIn.
-- Entrou antes da foto final: foto_url fica null (avatar fallback). Quando a foto chegar, salvar em
-- /public/assets/professional-marco-antonio-capelozzi.webp, rodar scripts/fotos-pequenas.mjs,
-- subir o deploy e só então: update profissionais_cadastrados set foto_url = '/assets/professional-marco-antonio-capelozzi.webp' where nome = 'Marco Antonio Capelozzi';

insert into profissionais_cadastrados
  (nome, especialidade, telefone, email, localizacao, status, categoria_resposta_relevante,
   registro_profissional, foto_url, bio, tags, whatsapp_link, ativo, abordagem, formacoes, ano_inicio_experiencia)
values
(
  'Marco Antonio Capelozzi', 'psiquiatra', '11997057632', 'marco_capelozzi@uol.com.br', 'São Paulo/SP',
  'gratuito', 'geral', '60785', null,
  $bio$Médico, atuo em psiquiatria clínica, clínica geral e psicoterapia, atualmente em telemedicina e também em consultório presencial. Sou terapeuta de adultos, adolescentes, casais e famílias.$bio$,
  '["Psiquiatria Clínica","Farmacologia","Ansiedade","Depressão","Dependência Química e Alcoolismo","Pânico e Fobias"]',
  'https://wa.me/5511966289223', true, null,
  '[{"curso":"Medicina","nivel":"Graduação","conclusao":1987,"instituicao":"UNICAMP"},
    {"curso":"Psiquiatria","nivel":"Especialização","conclusao":1989,"instituicao":"HGeSP"},
    {"curso":"Psicoterapia Psicodramática","nivel":"Pós-graduação","conclusao":1995,"instituicao":"Instituto Sedes Sapientae de SP"},
    {"curso":"Doutorado","nivel":"Pós-graduação","conclusao":2004,"instituicao":"FMUSP"}]',
  1988
);
