-- A 0012_seed_profissionais_planilha.sql foi rodada duas vezes no SQL Editor, duplicando os
-- 9 profissionais. Além disso, a Mychele Capellini já tinha um cadastro anterior à 0012 (bio
-- diferente, escrita antes desta seed), então ela ficou com 3 linhas: a original + 2 cópias
-- da planilha. Decisão: manter a bio original da Mychele, remover as 2 cópias vindas da planilha.

-- Remove as cópias extras dos outros 8 profissionais, mantendo a linha mais antiga (menor id)
-- de cada um.
delete from profissionais_cadastrados p
using (
  select id, row_number() over (partition by email order by id) as rn
  from profissionais_cadastrados
  where email in (
    'sarah_todaro@hotmail.com',
    'paulovictorlucena@gmail.com',
    'viviane980@hotmail.com',
    'ceciliamagalhaes.psi@gmail.com',
    'psi.arianylis@gmail.com',
    'psicologavanessaponde@gmail.com',
    'psilauanysilva@gmail.com',
    'maurocmorais@hotmail.com'
  )
) dup
where p.id = dup.id and dup.rn > 1;

-- Remove as 2 cópias da Mychele vindas da planilha (identificadas pela bio da 0012),
-- preservando a linha que já existia antes com a bio da UNESP.
delete from profissionais_cadastrados
where email = 'mychele_c@hotmail.com'
  and bio = 'Sou psicóloga há 20 anos na saúde pública e há 10 anos atuo na clínica álcool e outras drogas tanto na frente assistencial como na gestão. Minha abordagem profissional é psicanalítica.';
