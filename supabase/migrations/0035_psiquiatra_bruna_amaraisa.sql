-- Bruna Amaraisa da Silva na aba de Médicos/Psiquiatras (formulário recebido em 08/10/2026).
-- Médica (CRM SP 239473, formada em 2022), pós em Psiquiatria (Mandic, 2026).
-- Ficam de fora por não terem coluna: o Instagram e a faixa de valor social.
-- Foto em /public/assets, com a versão -192.webp gerada por scripts/fotos-pequenas.mjs.
-- Aplicar só depois que o deploy com a foto estiver no ar, senão o card cai no avatar fallback.

insert into profissionais_cadastrados
  (nome, especialidade, telefone, email, localizacao, status, categoria_resposta_relevante,
   registro_profissional, foto_url, bio, tags, whatsapp_link, ativo, abordagem, formacoes, ano_inicio_experiencia)
values
(
  'Bruna Amaraisa da Silva', 'psiquiatra', '16997736676', 'amaraiisabruna@gmail.com', 'Ribeirão Preto/SP',
  'gratuito', 'geral', '239473', '/assets/professional-bruna-amaraisa-da-silva.webp',
  $bio$Atendo Psiquiatria há 3 anos, CAPS, ambulatório de psiquiatria, e consultório particular.$bio$,
  '["Avaliação Diagnóstica","Psicofarmacologia Clínica","Depressão","Transtorno Bipolar","Ansiedade","TDAH","Transtornos Mentais Graves","Cannabis Medicinal"]',
  'https://wa.me/5516997736676', true, null,
  '[{"curso":"Medicina","nivel":"Graduação","conclusao":2022,"instituicao":"FAM"},
    {"curso":"Psiquiatria","nivel":"Pós-graduação","conclusao":2026,"instituicao":"Mandic"}]',
  2022
);
