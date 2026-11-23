-- WhatsApp do familiar, pedido na tela de dados logo depois do primeiro login (nome e e-mail vêm
-- do provedor e a pessoa confere; o WhatsApp ela digita). Guardado só com dígitos e código do país,
-- ex.: +5511912345678. A tela exige o número, mas a coluna aceita nulo porque os perfis criados
-- antes dessa tela não têm.
alter table familia_perfis add column whatsapp text;
