-- Preenche foto_url dos 9 profissionais inseridos em 0012_seed_profissionais_planilha.sql.
-- Fotos baixadas dos links do Google Drive da planilha, redimensionadas pra 400x400 e
-- comprimidas (public/assets/professional-<nome>.jpg), conforme regra do CLAUDE.md de nunca
-- referenciar link externo direto. Update por email porque é a coluna que não tem ambiguidade.

update profissionais_cadastrados set foto_url = '/assets/professional-mychele-capellini.jpg'
  where email = 'mychele_c@hotmail.com';

update profissionais_cadastrados set foto_url = '/assets/professional-sarah-todaro.jpg'
  where email = 'sarah_todaro@hotmail.com';

update profissionais_cadastrados set foto_url = '/assets/professional-paulo-victor-melo-lucena.jpg'
  where email = 'paulovictorlucena@gmail.com';

update profissionais_cadastrados set foto_url = '/assets/professional-viviane-de-melo-ciza.jpg'
  where email = 'viviane980@hotmail.com';

update profissionais_cadastrados set foto_url = '/assets/professional-cecilia-magalhaes.jpg'
  where email = 'ceciliamagalhaes.psi@gmail.com';

update profissionais_cadastrados set foto_url = '/assets/professional-ariany-lis-rossi.jpg'
  where email = 'psi.arianylis@gmail.com';

update profissionais_cadastrados set foto_url = '/assets/professional-vanessa-ponde.jpg'
  where email = 'psicologavanessaponde@gmail.com';

update profissionais_cadastrados set foto_url = '/assets/professional-lauany-silva.jpg'
  where email = 'psilauanysilva@gmail.com';

update profissionais_cadastrados set foto_url = '/assets/professional-mauro-cesar-morais-dos-santos.jpg'
  where email = 'maurocmorais@hotmail.com';
