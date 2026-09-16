-- Links e canais oficiais dos serviços exibidos na resposta.

insert into servicos_publicos (nome, descricao, tipo, categoria_resposta_relevante, acoes)
select
  '192 • SAMU • Serviço de Atendimento Móvel de Urgência',
  'Serviço público de emergência médica que envia ambulância e equipe treinada para situações graves, como dor no peito, confusão e outros sintomas',
  'outro',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":"192"}]'::jsonb
where not exists (
  select 1 from servicos_publicos where nome = '192 • SAMU • Serviço de Atendimento Móvel de Urgência'
);

insert into servicos_publicos (nome, descricao, tipo, categoria_resposta_relevante, acoes)
select
  '190 • Polícia Militar',
  'Força policial estadual que atua na proteção e no atendimento de pessoas em situações de violência, ameaça ou risco à integridade física',
  'outro',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":"190"}]'::jsonb
where not exists (
  select 1 from servicos_publicos where nome = '190 • Polícia Militar'
);

insert into servicos_publicos (nome, descricao, tipo, categoria_resposta_relevante, acoes)
select
  'Disque denúncia 181 • Polícia Civil',
  'Canal anônimo e sigiloso para envio de informações e denúncias, apoiando investigações e a proteção de pessoas em situações de risco ou violência',
  'outro',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":"181"},{"kind":"nearby","label":"Perto de mim","value":"https://www.google.com/maps/search/?api=1&query=Pol%C3%ADcia+Civil"}]'::jsonb
where not exists (
  select 1 from servicos_publicos where nome = 'Disque denúncia 181 • Polícia Civil'
);

update servicos_publicos
set acoes = '[
  {"kind":"phone","label":"Telefone","value":"188"},
  {"kind":"chat","label":"Chat","value":"https://cvv.org.br/chat/"},
  {"kind":"email","label":"E-mail","value":"https://cvv.org.br/e-mail/"},
  {"kind":"nearby","label":"Perto de mim","value":"https://www.google.com/maps/search/?api=1&query=CVV"},
  {"kind":"site","label":"Site","value":"https://www.cvv.org.br/"}
]'::jsonb
where nome ilike '188%' and nome ilike '%CVV%';

update servicos_publicos
set acoes = '[
  {"kind":"phone","label":"Telefone","value":"136"},
  {"kind":"nearby","label":"Perto de mim","value":"https://www.google.com/maps/search/?api=1&query=CAPS+AD"}
]'::jsonb
where nome ilike 'CAPS AD%' and nome ilike '%Atenção Psicossocial%';

update servicos_publicos
set acoes = '[
  {"kind":"phone","label":"Telefone","value":"100"},
  {"kind":"whatsapp","label":"WhatsApp","value":"61996110100"},
  {"kind":"telegram","label":"Telegram","value":"https://t.me/Direitoshumanosbrasilbot"},
  {"kind":"libras","label":"Libras","value":"https://atendelibras.mdh.gov.br/acesso"},
  {"kind":"site","label":"Site","value":"https://www.gov.br/pt-br/servicos/denunciar-violacao-de-direitos-humanos"}
]'::jsonb
where nome ilike 'Disque 100%' and nome ilike '%Direitos Humanos%';

update servicos_publicos
set acoes = '[
  {"kind":"phone","label":"Telefone","value":"132"}
]'::jsonb
where nome ilike 'Ligue 132%' and nome ilike '%Orientação sobre drogas%';

update servicos_publicos
set acoes = '[
  {"kind":"phone","label":"Telefone","value":"136"},
  {"kind":"nearby","label":"Perto de mim","value":"https://www.google.com/maps/search/?api=1&query=UBS"},
  {"kind":"site","label":"Meu SUS","value":"https://meususdigital.saude.gov.br/publico/rede-saude"}
]'::jsonb
where nome ilike 'UBS%' and nome ilike '%Unidade Básica de Saúde%';

update servicos_publicos
set acoes = '[
  {"kind":"phone","label":"Telefone","value":"136"},
  {"kind":"site","label":"Rede de saúde","value":"https://meususdigital.saude.gov.br/publico/rede-saude"}
]'::jsonb
where nome ilike 'Disque Saúde 136%' and nome ilike '%Sistema Único de Saúde%';

update servicos_publicos
set acoes = '[
  {"kind":"phone","label":"Telefone","value":"156"},
  {"kind":"nearby","label":"Perto de mim","value":"https://www.google.com/maps/search/?api=1&query=CRAS"},
  {"kind":"site","label":"Agendar","value":"https://agendamentocras.com.br/"}
]'::jsonb
where nome ilike 'CRAS%' and nome ilike '%Assistência Social%';

update instituicoes_apoio
set contatos = '[
  {"kind":"phone","label":"Telefone","value":"30035222"},
  {"kind":"phone","label":"0800","value":"08002210221"},
  {"kind":"whatsapp","label":"WhatsApp","value":"1932556688"},
  {"kind":"chat","label":"Salas virtuais","value":"https://www.na.org.br/virtual/"},
  {"kind":"chat","label":"Reuniões presenciais","value":"https://www.na.org.br/grupos/"},
  {"kind":"nearby","label":"Perto de mim","value":"https://www.google.com/maps/search/?api=1&query=Narc%C3%B3ticos+An%C3%B4nimos"},
  {"kind":"site","label":"Site","value":"https://www.na.org.br/"}
]'::jsonb
where nome ilike 'NA%' and nome ilike '%Narcóticos%';

update instituicoes_apoio
set contatos = '[
  {"kind":"phone","label":"Telefone","value":"1133159333"},
  {"kind":"whatsapp","label":"WhatsApp","value":"11947196531"},
  {"kind":"chat","label":"Grupos on-line","value":"https://www.aa.org.br/virtual/"},
  {"kind":"nearby","label":"Perto de mim","value":"https://www.google.com/maps/search/?api=1&query=Alco%C3%B3licos+An%C3%B4nimos"},
  {"kind":"site","label":"Site","value":"https://www.aa.org.br/"}
]'::jsonb
where nome ilike 'AA%' and nome ilike '%Alcoólicos%';