-- Remove as 64 chaves_busca resquício do cache antigo do campo livre (desligado em 17/09/2026)
-- As respostas continuam intactas, só o ponteiro de reuso some
-- Isso evita que essas chaves sejam reaproveitadas quando o cache por similaridade for implementado
update respostas
set chave_busca = null
where origem = 'gerada_gemini'
  and chave_busca is not null;
