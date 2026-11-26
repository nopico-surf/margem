-- Libera a psicóloga Vanessa Pondé na /familia, sem a etapa de pagamento.
insert into familia_emails_liberados (email, observacao) values
  ('psicologavanessaponde@gmail.com', 'Vanessa Pondé, psicóloga parceira')
on conflict (email) do nothing;
