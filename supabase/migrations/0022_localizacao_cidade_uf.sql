-- profissionais_cadastrados.localizacao guardava o endereço completo (rua, número, apartamento, CEP).
-- Pela minimização de dados, o campo passa a guardar só Cidade/UF, ex: 'Indaiatuba/SP',
-- mesmo que não apareça em tela. A cidade das linhas sem cidade explícita foi conferida pelo CEP.

update profissionais_cadastrados set localizacao = 'São José do Rio Preto/SP' where id = '5ab417d3-8d3a-42ee-ba9e-4a8fe3546eae'; -- Ariany Lis Rossi
update profissionais_cadastrados set localizacao = 'Porto Velho/RO'           where id = '91f47c86-60bc-470b-98fc-ff8669274e1a'; -- Cecília Magalhães
update profissionais_cadastrados set localizacao = 'Caetité/BA'               where id = '13433c7d-1ba6-4b8b-be83-18d15d200836'; -- Lauany Silva
update profissionais_cadastrados set localizacao = 'São Paulo/SP'             where id = '70537606-cd30-433b-80af-c228d1fcf82e'; -- Mauro Cesar Morais dos Santos
update profissionais_cadastrados set localizacao = null                       where id = 'c2ee14f1-e1e9-4cb8-bb8c-e54c5b79b2b1'; -- Mychele Capellini (o campo tinha um e-mail, não um endereço)
update profissionais_cadastrados set localizacao = 'Curitiba/PR'              where id = '00049e86-105d-4e54-a380-ea9c24027165'; -- Paulo Victor Melo Lucena
update profissionais_cadastrados set localizacao = 'Jundiaí/SP'               where id = '047fa636-df72-4c03-a4c4-02fa1ec3f243'; -- Sarah Todaro
update profissionais_cadastrados set localizacao = 'Salvador/BA'              where id = '5a300eda-50e1-4a39-842b-fb1b23bbcb00'; -- Vanessa Pondé
update profissionais_cadastrados set localizacao = 'Curitiba/PR'              where id = 'b808ed3f-1c28-4df1-a37b-a697ecd1f1f6'; -- Viviane de Melo Ciza
