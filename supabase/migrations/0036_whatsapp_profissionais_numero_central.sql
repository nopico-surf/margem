-- Rodrigo (0034) e Bruna (0035) entraram depois da 0028 com outro número no whatsapp_link
-- (o antigo e o WhatsApp pessoal dela). Todos passam a usar o número central de agendamento,
-- o mesmo de lib/contatos.ts.

update profissionais_cadastrados
set whatsapp_link = 'https://wa.me/5511966289223';
