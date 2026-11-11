-- Programa Família, briefing M2b (11/11/2026): só mede se a anotação teve "Outro" escrito pela pessoa.
-- Nenhum conteúdo novo: é um booleano sobre uma linha que já existe. Preenchido no servidor (POST e
-- PATCH de /api/familia/diario). Serve pra decidir, com número, se vale agrupar sinônimos do texto livre.
alter table familia_diario
  add column usou_outro_escrito boolean not null default false;
