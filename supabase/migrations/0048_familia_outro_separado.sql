-- Programa Família, briefing 00d (11/11/2026): o texto escrito no "Outro" passa a ser guardado ao lado
-- da categoria, em vez de no lugar dela. A lista (antes, buscou, reagiu...) guarda "Outro" e o texto
-- vai pra coluna <campo>_outro. Linhas antigas não são migradas: o servidor lê valor fora da lista
-- como "Outro" mais o texto.
alter table familia_diario
  add column antes_outro text,
  add column percebeu_outro text,
  add column buscou_outro text,
  add column reagiu_outro text,
  add column depois_outro text,
  add column bom_o_que_outro text,
  add column bom_sentiu_outro text;

-- "Contar como foi": quando a frase usada é "Outra", a frase escrita fica em frase_outra e a
-- coluna frase guarda "Outra". Registros antigos seguem com o texto em frase.
alter table familia_conversa
  add column frase_outra text;
