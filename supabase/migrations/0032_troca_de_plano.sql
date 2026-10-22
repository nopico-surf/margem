-- Troca de plano de quem já pagou (decisões de 22/10/2026):
-- - upgrade: paga hoje só a diferença entre o mensal novo e o atual, num QR de Pix Automático que já
--   autoriza o mensal novo a partir do próximo vencimento (pago_ate, que não muda); as vagas novas valem
--   quando a diferença cai, e a autorização antiga é cancelada quando a nova ativa;
-- - downgrade: nada hoje, nada devolvido; o plano menor fica escolhido e é pago pelo link no vencimento.
--
-- troca marca o apoio de upgrade (o pagamento dele não estende pago_ate); valor_imediato é o que o QR
-- cobra hoje quando é diferente do mensal (null = igual ao mensal).

alter table apoios
  add column troca boolean not null default false,
  add column valor_imediato numeric(10, 2) check (valor_imediato > 0);
