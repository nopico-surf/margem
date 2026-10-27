-- Rodrigo P. Santos Neto na aba de Médicos/Psiquiatras (formulário recebido em 09/10/2026).
-- Médico (CRM 72768, formado em 2017), título em Medicina de Família e Comunidade com RQE e pós em Psiquiatria.
-- Ele não mandou ano nem instituição da maioria das formações; ficam null até ele responder.
-- Ficam de fora por não terem coluna: o site e o Instagram.
-- Foto em /public/assets, com a versão -192.webp gerada por scripts/fotos-pequenas.mjs.
-- Aplicar só depois que o deploy com a foto estiver no ar, senão o card cai no avatar fallback.

insert into profissionais_cadastrados
  (nome, especialidade, telefone, email, localizacao, status, categoria_resposta_relevante,
   registro_profissional, foto_url, bio, tags, whatsapp_link, ativo, abordagem, formacoes, ano_inicio_experiencia)
values
(
  'Rodrigo P. Santos Neto', 'psiquiatra', '38999378846', 'rodrigosantosneto@gmail.com', 'Montes Claros/MG',
  'gratuito', 'geral', '72768', '/assets/professional-rodrigo-santos-neto.webp',
  $bio$Minha experiência é construída a partir de 9 anos de prática médica e a vivência em diferentes contextos de cuidado em saúde mental, incluindo atendimento ambulatorial em psiquiatria e atuação em CAPS.$bio$,
  '["Redução de Danos","Depressão","Ansiedade","Manejo de Abstinência","TDAH","Cannabis Medicinal"]',
  'https://wa.me/5511968996977', true, null,
  '[{"curso":"Medicina","nivel":"Graduação","conclusao":2017,"instituicao":null},
    {"curso":"Medicina de Família e Comunidade","nivel":"Título com RQE","conclusao":null,"instituicao":null},
    {"curso":"Psiquiatria","nivel":"Pós-graduação","conclusao":2024,"instituicao":"EBRAMED, Escola Brasileira de Medicina"},
    {"curso":"Certificação Dr. Italo Marsili","nivel":"Certificação","conclusao":null,"instituicao":null},
    {"curso":"Saúde Mental Integral","nivel":"Pós-graduação","conclusao":null,"instituicao":"Dr. Saulo Barbosa"}]',
  2017
);
