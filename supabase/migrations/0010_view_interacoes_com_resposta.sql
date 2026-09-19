create or replace view public.interacoes_com_resposta
with (security_invoker = on) as
select
  h."timestamp"        as quando,
  h.tipo,
  h.texto_original,
  r.acolhimento,
  r.orientacao,
  r.pilula_espiritual,
  r.checklist_agora,
  r.checklist_proximo,
  h.foi_cache_hit,
  h.gemini_falhou,
  h.motivo_falha,
  h.tempo_gemini_ms,
  r.origem             as origem_resposta,
  h.sessao_id,
  h.resposta_id
from historico_interacoes h
left join respostas r on r.id = h.resposta_id
order by h."timestamp" desc;

revoke all on public.interacoes_com_resposta from anon, authenticated;
