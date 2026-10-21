-- Troca o número central de agendamento (usado em profissionais_cadastrados.whatsapp_link pelo botão
-- "Agendar por WhatsApp") pelo novo, o mesmo de lib/contatos.ts.

update profissionais_cadastrados
set whatsapp_link = 'https://wa.me/5511966289223';
