-- Troca as fotos de 8 profissionais (400x400 jpg, ficavam borradas na página interna) por
-- versões webp 1200x1200, qualidade 80 (a da Sarah é 1024x1024, o original não era maior).
-- Mychele Capellini segue com o .jpg de 400x400 até chegar foto nova.
-- Aplicar só depois que o deploy com os .webp estiver no ar, senão a foto cai no fallback.

update profissionais_cadastrados
  set foto_url = replace(foto_url, '.jpg', '.webp')
  where foto_url in (
    '/assets/professional-ariany-lis-rossi.jpg',
    '/assets/professional-cecilia-magalhaes.jpg',
    '/assets/professional-lauany-silva.jpg',
    '/assets/professional-mauro-cesar-morais-dos-santos.jpg',
    '/assets/professional-paulo-victor-melo-lucena.jpg',
    '/assets/professional-sarah-todaro.jpg',
    '/assets/professional-vanessa-ponde.jpg',
    '/assets/professional-viviane-de-melo-ciza.jpg'
  );
