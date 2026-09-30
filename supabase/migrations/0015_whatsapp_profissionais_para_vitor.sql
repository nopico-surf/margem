-- O botão "Agendar por WhatsApp" (CardProfissionaisCompleto.tsx) usa profissionais_cadastrados.whatsapp_link
-- pra montar o link e já vem com a mensagem "Oi Vitor, achei o(a) [nome] na Margem...". A ideia é
-- centralizar os pedidos de agendamento no WhatsApp do Vitor, não no número pessoal de cada
-- profissional. A 0012 tinha preenchido esse campo com o WhatsApp pessoal de cada um (dado da
-- planilha); aqui todos passam a usar o mesmo número já usado no rodapé do site (lib/contatos.ts).

update profissionais_cadastrados
set whatsapp_link = 'https://wa.me/5511968996977';
