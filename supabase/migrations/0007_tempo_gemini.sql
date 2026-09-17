-- Colunas para acompanhar chamadas ao Gemini junto com a mensagem que a pessoa escreveu.
-- tempo_gemini_ms: quanto a chamada ao Google levou, medido no servidor (não inclui rede do navegador
--   nem gravação no banco). Vazio quando a interação veio de card ou de cache (não chama o Gemini).
-- gemini_falhou: true quando a chamada não devolveu uma orientação válida (timeout, erro do Google,
--   JSON inválido, campo fora do formato). Vazio nos mesmos casos que tempo_gemini_ms.
-- motivo_falha: o motivo de lib/gemini.ts (ex: "tempo_esgotado"), só preenchido quando gemini_falhou = true.
alter table historico_interacoes
  add column tempo_gemini_ms integer,
  add column gemini_falhou boolean,
  add column motivo_falha text;
