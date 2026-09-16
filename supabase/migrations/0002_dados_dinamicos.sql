-- Margem v0 — dados dinâmicos: profissionais, serviços públicos, instituições
-- Rodar no Supabase SQL Editor depois da 0001_init.sql

-- Profissionais: campos que o card do Figma exige e a tabela ainda não tinha
alter table profissionais_cadastrados
  add column crp text,
  add column anos_experiencia int,
  add column foto_url text,
  add column bio text,
  add column tags jsonb not null default '[]',
  add column whatsapp_link text;

comment on column profissionais_cadastrados.tags is 'Lista de badges exibidos no card, ex: ["Recaídas", "Redução de danos", "Abstinência"]';

-- Serviços públicos: o Figma mostra um conjunto de botões de ação que varia por
-- serviço e às vezes tem rótulo customizado (ex: "Meu SUS", "Agendar" em vez de "Site").
-- Colunas fixas (telefone, google_maps_link) não davam conta disso, viram uma lista.
alter table servicos_publicos
  drop column telefone,
  drop column google_maps_link,
  add column acoes jsonb not null default '[]';

comment on column servicos_publicos.acoes is
  'Lista de botões do card: [{"kind": "phone|whatsapp|chat|email|nearby|site|telegram|libras|agenda|custom", "label": "texto do botão", "value": "telefone/link/email ou null"}]. '
  'kind/label seguem o mesmo contrato de PublicServiceAction em components/PublicServicesList.tsx. label é livre, não fixo pelo kind.';

comment on column instituicoes_apoio.contatos is
  'Mesmo formato de servicos_publicos.acoes: [{"kind": ..., "label": ..., "value": ...}]';

-- Seed: os 7 serviços públicos reais do frame "_cards-serviços públicos" do Figma.
-- Números de telefone só foram preenchidos quando o próprio nome do serviço já os
-- expõe (188, 100, 132, 136). Endereços, sites, chats e e-mails variam por unidade
-- ou não foram fornecidos em nenhuma referência: ficam null até termos o dado real.
insert into servicos_publicos (nome, descricao, tipo, categoria_resposta_relevante, acoes) values
(
  '188 • CVV • Centro de Valorização da Vida',
  'Serviço de apoio emocional, escuta e prevenção do suicídio. O atendimento pode ser feito por telefone, chat ou e-mail, de forma gratuita e sigilosa',
  'outro',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":"188"},{"kind":"chat","label":"Chat","value":null},{"kind":"email","label":"E-mail","value":null},{"kind":"nearby","label":"Perto de mim","value":null},{"kind":"site","label":"Site","value":null}]'
),
(
  'CAPS AD • Centro de Atenção Psicossocial (Álcool e Outras Drogas)',
  'Serviço público do SUS que oferece atendimento especializado com equipe multidisciplinar para acolhimento, cuidado e apoio no uso de substâncias',
  'CAPS',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":null},{"kind":"nearby","label":"Perto de mim","value":null}]'
),
(
  'Disque 100 • Disque Direitos Humanos',
  'Canal anônimo de denúncia e proteção aos direitos humanos, acolhendo crianças, idosos, populações vulneráveis e pessoas em situação de violência',
  'outro',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":"100"},{"kind":"whatsapp","label":"WhatsApp","value":null},{"kind":"telegram","label":"Telegram","value":null},{"kind":"libras","label":"Libras","value":null},{"kind":"site","label":"Site","value":null}]'
),
(
  'Ligue 132 • Orientação sobre drogas',
  'Espaço sigiloso para tirar dúvidas e conversar sobre álcool e outras drogas, apoiando quem usa e familiares na busca por caminhos de cuidado',
  'outro',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":"132"}]'
),
(
  'UBS • Unidade Básica de Saúde (Posto de Saúde)',
  'Porta de entrada do SUS para cuidados gerais, escuta inicial, orientações e encaminhamentos para serviços especializados',
  'UBS',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":null},{"kind":"nearby","label":"Perto de mim","value":null},{"kind":"site","label":"Meu SUS","value":null}]'
),
(
  'Disque Saúde 136 • SUS • Sistema Único de Saúde',
  'Canal do SUS para entender seus direitos de saúde, tirando dúvidas e direcionando você ao tratamento e acompanhamento adequado no seu território',
  'outro',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":"136"},{"kind":"site","label":"Site","value":null}]'
),
(
  'CRAS • Centro de Referência de Assistência Social',
  'Serviço público de assistência social que apoia famílias em situação de vulnerabilidade, incluindo casos em que o uso de substâncias afeta moradia, renda, convivência e segurança',
  'outro',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":null},{"kind":"nearby","label":"Perto de mim","value":null},{"kind":"site","label":"Agendar","value":null}]'
);

-- Seed: instituições de apoio (mesmo texto já usado hoje em ResultPage.tsx,
-- confirmado como conteúdo real pelo usuário — o frame do Figma para esta seção
-- só mostra um placeholder duplicado, não a lista final).
insert into instituicoes_apoio (nome, descricao, tipo, categoria_resposta_relevante, contatos) values
(
  'NA • Narcóticos anônimos',
  'Grupo de apoio mútuo e escuta para pessoas que buscam a abstinência de álcool e outras drogas, com encontros presenciais e online para troca de experiências',
  'NA',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":null},{"kind":"whatsapp","label":"WhatsApp","value":null},{"kind":"chat","label":"Grupos on-line","value":null},{"kind":"chat","label":"Grupos presenciais","value":null},{"kind":"site","label":"Site","value":null}]'
),
(
  'AA • Alcoólicos anônimos',
  'Grupo de apoio e escuta voltada para a recuperação do uso de álcool, oferecendo reuniões presenciais e online para a troca de experiências',
  'AA',
  'geral',
  '[{"kind":"phone","label":"Telefone","value":null},{"kind":"whatsapp","label":"WhatsApp","value":null},{"kind":"chat","label":"Grupos on-line","value":null},{"kind":"chat","label":"Grupos presenciais","value":null},{"kind":"site","label":"Site","value":null}]'
);
