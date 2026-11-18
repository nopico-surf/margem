-- Samantha na aba de Psicólogos (formulário recebido em 20/10/2026).
-- Psicóloga (CRP 06/210886), Psicologia Analítica, ex-CAPS AD III, Libras avançado. Atua desde 2023.
-- Só o primeiro nome chegou no formulário; completar o nome quando ela mandar o sobrenome.
-- Ficam de fora por não terem coluna: Instagram e LinkedIn.
-- A foto (/assets/professional-samantha.webp, recorte 1200x1200 da original) precisa estar no deploy antes
-- de rodar este SQL, senão o card mostra o avatar fallback.

insert into profissionais_cadastrados
  (nome, especialidade, telefone, email, localizacao, status, categoria_resposta_relevante,
   registro_profissional, foto_url, bio, tags, whatsapp_link, ativo, abordagem, formacoes, ano_inicio_experiencia)
values
(
  'Samantha', 'psicologo', '11934023401', 'psicolibras.sla@gmail.com', 'Diadema/SP',
  'gratuito', 'geral', '06/210886', '/assets/professional-samantha.webp',
  $bio$Sou psicóloga, com experiência na Rede de Atenção Psicossocial (RAPS), especialmente no CAPS AD III, e trajetória profissional também voltada à inclusão social, acessibilidade e garantia de direitos. Minha atuação na saúde mental envolve acolhimento, atendimentos individuais e em grupo, avaliação de casos, oficinas terapêuticas, visitas domiciliares, atendimento às famílias e articulação em rede.

Trabalho com foco na autonomia, reinserção social e cuidado integral das pessoas que fazem uso de substâncias psicoativas, valorizando a singularidade, o vínculo terapêutico e a Redução de Danos como estratégia de cuidado. Minha formação em Psicologia Analítica contribui para uma escuta atenta à subjetividade e à história de cada pessoa. Também possuo proficiência avançada em LIBRAS, fortalecendo meu compromisso com uma prática acessível, inclusiva e livre de julgamento.$bio$,
  '["Redução de Danos","Saúde Mental e Uso de Substâncias Psicoativas","Atenção Psicossocial (RAPS/SUS)","Acolhimento Familiar","Psicologia Analítica"]',
  'https://wa.me/5511966289223', true, 'Psicologia Analítica',
  '[{"curso":"Psicologia","nivel":"Bacharelado","conclusao":2023,"instituicao":"Centro Universitário FMU | FIAM-FAAM"},
    {"curso":"Educação Permanente para a Rede de Atenção Psicossocial no SUS (Nós na Rede)","nivel":"Formação","conclusao":2026,"instituicao":"Fiocruz"},
    {"curso":"Libras Avançado","nivel":"Curso de Capacitação","conclusao":null,"instituicao":"Instituto SELI de Educação para Surdos"},
    {"curso":"Emprego Apoiado e Empregabilidade de PcD","nivel":"Curso de Capacitação","conclusao":null,"instituicao":"ITS Brasil"},
    {"curso":"Comunicação Efetiva com PcD Auditiva e Surda","nivel":"Curso de Capacitação","conclusao":null,"instituicao":"UNA-SUS/UFMA"},
    {"curso":"Saúde Mental e Atenção Psicossocial de Adolescentes","nivel":"Curso de Capacitação","conclusao":null,"instituicao":"Fiocruz"},
    {"curso":"Jogos de Apostas: Cuidado na Rede Psicossocial (RAPS)","nivel":"Curso de Capacitação","conclusao":null,"instituicao":"Fiocruz"},
    {"curso":"Letramento Racial para Trabalhadores do SUS","nivel":"Curso de Capacitação","conclusao":null,"instituicao":"Fiocruz"},
    {"curso":"Liderança e Empoderamento","nivel":"Curso de Capacitação","conclusao":null,"instituicao":"Secretaria dos Direitos da Pessoa com Deficiência e UNIVESP"}]',
  2023
);
