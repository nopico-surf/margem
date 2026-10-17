-- Karoline Ceroni na aba de Médicos/Psiquiatras (formulário recebido em 17/10/2026). É médica,
-- residente R2 em Medicina de Família e Comunidade, com pós em Psiquiatria; entra em 'psiquiatra'
-- como a Ana Paula (0023), com a especialidade que ela escreveu em especialidade_rotulo.
-- Ficam de fora por não terem coluna: a resposta sobre cannabis, o Instagram e a descrição de cada formação.
-- Foto em /public/assets, com a versão -192.webp gerada por scripts/fotos-pequenas.mjs.
-- Aplicar só depois que o deploy com a foto estiver no ar, senão o card cai no avatar fallback.

insert into profissionais_cadastrados
  (nome, especialidade, especialidade_rotulo, telefone, email, localizacao, status, categoria_resposta_relevante,
   registro_profissional, foto_url, bio, tags, whatsapp_link, ativo, abordagem, formacoes, ano_inicio_experiencia)
values
(
  'Karoline Ceroni', 'psiquiatra', 'Medicina de Família e Comunidade', '19996485014', 'karoceronimed@gmail.com', 'São Paulo/SP',
  'gratuito', 'geral', '264199', '/assets/professional-karoline-ceroni.webp',
  $bio$Sou médica e atualmente residente em Medicina de Família e Comunidade (R2), com formação em Psiquiatria. Minha trajetória é construída na Atenção Primária à Saúde, com atuação no cuidado integral e acompanhamento de pessoas em diferentes fases da vida.

Tenho especial interesse em saúde mental, ansiedade, estresse, alterações do sono e outras demandas emocionais, além do acompanhamento de doenças crônicas e promoção da saúde. Busco realizar uma avaliação individualizada, baseada em evidências, com escuta qualificada e construção conjunta de um plano de cuidado adequado às necessidades de cada paciente.$bio$,
  '["Medicina de Família e Comunidade","Saúde Mental","Saúde da Mulher","Doenças Crônicas","Prevenção e Promoção da Saúde","Cuidado Integral"]',
  'https://wa.me/5511968996977', true, null,
  '[{"curso":"Preceptoria para Formação de Médicos de Família","nivel":"Pós-graduação em curso","conclusao":null,"instituicao":"UFMG / NESCON"},
    {"curso":"Medicina de Família e Comunidade","nivel":"Residência Médica em curso","conclusao":null,"instituicao":"Universidade Nove de Julho (UNINOVE)"},
    {"curso":"Psiquiatria","nivel":"Pós-graduação","conclusao":null,"instituicao":"EBRAMED, Escola Brasileira de Medicina"},
    {"curso":"Medicina","nivel":"Graduação","conclusao":2024,"instituicao":"UNIMAX, Centro Universitário Max Planck"}]',
  2024
);
